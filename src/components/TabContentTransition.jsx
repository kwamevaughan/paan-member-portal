import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardTabs from "./DashboardTabs";

const TabContentTransition = ({
  children,
  activeTab,
  setActiveTab,
  mode,
  Icon,
  user,
}) => {
  // Define tabs dynamically based on user.job_type
  const tabs =
    user?.job_type?.toLowerCase() === "freelancer"
      ? [
          {
            id: "opportunities",
            label: "Gigs",
            icon: "mdi:briefcase",
          },
        ]
      : [
          {
            id: "opportunities",
            label: "Business Opportunities",
            icon: "mdi:briefcase",
          },
          { id: "events", label: "Events & Workshops", icon: "mdi:calendar" },
          { id: "resources", label: "Resources", icon: "mdi:book-open" },
          {
            id: "marketIntel",
            label: "Market Intelligence",
            icon: "mdi:chart-bar",
          },
          { id: "offers", label: "Offers", icon: "mdi:bullseye" },
          { id: "updates", label: "Updates", icon: "mdi:bell" },
        ];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        {/* Render DashboardTabs only if there are multiple tabs (non-freelancers) */}
        {tabs.length > 1 && (
          <DashboardTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            mode={mode}
            Icon={Icon}
            tabs={tabs}
            user={user}
          />
        )}
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default TabContentTransition;
