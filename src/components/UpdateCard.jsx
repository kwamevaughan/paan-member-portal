import React from "react";
import { TierBadge } from "./Badge";

const UpdateCard = ({
  update,
  mode,
  isRestricted,
  onRestrictedClick,
  Icon,
}) => {
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

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick(e);
    }
  };

  return (
    <div
      className={`group relative overflow-hidden rounded-xl border transition-all duration-300 ease-out ${
        isRestricted
          ? "opacity-60 cursor-not-allowed"
          : "hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 cursor-pointer"
      } ${
        mode === "dark"
          ? "bg-gradient-to-br from-gray-800/60 to-gray-900/60 border-gray-700/50 hover:border-blue-500/30"
          : "bg-gradient-to-br from-white to-gray-50/50 border-gray-200/80 hover:border-blue-300/50"
      }`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-disabled={isRestricted}
      role="button"
      tabIndex={isRestricted ? -1 : 0}
      aria-label={
        isRestricted
          ? `Restricted update: ${update.title}`
          : `View update: ${update.title}`
      }
    >
      {/* Background Pattern */}
      <div
        className={`absolute inset-0 opacity-5 ${
          mode === "dark" ? "bg-blue-600" : "bg-blue-500"
        }`}
        style={{
          backgroundImage: `radial-gradient(circle at 20% 80%, currentColor 0%, transparent 50%), 
                         radial-gradient(circle at 80% 20%, currentColor 0%, transparent 50%)`,
        }}
      />

      {/* Restricted Overlay */}
      {isRestricted && (
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-red-500/5 pointer-events-none" />
      )}

      {/* Content */}
      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3
              className={`font-semibold text-lg leading-tight mb-2 ${
                mode === "dark" ? "text-white" : "text-gray-900"
              } ${isRestricted ? "text-gray-500 dark:text-gray-400" : ""}`}
            >
              {update.title}
            </h3>

            {isRestricted && (
              <div className="flex items-center space-x-2 mb-3">
                <div
                  className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                    mode === "dark"
                      ? "bg-red-900/30 text-red-400 border border-red-800/30"
                      : "bg-red-50 text-red-600 border border-red-200"
                  }`}
                >
                  {Icon ? (
                    <Icon icon="mdi:lock" className="text-xs" />
                  ) : (
                    <span className="text-xs">🔒</span>
                  )}
                  <span>Access Restricted</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex-shrink-0 ml-3">
            <TierBadge
              tier={update.tier_restriction || "Free Member"}
              mode={mode}
            />
          </div>
        </div>

        {/* Description or Preview */}
        {update.description && (
          <p
            className={`text-sm mb-4 line-clamp-2 ${
              mode === "dark" ? "text-gray-300" : "text-gray-600"
            } ${isRestricted ? "text-gray-400 dark:text-gray-500" : ""}`}
          >
            {update.description}
          </p>
        )}

        {/* Tags */}
        {update.tags && update.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {update.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                  mode === "dark"
                    ? "bg-gray-700/70 text-gray-300 hover:bg-gray-600/70"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                } ${isRestricted ? "opacity-60" : ""}`}
              >
                <span className="mr-1">#</span>
                {tag}
              </span>
            ))}
            {update.tags.length > 3 && (
              <span
                className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${
                  mode === "dark"
                    ? "bg-gray-700/50 text-gray-400"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                +{update.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
          {/* Date/Time */}
          {update.created_at && (
            <div
              className={`flex items-center space-x-1 text-xs ${
                mode === "dark" ? "text-gray-500" : "text-gray-400"
              }`}
            >
              {Icon ? (
                <Icon icon="mdi:clock-outline" className="text-xs" />
              ) : (
                <span className="text-xs">🕒</span>
              )}
              <span>{new Date(update.created_at).toLocaleDateString()}</span>
            </div>
          )}

          {/* CTA Button */}
          <button
            onClick={handleClick}
            disabled={isRestricted}
            className={`group/btn inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
              isRestricted
                ? "text-gray-400 cursor-not-allowed bg-gray-100 dark:bg-gray-800"
                : mode === "dark"
                ? "text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 bg-blue-900/10 border border-blue-800/30"
                : "text-blue-600 hover:text-blue-700 hover:bg-blue-50 bg-blue-50/50 border border-blue-200"
            }`}
          >
            <span>{update.cta_text || "View Details"}</span>
            {!isRestricted && Icon && (
              <Icon
                icon="mdi:arrow-right"
                className="text-sm transition-transform group-hover/btn:translate-x-0.5"
              />
            )}
          </button>
        </div>
      </div>

      {/* Hover Glow Effect */}
      {!isRestricted && (
        <div
          className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${
            mode === "dark"
              ? "bg-gradient-to-r from-blue-500/5 via-transparent to-purple-500/5"
              : "bg-gradient-to-r from-blue-300/10 via-transparent to-indigo-300/10"
          }`}
        />
      )}
    </div>
  );
};

export default UpdateCard;
