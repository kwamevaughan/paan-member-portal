import React, { useEffect, useState } from "react";
import DashboardTabs from "./DashboardTabs";
import { getOrderedSections } from "@/utils/accessControl";

const TabContentTransition = ({
  children,
  activeTab,
  setActiveTab,
  mode,
  Icon,
  user,
}) => {
  const [isClient, setIsClient] = useState(false);

  // Ensure component only renders on client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Define all available tabs
  const allTabs =
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

  // Get ordered tabs based on user access (accessible first, then restricted)
  const { accessible, restricted } = getOrderedSections(allTabs, user?.selected_tier);
  const tabs = [...accessible, ...restricted];

  // Don't render tabs on server side
  if (!isClient) {
    return <div className="min-h-[200px] flex items-center justify-center text-gray-500">Loading...</div>;
  }

  return (
    <div>
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
    </div>
  );
};

export default TabContentTransition;
