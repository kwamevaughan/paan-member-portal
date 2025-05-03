import { useState, useEffect, useRef } from "react";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/16/solid";
import Notifications from "@/components/Notifications";

const HRHeader = ({
  mode,
  toggleSidebar,
  toggleMode,
  isSidebarOpen,
  onLogout,
  pageName = "Dashboard",
  pageDescription = "",
  fullName = "GCG BD Team", // Default value
  loading = false, // Default value
  notifications = [], // New prop for notifications
  isLoading = false, // New prop for loading state
  onMarkAsRead = () => {}, // Function to mark notifications as read
  onClearAll, // Function to clear all notifications
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const notificationsRef = useRef(null);
  const headerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close user dropdown when clicking outside
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }

      // Close notifications dropdown when clicking outside
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (headerRef.current) {
      const headerHeight = headerRef.current.offsetHeight;
      document.body.style.paddingTop = `${headerHeight}px`;
    }
  }, []);

  // Count unread notifications
  const unreadCount = notifications.filter((notif) => !notif.read).length;

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-50 mb-6 content-container transition-all duration-300 shadow-sm ${
        mode === "dark"
          ? "border-[#f05d23] bg-[#101827] text-white bg-opacity-100"
          : "border-gray-300 bg-[#ececec] text-black bg-opacity-50"
      } ${isSidebarOpen ? "md:ml-[300px]" : "md:ml-[80px]"} backdrop-blur-md`}
    >
      <div className="flex items-center justify-between p-0 md:p-4">
        {/* Left Section: Sidebar Toggle, Page Info */}
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleSidebar}
            className="p-2 focus:outline-none"
            aria-label="Toggle sidebar"
          >
            {isSidebarOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
          <div className="flex flex-col">
            <h1
              className={`text-2xl font-bold flex items-center gap-2 ${
                mode === "dark" ? "text-white" : "text-[#231812]"
              }`}
            >
              {pageName}
            </h1>
            {pageDescription && (
              <p
                className={`text-base truncate max-w-[200px] md:max-w-[500px] ${
                  mode === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {pageDescription}
              </p>
            )}
          </div>
        </div>

        {/* Right Section: Dark Mode, User, and Notifications */}
        <div className="flex items-center space-x-2 md:space-x-6">
          {/* Dark Mode Toggle (Mobile) */}
          <button
            onClick={toggleMode}
            className="p-2 focus:outline-none md:hidden"
            aria-label="Toggle dark mode"
          >
            {mode === "dark" ? (
              <SunIcon className="h-6 w-6" />
            ) : (
              <MoonIcon className="h-6 w-6" />
            )}
          </button>

          {/* Notifications Icon */}
          <div
            className="relative cursor-pointer"
            ref={notificationsRef}
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
          >
            <div className="p-2 focus:outline-none cursor-pointer relative">
              <Icon
                icon="mdi:bell-outline"
                width={24}
                height={24}
                className={`text-[#f05d23] ${
                  unreadCount > 0 ? "animate-pulse" : ""
                }`}
              />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-600 text-white rounded-full text-xs px-2 py-1">
                  {unreadCount}
                </span>
              )}
            </div>
            {isNotificationsOpen && (
              <div
                className={`absolute top-12 right-0 w-96 rounded-2xl shadow-lg z-10 ${
                  mode === "dark"
                    ? "bg-gray-800 text-white"
                    : "bg-white text-[#231812]"
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                <Notifications
                  notifications={notifications}
                  mode={mode}
                  isLoading={isLoading}
                  onMarkAsRead={onMarkAsRead}
                  onClearAll={onClearAll}
                />
              </div>
            )}
          </div>

          <label className="hidden md:inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={mode === "dark"}
              onChange={toggleMode}
              className="hidden"
            />
            <div
              className={`relative w-14 h-8 rounded-full border-2 flex items-center ${
                mode === "dark"
                  ? "border-blue-600 bg-blue-600"
                  : "border-gray-300 bg-gray-300"
              } transition`}
            >
              <div
                className={`absolute w-6 h-6 rounded-full bg-white flex items-center justify-center transition-transform ${
                  mode === "dark" ? "translate-x-6" : ""
                }`}
              >
                {mode === "dark" ? (
                  <Icon icon="bi:moon" className="h-4 w-4 text-gray-700" />
                ) : (
                  <Icon icon="bi:sun" className="h-4 w-4 text-yellow-500" />
                )}
              </div>
            </div>
          </label>

          {/* User Dropdown */}
          <div
            className="flex items-center gap-2 relative group cursor-default"
            ref={dropdownRef}
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="w-10 h-10 overflow-hidden">
                <Image
                  src={mode === "dark" ? "/favicon-white.png" : "/favicon.png"}
                  alt="User Profile"
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>
              <div className="hidden md:block">
                <span
                  className={`font-bold ${
                    mode === "dark" ? "text-white" : "text-[#231812]"
                  }`}
                >
                  {loading ? "Loading..." : fullName}
                </span>
                <span
                  className={`block text-sm font-normal ${
                    mode === "dark" ? "text-[#f05d23]" : "text-[#f05d23]"
                  }`}
                >
                  Business Department
                </span>
              </div>
              <Icon
                icon={
                  dropdownOpen
                    ? "mingcute:arrow-up-fill"
                    : "mingcute:arrow-down-fill"
                }
                className={`h-5 w-5 font-bold transform transition-transform duration-300 ${
                  mode === "dark" ? "text-white" : "text-[#231812]"
                }`}
              />
            </div>

            {dropdownOpen && (
              <div
                className={`absolute top-full mt-2 right-0 w-80 rounded-2xl shadow-lg z-10 ${
                  mode === "dark"
                    ? "bg-gray-800 text-white"
                    : "bg-white text-[#231812]"
                }`}
              >
                <div className="p-8">
                  <p className="text-lg mb-6">User Profile</p>
                  <div className="flex items-center gap-2 border-b pb-6 w-full">
                    <div className="overflow-hidden flex-shrink-0">
                      <Image
                        src={
                          mode === "dark"
                            ? "/favicon-white.png"
                            : "/favicon.png"
                        }
                        alt="User Profile"
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-md font-bold">
                        {loading ? "Loading..." : fullName}
                      </span>
                      <span className="text-sm">Business Department</span>
                    </div>
                  </div>
                  <button onClick={onLogout}>Logout</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default HRHeader;
