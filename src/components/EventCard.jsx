import React from "react";
import { TierBadge } from "./Badge";

const EventCard = ({
  event,
  mode,
  onRegister,
  isRegistered,
  isRestricted,
  onRestrictedClick,
}) => {
  const handleClick = () => {
    if (isRestricted) {
      onRestrictedClick?.();
      return;
    }
    onRegister?.(event.id);
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
          ? `Restricted event: ${event.title}`
          : `Register for event: ${event.title}`
      }
    >
      <div className="flex items-start justify-between mb-2">
        <h3
          className={`font-medium ${
            mode === "dark" ? "text-white" : "text-gray-900"
          } ${isRestricted ? "text-gray-500 dark:text-gray-400" : ""}`}
        >
          {event.title}
          {isRestricted && (
            <span className="ml-2 text-xs text-red-500">
              <iconify-icon icon="mdi:lock" className="inline mr-1" />
              Restricted
            </span>
          )}
        </h3>
        <TierBadge
          tier={event.tier_restriction || "Free Member (Tier 4)"}
          mode={mode}
        />
      </div>
      <div
        className={`flex items-center space-x-4 text-sm ${
          mode === "dark" ? "text-gray-400" : "text-gray-600"
        } ${isRestricted ? "text-gray-400 dark:text-gray-500" : ""}`}
      >
        <div className="flex items-center space-x-1">
          <iconify-icon icon="mdi:calendar" className="text-sm" />
          <span>{new Date(event.date).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center space-x-1">
          <iconify-icon icon="mdi:map-marker" className="text-sm" />
          <span>{event.location || "Virtual"}</span>
        </div>
      </div>
      <div className="mt-3">
        <button
          onClick={handleClick}
          disabled={isRegistered || isRestricted}
          className={`text-sm px-3 py-1 rounded-md transition-colors ${
            isRegistered || isRestricted
              ? "bg-gray-400 text-gray-700 cursor-not-allowed"
              : mode === "dark"
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          {isRegistered
            ? "Registered"
            : isRestricted
            ? "Restricted"
            : "Register"}
        </button>
      </div>
    </div>
  );
};

export default EventCard;
