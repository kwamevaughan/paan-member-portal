import { Icon } from "@iconify/react";

export default function TabNavigation({ activeTab, setActiveTab, mode }) {
  const tabs = [
    { id: "personal", label: "Personal Info", icon: "mdi:account" },
    { id: "business", label: "Business Details", icon: "mdi:domain" },
    { id: "security", label: "Security", icon: "mdi:shield-lock" },
  ];

  return (
    <div className="mb-8">
      <div className={`flex space-x-1 p-1 rounded-xl ${mode === "dark" ? "bg-gray-800" : "bg-white"} shadow-lg`}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
              activeTab === tab.id
                ? mode === "dark"
                  ? "bg-paan-yellow text-paan-dark-blue shadow-lg font-semibold"
                  : "bg-paan-yellow text-paan-dark-blue shadow-lg font-semibold"
                : mode === "dark"
                ? "text-gray-400 hover:text-white hover:bg-paan-dark-blue/50"
                : "text-gray-600 hover:text-paan-dark-blue hover:bg-paan-blue/20"
            }`}
          >
            <Icon icon={tab.icon} className="w-5 h-5" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}