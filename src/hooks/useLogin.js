import { useState } from "react";
import { useAuth } from "@/hooks/useAuth"; // Import the custom useAuth hook

const useLogin = () => {
  const { login, signInWithSocial } = useAuth(); // Use the provided login and social login methods from useAuth
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);

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

  return {
    loginData,
    setLoginData,
    showPassword,
    togglePasswordVisibility,
    handleLogin,
    handleLoginChange,
    handleSocialLogin,
  };
};

export default useLogin;
