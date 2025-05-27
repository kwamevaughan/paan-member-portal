import React from "react";
import { TierBadge } from "./Badge";

const UpdateCard = ({ update, mode, isRestricted, onRestrictedClick }) => {
  const handleClick = (e) => {
    if (isRestricted) {
      e.preventDefault();
      onRestrictedClick?.();
      return;
    }
    if (update.cta_url) {
      window.open(update.cta_url, "_blank", "noopener,noreferrer");
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
          ? `Restricted update: ${update.title}`
          : `View update: ${update.title}`
      }
    >
      <div className="flex items-start justify-between mb-2">
        <h3
          className={`font-medium ${
            mode === "dark" ? "text-white" : "text-gray-900"
          } ${isRestricted ? "text-gray-500 dark:text-gray-400" : ""}`}
        >
          {update.title}
          {isRestricted && (
            <span className="ml-2 text-xs text-red-500">
              <iconify-icon icon="mdi:lock" className="inline mr-1" />
              Restricted
            </span>
          )}
        </h3>
        <TierBadge
          tier={update.tier_restriction || "Free Member"}
          mode={mode}
        />
      </div>
      <div
        className={`flex items-center justify-between ${
          mode === "dark" ? "text-gray-400" : "text-gray-600"
        } ${isRestricted ? "text-gray-400 dark:text-gray-500" : ""}`}
      >
        <div className="flex space-x-2">
          {update.tags.map((tag, index) => (
            <span
              key={index}
              className={`px-2 py-1 text-xs rounded ${
                mode === "dark"
                  ? "bg-gray-600 text-gray-300"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              #{tag}
            </span>
          ))}
        </div>
        <button
          onClick={handleClick}
          disabled={isRestricted}
          className={`text-sm font-medium transition-colors ${
            isRestricted
              ? "text-gray-400 cursor-not-allowed"
              : "text-blue-600 hover:text-blue-700"
          }`}
        >
          {update.cta_text}
        </button>
      </div>
    </div>
  );
};

export default UpdateCard;
