import React from "react";
import { TierBadge } from "./Badge";

const MarketIntelItem = ({ intel, mode, isRestricted, onRestrictedClick }) => {
  const handleClick = () => {
    if (isRestricted) {
      onRestrictedClick();
      return;
    }
    // Navigate to the intel's URL or a detail page if available
    if (intel.url) {
      window.location.href = intel.url;
    }
  };

  return (
    <div
      className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${
        mode === "dark"
          ? "bg-gray-700/30 border-gray-600 hover:bg-gray-700/50"
          : "bg-gray-50 border-gray-200 hover:bg-gray-100"
      } ${
        isRestricted
          ? "opacity-50 cursor-not-allowed"
          : "hover:shadow-sm cursor-pointer"
      }`}
      onClick={handleClick}
      aria-disabled={isRestricted}
      role="button"
      tabIndex={isRestricted ? -1 : 0}
      aria-label={
        isRestricted
          ? `Restricted market intel: ${intel.title}`
          : `View market intel: ${intel.title}`
      }
    >
      <div className="flex items-center space-x-3">
        <div className="p-2 rounded bg-gradient-to-r from-indigo-500 to-purple-600">
          <iconify-icon
            icon="mdi:chart-box"
            className="text-white text-sm"
          ></iconify-icon>
        </div>
        <div>
          <h4
            className={`font-medium ${
              mode === "dark" ? "text-white" : "text-gray-900"
            } ${isRestricted ? "text-gray-500 dark:text-gray-400" : ""}`}
          >
            {intel.title}
            {isRestricted && (
              <span className="ml-2 text-xs text-red-500">
                <iconify-icon
                  icon="mdi:lock"
                  className="inline mr-1"
                ></iconify-icon>
                Restricted
              </span>
            )}
          </h4>
          <p
            className={`text-sm ${
              mode === "dark" ? "text-gray-400" : "text-gray-600"
            } ${isRestricted ? "text-gray-400 dark:text-gray-500" : ""}`}
          >
            {intel.region} • {intel.type}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <TierBadge tier={intel.tier_restriction || "Free Member"} mode={mode} />
        {intel.downloadable && (
          <iconify-icon
            icon="mdi:download"
            className={`${mode === "dark" ? "text-gray-400" : "text-gray-600"}`}
          ></iconify-icon>
        )}
      </div>
    </div>
  );
};

export default MarketIntelItem;
