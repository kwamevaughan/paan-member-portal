import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardTabs from "./DashboardTabs";

const TabContentTransition = ({
  children,
  activeTab,
  setActiveTab,
  mode,
  Icon,
}) => (
  <AnimatePresence mode="wait">
    <motion.div
      key={activeTab}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <DashboardTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mode={mode}
        Icon={Icon}
      />
      {children}
    </motion.div>
  </AnimatePresence>
);

export default TabContentTransition;
