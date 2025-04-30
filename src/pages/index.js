import React, { useState } from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import Image from "next/image";
import CustomSlider from "@/components/CustomSlider";
import RegisterForm from "@/components/RegisterForm";

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loginData, setLoginData] = useState({
    email: "john@paan.africa",
    password: "testpassword",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Logging in with:", loginData.email, loginData.password);
  };

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
    <div className="flex flex-col md:flex-row min-h-screen bg-[#172840]">
      {/* Left Section - Hidden on mobile */}
      <div className="hidden md:block w-full md:w-3/5 bg-login">
        <CustomSlider />
      </div>

      {/* Right Section */}
      <div className="w-full md:w-2/5 flex items-start justify-center p-4 md:p-6 overflow-y-auto">
        <div className="w-full max-w-md py-4">
          <div className="mb-6">
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
                className="bg-white/95 rounded-lg py-2 px-4 transition-transform duration-300 ease-in-out hover:translate-y-[-2px]"
                priority
              />
            </Link>
          </div>

          <div className="pb-6 space-y-2">
            {isLogin ? (
              <>
                <p className="text-3xl text-gray-100">Welcome back!</p>
                <p className="text-gray-300">
                  Access a centralized platform for sharing insights, best
                  practices, and resources to drive innovation and growth.
                </p>
              </>
            ) : (
              <>
                <p className="text-3xl text-gray-100">Join the Network!</p>
                <p className="text-gray-300">
                  Create an account to connect with the Pan-African Agency
                  Network and unlock tools for innovation and collaboration.
                </p>
              </>
            )}
          </div>

          {isLogin ? (
            <form onSubmit={handleLogin}>
              {/* Email Field */}
              <div className="mb-4">
                <label
                  className="block text-gray-300 text-sm md:text-base mb-2"
                  htmlFor="email"
                >
                  Email
                </label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={loginData.email}
                    onChange={handleLoginChange}
                    className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg py-1.5 md:py-2 px-4 focus:outline-none focus:border-blue-500"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <Icon icon="heroicons:envelope" className="w-5 h-5" />
                  </span>
                </div>
              </div>

              {/* Password Field */}
              <div className="mb-4">
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
                    className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg py-1.5 md:py-2 px-4 focus:outline-none focus:border-blue-500"
                  />
                  <span
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                  >
                    {showPassword ? (
                      <Icon icon="heroicons:eye-slash" className="w-5 h-5" />
                    ) : (
                      <Icon icon="heroicons:eye" className="w-5 h-5" />
                    )}
                  </span>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex flex-col md:flex-row items-center justify-between mb-6 space-y-2 md:space-y-0">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    name="rememberMe"
                    checked={loginData.rememberMe}
                    onChange={handleLoginChange}
                    className="mr-2"
                  />
                  <label
                    htmlFor="rememberMe"
                    className="text-gray-300 text-sm md:text-base"
                  >
                    Remember me on this device
                  </label>
                </div>
                <span>
                  <Link href="/forgot-password">
                    <span className="text-gray-400 text-sm md:text-base hover:underline hover:text-[#FF930A]">
                      Forgot Password?
                    </span>
                  </Link>
                </span>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="w-full bg-sky-500 text-white font-bold py-3 rounded-lg transform transition-transform duration-700 ease-in-out hover:scale-105"
              >
                Access Dashboard
              </button>
            </form>
          ) : (
            <RegisterForm />
          )}

          {/* Social Login Buttons */}
          <div className="flex flex-col justify-center items-center gap-4 md:flex-row md:gap-6 mt-6">
            <button
              onClick={() => handleSocialLogin("Google")}
              className="flex items-center hover:underline text-gray-300 font-normal py-2 rounded-lg transform transition-transform duration-300 ease-in-out hover:translate-y-[-5px]"
            >
              <Icon icon="devicon:google" className="w-5 h-5 mr-2" />
              {isLogin ? "Continue with Google" : "Sign Up with Google"}
            </button>
            <span className="text-gray-400 hidden md:block">|</span>
            <button
              onClick={() => handleSocialLogin("Facebook")}
              className="flex items-center hover:underline text-gray-300 font-normal py-2 rounded-lg transform transition-transform duration-300 ease-in-out hover:translate-y-[-5px]"
            >
              <Icon icon="logos:facebook" className="w-5 h-5 mr-2" />
              {isLogin ? "Continue with Facebook" : "Sign Up with Facebook"}
            </button>
          </div>

          {/* Toggle Form Link */}
          <div className="mt-6 flex justify-center items-center w-full space-x-2">
            <span className="text-gray-200 text-sm md:text-base">
              {isLogin
                ? "Don't have an account yet?"
                : "Already have an account?"}
            </span>
            <button
              onClick={toggleForm}
              className="text-[#FF930A] underline font-bold hover:text-gray-100 text-sm md:text-base"
            >
              {isLogin ? "Sign Up Here" : "Sign In Here"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
