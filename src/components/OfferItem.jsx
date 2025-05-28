import React, { useState } from "react";
import { TierBadge } from "./Badge";

const OfferItem = ({ offer, mode, isRestricted, onRestrictedClick, Icon }) => {
  const [isHovered, setIsHovered] = useState(false);

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

  const getOfferIcon = (type) => {
    const iconMap = {
      Discount: "mdi:percent-outline",
      Voucher: "mdi:ticket-outline",
      Coupon: "mdi:coupon-outline",
      Deal: "mdi:tag-outline",
      Promotion: "mdi:megaphone-outline",
    };
    return iconMap[type] || "mdi:gift-outline";
  };

  return (
    <div
      onClick={handleClick}
      className={`group relative overflow-hidden rounded-2xl border backdrop-blur-sm transition-all duration-500 ease-out transform-gpu ${
        isRestricted
          ? "opacity-60 cursor-not-allowed"
          : "hover:scale-[1.02] hover:shadow-2xl cursor-pointer"
      } ${
        mode === "dark"
          ? "bg-gradient-to-br from-gray-800/80 via-gray-800/60 to-gray-900/80 border-gray-700/50 hover:border-blue-500/30"
          : "bg-gradient-to-br from-white/90 via-white/70 to-gray-50/90 border-gray-200/80 hover:border-blue-300/50"
      }`}
      style={{
        boxShadow: isRestricted
          ? "none"
          : mode === "dark"
          ? "0 0 0 1px rgba(59, 130, 246, 0.1)"
          : "0 0 0 1px rgba(59, 130, 246, 0.05)",
      }}
      aria-disabled={isRestricted}
      role="button"
      tabIndex={0}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleClick(e);
        }
      }}
    >
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
          mode === "dark"
            ? "bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-blue-600/5"
            : "bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-blue-500/5"
        }`}
      />
      {!isRestricted && (
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 blur-xl -z-10" />
      )}

      <div className="relative p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1 min-w-0">
            <div
              className={`relative flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transform transition-transform duration-300 ${
                isRestricted
                  ? "bg-gray-400 group-hover:scale-105"
                  : "group-hover:scale-110 group-hover:rotate-3"
              } ${mode === "dark" ? "bg-gray-700/50" : "bg-gray-100"}`}
            >
              {Icon ? (
                <Icon
                  icon={getOfferIcon(offer.type)}
                  className="text-blue-400 text-2xl"
                />
              ) : (
                <span className="text-blue-400 text-2xl">🎁</span>
              )}
              {isRestricted && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  {Icon ? (
                    <Icon icon="mdi:lock" className="text-white text-xs" />
                  ) : (
                    <span className="text-white text-xs">🔒</span>
                  )}
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex items-start justify-between">
                <h4
                  className={`font-bold text-lg leading-tight transition-colors duration-200 truncate ${
                    isRestricted
                      ? "text-gray-500 dark:text-gray-400"
                      : mode === "dark"
                      ? "text-white group-hover:text-blue-400"
                      : "text-gray-900 group-hover:text-blue-600"
                  }`}
                >
                  {offer.title}
                </h4>
              </div>

              <div className="flex items-center space-x-3">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    isRestricted
                      ? "bg-gray-200 dark:bg-gray-700 text-gray-500"
                      : mode === "dark"
                      ? "bg-blue-900/30 text-blue-400 border border-blue-800/30"
                      : "bg-blue-50 text-blue-700 border border-blue-200"
                  }`}
                >
                  {Icon ? (
                    <Icon
                      icon={getOfferIcon(offer.type)}
                      className="mr-1.5 text-xs"
                    />
                  ) : (
                    <span className="mr-1.5 text-xs">🎁</span>
                  )}
                  {offer.type || "General"}
                </span>

                {offer.averageRating > 0 && (
                  <div className="flex items-center gap-1">
                    {Icon ? (
                      <Icon
                        icon="mdi:star"
                        className={`text-base ${
                          offer.averageRating > 0
                            ? "text-amber-400"
                            : "text-gray-400"
                        }`}
                      />
                    ) : (
                      <span
                        className={`text-base ${
                          offer.averageRating > 0
                            ? "text-amber-400"
                            : "text-gray-400"
                        }`}
                      >
                        ★
                      </span>
                    )}
                    <span
                      className={`text-xs font-medium ${
                        mode === "dark" ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {offer.averageRating.toFixed(1)}
                    </span>
                  </div>
                )}
              </div>

              {offer.tier_restriction && (
                <div className="flex items-center space-x-2">
                  <TierBadge
                    tier={offer.tier_restriction || "Free Member"}
                    mode={mode}
                  />
                  {offer.feedbackCount > 0 && (
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        mode === "dark"
                          ? "bg-slate-700/60 text-slate-400"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {offer.feedbackCount} review
                      {offer.feedbackCount !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>
              )}

              {offer.description && (
                <p
                  className={`text-sm leading-relaxed truncate ${
                    isRestricted
                      ? "text-gray-400"
                      : mode === "dark"
                      ? "text-gray-300"
                      : "text-gray-600"
                  }`}
                >
                  {offer.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex-shrink-0 ml-4">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                isRestricted
                  ? mode === "dark"
                    ? "bg-red-900/30 text-red-400"
                    : "bg-red-100 text-red-600"
                  : mode === "dark"
                  ? "bg-gray-700/50 text-gray-400 group-hover:bg-blue-600/20 group-hover:text-blue-400"
                  : "bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600"
              } ${!isRestricted ? "group-hover:scale-110" : ""}`}
            >
              {Icon ? (
                <Icon
                  icon={
                    isRestricted ? "mdi:lock-outline" : "mdi:arrow-top-right"
                  }
                  className="text-lg"
                />
              ) : (
                <span className="text-lg">{isRestricted ? "🔒" : "↗"}</span>
              )}
            </div>
          </div>
        </div>

        {isRestricted && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-red-600 dark:text-red-400">
                Upgrade Required
              </span>
              <button
                onClick={handleClick}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  mode === "dark"
                    ? "bg-red-900/30 text-red-400 hover:bg-red-900/50"
                    : "bg-red-100 text-red-600 hover:bg-red-200"
                }`}
              >
                View Details
              </button>
            </div>
          </div>
        )}
      </div>

      {!isRestricted && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </div>
      )}
    </div>
  );
};

export default OfferItem;
