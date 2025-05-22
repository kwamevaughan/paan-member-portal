import React from "react";
import { Icon } from "@iconify/react";
import PropTypes from "prop-types";

const getTierBadgeColor = (tier, mode) => {
  if (tier === "Founding Agency (Tier 1)") {
    return {
      bg: mode === "dark" ? "bg-blue-900/30" : "bg-blue-50",
      text: mode === "dark" ? "text-blue-200" : "text-blue-800",
      border: mode === "dark" ? "border-blue-800" : "border-blue-200",
    };
  } else if (tier === "Full Member (Tier 2)") {
    return {
      bg: mode === "dark" ? "bg-emerald-900/30" : "bg-emerald-50",
      text: mode === "dark" ? "text-emerald-200" : "text-emerald-800",
      border: mode === "dark" ? "border-emerald-800" : "border-emerald-200",
    };
  } else if (tier === "Associate Member (Tier 3)") {
    return {
      bg: mode === "dark" ? "bg-amber-900/30" : "bg-amber-50",
      text: mode === "dark" ? "text-amber-200" : "text-amber-800",
      border: mode === "dark" ? "border-amber-800" : "border-amber-200",
    };
  } else {
    return {
      bg: mode === "dark" ? "bg-gray-700/30" : "bg-gray-100",
      text: mode === "dark" ? "text-gray-200" : "text-gray-800",
      border: mode === "dark" ? "border-gray-600" : "border-gray-200",
    };
  }
};

const tierBadgeStyles = {
  "Founding Members":
    "bg-gradient-to-r from-yellow-600 to-amber-600 text-white",
  "Full Members": "bg-gradient-to-r from-blue-600 to-indigo-600 text-white",
  "Associate Members": "bg-gradient-to-r from-green-600 to-teal-600 text-white",
  All: "bg-gradient-to-r from-purple-600 to-pink-600 text-white",
};

const normalizeTier = (tier) => {
  if (!tier) return "Associate Members";
  if (tier.includes("Associate Member")) return "Associate Members";
  if (tier.includes("Full Member")) return "Full Members";
  if (tier.includes("Founding Member")) return "Founding Members";
  return tier;
};

const getStatusBadgeColor = (days, mode) => {
  if (days < 3) {
    return {
      bg: mode === "dark" ? "bg-red-900/30" : "bg-red-50",
      text: mode === "dark" ? "text-red-200" : "text-red-800",
      icon: "text-red-400",
    };
  } else if (days < 7) {
    return {
      bg: mode === "dark" ? "bg-amber-900/30" : "bg-amber-50",
      text: mode === "dark" ? "text-amber-200" : "text-amber-800",
      icon: "text-amber-400",
    };
  } else {
    return {
      bg: mode === "dark" ? "bg-emerald-900/30" : "bg-emerald-50",
      text: mode === "dark" ? "text-emerald-200" : "text-emerald-800",
      icon: "text-emerald-400",
    };
  }
};

const getRegistrationStatusColor = (status, mode) => {
  if (status === "pending") {
    return {
      bg: mode === "dark" ? "bg-yellow-900/30" : "bg-yellow-50",
      text: mode === "dark" ? "text-yellow-200" : "text-yellow-800",
      border: mode === "dark" ? "border-yellow-800" : "border-yellow-200",
    };
  } else if (status === "approved") {
    return {
      bg: mode === "dark" ? "bg-green-900/30" : "bg-green-50",
      text: mode === "dark" ? "text-green-200" : "text-green-800",
      border: mode === "dark" ? "border-green-800" : "border-green-200",
    };
  } else if (status === "rejected") {
    return {
      bg: mode === "dark" ? "bg-red-900/30" : "bg-red-50",
      text: mode === "dark" ? "text-red-200" : "text-red-800",
      border: mode === "dark" ? "border-red-800" : "border-red-200",
    };
  } else {
    return {
      bg: mode === "dark" ? "bg-gray-700/30" : "bg-gray-100",
      text: mode === "dark" ? "text-gray-200" : "text-gray-800",
      border: mode === "dark" ? "border-gray-600" : "border-gray-200",
    };
  }
};

const TierBadge = ({ tier, mode }) => {
  const colors = getTierBadgeColor(tier, mode);
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${colors.bg} ${colors.text} ${colors.border}`}
    >
      {tier}
    </span>
  );
};

const StatusBadge = ({ days, mode }) => {
  const colors = getStatusBadgeColor(days, mode);
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

const RegistrationStatusBadge = ({ status, mode }) => {
  const colors = getRegistrationStatusColor(status, mode);
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${colors.bg} ${colors.text} ${colors.border}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// Single export statement for all named exports
export {
  TierBadge,
  StatusBadge,
  RegistrationStatusBadge,
  tierBadgeStyles,
  normalizeTier,
};

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
