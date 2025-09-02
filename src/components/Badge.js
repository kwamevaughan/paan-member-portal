import React from "prop-types";
import { Icon } from "@iconify/react";
import PropTypes from "prop-types";

// Cache for tier and status lookups
const badgeCache = {
  tier: {},
  status: {},
  jobType: {},
};

// Tier icons (updated to match BusinessOpportunities for consistency)
const tierIcons = {
  "Associate Member": "mdi:crown",
  "Full Member": "mdi:check-decagram",
  "Gold Member": "mdi:star",
  "Free Member": "mdi:account",
  "Admin": "mdi:shield-crown",
  default: "mdi:account",
};

// Job type icons
const jobTypeIcons = {
  freelancer: "mdi:account-star",
  agency: "mdi:domain",
  admin: "mdi:shield-crown",
  default: "solar:question-circle-linear",
};

// Simplified color maps for tier, jobType, status, and registrationStatus
const colorMaps = {
  tier: {
    "Associate Member": {
      bgDark: "bg-blue-900/30",
      bgLight: "bg-blue-50",
      textDark: "text-blue-200",
      textLight: "text-blue-800",
      borderDark: "border-blue-800",
      borderLight: "border-blue-200",
      solidDark: "bg-blue-600 text-white border-blue-600",
      solidLight: "bg-blue-600 text-white border-blue-600",
    },
    "Full Member": {
      bgDark: "bg-green-900/30",
      bgLight: "bg-green-50",
      textDark: "text-green-200",
      textLight: "text-green-800",
      borderDark: "border-green-800",
      borderLight: "border-green-200",
      solidDark: "bg-emerald-600 text-white border-emerald-600",
      solidLight: "bg-emerald-600 text-white border-emerald-600",
    },
    "Gold Member": {
      bgDark: "bg-amber-900/30",
      bgLight: "bg-amber-50",
      textDark: "text-amber-200",
      textLight: "text-amber-800",
      borderDark: "border-amber-800",
      borderLight: "border-amber-200",
      solidDark: "bg-amber-600 text-white border-amber-600",
      solidLight: "bg-amber-600 text-white border-amber-600",
    },
    "Free Member": {
      bgDark: "bg-red-900/30",
      bgLight: "bg-red-50",
      textDark: "text-red-200",
      textLight: "text-red-800",
      borderDark: "border-red-800",
      borderLight: "border-red-200",
      solidDark: "bg-gray-600 text-white border-gray-600",
      solidLight: "bg-gray-600 text-white border-gray-600",
    },
    "Admin": {
      bgDark: "bg-paan-blue/30",
      bgLight: "bg-paan-blue-50",
      textDark: "text-paan-blue",
      textLight: "text-paan-blue",
      borderDark: "border-paan-blue",
      borderLight: "border-paan-blue",
      solidDark: "bg-paan-blue text-white border-paan-blue",
      solidLight: "bg-paan-blue text-white border-paan-blue",
    },
    default: {
      bgDark: "bg-gray-700/30",
      bgLight: "bg-gray-100",
      textDark: "text-gray-200",
      textLight: "text-gray-800",
      borderDark: "border-gray-600",
      borderLight: "border-gray-200",
      solidDark: "bg-gray-600 text-white border-gray-600",
      solidLight: "bg-gray-600 text-white border-gray-600",
    },
  },
  jobType: {
    freelancer: {
      bgDark: "bg-purple-900/30",
      bgLight: "bg-purple-50",
      textDark: "text-purple-200",
      textLight: "text-purple-800",
      borderDark: "border-purple-800",
      borderLight: "border-purple-200",
    },
    agency: {
      bgDark: "bg-teal-900/30",
      bgLight: "bg-teal-50",
      textDark: "text-teal-200",
      textLight: "text-teal-800",
      borderDark: "border-teal-800",
      borderLight: "border-teal-200",
    },
    admin: {
      bgDark: "bg-paan-blue/30",
      bgLight: "bg-paan-blue-50",
      textDark: "text-paan-blue",
      textLight: "text-paan-blue",
      borderDark: "border-paan-blue",
      borderLight: "border-paan-blue",
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

  if (!badgeCache[type]) {
    badgeCache[type] = {};
  }
  badgeCache[type][mode] = result;

  return result;
};

// Get tier badge styles (supports solid or semi-transparent styles)
const getTierBadgeStyles = (tier, mode, variant = "semi-transparent") => {
  const normalizedTier = normalizeTier(tier) || "Free Member";
  const colors = colorMaps.tier[normalizedTier] || colorMaps.tier["default"];

  if (variant === "solid") {
    return mode === "dark" ? colors.solidDark : colors.solidLight;
  }

  return `${mode === "dark" ? colors.bgDark : colors.bgLight} ${
    mode === "dark" ? colors.textDark : colors.textLight
  } ${mode === "dark" ? colors.borderDark : colors.borderLight}`;
};

// Get tier badge icon
const getTierBadgeIcon = (tier) => {
  const normalizedTier = normalizeTier(tier) || "Free Member";
  return tierIcons[normalizedTier] || tierIcons["default"];
};

// Tier mapping for normalization
const tierMap = {
  "gold member (tier 4)": "Gold Member",
  "full member (tier 3)": "Full Member",
  "associate member (tier 2)": "Associate Member",
  "free member (tier 1)": "Free Member",
  "associate agency (tier 2)": "Associate Member",
  "gold member": "Gold Member",
  "full member": "Full Member",
  "associate member": "Associate Member",
  "free member": "Free Member",
  "admin": "Admin",
};

// Normalize the tier name for consistency
const normalizeTier = (tier) => {
  if (!tier || typeof tier !== "string") return "Free Member";
  // Remove anything after ' - ' (e.g., description)
  const cleanTier = tier.split(" - ")[0]
    .replace(/\(.*?\)/g, "")
    .trim()
    .toLowerCase();
  return tierMap[cleanTier] || cleanTier;
};

// Get the database tier value for queries
const getDatabaseTier = (normalizedTier) => {
  const reverseTierMap = {
    "Gold Member": "Gold Member (Tier 4)",
    "Full Member": "Full Member (Tier 3)",
    "Associate Member": "Associate Member (Tier 2)",
    "Free Member": "Free Member (Tier 1)",
  };
  return reverseTierMap[normalizedTier] || normalizedTier;
};

// Tier Badge Component
const TierBadge = ({ tier, mode, variant = "semi-transparent" }) => {
  const normalizedTier = normalizeTier(tier);
  const styles = getTierBadgeStyles(normalizedTier, mode, variant);
  const icon = getTierBadgeIcon(normalizedTier);

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${styles}`}
    >
      <Icon icon={icon} className="mr-1 w-6 h-6" />
      {normalizedTier}
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

// Job Type Badge Component
const JobTypeBadge = ({ jobType, mode }) => {
  const normalizedJobType = jobType?.toLowerCase() || "freelancer";
  const colors = getBadgeColor(normalizedJobType, mode, colorMaps.jobType);
  const icon = jobTypeIcons[normalizedJobType] || jobTypeIcons["default"];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${colors.bg} ${colors.text} ${colors.border}`}
    >
      <Icon icon={icon} className="mr-1 w-6 h-6" />
      {normalizedJobType.charAt(0).toUpperCase() + normalizedJobType.slice(1)}
    </span>
  );
};

// Prop Types for validation
TierBadge.propTypes = {
  tier: PropTypes.any, // Allow any type, as normalizeTier handles it
  mode: PropTypes.oneOf(["light", "dark"]).isRequired,
  variant: PropTypes.oneOf(["semi-transparent", "solid"]),
};

StatusBadge.propTypes = {
  days: PropTypes.number.isRequired,
  mode: PropTypes.oneOf(["light", "dark"]).isRequired,
};

RegistrationStatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
  mode: PropTypes.oneOf(["light", "dark"]).isRequired,
};

JobTypeBadge.propTypes = {
  jobType: PropTypes.string.isRequired,
  mode: PropTypes.oneOf(["light", "dark"]).isRequired,
};

export {
  TierBadge,
  StatusBadge,
  RegistrationStatusBadge,
  JobTypeBadge,
  normalizeTier,
  getDatabaseTier,
  getTierBadgeStyles,
  getTierBadgeIcon,
  tierMap,
};
