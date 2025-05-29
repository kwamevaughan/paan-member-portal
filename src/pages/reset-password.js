import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Icon } from "@iconify/react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

const ResetPasswordPage = () => {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Ensure the page is only accessible via a valid password reset link
    const handlePasswordReset = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session) {
        toast.error("Invalid or expired reset link. Please try again.");
        router.push("/login");
      }
    };
    handlePasswordReset();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      setIsSubmitting(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        throw new Error(error.message);
      }

      toast.success("Password updated successfully! Redirecting to login...");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error) {
      setError(error.message || "Failed to update password. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-md p-6">
        <h1 className="text-3xl text-paan-blue font-bold mb-4">
          Reset Password
        </h1>
        <p className="text-paan-blue font-light mb-6">
          Enter your new password below.
        </p>

        {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-300 text-sm md:text-base mb-2"
              htmlFor="new-password"
            >
              New Password
            </label>
            <div className="relative">
              <input
                id="new-password"
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full bg-transparent text-paan-blue font-light border-b-2 border-gray-700 rounded-none py-2.5 px-2 focus:outline-none focus:border-blue-500"
                required
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

          <div className="mb-6">
            <label
              className="block text-gray-300 text-sm md:text-base mb-2"
              htmlFor="confirm-password"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirm-password"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full bg-transparent text-paan-blue font-light border-b-2 border-gray-700 rounded-none py-2.5 px-2 focus:outline-none focus:border-blue-500"
                required
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

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-paan-red text-white font-bold py-3 rounded-full transform transition-transform duration-700 ease-in-out hover:scale-105 ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Updating..." : "Update Password"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => router.push("/login")}
            className="text-paan-blue font-light text-sm md:text-base hover:underline hover:text-paan-red"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
