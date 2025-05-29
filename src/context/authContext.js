import React, { createContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabase";
import SessionExpiredModal from "@/components/modals/SessionExpiredModal";
import LoginErrorModal from "@/components/modals/LoginErrorModal";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [skipRedirect, setSkipRedirect] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const router = useRouter();
  const [showExpiredModal, setShowExpiredModal] = useState(false);
  const [loginError, setLoginError] = useState(null);

  const debounce = (fn, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn(...args), delay);
    };
  };

  const initializeAuth = async () => {
    if (isAuthenticating) {
      console.log(
        "AuthContext: Skipping initializeAuth, already authenticating"
      );
      return;
    }
    setIsAuthenticating(true);

    try {
      console.log(
        "AuthContext: Running initializeAuth, pathname:",
        router.pathname
      );
      const { data: session } = await supabase.auth.getSession();
      const email = session?.session?.user?.email;
      const authUserId = session?.session?.user?.id;

      if (session?.session && email && authUserId) {
        const { data, error } = await supabase
          .from("candidates")
          .select(
            "id, primaryContactEmail, primaryContactName, job_type, selected_tier, agencyName, auth_user_id"
          )
          .eq("auth_user_id", authUserId)
          .single();

        if (data && !error) {
          setUser({
            id: data.id,
            email: data.primaryContactEmail,
            primaryContactName: data.primaryContactName,
            job_type: data.job_type,
            selected_tier: data.selected_tier,
            agencyName: data.agencyName,
            role: "agency_member",
          });
          localStorage.setItem("paan_member_session", "authenticated");
          localStorage.setItem("user_email", email);
        } else {
          console.error("AuthContext: No candidate found for user:", error);
          if (router.pathname !== "/auth/callback") {
            setLoginError(
              "No account found for this email. Please ensure your account is activated or contact support."
            );
          }
        }
      } else {
        localStorage.removeItem("paan_member_session");
        localStorage.removeItem("user_email");
      }
    } catch (err) {
      console.error("AuthContext: Initialization error:", err);
      localStorage.removeItem("paan_member_session");
      localStorage.removeItem("user_email");
      if (router.pathname !== "/auth/callback") {
        setLoginError(
          "An error occurred during authentication. Please try again."
        );
      }
    } finally {
      setLoading(false);
      setIsAuthenticating(false);
    }
  };

  const debouncedInitializeAuth = debounce(initializeAuth, 500);

  useEffect(() => {
    initializeAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("AuthContext: onAuthStateChange event:", event);
        if (event === "SIGNED_IN" && session?.user?.email) {
          debouncedInitializeAuth();
        } else if (event === "SIGNED_OUT" && !skipRedirect) {
          setUser(null);
          localStorage.removeItem("paan_member_session");
          localStorage.removeItem("user_email");
          localStorage.removeItem("paan_remembered_email");
          localStorage.removeItem("paan_session_expiry");
          if (router.pathname !== "/auth/callback") {
            router.push("/");
          }
        }
      }
    );

    return () => authListener.subscription?.unsubscribe();
  }, [router]);

  const login = async (email, password, rememberMe) => {
    try {
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (authError) {
        console.error("AuthContext: Supabase auth error:", authError);
        setLoginError(
          "Invalid email or password. If you recently received a new password, please use it or contact support at support@paan.africa."
        );
        throw new Error(authError.message);
      }

      const authUserId = authData.user.id;
      const { data: userData, error } = await supabase
        .from("candidates")
        .select(
          "id, primaryContactEmail, primaryContactName, job_type, selected_tier, agencyName, auth_user_id"
        )
        .eq("auth_user_id", authUserId)
        .single();

      if (error || !userData) {
        console.error("AuthContext: User not found:", error);
        setLoginError(
          "No account found for this email. Please ensure your account is activated or contact support at support@paan.africa."
        );
        throw new Error("No account found.");
      }

      if (rememberMe) {
        localStorage.setItem("paan_remembered_email", email);
        localStorage.setItem(
          "paan_session_expiry",
          Date.now() + 30 * 24 * 60 * 60 * 1000
        );
      } else {
        localStorage.removeItem("paan_remembered_email");
        localStorage.removeItem("paan_session_expiry");
      }

      const user = {
        id: userData.id,
        email: userData.primaryContactEmail,
        primaryContactName: userData.primaryContactName,
        job_type: userData.job_type,
        selected_tier: userData.selected_tier,
        agencyName: userData.agencyName,
        role: "agency_member",
      };

      setUser(user);
      console.log("AuthContext: User authenticated:", user);
      router.push("/dashboard");
    } catch (error) {
      console.error("AuthContext: Login error:", error);
      throw error;
    }
  };

  const signInWithSocial = async (provider) => {
    try {
      const baseUrl =
        process.env.NODE_ENV === "development"
          ? process.env.NEXT_PUBLIC_BASE_URL_DEV
          : process.env.NEXT_PUBLIC_BASE_URL_PROD;
      const redirectTo = `${baseUrl}/auth/callback`;
      console.log(
        `AuthContext: Initiating ${provider} login with redirectTo: ${redirectTo}`
      );
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider.toLowerCase(),
        options: {
          redirectTo,
        },
      });

      if (error) {
        console.error(
          `AuthContext: Social login error with ${provider}:`,
          error
        );
        setLoginError(`Failed to sign in with ${provider}. Please try again.`);
        throw new Error(`Failed to sign in with ${provider}`);
      }
    } catch (error) {
      console.error("AuthContext: Social login error:", error);
      throw error;
    }
  };

  const resetPassword = async (email) => {
    try {
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const { error } = await response.json();
        setLoginError("Failed to send reset email. Please try again.");
        throw new Error(error || "Failed to send reset email");
      }
    } catch (error) {
      console.error("AuthContext: Password reset error:", error);
      throw error;
    }
  };

  useEffect(() => {
    const handleSocialLoginCallback = async () => {
      if (router.pathname !== "/auth/callback") return;

      console.log("AuthContext: Handling social login callback");

      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("AuthContext: Error retrieving session:", error);
          router.push("/");
          return;
        }

        if (session?.user) {
          const { user } = session;
          const email = user.email;
          const authUserId = user.id;
          const name =
            user.user_metadata.full_name || user.user_metadata.name || "User";

          console.log("AuthContext: Social login user:", {
            email,
            authUserId,
            name,
          });

          const { data: existingUser, error: fetchError } = await supabase
            .from("candidates")
            .select(
              "id, primaryContactEmail, primaryContactName, job_type, selected_tier, agencyName, auth_user_id"
            )
            .eq("auth_user_id", authUserId)
            .single();

          if (fetchError || !existingUser) {
            console.log(
              "AuthContext: No existing candidate, redirecting to membership page"
            );
            toast.error("No account found. Redirecting to Membership page.");
            setSkipRedirect(true);
            console.log(
              "AuthContext: Calling /api/signout with authUserId:",
              authUserId
            );
            const response = await fetch("/api/signout", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                redirectTo: "https://membership.paan.africa/",
                authUserId,
              }),
            });

            if (!response.ok) {
              console.error(
                "AuthContext: Sign-out error:",
                await response.json()
              );
              window.location.assign("https://membership.paan.africa/");
            }
            return;
          }

          localStorage.setItem("paan_member_session", "authenticated");
          localStorage.setItem("user_email", email);

          setUser({
            id: existingUser.id,
            email: existingUser.primaryContactEmail,
            primaryContactName: existingUser.primaryContactName,
            job_type: existingUser.job_type,
            selected_tier: existingUser.selected_tier,
            agencyName: existingUser.agencyName,
            role: "agency_member",
          });

          toast.success("Social login successful! Redirecting...");
          router.push("/dashboard");
        } else {
          console.log("AuthContext: No session user, redirecting to login");
          router.push("/");
        }
      } catch (error) {
        console.error("AuthContext: Social login callback error:", error);
        router.push("/");
      }
    };

    handleSocialLoginCallback();
  }, [router]);

  const logout = async () => {
    console.log("AuthContext: Logging out...");
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem("paan_member_session");
    localStorage.removeItem("user_email");
    localStorage.removeItem("paan_remembered_email");
    localStorage.removeItem("paan_session_expiry");
    router.push("/");
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, signInWithSocial, resetPassword }}
    >
      {children}
      <SessionExpiredModal
        isOpen={showExpiredModal}
        onClose={() => {
          setShowExpiredModal(false);
          localStorage.removeItem("paan_member_session");
          localStorage.removeItem("user_email");
          router.push("/");
        }}
      />
      <LoginErrorModal
        isOpen={!!loginError}
        onClose={() => setLoginError(null)}
        errorMessage={loginError}
      />
    </AuthContext.Provider>
  );
};
