import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

export default function TabsSelector({
  tabs = [],
  selectedTab,
  onSelect,
  mode = "light",
  icon, // Optional fallback icon for string-based tabs
}) {
  return (
    <>
      {/* Dropdown on mobile */}
      <select
        value={selectedTab}
        onChange={(e) => {
          e.preventDefault();
          onSelect(e.target.value);
        }}
        className={`block sm:hidden w-full px-4 py-2 rounded-xl font-medium transition-all appearance-none ${
          mode === "dark"
            ? "bg-gray-700/50 border border-gray-600 text-gray-200"
            : "bg-white/80 border border-gray-300 text-gray-800"
        }`}
      >
        {tabs.map((tab, index) => {
          const tabId = typeof tab === "string" ? tab : tab.id;
          const tabLabel = typeof tab === "string" ? tab : tab.label;
          return (
            <option key={tabId || index} value={tabId}>
              {tabLabel}
            </option>
          );
        })}
      </select>

      {/* Buttons on desktop */}
      <div className="hidden sm:flex flex-wrap gap-2">
        {tabs.map((tab, index) => {
          const tabId = typeof tab === "string" ? tab : tab.id;
          const tabLabel = typeof tab === "string" ? tab : tab.label;
          const tabIcon = typeof tab === "string" ? icon : tab.icon;
          return (
            <motion.button
              key={tabId || index}
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.preventDefault();
                onSelect(tabId);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                selectedTab === tabId
                  ? mode === "dark"
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-blue-500 text-white shadow-lg"
                  : mode === "dark"
                  ? "bg-gray-700/50 text-gray-300 hover:bg-gray-600/50"
                  : "bg-gray-100/80 text-gray-600 hover:bg-gray-200/80"
              }`}
            >
              {tabIcon && <Icon icon={tabIcon} className="w-4 h-4" />}
              <span className="text-sm">{tabLabel}</span>
            </motion.button>
          );
        })}
      </div>
    </>
  );
}
