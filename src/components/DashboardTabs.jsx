import React from "react";
import { Icon } from "@iconify/react";

const DashboardTabs = ({ activeTab, setActiveTab, mode }) => {
  const tabs = [
    {
      id: "opportunities",
      label: "Business Opportunities",
      icon: "mdi:briefcase",
    },
    { id: "events", label: "Events & Workshops", icon: "mdi:calendar" },
    { id: "resources", label: "Resources", icon: "mdi:book-open" },
    { id: "marketIntel", label: "Market Intelligence", icon: "mdi:chart-bar" },
    { id: "offers", label: "Offers", icon: "mdi:bullseye" },
    { id: "updates", label: "Updates", icon: "mdi:bell" },
  ];

  return (
    <div className="relative w-full">
      {/* Glassmorphism container */}
      <div
        className={`backdrop-blur-xl ${
          mode === "dark"
            ? "bg-gray-900/80 border-gray-700/30"
            : "bg-white/80 border-white/20"
        } border rounded-2xl p-2 shadow-lg`}
      >
        <div className="flex w-full overflow-x-auto scrollbar-hide">
          <div className="flex min-w-full gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group relative px-6 py-4 text-sm font-medium transition-all duration-300 ease-in-out flex-1 whitespace-nowrap focus:outline-none rounded-xl overflow-hidden
                  ${
                    activeTab === tab.id
                      ? mode === "dark"
                        ? "text-white bg-gradient-to-br from-blue-500/90 to-purple-600/90 shadow-lg shadow-blue-500/25"
                        : "text-white bg-gradient-to-br from-blue-500/90 to-purple-600/90 shadow-blue-500/25"
                      : mode === "dark"
                      ? "text-gray-300 hover:text-white hover:bg-gray-800/50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/50"
                  }`}
                style={{
                  transform:
                    activeTab === tab.id ? "translateY(-3px)" : "translateY(0)",
                  boxShadow:
                    activeTab === tab.id
                      ? "0 12px 30px -5px rgba(59, 130, 246, 0.3)"
                      : "none",
                }}
              >
                {/* Animated shimmer effect for active state */}
                {activeTab === tab.id && (
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"
                    style={{
                      backgroundSize: "200% 100%",
                      animation: "shimmer 2s infinite",
                    }}
                  />
                )}

                {/* Content */}
                <div className="relative flex items-center justify-center gap-2">
                  <span
                    className={`text-lg group-hover:scale-110 transition-transform duration-300 ${
                      activeTab === tab.id
                        ? "text-white" // Make icon white for active tab
                        : mode === "dark"
                        ? "text-white/80"
                        : "text-blue-400"
                    }`}
                  >
                    <Icon icon={tab.icon} width={24} height={24} />
                  </span>
                  <span className="font-semibold tracking-wide">
                    {tab.label}
                  </span>
                </div>

                {/* Active indicator */}
                {activeTab === tab.id && (
                  <>
                    <div className="absolute -inset-1 rounded-xl opacity-30 blur-sm bg-gradient-to-r from-white-600 to-amber-600" />
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-white/60 rounded-full" />
                  </>
                )}

                {/* Hover effect for inactive tabs */}
                {activeTab !== tab.id && (
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Floating notification dots */}
      <div className="absolute -top-1 right-4 flex gap-2">
        {["offers", "updates"].includes(activeTab) && (
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50" />
        )}
      </div>
    </div>
  );
};

export default DashboardTabs;
