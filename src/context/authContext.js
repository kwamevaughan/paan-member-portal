import React, { createContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
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

      localStorage.setItem("hr_session", "authenticated");
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

  const logout = async () => {
    console.log("AuthContext: Logging out...");
    setUser(null);
    localStorage.removeItem("paan_member_session");
    localStorage.removeItem("user_email");
    localStorage.removeItem("paan_remembered_email");
    localStorage.removeItem("paan_session_expiry");
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
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
