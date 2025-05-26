import React from "react";

const DashboardTabs = ({ activeTab, setActiveTab, mode }) => {
  const tabs = [
    { id: "opportunities", label: "Business Opportunities" },
    { id: "events", label: "Events & Workshops" },
    { id: "resources", label: "Resources" },
    { id: "marketIntel", label: "Market Intelligence" },
    { id: "offers", label: "Offers" },
    { id: "updates", label: "Updates" },
  ];

  return (
    <div className="flex border-b border-gray-200 dark:border-gray-700">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === tab.id
              ? mode === "dark"
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-blue-600 border-b-2 border-blue-600"
              : mode === "dark"
              ? "text-gray-400 hover:text-gray-200"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default DashboardTabs;
