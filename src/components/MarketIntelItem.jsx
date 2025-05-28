import React from "react";
import { TierBadge } from "./Badge";
import { Icon } from "@iconify/react";

const MarketIntelItem = ({
  intel,
  mode,
  isRestricted,
  onRestrictedClick,
  Icon: CustomIcon,
}) => {
  const IconComponent = CustomIcon || Icon;

  const handleClick = () => {
    if (isRestricted) {
      onRestrictedClick?.();
      return;
    }
    if (intel.url) {
      window.location.href = intel.url;
    }
  };

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border backdrop-blur-sm transition-all duration-500 ease-out hover:scale-[1.02] ${
        isRestricted
          ? "opacity-60 cursor-not-allowed"
          : "hover:shadow-2xl hover:shadow-indigo-500/10 cursor-pointer transform-gpu"
      } ${
        mode === "dark"
          ? "bg-gradient-to-br from-gray-800/80 via-gray-800/60 to-gray-900/80 border-gray-700/50 hover:border-indigo-500/30"
          : "bg-gradient-to-br from-white/90 via-white/70 to-gray-50/90 border-gray-200/80 hover:border-indigo-300/50"
      }`}
      aria-disabled={isRestricted}
      role="button"
      tabIndex={isRestricted ? -1 : 0}
      aria-label={
        isRestricted
          ? `Restricted market intel: ${intel.title}`
          : `View market intel: ${intel.title}`
      }
      onClick={handleClick}
    >
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
          mode === "dark"
            ? "bg-gradient-to-r from-indigo-600/5 via-purple-600/5 to-indigo-600/5"
            : "bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-indigo-500/5"
        }`}
      />
      {!isRestricted && (
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-indigo-500/20 blur-xl -z-10" />
      )}
      <div className="relative p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="relative">
            <div
              className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 ${
                mode === "dark"
                  ? "bg-gradient-to-br from-indigo-600 to-purple-700"
                  : "bg-gradient-to-br from-indigo-500 to-purple-600"
              } group-hover:shadow-indigo-500/25`}
            >
              <IconComponent
                icon="mdi:chart-box"
                className="text-white text-xl"
              />
            </div>
            <div className="absolute inset-0 rounded-xl border-2 border-indigo-500/20 scale-110 opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-500" />
          </div>
          <div className="flex-shrink-0">
            <TierBadge
              tier={intel.tier_restriction || "Free Member"}
              mode={mode}
            />
          </div>
        </div>
        <div className="space-y-2">
          <h3
            className={`text-xl font-bold leading-tight transition-colors duration-200 ${
              mode === "dark" ? "text-white" : "text-gray-900"
            } ${
              isRestricted
                ? "text-gray-500 dark:text-gray-400"
                : "group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
            }`}
          >
            {intel.title}
          </h3>
          {isRestricted && (
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
              <IconComponent icon="mdi:lock-outline" className="text-sm" />
              <span className="text-sm font-medium">Access Restricted</span>
            </div>
          )}
        </div>
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
                    ? "bg-gray-700/50 text-indigo-400"
                    : "bg-indigo-50 text-indigo-600"
                }`}
              >
                <IconComponent
                  icon="mdi:map-marker-outline"
                  className="text-sm"
                />
              </div>
              <span>{intel.region}</span>
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
                    ? "bg-gray-700/50 text-purple-400"
                    : "bg-purple-50 text-purple-600"
                }`}
              >
                <IconComponent
                  icon="mdi:file-chart-outline"
                  className="text-sm"
                />
              </div>
              <span>{intel.type}</span>
            </div>
            {intel.downloadable && (
              <div
                className={`ml-auto p-1.5 rounded-lg ${
                  mode === "dark"
                    ? "bg-gray-700/50 text-gray-400"
                    : "bg-gray-100 text-gray-600"
                } group-hover:bg-green-500 group-hover:text-white transition-colors duration-300`}
              >
                <IconComponent icon="mdi:download" className="text-sm" />
              </div>
            )}
          </div>
        </div>
        <div className="pt-2">
          <button
            disabled={isRestricted}
            onClick={handleClick}
            className={`w-full py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-300 transform ${
              isRestricted
                ? "bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                : mode === "dark"
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:shadow-indigo-500/25 active:scale-95"
                : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:shadow-indigo-500/25 active:scale-95"
            }`}
          >
            {isRestricted ? (
              <div className="flex items-center justify-center space-x-2">
                <IconComponent icon="mdi:lock" className="text-lg" />
                <span>Upgrade Required</span>
              </div>
            ) : intel.downloadable ? (
              <div className="flex items-center justify-center space-x-2">
                <IconComponent icon="mdi:download" className="text-lg" />
                <span>Download Report</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <IconComponent icon="mdi:eye" className="text-lg" />
                <span>View Report</span>
              </div>
            )}
          </button>
        </div>
      </div>
      {!isRestricted && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </div>
      )}
    </div>
  );
};

export default MarketIntelItem;
