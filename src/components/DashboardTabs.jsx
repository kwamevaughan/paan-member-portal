import React from "react";

const DashboardTabs = ({ activeTab, setActiveTab, mode, Icon, tabs }) => {
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
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-6 py-6 text-sm font-normal transition-all duration-300 ease-in-out rounded-xl
                  ${
                    activeTab === tab.id
                      ? mode === "dark"
                        ? "text-white bg-[#172840] shadow-lg "
                        : "text-white bg-[#172840] "
                      : mode === "dark"
                      ? "text-gray-300 hover:text-white hover:bg-gray-800/50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/50"
                  }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <span
                    className={`text-lg group-hover:scale-110 transition-transform duration-300 ${
                      activeTab === tab.id
                        ? "text-white"
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
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardTabs;
