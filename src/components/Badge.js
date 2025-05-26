import React from "react";
import { Icon } from "@iconify/react";
import PropTypes from "prop-types";

// Cache for tier and status lookups
const badgeCache = {
  tier: {},
  status: {},
};

// Add a mapping of tiers to icons
const tierIcons = {
  "associate member": "mdi:account-group",
  "full member": "mdi:account-check-outline",
  "gold member": "tabler:medal",
  "free member": "mdi:account-off",
  default: "mdi:account-question",
};



// Helper function to get badge colors from a given color map
const getBadgeColor = (type, mode, colorMap) => {
  if (badgeCache[type] && badgeCache[type][mode]) {
    return badgeCache[type][mode];
  }

  const colors = colorMap[type] || colorMap["default"];
  const result = {
    bg: mode === "dark" ? colors.bgDark : colors.bgLight,
    text: mode === "dark" ? colors.textDark : colors.textLight,
    border: mode === "dark" ? colors.borderDark : colors.borderLight,
  };

  // Cache the result for the current type and mode
  if (!badgeCache[type]) {
    badgeCache[type] = {};
  }
  badgeCache[type][mode] = result;

  return result;
};

// Simplified color maps for tier and status
const colorMaps = {
  tier: {
    "associate member": {
      bgDark: "bg-blue-900/30",
      bgLight: "bg-blue-50",
      textDark: "text-blue-200",
      textLight: "text-blue-800",
      borderDark: "border-blue-800",
      borderLight: "border-blue-200",
    },
    "full member": {
      bgDark: "bg-green-900/30",
      bgLight: "bg-green-50",
      textDark: "text-green-200",
      textLight: "text-green-800",
      borderDark: "border-green-800",
      borderLight: "border-green-200",
    },
    "gold member": {
      bgDark: "bg-amber-900/30",
      bgLight: "bg-amber-50",
      textDark: "text-amber-200",
      textLight: "text-amber-800",
      borderDark: "border-amber-800",
      borderLight: "border-amber-200",
    },
    "free member": {
      bgDark: "bg-red-900/30",
      bgLight: "bg-red-50",
      textDark: "text-red-200",
      textLight: "text-red-800",
      borderDark: "border-red-800",
      borderLight: "border-red-200",
    },
    default: {
      bgDark: "bg-gray-700/30",
      bgLight: "bg-gray-100",
      textDark: "text-gray-200",
      textLight: "text-gray-800",
      borderDark: "border-gray-600",
      borderLight: "border-gray-200",
    },
  },

  status: {
    pending: {
      bgDark: "bg-yellow-900/30",
      bgLight: "bg-yellow-50",
      textDark: "text-yellow-200",
      textLight: "text-yellow-800",
      borderDark: "border-yellow-800",
      borderLight: "border-yellow-200",
    },
    confirmed: {
      bgDark: "bg-blue-900/30",
      bgLight: "bg-blue-50",
      textDark: "text-blue-200",
      textLight: "text-blue-800",
      borderDark: "border-blue-800",
      borderLight: "border-blue-200",
    },
    approved: {
      bgDark: "bg-green-900/30",
      bgLight: "bg-green-50",
      textDark: "text-green-200",
      textLight: "text-green-800",
      borderDark: "border-green-800",
      borderLight: "border-green-200",
    },
    rejected: {
      bgDark: "bg-red-900/30",
      bgLight: "bg-red-50",
      textDark: "text-red-200",
      textLight: "text-red-800",
      borderDark: "border-red-800",
      borderLight: "border-red-200",
    },
    default: {
      bgDark: "bg-gray-700/30",
      bgLight: "bg-gray-100",
      textDark: "text-gray-200",
      textLight: "text-gray-800",
      borderDark: "border-gray-600",
      borderLight: "border-gray-200",
    },
  },

  registrationStatus: {
    pending: {
      bgDark: "bg-yellow-900/30",
      bgLight: "bg-yellow-50",
      textDark: "text-yellow-200",
      textLight: "text-yellow-800",
      borderDark: "border-yellow-800",
      borderLight: "border-yellow-200",
    },
    confirmed: {
      bgDark: "bg-blue-900/30",
      bgLight: "bg-blue-50",
      textDark: "text-blue-200",
      textLight: "text-blue-800",
      borderDark: "border-blue-800",
      borderLight: "border-blue-200",
    },
    approved: {
      bgDark: "bg-green-900/30",
      bgLight: "bg-green-50",
      textDark: "text-green-200",
      textLight: "text-green-800",
      borderDark: "border-green-800",
      borderLight: "border-green-200",
    },
    rejected: {
      bgDark: "bg-red-900/30",
      bgLight: "bg-red-50",
      textDark: "text-red-200",
      textLight: "text-red-800",
      borderDark: "border-red-800",
      borderLight: "border-red-200",
    },
    default: {
      bgDark: "bg-gray-700/30",
      bgLight: "bg-gray-100",
      textDark: "text-gray-200",
      textLight: "text-gray-800",
      borderDark: "border-gray-600",
      borderLight: "border-gray-200",
    },
  },
};

// Normalize the tier name for consistency
const normalizeTier = (tier) => {
  if (!tier) return "free member";
  return tier.toLowerCase().replace(/\s*\(tier.*\)\s*/g, ""); // Normalize and remove extra details like "(Tier 3)"
};

// Tier Badge Component
const TierBadge = ({ tier, mode }) => {
  const normalizedTier = normalizeTier(tier); // Normalize the tier name
  const colors = getBadgeColor(normalizedTier, mode, colorMaps.tier); // Get colors based on mode and tier
  const icon = tierIcons[normalizedTier] || tierIcons["default"]; // Get the appropriate icon

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${colors.bg} ${colors.text} ${colors.border}`}
    >
      <Icon icon={icon} className="mr-1 w-6 h-6" />
      {tier}
    </span>
  );
};

// Status Badge Component
const StatusBadge = ({ days, mode }) => {
  const status = days < 3 ? "pending" : days < 7 ? "confirmed" : "approved";
  const colors = getBadgeColor(status, mode, colorMaps.status);
  return (
    <div
      className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg ${colors.bg}`}
    >
      <Icon icon="heroicons:clock" className={`w-3.5 h-3.5 ${colors.icon}`} />
      <span className={`text-xs font-medium ${colors.text}`}>
        {days <= 0 ? "Past Event" : `${days} days left`}
      </span>
    </div>
  );
};

// Registration Status Badge Component
const RegistrationStatusBadge = ({ status, mode }) => {
  const colors = getBadgeColor(status, mode, colorMaps.registrationStatus);
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${colors.bg} ${colors.text} ${colors.border}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// Prop Types for validation
TierBadge.propTypes = {
  tier: PropTypes.string.isRequired,
  mode: PropTypes.oneOf(["light", "dark"]).isRequired,
};

StatusBadge.propTypes = {
  days: PropTypes.number.isRequired,
  mode: PropTypes.oneOf(["light", "dark"]).isRequired,
};

RegistrationStatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
  mode: PropTypes.oneOf(["light", "dark"]).isRequired,
};

export { TierBadge, StatusBadge, RegistrationStatusBadge, normalizeTier };
