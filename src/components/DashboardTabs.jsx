import React from "react";
import { getRestrictionMessage } from "@/utils/accessControl";
import toast from "react-hot-toast";

const DashboardTabs = ({ activeTab, setActiveTab, mode, Icon, tabs, user }) => {
  const handleTabClick = (tab) => {
    if (tab.isRestricted) {
      // Show restriction message for restricted tabs
      const message = getRestrictionMessage(tab.id, user?.selected_tier);
      toast.error(message, { duration: 4000 });
      return;
    }
    setActiveTab(tab.id);
  };

  return (
    <div className="w-full">
      <div
        className={`backdrop-blur-xl ${
          mode === "dark"
            ? "bg-gray-900/80 border-gray-700/30"
            : "bg-white/80 border-white/20"
        } border rounded-2xl p-2 shadow-lg mb-4`}
      >
        <div className="flex overflow-x-auto scrollbar-hide">
          <div className="flex gap-1 flex-wrap justify-center sm:justify-start">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab)}
                disabled={tab.isRestricted}
                className={`relative px-6 py-6 text-sm font-normal transition-all duration-300 ease-in-out rounded-xl group
                  ${
                    activeTab === tab.id && !tab.isRestricted
                      ? mode === "dark"
                        ? "text-white bg-[#172840] shadow-lg"
                        : "text-white bg-[#172840]"
                      : tab.isRestricted
                      ? mode === "dark"
                        ? "text-gray-500 bg-gray-800/30 cursor-not-allowed opacity-60"
                        : "text-gray-400 bg-gray-100/30 cursor-not-allowed opacity-60"
                      : mode === "dark"
                      ? "text-gray-300 hover:text-white hover:bg-gray-800/50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/50"
                  }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <span
                    className={`text-lg transition-transform duration-300 ${
                      !tab.isRestricted ? "group-hover:scale-110" : ""
                    } ${
                      activeTab === tab.id && !tab.isRestricted
                        ? "text-white"
                        : tab.isRestricted
                        ? mode === "dark"
                          ? "text-gray-600"
                          : "text-gray-400"
                        : mode === "dark"
                        ? "text-white/80"
                        : "text-[#f25749]"
                    }`}
                  >
                    <Icon icon={tab.icon} width={20} height={20} />
                  </span>
                  <span className="font-normal tracking-wide text-xs sm:text-sm">
                    {tab.label}
                  </span>
                  {tab.isRestricted && (
                    <Icon
                      icon="mdi:lock"
                      width={14}
                      height={14}
                      className={`ml-1 ${
                        mode === "dark" ? "text-gray-600" : "text-gray-400"
                      }`}
                    />
                  )}
                </div>
                {tab.isRestricted && (
                  <div className="absolute inset-0 rounded-xl border-2 border-dashed border-gray-400/30 pointer-events-none" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardTabs;
