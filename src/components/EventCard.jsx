import React from "react";
import { TierBadge } from "./Badge";

const EventCard = ({
  event,
  mode,
  onRegister,
  isRegistered,
  isRestricted,
  onRestrictedClick,
  Icon,
}) => {
  const handleClick = () => {
    if (isRestricted) {
      onRestrictedClick?.();
      return;
    }
    onRegister?.(event.id);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString("en-US", { month: "short" });
    const year = date.getFullYear();
    return { day, month, year };
  };

  const dateInfo = formatDate(event.date);

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border backdrop-blur-sm transition-all duration-500 ease-out hover:scale-[1.02] ${
        isRestricted
          ? "opacity-60 cursor-not-allowed"
          : "hover:shadow-2xl hover:shadow-blue-500/10 cursor-pointer transform-gpu"
      } ${
        mode === "dark"
          ? "bg-gradient-to-br from-gray-800/80 via-gray-800/60 to-gray-900/80 border-gray-700/50 hover:border-blue-500/30"
          : "bg-gradient-to-br from-white/90 via-white/70 to-gray-50/90 border-gray-200/80 hover:border-blue-300/50"
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
      {/* Gradient overlay for premium feel */}
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
          mode === "dark"
            ? "bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-blue-600/5"
            : "bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-blue-500/5"
        }`}
      />

      {/* Animated border glow */}
      {!isRestricted && (
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 blur-xl -z-10" />
      )}

      <div className="relative p-6 space-y-4">
        {/* Header with date badge and tier */}
        <div className="flex items-start justify-between">
          {/* Date Badge */}
          <div
            className={`flex-shrink-0 w-16 h-16 rounded-xl flex flex-col items-center justify-center text-center shadow-lg ${
              mode === "dark"
                ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white"
                : "bg-gradient-to-br from-blue-500 to-blue-600 text-white"
            }`}
          >
            <span className="text-xs font-medium opacity-90">
              {dateInfo.month}
            </span>
            <span className="text-lg font-bold leading-none">
              {dateInfo.day}
            </span>
            <span className="text-xs opacity-90">{dateInfo.year}</span>
          </div>

          {/* Tier Badge */}
          <div className="flex-shrink-0">
            <TierBadge
              tier={event.tier_restriction || "Free Member (Tier 4)"}
              mode={mode}
            />
          </div>
        </div>

        {/* Title and Restriction Status */}
        <div className="space-y-2">
          <h3
            className={`text-xl font-bold leading-tight transition-colors duration-200 ${
              mode === "dark" ? "text-white" : "text-gray-900"
            } ${
              isRestricted
                ? "text-gray-500 dark:text-gray-400"
                : "group-hover:text-blue-600 dark:group-hover:text-blue-400"
            }`}
          >
            {event.title}
          </h3>

          {isRestricted && (
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
              <Icon icon="mdi:lock-outline" className="text-sm" />
              <span className="text-sm font-medium">Access Restricted</span>
            </div>
          )}
        </div>

        {/* Event Details */}
        <div className="space-y-3">
          <div
            className={`flex items-center space-x-3 text-sm font-medium ${
              mode === "dark" ? "text-gray-300" : "text-gray-600"
            } ${isRestricted ? "text-gray-400 dark:text-gray-500" : ""}`}
          >
            <div className="flex items-center space-x-2">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  mode === "dark"
                    ? "bg-gray-700/50 text-blue-400"
                    : "bg-blue-50 text-blue-600"
                }`}
              >
                <Icon icon="mdi:clock-outline" className="text-sm" />
              </div>
              <span>
                {new Date(event.date).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>

          <div
            className={`flex items-center space-x-3 text-sm font-medium ${
              mode === "dark" ? "text-gray-300" : "text-gray-600"
            } ${isRestricted ? "text-gray-400 dark:text-gray-500" : ""}`}
          >
            <div className="flex items-center space-x-2">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  mode === "dark"
                    ? "bg-gray-700/50 text-green-400"
                    : "bg-green-50 text-green-600"
                }`}
              >
                <Icon
                  icon="mdi:map-marker-outline"
                  className="text-sm"
                />
              </div>
              <span>{event.location || "Virtual Event"}</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={handleClick}
            disabled={isRegistered || isRestricted}
            className={`w-full py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-300 transform ${
              isRegistered
                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 cursor-default"
                : isRestricted
                ? "bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                : mode === "dark"
                ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:shadow-blue-500/25 active:scale-95"
                : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:shadow-blue-500/25 active:scale-95"
            }`}
          >
            {isRegistered ? (
              <div className="flex items-center justify-center space-x-2">
                <Icon icon="mdi:check-circle" className="text-lg" />
                <span>Registered</span>
              </div>
            ) : isRestricted ? (
              <div className="flex items-center justify-center space-x-2">
                <Icon icon="mdi:lock" className="text-lg" />
                <span>Upgrade Required</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <Icon icon="mdi:calendar-plus" className="text-lg" />
                <span>Register Now</span>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Shimmer effect for non-restricted cards */}
      {!isRestricted && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </div>
      )}
    </div>
  );
};

export default EventCard;
