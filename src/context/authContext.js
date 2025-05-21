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
  const router = useRouter();
  const [showExpiredModal, setShowExpiredModal] = useState(false);
  const [showLoginError, setShowLoginError] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
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
            console.error("AuthContext: Session invalid:", error);
            await supabase.auth.signOut();
            localStorage.removeItem("paan_member_session");
            localStorage.removeItem("user_email");
            setShowExpiredModal(true);
          }
        } else {
          localStorage.removeItem("paan_member_session");
          localStorage.removeItem("user_email");
        }
      } catch (err) {
        console.error("AuthContext: Initialization error:", err);
        localStorage.removeItem("paan_member_session");
        localStorage.removeItem("user_email");
        setShowExpiredModal(true);
      }
      setLoading(false);
    };

    initializeAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN" && session?.user?.email) {
          initializeAuth();
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          localStorage.removeItem("paan_member_session");
          localStorage.removeItem("user_email");
          localStorage.removeItem("paan_remembered_email");
          localStorage.removeItem("paan_session_expiry");
          router.push("/");
        }
      }
    );

    return () => authListener.subscription?.unsubscribe();
  }, [router]);

  const login = async (email, password, rememberMe) => {
    try {
      // Sign in with Supabase auth
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (authError) {
        console.error("AuthContext: Supabase auth error:", authError);
        setShowLoginError(true);
        throw new Error(
          authError.message.includes("Invalid login credentials")
            ? "Invalid email or password. If you recently received a new password, please use it or contact support at support@paan.africa."
            : `Authentication failed: ${authError.message}`
        );
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
        setShowLoginError(true);
        throw new Error(
          "No account found for this email. Please ensure your account is activated or contact support at support@paan.africa."
        );
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
        `AuthContext: Redirecting to ${redirectTo} for ${provider} login`
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
        throw new Error(`Failed to sign in with ${provider}`);
      }
    } catch (error) {
      console.error("AuthContext: Social login error:", error);
      throw error;
    }
  };

  useEffect(() => {
    const handleSocialLoginCallback = async () => {
      if (router.pathname !== "/auth/callback") return;

      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("AuthContext: Error retrieving session:", error);
          setShowLoginError(true);
          return;
        }

        if (session?.user) {
          const { user } = session;
          const email = user.email;
          const authUserId = user.id;
          const name =
            user.user_metadata.full_name || user.user_metadata.name || "User";

          const { data: existingUser, error: fetchError } = await supabase
            .from("candidates")
            .select(
              "id, primaryContactEmail, primaryContactName, job_type, selected_tier, agencyName, auth_user_id"
            )
            .eq("auth_user_id", authUserId)
            .single();

          if (fetchError || !existingUser) {
            // Create candidate entry for social login
            const { data: newCandidate, error: insertError } = await supabase
              .from("candidates")
              .insert({
                primaryContactEmail: email,
                primaryContactName: name,
                auth_user_id: authUserId,
                job_type: "agency",
                selected_tier: "Associate Member (Tier 3)",
              })
              .select()
              .single();

            if (insertError || !newCandidate) {
              console.error(
                "AuthContext: Failed to create candidate:",
                insertError
              );
              toast.error(
                "Failed to create account. Redirecting to Membership page.",
                { duration: 3000 }
              );
              await supabase.auth.signOut();
              setTimeout(() => {
                window.location.href = "https://membership.paan.africa/";
              }, 3000);
              return;
            }

            localStorage.setItem("paan_member_session", "authenticated");
            localStorage.setItem("user_email", email);

            setUser({
              id: newCandidate.id,
              email: newCandidate.primaryContactEmail,
              primaryContactName: newCandidate.primaryContactName,
              job_type: newCandidate.job_type,
              selected_tier: newCandidate.selected_tier,
              agencyName: newCandidate.agencyName,
              role: "agency_member",
            });
          } else {
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
          }

          toast.success("Social login successful! Redirecting...");
          router.push("/dashboard");
        } else {
          setShowLoginError(true);
        }
      } catch (error) {
        console.error("AuthContext: Social login callback error:", error);
        setShowLoginError(true);
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
      value={{ user, loading, login, logout, signInWithSocial }}
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
        isOpen={showLoginError}
        onClose={() => setShowLoginError(false)}
      />
    </AuthContext.Provider>
  );
};
