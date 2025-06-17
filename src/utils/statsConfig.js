// Common colors used across stats
const STATS_COLORS = {
  total: "#3B82F6", // blue
  available: "#10B981", // green
  restricted: "#F59E0B", // amber
  categories: "#8B5CF6", // purple
};

// Helper function to create stats config
export const createStatsConfig = ({
  items = [],
  user,
  hasTierAccess,
  categories = {},
  sectionName,
  registeredItems = [],
}) => {
  const config = [
    {
      filter: "total",
      label: `Total ${sectionName}`,
      count: items.length,
      color: STATS_COLORS.total,
    },
    {
      filter: "available",
      label: "Available",
      count: items.filter((item) => hasTierAccess(item.tier_restriction, user)).length,
      color: STATS_COLORS.available,
    },
  ];

  // Add registered items count if provided (for events)
  if (registeredItems.length > 0) {
    config.push({
      filter: "registered",
      label: "Registered",
      count: registeredItems.length,
      color: STATS_COLORS.categories,
    });
  }

  // Add restricted items count
  config.push({
    filter: "restricted",
    label: "Restricted",
    count: items.filter((item) => !hasTierAccess(item.tier_restriction, user)).length,
    color: STATS_COLORS.restricted,
  });

  // Add categories count if provided
  if (Object.keys(categories).length > 0) {
    config.push({
      filter: "categories",
      label: "Categories",
      count: Object.keys(categories).length,
      color: STATS_COLORS.categories,
    });
  }

  return config;
};

export default createStatsConfig; 