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
    if (isAuthenticating || router.pathname === "/auth/callback") return;
    setIsAuthenticating(true);

    try {
      const cachedUser = localStorage.getItem("paan_user_data");
      if (cachedUser) {
        const parsedUser = JSON.parse(cachedUser);
        console.log("[AuthProvider] Loaded cached user:", parsedUser);
        if (!parsedUser.selected_tier || !parsedUser.name) {
          console.log("[AuthProvider] Invalid cache, clearing");
          localStorage.removeItem("paan_user_data");
          localStorage.removeItem("paan_member_session");
          localStorage.removeItem("user_email");
        } else {
          setUser(parsedUser);
          setLoading(false);
          const { data: user } = await supabase.auth.getUser();
          if (!user?.user) {
            setUser(null);
            localStorage.removeItem("paan_user_data");
            localStorage.removeItem("paan_member_session");
            localStorage.removeItem("user_email");
            if (router.pathname !== "/") {
              router.push("/");
            }
          }
          setIsAuthenticating(false);
          return;
        }
      }

      const { data: user } = await supabase.auth.getUser();
      const email = user?.user?.email;
      const authUserId = user?.user?.id;

      if (user?.user && email && authUserId) {
        const { data, error } = await supabase
          .from("candidates")
          .select(
            "id, primaryContactEmail, primaryContactName, job_type, selected_tier, agencyName, auth_user_id, created_at"
          )
          .eq("auth_user_id", authUserId)
          .single();

        if (data && !error) {
          const userData = {
            id: data.id,
            email: data.primaryContactEmail,
            name: data.primaryContactName,
            job_type: data.job_type,
            selected_tier: data.selected_tier,
            agencyName: data.agencyName,
            created_at: data.created_at,
            role: "agency_member",
          };
          setUser(userData);
          localStorage.setItem("paan_user_data", JSON.stringify(userData));
          localStorage.setItem("paan_member_session", "authenticated");
          localStorage.setItem("user_email", email);
        } else {
          setLoginError("No account found for this email.");
          setUser(null);
          localStorage.removeItem("paan_user_data");
          localStorage.removeItem("paan_member_session");
          localStorage.removeItem("user_email");
        }
      } else {
        setUser(null);
        localStorage.removeItem("paan_user_data");
        localStorage.removeItem("paan_member_session");
        localStorage.removeItem("user_email");
      }
    } catch (err) {
      console.error("AuthContext: Initialization error:", err);
      setLoginError("An error occurred during authentication.");
      setUser(null);
      localStorage.removeItem("paan_user_data");
      localStorage.removeItem("paan_member_session");
      localStorage.removeItem("user_email");
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
          localStorage.removeItem("paan_user_data");
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
  }, []);

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
          "id, primaryContactEmail, primaryContactName, job_type, selected_tier, agencyName, auth_user_id, created_at"
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
        name: userData.primaryContactName,
        job_type: userData.job_type,
        selected_tier: userData.selected_tier,
        agencyName: userData.agencyName,
        created_at: userData.created_at,
        role: "agency_member",
      };

      setUser(user);
      localStorage.setItem("paan_user_data", JSON.stringify(user));
      localStorage.setItem("paan_member_session", "authenticated");
      localStorage.setItem("user_email", email);
      console.log(
        "AuthContext: User authenticated, navigating to /dashboard:",
        user
      );
      await router.push("/dashboard");
      toast.dismiss("route-loading");
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

      localStorage.setItem("reset_email", email);
      toast.success("Password reset email sent. Check your inbox.");
    } catch (error) {
      console.error("AuthContext: Password reset error:", error);
      setLoginError(error.message || "Failed to send reset email.");
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
              "id, primaryContactEmail, primaryContactName, job_type, selected_tier, agencyName, auth_user_id, created_at"
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
              return;
            }

            const { redirectTo } = await response.json();
            console.log("AuthContext: Redirecting to:", redirectTo);
            window.location.assign(redirectTo);
            return;
          }

          localStorage.setItem("paan_member_session", "authenticated");
          localStorage.setItem("user_email", email);

          setUser({
            id: existingUser.id,
            email: existingUser.primaryContactEmail,
            name: existingUser.primaryContactName,
            job_type: existingUser.job_type,
            selected_tier: existingUser.selected_tier,
            agencyName: existingUser.agencyName,
            created_at: existingUser.created_at,
            role: "agency_member",
          });

          toast.success("Social login successful! Redirecting...");
          console.log(
            "AuthContext: Social login successful, navigating to /dashboard"
          );
          await router.push("/dashboard");
          toast.dismiss("route-loading");
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
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("AuthContext: Sign-out error:", error);
        toast.error("Failed to log out. Please try again.");
        return;
      }
      setUser(null);
      localStorage.removeItem("paan_user_data");
      localStorage.removeItem("paan_member_session");
      localStorage.removeItem("user_email");
      localStorage.removeItem("paan_remembered_email");
      localStorage.removeItem("paan_session_expiry");
      await router.push("/");
    } catch (err) {
      console.error("AuthContext: Logout error:", err);
      toast.error("An error occurred during logout. Please try again.");
    }
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
          localStorage.removeItem("paan_user_data");
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
