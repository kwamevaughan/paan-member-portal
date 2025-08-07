import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { Icon } from "@iconify/react";
import { sidebarNav, getFilteredNav } from "@/data/nav";
import Link from "next/link";

const HrSidebar = ({
  mode,
  toggleMode,
  onLogout,
  user,
  isOpen,
  toggleSidebar,
}) => {
  const [windowWidth, setWindowWidth] = useState(null);
  const router = useRouter();
  const sidebarRef = useRef(null);
  const [showLogout, setShowLogout] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState({});

  const filteredNav = getFilteredNav(user?.job_type);

  // By default, all categories are collapsed (expandedCategories is empty)

  // Expand all categories by default on mount or when filteredNav changes
  useEffect(() => {
    if (filteredNav && filteredNav.length > 0) {
      const allExpanded = {};
      filteredNav.forEach(({ category }) => {
        if (category) allExpanded[category] = true;
      });
      setExpandedCategories(allExpanded);
    }
  }, [filteredNav]);

  // Auto-scroll to active item and expand active category when page loads
  useEffect(() => {
    // Find the active category and expand it (only for categorized items)
    const activeCategory = filteredNav.find((navItem) => {
      if (!navItem.category) return false; // Skip non-categorized items

      return navItem.items.some(({ href }) => {
        const pathname = href.split("?")[0];
        if (pathname === "/business-opportunities") {
          if (href.includes("opportunityType=tender")) {
            return router.asPath.includes("opportunityType=tender");
          } else {
            return (
              router.pathname === "/business-opportunities" &&
              !router.asPath.includes("opportunityType=tender")
            );
          }
        }
        return router.pathname === pathname;
      });
    });

    if (
      activeCategory &&
      activeCategory.category &&
      !expandedCategories[activeCategory.category]
    ) {
      setExpandedCategories((prev) => ({
        ...prev,
        [activeCategory.category]: true,
      }));
    }
  }, [router.asPath, router.pathname, filteredNav, expandedCategories]);

  const toggleCategory = (category) => {
    setExpandedCategories((prev) => {
      // If the clicked category is already expanded, close it
      if (prev[category]) {
        const newState = { ...prev };
        delete newState[category];
        return newState;
      }
      // If it's not expanded, close all others and expand this one
      return { [category]: true };
    });
  };

  const setActiveItemRef = useCallback(
    (element) => {
      if (element) {
        // Check if this element is the active one
        const href = element.getAttribute("data-href");
        if (href) {
          const pathname = href.split("?")[0];
          let isActive = false;

          if (pathname === "/business-opportunities") {
            if (href.includes("opportunityType=tender")) {
              isActive = router.asPath.includes("opportunityType=tender");
            } else {
              isActive =
                router.pathname === "/business-opportunities" &&
                !router.asPath.includes("opportunityType=tender");
            }
          } else {
            isActive = router.pathname === pathname;
          }

          if (isActive) {
            setTimeout(() => {
              element.scrollIntoView({
                behavior: "smooth",
                block: "center",
                inline: "nearest",
              });
            }, 200);
          }
        }
      }
    },
    [router.asPath, router.pathname]
  );

  const handleResize = useCallback(() => {
    setWindowWidth(window.innerWidth);
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  const isActive = (href) => {
    // Extract pathname from href (remove query parameters)
    const pathname = href.split("?")[0];
    const pathMatches = router.pathname === pathname;

    // Special handling for business opportunities with tender filter
    if (pathname === "/business-opportunities") {
      if (href.includes("opportunityType=tender")) {
        // If this nav item is for tenders, check if we're currently viewing tenders
        return router.asPath.includes("opportunityType=tender")
          ? mode === "dark"
            ? "bg-[#19191e] text-white shadow-md"
            : "bg-[#0a1215] text-[#E7EEF8] shadow-md"
          : mode === "dark"
          ? "text-gray-200 hover:bg-gray-700 hover:text-white"
          : "text-[#231812] hover:bg-[#0B1215]";
      } else {
        // If this nav item is for regular opportunities, check if we're viewing all opportunities
        return router.pathname === "/business-opportunities" &&
          !router.asPath.includes("opportunityType=tender")
          ? mode === "dark"
            ? "bg-[#19191e] text-white shadow-md"
            : "bg-[#0a1215] text-[#E7EEF8] shadow-md"
          : mode === "dark"
          ? "text-gray-200 hover:bg-gray-700 hover:text-white"
          : "text-[#231812] hover:bg-[#0B1215]";
      }
    }

    // Default behavior for other pages
    return pathMatches
      ? mode === "dark"
        ? "bg-[#19191e] text-white shadow-md"
        : "bg-[#0a1215] text-[#E7EEF8] shadow-md"
      : mode === "dark"
      ? "text-gray-200 hover:bg-gray-700 hover:text-white"
      : "text-[#231812] hover:bg-[#0B1215]";
  };

  const handleNavigation = async (href, label) => {
    try {
      console.log(
        "[HrSidebar] Navigating to:",
        href,
        "Label:",
        typeof label === "function" ? label(user?.job_type) : label
      );
      await router.push(href);
    } catch (error) {
      console.error("[HrSidebar] Navigation error:", error);
    }
  };

  if (windowWidth === null) return null;

  const isMobile = windowWidth < 640;

  return (
    <div className="relative z-[20]">
      <div
        ref={sidebarRef}
        className={`fixed left-0 top-0 z-50 rounded-xl m-0 md:m-3 transition-all duration-300
          ${isMobile ? (isOpen ? "block" : "hidden") : "block"}
          ${mode === "dark" ? "bg-[#05050a]" : "bg-[#172840]"}
          group shadow-lg shadow-black/20 custom-scrollbar`}
        style={{
          width: isMobile ? "100vw" : "240px",
          height: isMobile ? "100vh" : "calc(100vh - 24px)",
        }}
      >
        <div className="flex flex-col h-full relative">
          <div className="flex items-center justify-between py-8 px-4">
            <Image
              src="/assets/images/logo-white.svg"
              alt="PAAN Logo"
              width={120}
              height={75}
              className="object-contain w-40"
              priority
            />
            {/* Mobile close arrow */}
            {isMobile && (
              <button
                onClick={toggleSidebar}
                className="ml-2 p-2 rounded-full hover:bg-gray-700/30 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Close sidebar"
              >
                <Icon icon="mdi:arrow-left" className="w-6 h-6 text-white" />
              </button>
            )}
          </div>

          <div className="flex-grow px-2 overflow-y-auto flex flex-col scrollbar-thin">
            {filteredNav.map((navItem, index) => {
              // Check if this nav item has a category (grouped items)
              if (navItem.category) {
                return (
                  <div key={navItem.category} className="w-full mb-4 mt-4">
                    {/* Section heading, clickable for collapse/expand */}
                    <div
                      className="text-sm tracking-wide font-normal text-gray-300 px-2 py-2 cursor-pointer hover:text-white transition-colors flex items-center justify-between border-t border-b border-gray-600/30"
                      onClick={() => toggleCategory(navItem.category)}
                    >
                      <span>{navItem.category}</span>
                      <Icon
                        icon={
                          expandedCategories[navItem.category]
                            ? "mdi:chevron-up"
                            : "mdi:chevron-down"
                        }
                        className="w-4 h-4 transition-transform"
                      />
                    </div>
                    <div
                      className={`transition-all duration-300 overflow-hidden ${
                        expandedCategories[navItem.category]
                          ? "max-h-96 opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <ul className="ml-4 mt-2">
                        {Array.isArray(navItem.items) &&
                        navItem.items.length > 0 ? (
                          navItem.items.map(({ href, icon, label }) => {
                            const isActiveItem = isActive(href);
                            return (
                              <li
                                key={href}
                                ref={setActiveItemRef}
                                data-href={href}
                                onClick={() => handleNavigation(href, label)}
                                className={`relative py-3 px-2 flex items-center font-normal text-sm w-full text-white cursor-pointer rounded-lg hover:shadow-md transition-all duration-200 group mb-1 ${isActiveItem}`}
                              >
                                <Icon
                                  icon={icon}
                                  className="h-5 w-5 mr-3 text-gray-300 group-hover:scale-110 group-hover:text-white transition-all"
                                />
                                <span className="text-sm">
                                  {typeof label === "function"
                                    ? label(user?.job_type)
                                    : label}
                                </span>
                              </li>
                            );
                          })
                        ) : (
                          <li className="py-3 px-2 text-gray-500 text-sm">
                            No items available
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                );
              } else {
                // Single item without category - render directly
                return navItem.items.map(({ href, icon, label }) => {
                  const isActiveItem = isActive(href);
                  return (
                    <li
                      key={href}
                      ref={setActiveItemRef}
                      data-href={href}
                      onClick={() => handleNavigation(href, label)}
                      className={`relative py-3 px-2 flex items-center font-normal text-sm w-full text-white cursor-pointer rounded-lg hover:shadow-md transition-all duration-200 group mb-1 ${isActiveItem}`}
                    >
                      <Icon
                        icon={icon}
                        className="h-5 w-5 mr-3 text-gray-300 group-hover:scale-110 group-hover:text-white transition-all"
                      />
                      <span className="text-sm">
                        {typeof label === "function"
                          ? label(user?.job_type)
                          : label}
                      </span>
                    </li>
                  );
                });
              }
            })}
          </div>

          <div
            className={`px-4 py-2 mt-auto ${
              mode === "dark"
                ? "bg-gradient-to-r from-gray-800 to-gray-700"
                : ""
            } shadow-inner`}
          >
            <div
              className="flex items-center space-x-4 cursor-pointer bg-[#d2d3d4] rounded-lg p-2"
              onClick={() => setShowLogout((prev) => !prev)}
            >
              <div className="overflow-hidden rounded-full">
                <Image
                  src="/assets/images/paan-logo-icon.svg"
                  alt="Profile"
                  width={38}
                  height={38}
                  className="object-cover"
                  priority
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-black">
                  {user.name}
                </span>
                <div className="w-3 h-3 bg-green-400 rounded-full border border-green-400 flex items-center justify-center aspect-square"></div>
              </div>
            </div>
            <div
              className={`transition-all duration-200 overflow-hidden ${
                showLogout ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="flex flex-col gap-2 text-white text-sm pt-2">
                <div className="flex items-center gap-2 hover:bg-paan-dark-blue rounded-2xl p-2">
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 hover:opacity-80 transition-colors duration-300"
                  >
                    <Icon
                      icon="mdi:account-circle-outline"
                      className="h-5 w-5"
                    />
                    <span>Profile</span>
                  </Link>
                </div>

                <div className="flex items-center gap-2 hover:bg-paan-dark-blue rounded-2xl p-2">
                  <Link
                    href="/support"
                    className="flex items-center gap-2 hover:opacity-80 transition-colors duration-300"
                  >
                    <Icon icon="mdi:headset" className="h-5 w-5" />
                    <span>Support</span>
                  </Link>
                </div>
                <div className="py-2 hover:bg-paan-dark-blue rounded-2xl p-2">
                  <button
                    onClick={toggleMode}
                    className="flex items-center gap-2 hover:opacity-80 transition-colors duration-300"
                  >
                    <Icon
                      icon={
                        mode === "dark"
                          ? "line-md:sunny-filled-loop-to-moon-filled-alt-loop-transition"
                          : "line-md:moon-alt-to-sunny-outline-loop-transition"
                      }
                      className={`h-5 w-5 ${
                        mode === "dark" ? "text-paan-blue" : "text-paan-yellow"
                      }`}
                    />
                    <span>{mode === "dark" ? "Dark Mode" : "Light Mode"}</span>
                  </button>
                </div>
                <hr className="border-t border-gray-600" />
                <button
                  onClick={onLogout}
                  className="flex items-center gap-2 text-paan-red hover:text-paan-red transition-colors hover:bg-[#19191e] rounded-2xl p-2"
                >
                  <Icon icon="mdi:logout" className="h-5 w-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HrSidebar;
