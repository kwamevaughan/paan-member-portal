import React, { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import jwt from "jsonwebtoken";
import supabase from "lib/supabaseClient";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token =
        Cookies.get("token") ||
        sessionStorage.getItem("token") ||
        localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/verify-token", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Token verification failed");

        setUser(data.user); // this is your decoded token payload
      } catch (err) {
        console.error("Token verification failed:", err);
        clearTokens();
        setUser(null);
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
        throw new Error(data.error || "Login failed");
      }

      // Store token
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

      // Set user
      setUser({
        id: data.user.id,
        email: data.user.email,
        full_name: data.user.full_name,
        role: data.user.role,
        agency_id: data.user.agency_id,
        agency: null, // Will be fetched on dashboard
      });

      // Redirect
      const redirectTo = data.user.role === "admin" ? "/admin" : "/dashboard";
      console.log("AuthContext: Redirecting to:", redirectTo);
      window.location.href = redirectTo; // Hard redirect
    } catch (error) {
      console.error("AuthContext: Login error:", error);
      throw error;
    }
  };

  const logout = () => {
    clearTokens();
    setUser(null);
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
    </AuthContext.Provider>
  );
};
