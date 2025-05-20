import React, { createContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";
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
      const session = localStorage.getItem("paan_member_session");
      const email = localStorage.getItem("user_email");

      if (session === "authenticated" && email) {
        try {
          const { data, error } = await supabase
            .from("candidates")
            .select("primaryContactEmail, primaryContactName")
            .eq("primaryContactEmail", email)
            .single();

          if (data && !error) {
            setUser({
              email: data.primaryContactEmail,
              primaryContactName: data.primaryContactName,
              role: "agency_member",
            });
          } else {
            console.error("AuthContext: Session invalid:", error);
            localStorage.removeItem("paan_member_session");
            localStorage.removeItem("user_email");
            setShowExpiredModal(true);
          }
        } catch (err) {
          console.error("AuthContext: Initialization error:", err);
          localStorage.removeItem("paan_member_session");
          localStorage.removeItem("user_email");
          setShowExpiredModal(true);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password, rememberMe) => {
    try {
      const { data: userData, error } = await supabase
        .from("candidates")
        .select("primaryContactEmail, primaryContactName, candidate_password")
        .eq("primaryContactEmail", email)
        .single();

      if (error || !userData) {
        console.error("AuthContext: Login error:", error);
        setShowLoginError(true);
        throw new Error("Invalid email or password");
      }

      const passwordMatch = await bcrypt.compare(
        password,
        userData.candidate_password
      );

      if (!passwordMatch) {
        console.error("AuthContext: Password mismatch");
        setShowLoginError(true);
        throw new Error("Invalid email or password");
      }

      localStorage.setItem("paan_member_session", "authenticated");
      localStorage.setItem("user_email", userData.primaryContactEmail);

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
        email: userData.primaryContactEmail,
        primaryContactName: userData.primaryContactName,
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
      console.log("NODE_ENV:", process.env.NODE_ENV);
      console.log(
        "NEXT_PUBLIC_BASE_URL_DEV:",
        process.env.NEXT_PUBLIC_BASE_URL_DEV
      );
      console.log(
        "NEXT_PUBLIC_BASE_URL_PROD:",
        process.env.NEXT_PUBLIC_BASE_URL_PROD
      );
      const baseUrl =
        process.env.NODE_ENV === "development"
          ? process.env.NEXT_PUBLIC_BASE_URL_DEV
          : process.env.NEXT_PUBLIC_BASE_URL_PROD;
      const redirectTo = `${baseUrl}/auth/callback`;
      console.log(
        `AuthContext: Redirecting to ${redirectTo} for ${provider} login`
      );
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
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
          const name =
            user.user_metadata.full_name || user.user_metadata.name || "User";

          // Check if user exists in candidates table
          const { data: existingUser, error: fetchError } = await supabase
            .from("candidates")
            .select("primaryContactEmail, primaryContactName")
            .eq("primaryContactEmail", email)
            .single();

          if (fetchError || !existingUser) {
            console.log(
              "AuthContext: User not found, redirecting to registration"
            );
            toast.error(
              "User not found. Redirecting to Membership page to create an account.",
              {
                duration: 3000,
              }
            );
            await supabase.auth.signOut(); // Clear Supabase session
            setTimeout(() => {
              window.location.href = "https://membership.paan.africa/";
            }, 3000); // Delay redirect to show toast
            return;
          }

          localStorage.setItem("paan_member_session", "authenticated");
          localStorage.setItem("user_email", email);

          setUser({
            email,
            primaryContactName: existingUser.primaryContactName,
            role: "agency_member",
          });

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
