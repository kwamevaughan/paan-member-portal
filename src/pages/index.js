import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import Image from "next/image";
import CustomSlider from "@/components/CustomSlider";
import RegisterForm from "@/components/RegisterForm";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loginData, setLoginData] = useState({
    email: "john@paan.africa",
    password: "Test1234",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Login payload:", loginData);
    toast.info("Please wait...", { autoClose: false, toastId: "loginToast" });

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password,
        }),
      });

      const data = await response.json();
      console.log("Login response:", data);

      if (!response.ok) {
        toast.dismiss("loginToast");
        toast.error(data.error || "Login failed");
        return;
      }

      // Store token in cookie for middleware
      const maxAge = loginData.rememberMe ? 7 * 24 * 60 * 60 : 60 * 60; // 7 days or 1 hour
      Cookies.set("token", data.token, {
        expires: maxAge / (24 * 60 * 60), // Convert seconds to days
        path: "/",
        sameSite: "Strict",
        secure: process.env.NODE_ENV === "production", // Secure in production
      });
      console.log("Cookie set:", Cookies.get("token"));

      // Store token in localStorage or sessionStorage for client-side
      if (loginData.rememberMe) {
        localStorage.setItem("token", data.token);
        console.log("localStorage set:", localStorage.getItem("token"));
      } else {
        sessionStorage.setItem("token", data.token);
        console.log("sessionStorage set:", sessionStorage.getItem("token"));
      }

      // Store user data
      const userData = {
        id: data.user.id,
        email: data.user.email,
        full_name: data.user.full_name,
        role: data.user.role,
        agency_id: data.user.agency_id,
      };

      sessionStorage.setItem("user", JSON.stringify(userData));

      toast.dismiss("loginToast");
      toast.success("Login successful! Redirecting...");

      // Redirect based on role with timeout to ensure state is updated
      const redirectTo = data.user.role === "admin" ? "/admin" : "/dashboard";
      console.log("Redirecting to:", redirectTo);

      // Use window.location for a hard redirect instead of Next.js router
      setTimeout(() => {
        window.location.href = redirectTo;
      }, 500);
    } catch (error) {
      console.error("Login error:", error);
      toast.dismiss("loginToast");
      toast.error("An error occurred. Please try again.");
    }
  };

  // Check if user is already logged in
  useEffect(() => {
    const token =
      Cookies.get("token") ||
      sessionStorage.getItem("token") ||
      localStorage.getItem("token");

    if (token) {
      try {
        // Attempt to parse token to check if it's a valid JWT
        const tokenParts = token.split(".");
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));

          // Check if token is expired
          if (payload.exp && payload.exp * 1000 > Date.now()) {
            // Token exists and is not expired
            const redirectTo =
              payload.role === "admin" ? "/admin" : "/dashboard";
            router.push(redirectTo);
          }
        }
      } catch (error) {
        console.error("Error checking token:", error);
        // Clear invalid tokens
        Cookies.remove("token");
        sessionStorage.removeItem("token");
        localStorage.removeItem("token");
      }
    }
  }, [router]);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const handleLoginChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSocialLogin = (provider) => {
    console.log(`Initiating ${isLogin ? "login" : "sign-up"} with ${provider}`);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#D1D3D4]">
      <div className="w-full md:w-2/5 flex flex-col justify-between md:p-6 overflow-y-auto">
        <div className="flex flex-col items-center">
          <div className="w-full max-w-md">
            <Link
              href="https://paan.africa"
              target="_blank"
              rel="noopener noreferrer"
              title="Visit Paan Africa website"
            >
              <Image
                src="/assets/images/logo.svg"
                alt="Pan-African Agency Network Logo"
                width={250}
                height={0}
                className="transition-transform duration-300 ease-in-out hover:translate-y-[-2px]"
                priority
              />
            </Link>
          </div>
        </div>

        <div className="flex-grow flex flex-col justify-center items-center">
          <div className="w-full max-w-md py-4">
            <div className="pb-6 space-y-2">
              {isLogin ? (
                <>
                  <p className="text-3xl text-paan-blue font-bold">
                    Welcome back!
                  </p>
                  <p className="text-paan-blue font-light">
                    Access business opportunities for your agency, Co-bidding
                    opportunities, Resources, Templates, Market intelligence,
                    Market trends, Events & more to stay ahead of the curve in
                    Africa.
                  </p>
                </>
              ) : (
                <>
                  <p className="text-3xl text-paan-blue font-bold">
                    Join the Network!
                  </p>
                  <p className="text-paan-blue font-light">
                    Create an account to connect with the Pan-African Agency
                    Network and unlock tools for innovation and collaboration.
                  </p>
                </>
              )}
            </div>

            {isLogin ? (
              <form onSubmit={handleLogin}>
                <div className="">
                  <label className="hidden" htmlFor="email">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={loginData.email}
                      onChange={handleLoginChange}
                      className="w-full bg-transparent text-paan-blue font-light border-b-2 border-gray-700 rounded-none py-2.5 md:py-3 px-2 focus:outline-none focus:border-blue-500"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-paan-blue">
                      <Icon icon="heroicons:envelope" className="w-5 h-5" />
                    </span>
                  </div>
                </div>

                <div className="mb-8">
                  <label
                    className="block text-gray-300 text-sm md:text-base mb-2"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={loginData.password}
                      onChange={handleLoginChange}
                      className="w-full bg-transparent text-paan-blue font-light border-b-2 border-gray-700 rounded-none py-2.5 md:py-3 px-2 focus:outline-none focus:border-blue-500"
                    />
                    <span
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-paan-blue cursor-pointer"
                    >
                      {showPassword ? (
                        <Icon icon="heroicons:eye-slash" className="w-5 h-5" />
                      ) : (
                        <Icon icon="heroicons:eye" className="w-5 h-5" />
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between mb-8 space-y-2 md:space-y-0">
                  <div className="flex items-center">
                    <div
                      onClick={() =>
                        setLoginData({
                          ...loginData,
                          rememberMe: !loginData.rememberMe,
                        })
                      }
                      className={`w-5 h-5 flex items-center justify-center border-2 border-paan-blue rounded-full cursor-pointer transition-all duration-200 ease-in-out ${
                        loginData.rememberMe
                          ? "bg-transparent"
                          : "bg-transparent"
                      }`}
                    >
                      {loginData.rememberMe && (
                        <Icon
                          icon="ic:baseline-check"
                          className="w-4 h-4 text-paan-blue"
                        />
                      )}
                    </div>

                    <label
                      className="ml-2 text-paan-blue font-light text-sm md:text-base cursor-pointer"
                      onClick={() =>
                        setLoginData({
                          ...loginData,
                          rememberMe: !loginData.rememberMe,
                        })
                      }
                    >
                      Remember me on this device
                    </label>
                  </div>

                  <span>
                    <Link href="/forgot-password">
                      <span className="text-paan-blue font-light text-sm md:text-base hover:underline hover:text-paan-red">
                        Forgot Password?
                      </span>
                    </Link>
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full bg-paan-red text-white font-bold py-3 rounded-full transform transition-transform duration-700 ease-in-out hover:scale-105"
                >
                  Access Dashboard
                </button>
              </form>
            ) : (
              <RegisterForm />
            )}

            <div className="flex flex-col justify-center items-center gap-4 md:flex-row md:gap-6 mt-6">
              <button
                onClick={() => handleSocialLogin("Google")}
                className="flex items-center hover:underline text-gray-600 font-normal py-2 rounded-lg transform transition-transform duration-300 ease-in-out hover:translate-y-[-5px]"
              >
                <Icon icon="devicon:google" className="w-5 h-5 mr-2" />
                {isLogin ? "Continue with Google" : "Sign Up with Google"}
              </button>
              <span className="text-gray-400 hidden md:block">|</span>
              <button
                onClick={() => handleSocialLogin("Facebook")}
                className="flex items-center hover:underline text-gray-600 font-normal py-2 rounded-lg transform transition-transform duration-300 ease-in-out hover:translate-y-[-5px]"
              >
                <Icon icon="logos:facebook" className="w-5 h-5 mr-2" />
                {isLogin ? "Continue with Facebook" : "Sign Up with Facebook"}
              </button>
            </div>

            <div className="mt-6 flex justify-center items-center w-full space-x-2">
              <span className="text-gray-600 text-sm md:text-base">
                {isLogin
                  ? "Don't have an account yet?"
                  : "Already have an account?"}
              </span>
              <button
                onClick={toggleForm}
                className="text-gray-600 underline hover:text-paan-red text-sm md:text-base"
              >
                {isLogin ? "Sign Up Here" : "Sign In Here"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden md:block w-full md:w-3/5 bg-login">
        <CustomSlider />
      </div>
    </div>
  );
};

export default LoginPage;
