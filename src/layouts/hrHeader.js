import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";
import Search from "@/components/Search";
import FullscreenToggle from "@/components/FullscreenToggle";
import TooltipIconButton from "@/components/TooltipIconButton";
import LanguageSwitch from "@/components/LanguageSwitch";

const HrHeader = ({
  mode,
  toggleMode,
  isSidebarOpen,
  toggleSidebar,
  onLogout,
  user,
  onSearchModalToggle,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(null);
  const dropdownRef = useRef(null);
  const headerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (headerRef.current) {
      const headerHeight = headerRef.current.offsetHeight;
      document.body.style.paddingTop = `${headerHeight}px`;
    }
  }, []);

  const isMobile = windowWidth !== null && windowWidth < 640;

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-10 transition-transform duration-300 ${
        mode === "dark" ? "bg-[#101827]" : "bg-transparent"
      }`}
    >
      <div
        className={`
          p-2 m-4 transition-transform duration-300
          ${
            isMobile ? "ml-0" : isSidebarOpen ? "md:ml-[240px]" : "md:ml-[80px]"
          }
          ${
            mode === "dark"
              ? "bg-[#101827]/50 text-white"
              : "bg-white/50 text-black"
          }
          backdrop-blur-sm shadow-lg rounded-2xl
        `}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center w-full gap-2">
            {isMobile && (
              <button
                onClick={() => toggleSidebar(!isSidebarOpen)}
                className="text-white hover:scale-110 transition-transform"
                title={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
              >
                <Icon
                  icon={isSidebarOpen ? "ri:close-line" : "ri:menu-line"}
                  className="w-6 h-6 text-gray-900"
                />
              </button>
            )}
            <div className="flex-grow">
              <Search
                mode={mode}
                onSearchModalToggle={onSearchModalToggle}
                user={user}
              />
            </div>
          </div>

          <div className="flex justify-end items-center w-full gap-2">
            <TooltipIconButton
              label={
                <span className={mode === "dark" ? "text-black" : "text-black"}>
                  {mode === "dark"
                    ? "Switch to Light Mode"
                    : "Switch to Dark Mode"}
                </span>
              }
              onClick={toggleMode}
              mode={mode}
              className="bg-white/50"
            >
              <Icon
                icon={
                  mode === "dark"
                    ? "line-md:sunny-filled-loop-to-moon-filled-alt-loop-transition"
                    : "line-md:moon-alt-to-sunny-outline-loop-transition"
                }
                className={`h-6 w-6 ${
                  mode === "dark" ? "text-blue-900" : "text-yellow-500"
                }`}
              />
            </TooltipIconButton>

            <FullscreenToggle mode={mode} />
            <LanguageSwitch mode={mode} />

            <TooltipIconButton
              label={
                <span className={mode === "dark" ? "text-black" : "text-black"}>
                  {dropdownOpen ? "Close Profile" : "Open Profile"}
                </span>
              }
              mode={mode}
              className="bg-white/50"
            >
              <div
                className="flex items-center gap-2 pl-2 relative cursor-pointer"
                ref={dropdownRef}
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <div className="flex items-center cursor-pointer">
                  <div className="overflow-hidden">
                    <Image
                      src={
                        mode === "dark"
                          ? "/assets/images/paan-logo-icon-white.svg"
                          : "/assets/images/paan-logo-icon.svg"
                      }
                      alt="User Profile"
                      width={35}
                      height={35}
                      className="object-cover"
                    />
                  </div>
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
                      <div className="flex items-center gap-2 border-b pb-6 w-full">
                        <div className="overflow-hidden flex-shrink-0">
                          <Image
                            src={
                              mode === "dark"
                                ? "/assets/images/paan-logo-icon-white.svg"
                                : "/assets/images/paan-logo-icon.svg"
                            }
                            alt="User Profile"
                            width={40}
                            height={40}
                            className="object-cover"
                          />
                        </div>
                        <div className="flex flex-col">
                          <div className="flex gap-2">
                            <span className="text-md font-bold">
                              {user.name}
                            </span>
                            <span className="rounded-md capitalize bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/20 ring-inset">
                              {user.job_type}
                            </span>
                          </div>
                          <span className="text-sm">{user.agencyName}</span>
                        </div>
                      </div>
                      <button
                        onClick={onLogout}
                        className="block w-full text-center text-white px-4 py-2 bg-[#0088d2] rounded-full hover:bg-[#528fa7] transition duration-200 mt-4"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </TooltipIconButton>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HrHeader;
