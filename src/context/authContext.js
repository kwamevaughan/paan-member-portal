import React, { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
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
      let token =
        Cookies.get("token") ||
        sessionStorage.getItem("token") ||
        localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        let res = await fetch("/api/verify-token", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        let data = await res.json();

        // If token expired, try to refresh
        if (!res.ok && data.error === "Invalid token") {
          const refreshRes = await fetch("/api/auth/refresh-token", {
            method: "GET",
            credentials: "include", // needed for httpOnly cookie
          });

          const refreshData = await refreshRes.json();

          if (refreshRes.ok && refreshData.token) {
            // Save refreshed token
            Cookies.set("token", refreshData.token, {
              expires: 1 / 24, // 1 hour
              path: "/",
              sameSite: "Strict",
              secure: process.env.NODE_ENV === "production",
            });

            sessionStorage.setItem("token", refreshData.token);
            localStorage.setItem("token", refreshData.token);

            // Retry verify-token
            res = await fetch("/api/verify-token", {
              method: "GET",
              headers: {
                Authorization: `Bearer ${refreshData.token}`,
              },
            });

            data = await res.json();

            if (!res.ok) {
              throw new Error(data.error);
            }
          } else {
            setShowExpiredModal(true);
            return;
          }
        }

        if (!res.ok) {
          setShowExpiredModal(true);
          return;
        }

        setUser(data.user);
      } catch (err) {
        console.error("Token verification failed:", err);
        clearTokens();
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email, password, rememberMe) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        if (data.error === "Invalid credentials") {
          setShowLoginError(true);
          return;
        }
        throw new Error(data.error || "Login failed");
      }

      const maxAge = rememberMe ? 7 * 24 * 60 * 60 : 60 * 60;
      Cookies.set("token", data.token, {
        expires: maxAge / (24 * 60 * 60),
        path: "/",
        sameSite: "Strict",
        secure: process.env.NODE_ENV === "production",
      });

      if (rememberMe) {
        localStorage.setItem("token", data.token);
      } else {
        sessionStorage.setItem("token", data.token);
      }

      setUser({
        id: data.user.id,
        email: data.user.email,
        full_name: data.user.full_name,
        role: data.user.role,
        agency_id: data.user.agency_id,
        agency: null,
      });

      const redirectTo = data.user.role === "admin" ? "/admin" : "/dashboard";
      window.location.href = redirectTo;
    } catch (error) {
      console.error("AuthContext: Login error:", error);
      throw error;
    }
  };

  const logout = () => {
    clearTokens();
    setUser(null);
    fetch("/api/auth/logout", { method: "POST" }); // optional: to clear refresh cookie server-side
    router.push("/");
  };

  const clearTokens = () => {
    Cookies.remove("token", { path: "/" });
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
      <SessionExpiredModal
        isOpen={showExpiredModal}
        onClose={() => {
          setShowExpiredModal(false);
          clearTokens();
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
