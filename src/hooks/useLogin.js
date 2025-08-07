import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import toast from "react-hot-toast";

const useLogin = () => {
  const { login, signInWithSocial, resetPassword } = useAuth(); // Add resetPassword
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  // Check for remembered email on component mount
  useEffect(() => {
    const rememberedEmail = localStorage.getItem("paan_remembered_email");
    const sessionExpiry = localStorage.getItem("paan_session_expiry");
    
    console.log("useLogin: Checking remembered email:", { rememberedEmail, sessionExpiry });
    
    if (rememberedEmail && sessionExpiry) {
      const expiryTime = parseInt(sessionExpiry, 10);
      const currentTime = Date.now();
      
      console.log("useLogin: Expiry check:", { expiryTime, currentTime, isValid: currentTime < expiryTime });
      
      // Check if the session hasn't expired (30 days)
      if (currentTime < expiryTime) {
        console.log("useLogin: Setting remembered email:", rememberedEmail);
        setLoginData(prev => ({
          ...prev,
          email: rememberedEmail,
          rememberMe: true
        }));
      } else {
        // Session expired, clean up
        console.log("useLogin: Session expired, cleaning up");
        localStorage.removeItem("paan_remembered_email");
        localStorage.removeItem("paan_session_expiry");
      }
    } else {
      console.log("useLogin: No remembered email found");
    }
  }, []);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleLoginChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    await login(loginData.email, loginData.password, loginData.rememberMe);
  };

  const handleSocialLogin = async (provider) => {
    await signInWithSocial(provider);
  };

  const handleForgotPassword = async (email) => {
    const toastId = toast.loading("Sending password reset email...");
    try {
      await resetPassword(email);
      toast.dismiss(toastId);
      toast.success("Password reset email sent! Please check your inbox.");
    } catch (error) {
      toast.dismiss(toastId);
      toast.error(
        error.message || "Failed to send reset email. Please try again."
      );
    }
  };

  return {
    loginData,
    setLoginData,
    showPassword,
    togglePasswordVisibility,
    handleLogin,
    handleLoginChange,
    handleSocialLogin,
    showForgotPasswordModal,
    setShowForgotPasswordModal,
    handleForgotPassword,
  };
};

export default useLogin;
