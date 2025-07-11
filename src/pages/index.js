import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { Icon } from "@iconify/react";
import Link from "next/link";
import Image from "next/image";
import CustomSlider from "@/components/CustomSlider";
import useLogin from "@/hooks/useLogin";
import ForgotPasswordModal from "@/components/modals/ForgotPasswordModal";

const LoginPage = () => {
  const router = useRouter();
  const {
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
  } = useLogin();

  useEffect(() => {
    if (router.isReady) {
      console.log("LoginPage: Current route:", router.pathname);
    }
  }, [router.isReady, router.pathname]);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white pt-0">
      <div className="w-full md:w-2/5 flex flex-col justify-between overflow-y-auto gap-10">
        <div className="flex flex-col items-center pt-10">
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
              <p className="text-3xl text-paan-dark-blue font-semibold">
                Welcome back!
              </p>
              <p className="text-paan-dark-blue font-light">
                PAAN portal offers members business, co-bidding, PR, revenue,
                events, news, templates, and freelancer access across Africa.
              </p>
            </div>

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
                    placeholder="Enter your email"
                    onChange={handleLoginChange}
                    className="w-full bg-transparent text-paan-dark-blue font-light border-b-2 border-gray-700 rounded-none py-2.5 md:py-3 px-2 focus:outline-none focus:border-blue-500"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-paan-dark-blue">
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
                    placeholder="Enter your password"
                    onChange={handleLoginChange}
                    className="w-full bg-transparent text-paan-dark-blue font-light border-b-2 border-gray-700 rounded-none py-2.5 md:py-3 px-2 focus:outline-none focus:border-blue-500"
                  />
                  <span
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-paan-dark-blue cursor-pointer"
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
                      setLoginData((prev) => ({
                        ...prev,
                        rememberMe: !prev.rememberMe,
                      }))
                    }
                    className={`w-5 h-5 flex items-center justify-center border-2 border-paan-dark-blue rounded-full cursor-pointer transition-all duration-200 ease-in-out ${
                      loginData.rememberMe ? "bg-transparent" : "bg-transparent"
                    }`}
                  >
                    {loginData.rememberMe && (
                      <Icon
                        icon="ic:baseline-check"
                        className="w-4 h-4 text-paan-dark-blue"
                      />
                    )}
                  </div>

                  <label
                    className="ml-2 text-paan-dark-blue font-light text-sm md:text-base cursor-pointer"
                    onClick={() =>
                      setLoginData((prev) => ({
                        ...prev,
                        rememberMe: !prev.rememberMe,
                      }))
                    }
                  >
                    Remember me on this device
                  </label>
                </div>

                <span>
                  <button
                    type="button"
                    onClick={() => setShowForgotPasswordModal(true)}
                    className="text-paan-dark-blue font-light text-sm md:text-base hover:underline hover:text-paan-red"
                  >
                    Forgot Password?
                  </button>
                </span>
              </div>

              <button
                type="submit"
                className="w-full bg-paan-red text-white font-bold py-3 rounded-full transform transition-transform duration-700 ease-in-out hover:scale-105"
              >
                Access Dashboard
              </button>
            </form>

            <div className="flex flex-col justify-center items-center gap-4 md:flex-row md:gap-6 mt-6">
              <button
                onClick={() => handleSocialLogin("Google")}
                className="flex items-center hover:underline text-gray-600 font-normal py-2 rounded-lg transform transition-transform duration-300 ease-in-out hover:translate-y-[-5px]"
              >
                <Icon icon="devicon:google" className="w-5 h-5 mr-2" />
                Continue with Google
              </button>
              <button
                onClick={() => handleSocialLogin("Facebook")}
                className="flex items-center hover:underline text-gray-600 font-normal py-2 rounded-lg transform transition-transform duration-300 ease-in-out hover:translate-y-[-5px]"
              >
                <Icon icon="logos:facebook" className="w-5 h-5 mr-2" />
                Continue with Facebook
              </button>
            </div>

            <div className="mt-6 flex justify-center items-center w-full space-x-2">
              <span className="text-gray-600 text-sm md:text-base">
                Don't have an account yet?
              </span>
              <Link href="https://membership.paan.africa/" target="_blank">
                <button className="text-gray-600 underline hover:text-paan-red text-sm md:text-base">
                  Become a member here
                </button>
              </Link>
            </div>
          </div>
        </div>
        <div className="w-full bg-login-footer"></div>
      </div>

      <div className="hidden md:block w-full md:w-3/5 bg-login bg-paan-dark-blue">
        <CustomSlider />
      </div>

      <ForgotPasswordModal
        isOpen={showForgotPasswordModal}
        onClose={() => setShowForgotPasswordModal(false)}
        onSubmit={handleForgotPassword}
      />
    </div>
  );
};

export default LoginPage;
