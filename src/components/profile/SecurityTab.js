import { useState } from "react";
import { Icon } from "@iconify/react";
import { supabase } from "../../lib/supabase";
import toast from "react-hot-toast";

export default function SecurityTab({ user, mode }) {
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [loading, setLoading] = useState(false);

  // Handle password input changes
  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Toggle password visibility
  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // Validate password strength
  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const errors = [];
    if (password.length < minLength) errors.push("At least 8 characters");
    if (!hasUpperCase) errors.push("One uppercase letter");
    if (!hasLowerCase) errors.push("One lowercase letter");
    if (!hasNumbers) errors.push("One number");
    if (!hasSpecialChar) errors.push("One special character");

    return {
      isValid: errors.length === 0,
      errors,
      strength: errors.length === 0 ? "Strong" : errors.length <= 2 ? "Medium" : "Weak"
    };
  };

  // Handle password change
  const handleChangePassword = async () => {
    if (!passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }

    const validation = validatePassword(passwordData.newPassword);
    if (!validation.isValid) {
      toast.error(`Password must have: ${validation.errors.join(", ")}`);
      return;
    }

    try {
      setLoading(true);
      
      // Update password using Supabase Auth
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (error) {
        console.error("Password update error:", error);
        toast.error("Failed to update password. Please try again.");
        return;
      }

      // Clear form and show success
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setIsChangingPassword(false);
      toast.success("Password updated successfully!");

    } catch (error) {
      console.error("Password update error:", error);
      toast.error("Failed to update password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Cancel password change
  const handleCancelPasswordChange = () => {
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setIsChangingPassword(false);
  };

  const passwordValidation = validatePassword(passwordData.newPassword);

  return (
    <div
      className={`rounded-2xl p-8 shadow-xl transition-all duration-500 ${
        mode === "dark"
          ? "bg-gray-800 border border-gray-700"
          : "bg-white border border-gray-100"
      }`}
    >
      <div className="flex items-center space-x-3 mb-8">
        <div
          className={`p-3 rounded-xl ${
            mode === "dark" ? "bg-paan-yellow/20" : "bg-paan-yellow/30"
          }`}
        >
          <Icon
            icon="mdi:shield-lock"
            className={`w-6 h-6 ${
              mode === "dark" ? "text-paan-yellow" : "text-paan-dark-blue"
            }`}
          />
        </div>
        <h3
          className={`text-2xl font-bold ${
            mode === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          Security Settings
        </h3>
      </div>

      <div className="space-y-8">
        {/* Account Security Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            className={`p-6 hover:-translate-y-1 transition-all duration-500 ease-in-out rounded-xl ${
              mode === "dark" ? "bg-paan-yellow/20" : "bg-paan-yellow/30"
            } border border-paan-yellow/50`}
          >
            <div className="flex items-center space-x-3 mb-3">
              <Icon
                icon="mdi:check-circle"
                className="w-8 h-8 text-paan-yellow"
              />
              <div>
                <h4
                  className={`font-semibold ${
                    mode === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  Account Verified
                </h4>
                <p
                  className={`text-sm ${
                    mode === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Your email is verified and secure
                </p>
              </div>
            </div>
          </div>

          <div
            className={`p-6 hover:-translate-y-1 transition-all duration-500 ease-in-out rounded-xl ${
              mode === "dark" ? "bg-paan-blue/20" : "bg-paan-blue/30"
            } border border-paan-blue/50`}
          >
            <div className="flex items-center space-x-3 mb-3">
              <Icon
                icon="mdi:shield-check"
                className="w-8 h-8 text-paan-blue"
              />
              <div>
                <h4
                  className={`font-semibold ${
                    mode === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  Secure Login
                </h4>
                <p
                  className={`text-sm ${
                    mode === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Protected by secure authentication
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Password Change Section */}
        <div
          className={`p-6 rounded-xl border ${
            mode === "dark"
              ? "bg-gray-700/50 border-gray-600"
              : "bg-gray-50 border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h4
                className={`text-lg font-semibold ${
                  mode === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Password
              </h4>
              <p
                className={`text-sm ${
                  mode === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Keep your account secure with a strong password
              </p>
            </div>
            {!isChangingPassword && (
              <button
                onClick={() => setIsChangingPassword(true)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  mode === "dark"
                    ? "bg-paan-yellow hover:bg-paan-yellow/90 text-paan-dark-blue font-semibold"
                    : "bg-paan-yellow hover:bg-paan-yellow/90 text-paan-dark-blue font-semibold"
                }`}
              >
                <Icon icon="mdi:key" className="w-4 h-4" />
                <span>Change Password</span>
              </button>
            )}
          </div>

          {isChangingPassword && (
            <div className="space-y-6">
              {/* Current Password */}
              <div className="space-y-3">
                <label
                  className={`block text-sm font-semibold ${
                    mode === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      handlePasswordChange("currentPassword", e.target.value)
                    }
                    className={`w-full px-4 py-3 pr-12 rounded-xl border-2 transition-all duration-300 focus:ring-4 focus:ring-paan-yellow/20 ${
                      mode === "dark"
                        ? "bg-gray-700 border-gray-600 text-white focus:border-paan-yellow"
                        : "bg-gray-50 border-gray-200 text-gray-900 focus:border-paan-yellow focus:bg-white"
                    }`}
                    placeholder="Enter your current password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("current")}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    <Icon
                      icon={showPasswords.current ? "mdi:eye-off" : "mdi:eye"}
                      className="w-5 h-5"
                    />
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-3">
                <label
                  className={`block text-sm font-semibold ${
                    mode === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      handlePasswordChange("newPassword", e.target.value)
                    }
                    className={`w-full px-4 py-3 pr-12 rounded-xl border-2 transition-all duration-300 focus:ring-4 focus:ring-paan-yellow/20 ${
                      mode === "dark"
                        ? "bg-gray-700 border-gray-600 text-white focus:border-paan-yellow"
                        : "bg-gray-50 border-gray-200 text-gray-900 focus:border-paan-yellow focus:bg-white"
                    }`}
                    placeholder="Enter your new password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("new")}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    <Icon
                      icon={showPasswords.new ? "mdi:eye-off" : "mdi:eye"}
                      className="w-5 h-5"
                    />
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {passwordData.newPassword && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-xs font-medium ${
                          passwordValidation.strength === "Strong"
                            ? "text-green-600"
                            : passwordValidation.strength === "Medium"
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        Password Strength: {passwordValidation.strength}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          passwordValidation.strength === "Strong"
                            ? "bg-green-500 w-full"
                            : passwordValidation.strength === "Medium"
                            ? "bg-yellow-500 w-2/3"
                            : "bg-red-500 w-1/3"
                        }`}
                      ></div>
                    </div>
                    {!passwordValidation.isValid && (
                      <div className="text-xs text-red-600 space-y-1">
                        <p>Password must include:</p>
                        <ul className="list-disc list-inside space-y-1">
                          {passwordValidation.errors.map((error, index) => (
                            <li key={index}>{error}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-3">
                <label
                  className={`block text-sm font-semibold ${
                    mode === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      handlePasswordChange("confirmPassword", e.target.value)
                    }
                    className={`w-full px-4 py-3 pr-12 rounded-xl border-2 transition-all duration-300 focus:ring-4 focus:ring-paan-yellow/20 ${
                      mode === "dark"
                        ? "bg-gray-700 border-gray-600 text-white focus:border-paan-yellow"
                        : "bg-gray-50 border-gray-200 text-gray-900 focus:border-paan-yellow focus:bg-white"
                    }`}
                    placeholder="Confirm your new password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("confirm")}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    <Icon
                      icon={showPasswords.confirm ? "mdi:eye-off" : "mdi:eye"}
                      className="w-5 h-5"
                    />
                  </button>
                </div>
                {passwordData.confirmPassword &&
                  passwordData.newPassword !== passwordData.confirmPassword && (
                    <p className="text-xs text-red-600">
                      Passwords don't match
                    </p>
                  )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3 pt-4">
                <button
                  onClick={handleChangePassword}
                  disabled={
                    loading ||
                    !passwordValidation.isValid ||
                    passwordData.newPassword !== passwordData.confirmPassword
                  }
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    mode === "dark"
                      ? "bg-paan-yellow hover:bg-paan-yellow/90 text-paan-dark-blue font-semibold"
                      : "bg-paan-yellow hover:bg-paan-yellow/90 text-paan-dark-blue font-semibold"
                  }`}
                >
                  {loading ? (
                    <Icon icon="mdi:loading" className="w-4 h-4 animate-spin" />
                  ) : (
                    <Icon icon="mdi:check" className="w-4 h-4" />
                  )}
                  <span>{loading ? "Updating..." : "Update Password"}</span>
                </button>
                <button
                  onClick={handleCancelPasswordChange}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors ${
                    mode === "dark"
                      ? "bg-gray-600 hover:bg-gray-700 text-white"
                      : "bg-gray-500 hover:bg-gray-600 text-white"
                  }`}
                >
                  <Icon icon="mdi:close" className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Security Tips */}
        <div
          className={`p-6 rounded-xl border-l-4 border-paan-blue ${
            mode === "dark" ? "bg-paan-blue/10" : "bg-paan-blue/20"
          }`}
        >
          <h4
            className={`font-semibold mb-3 ${
              mode === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Security Tips
          </h4>
          <ul
            className={`space-y-2 text-sm ${
              mode === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            <li className="flex items-start space-x-2">
              <Icon
                icon="mdi:check"
                className="w-4 h-4 text-paan-yellow mt-0.5 flex-shrink-0"
              />
              <span>Use a unique password that you don't use elsewhere</span>
            </li>
            <li className="flex items-start space-x-2">
              <Icon
                icon="mdi:check"
                className="w-4 h-4 text-paan-yellow mt-0.5 flex-shrink-0"
              />
              <span>
                Include a mix of letters, numbers, and special characters
              </span>
            </li>
            <li className="flex items-start space-x-2">
              <Icon
                icon="mdi:check"
                className="w-4 h-4 text-paan-yellow mt-0.5 flex-shrink-0"
              />
              <span>Avoid using personal information in your password</span>
            </li>
            <li className="flex items-start space-x-2">
              <Icon
                icon="mdi:check"
                className="w-4 h-4 text-paan-yellow mt-0.5 flex-shrink-0"
              />
              <span>Consider using a password manager for better security</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}