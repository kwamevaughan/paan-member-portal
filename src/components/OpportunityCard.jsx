import React from "react";
import { useRouter } from "next/router";

const OpportunityCard = ({
  opportunity,
  mode,
  isRestricted,
  onRestrictedClick,
}) => {
  const router = useRouter();

  console.log("[OpportunityCard] Props:", {
    title: opportunity.title,
    tier_restriction: opportunity.tier_restriction,
    isRestricted,
  });

  const handleClick = () => {
    console.log("[OpportunityCard] Clicked:", {
      title: opportunity.title,
      isRestricted,
    });
    if (isRestricted) {
      onRestrictedClick();
      return;
    }
    console.log("[OpportunityCard] Navigating:", {
      title: opportunity.title,
      application_link: opportunity.application_link,
    });
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
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            opportunity.tier_restriction === "Gold Member (Tier 3)"
              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
              : opportunity.tier_restriction === "Full Member (Tier 2)"
              ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
              : opportunity.tier_restriction === "Associate Agency (Tier 1)"
              ? "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
              : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
          }`}
        >
          {opportunity.tier_restriction}
        </span>
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
