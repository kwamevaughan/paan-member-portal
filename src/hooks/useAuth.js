import { useContext } from "react";
import { AuthContext } from "@/context/authContext";
import { toast } from "react-toastify";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  const { login, logout } = context;

  const handleLogin = async (email, password, rememberMe) => {
    toast.info("Please wait...", { autoClose: false, toastId: "loginToast" });
    try {
      await login(email, password, rememberMe);
      toast.dismiss("loginToast");
      toast.success("Login successful! Redirecting...");
    } catch (error) {
      toast.dismiss("loginToast");
      toast.error(error.message || "An error occurred. Please try again.");
    }
  };

  return { login: handleLogin, logout };
};
