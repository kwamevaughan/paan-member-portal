import React from "react";
import { TierBadge } from "./Badge";

const OfferItem = ({ offer, mode, isRestricted, onRestrictedClick }) => {
  const handleClick = (e) => {
    if (isRestricted) {
      e.preventDefault();
      onRestrictedClick?.();
      return;
    }
    if (offer.url) {
      window.open(offer.url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div
      className={`p-4 rounded-lg border transition-all duration-200 ${
        isRestricted
          ? "opacity-50 cursor-not-allowed"
          : "hover:shadow-md cursor-pointer"
      } ${
        mode === "dark"
          ? "bg-gray-700/50 border-gray-600 hover:bg-gray-700/70"
          : "bg-gray-50 border-gray-200 hover:bg-gray-100"
      }`}
      onClick={handleClick}
      aria-disabled={isRestricted}
      role="button"
      tabIndex={isRestricted ? -1 : 0}
      aria-label={
        isRestricted
          ? `Restricted offer: ${offer.title}`
          : `View offer: ${offer.title}`
      }
    >
      <div className="flex items-start justify-between mb-2">
        <h3
          className={`font-medium ${
            mode === "dark" ? "text-white" : "text-gray-900"
          } ${isRestricted ? "text-gray-500 dark:text-gray-400" : ""}`}
        >
          {offer.title}
          {isRestricted && (
            <span className="ml-2 text-xs text-red-500">
              <iconify-icon icon="mdi:lock" className="inline mr-1" />
              Restricted
            </span>
          )}
        </h3>
        <TierBadge tier={offer.tier_restriction || "Free Member"} mode={mode} />
      </div>
      <p
        className={`text-sm ${
          mode === "dark" ? "text-gray-400" : "text-gray-600"
        } ${isRestricted ? "text-gray-400 dark:text-gray-500" : ""}`}
      >
        {offer.description}
      </p>
      <div className="mt-2 flex items-center justify-between">
        <span
          className={`text-sm ${
            mode === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Rating: {offer.averageRating.toFixed(1)} ({offer.feedbackCount})
        </span>
        <button
          onClick={handleClick}
          disabled={isRestricted}
          className={`text-sm font-medium transition-colors ${
            isRestricted
              ? "text-gray-400 cursor-not-allowed"
              : "text-blue-600 hover:text-blue-700"
          }`}
        >
          Learn More
        </button>
      </div>
    </div>
  );
};

export default OfferItem;
