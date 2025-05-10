import { useEffect, useState, useRef } from "react";
import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useRouter } from "next/router";
import { Icon } from "@iconify/react";
import { sidebarNav } from "@/data/nav";

const HRSidebar = ({
  isOpen,
  mode,
  onLogout,
  toggleSidebar,
  fullName = "PAAN Member", // Default value
}) => {
  const [windowWidth, setWindowWidth] = useState(null);
  const router = useRouter();
  const sidebarRef = useRef(null);

  // Handle window resize
  const handleResize = useCallback(() => {
    setWindowWidth(window.innerWidth);
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  // Handle outside click/tap to close sidebar on mobile
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        isOpen &&
        windowWidth < 640 &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target)
      ) {
        toggleSidebar();
      }
    };

    if (sidebarRef.current) {
      sidebarRef.current.addEventListener("mousedown", handleOutsideClick);
      sidebarRef.current.addEventListener("touchstart", handleOutsideClick);

      return () => {
        sidebarRef.current.removeEventListener("mousedown", handleOutsideClick);
        sidebarRef.current.removeEventListener("touchstart", handleOutsideClick);
      };
    }
  }, [isOpen, windowWidth, toggleSidebar]);

  if (windowWidth === null) return null;

  const isActive = useMemo(() => {
    return (pathname) => {
      const baseClass = "text-white shadow-md";
      const darkClass = "text-gray-200 hover:bg-gray-700 hover:text-white";
      const lightClass = "text-[#231812] hover:bg-gray-200 hover:text-[#f05d23]";

      return router.pathname === pathname
        ? `bg-[#f05d23] ${baseClass}`
        : mode === "dark"
        ? darkClass
        : lightClass;
    };
  }, [router.pathname, mode]);

  return (
    <div
      ref={sidebarRef}
      className={`fixed left-0 top-0 z-50 h-full transition-all duration-300 ${
        mode === "dark" ? "bg-gray-900" : "bg-gray-50"
      }`}
      style={{
        width: isOpen ? "300px" : windowWidth < 640 ? "0" : "80px",
      }}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div
          className={`flex py-8 ${
            isOpen ? "justify-start px-6" : "justify-center px-0"
          }`}
        >
          {isOpen ? (
            <Image
              src={
                mode === "dark"
                  ? "/assets/images/paan-logo-white.svg"
                  : "/assets/images/logo.svg"
              }
              alt="PAAN Logo"
              width={180}
              height={75}
              className="object-contain"
            />
          ) : (
            <Image
              src={
                mode === "dark"
                  ? "/assets/images/paan-logo-icon-white.svg"
                  : "/assets/images/paan-logo-icon.svg"
              }
              alt="PAAN Logo"
              width={48}
              height={48}
              className="object-contain"
            />
          )}
        </div>

        {/* Navigation */}
        <ul className="flex-grow px-2">
          {sidebarNav.map(({ href, icon, label }) => (
            <li key={href} className="py-2">
              <button
                onClick={() => {
                  router.push(href);
                  if (windowWidth < 640) toggleSidebar();
                }}
                className={`flex items-center font-semibold text-sm w-full ${
                  isOpen ? "justify-start px-6" : "justify-center px-0"
                } py-3 rounded-lg hover:shadow-md transition-all duration-200 group relative ${isActive(href)}`}
              >
                <Icon
                  icon={icon}
                  className={` ${isOpen ? "h-7 w-7 mr-3" : "h-6 w-6"} group-hover:scale-110 transition-transform`}
                />
                {isOpen && <span className="text-base">{label}</span>}
                {!isOpen && (
                  <Tooltip mode={mode} label={label} />
                )}
              </button>
            </li>
          ))}
        </ul>

        {/* Profile/Logout */}
        {!isOpen && windowWidth < 640 ? null : (
          <ProfileSection
            isOpen={isOpen}
            mode={mode}
            fullName={fullName}
            onLogout={onLogout}
          />
        )}
      </div>
    </div>
  );
};

const Tooltip = ({ mode, label }) => (
  <span
    className={`absolute left-full ml-2 text-xs ${
      mode === "dark"
        ? "bg-gray-800 text-gray-200"
        : "bg-gray-700 text-white"
    } rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50`}
  >
    {label}
  </span>
);

const ProfileSection = ({ isOpen, mode, fullName, onLogout }) => {
  return (
    <div
      className={`flex items-center justify-between px-4 py-3 mt-auto ${
        mode === "dark"
          ? "bg-gradient-to-r from-gray-800 to-gray-700"
          : "bg-gradient-to-r from-gray-200 to-gray-100"
      } shadow-inner`}
    >
      {isOpen ? (
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-4">
            <ProfileImage mode={mode} />
            <span
              className={`text-base font-medium ${
                mode === "dark" ? "text-gray-200" : "text-[#231812]"
              }`}
            >
              {fullName}
            </span>
          </div>
          <LogoutButton isOpen={isOpen} onLogout={onLogout} />
        </div>
      ) : (
        <div className="flex items-center justify-center w-full relative group">
          <LogoutButton isOpen={isOpen} onLogout={onLogout} />
          <span
            className={`absolute left-full ml-2 text-xs ${
              mode === "dark"
                ? "bg-gray-800 text-gray-200"
                : "bg-gray-700 text-white"
            } rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50`}
          >
            Sign Out
          </span>
        </div>
      )}
    </div>
  );
};

const ProfileImage = ({ mode }) => (
  <div className="w-12 h-12 overflow-hidden">
    <Image
      src={
        mode === "dark"
          ? "/assets/images/paan-logo-icon-white.svg"
          : "/assets/images/paan-logo-icon.svg"
      }
      alt="Profile"
      width={48}
      height={48}
      className="object-cover"
    />
  </div>
);

const LogoutButton = ({ isOpen, onLogout }) => (
  <button
    onClick={onLogout}
    className="flex items-center justify-center text-red-500 hover:text-red-600 transition-colors"
    aria-label="Logout"
  >
    <ArrowRightStartOnRectangleIcon className={isOpen ? "h-7 w-7" : "h-6 w-6 group-hover:scale-110 transition-transform"} />
  </button>
);

export default HRSidebar;
