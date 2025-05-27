import React from "react";
import { useRouter } from "next/router";
import { TierBadge } from "./Badge";

const OpportunityCard = ({
  opportunity,
  mode,
  isRestricted,
  onRestrictedClick,
}) => {
  const router = useRouter();

  const handleClick = () => {
    if (isRestricted) {
      onRestrictedClick();
      return;
    }
    // If the opportunity has an application link, open it in a new tab
    if (opportunity.application_link) {
      window.location.href = opportunity.application_link;
    } else {
      router.push(`/opportunities/${opportunity.id}`);
    }
  };

  return (
    <div
      className={`p-4 rounded-lg border transition-all duration-200 ${
        mode === "dark"
          ? "bg-gray-700/50 border-gray-600"
          : "bg-gray-50 border-gray-200"
      } ${
        isRestricted
          ? "opacity-50 cursor-not-allowed"
          : "hover:shadow-md cursor-pointer"
      }`}
      onClick={handleClick}
      aria-disabled={isRestricted}
      role="button"
      tabIndex={isRestricted ? -1 : 0}
      aria-label={
        isRestricted
          ? `Restricted opportunity: ${opportunity.title}`
          : `View opportunity: ${opportunity.title}`
      }
    >
      <div className="flex items-start justify-between mb-2">
        <h3
          className={`font-medium ${
            mode === "dark" ? "text-white" : "text-gray-900"
          } ${isRestricted ? "text-gray-500 dark:text-gray-400" : ""}`}
        >
          {opportunity.title}
          {isRestricted && (
            <span className="ml-2 text-xs text-red-500">
              <iconify-icon
                icon="mdi:lock"
                className="inline mr-1"
              ></iconify-icon>
              Restricted
            </span>
          )}
        </h3>
        <TierBadge
          tier={opportunity.tier_restriction || "Free Member"}
          mode={mode}
        />
      </div>
      <div
        className={`flex items-center space-x-4 text-sm ${
          mode === "dark" ? "text-gray-400" : "text-gray-600"
        } ${isRestricted ? "text-gray-400 dark:text-gray-500" : ""}`}
      >
        <div className="flex items-center space-x-1">
          <iconify-icon
            icon="mdi:map-marker"
            className="text-sm"
          ></iconify-icon>
          <span>{opportunity.location}</span>
        </div>
        <div className="flex items-center space-x-1">
          <iconify-icon icon="mdi:calendar" className="text-sm"></iconify-icon>
          <span>{new Date(opportunity.deadline).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

export default OpportunityCard;
