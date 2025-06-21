import React, { useState } from "react";
import { TierBadge } from "./Badge";
import { Icon } from "@iconify/react";

const UpdateCard = ({
  update,
  mode,
  isRestricted,
  onRestrictedClick,
  onClick,
  Icon: CustomIcon,
}) => {
  const IconComponent = CustomIcon || Icon;
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (isRestricted) {
      onRestrictedClick?.();
      return;
    }
    onClick?.(update);
  };

  const handleViewMoreInfo = (e) => {
    e.stopPropagation(); // Prevent card click
    if (isRestricted) {
      onRestrictedClick?.();
      return;
    }
    onClick?.(update);
  };

  const getUpdateIcon = (update) => {
    if (update.cta_url) return "mdi:external-link";
    if (update.title.toLowerCase().includes("event")) return "mdi:calendar";
    if (update.title.toLowerCase().includes("opportunity")) return "mdi:briefcase";
    if (update.title.toLowerCase().includes("offer")) return "mdi:gift";
    if (update.title.toLowerCase().includes("resource")) return "mdi:book-open";
    return "mdi:bell";
  };

  return (
    <div
      className={`group relative overflow-hidden rounded-lg border backdrop-blur-lg transition-all duration-300 transform h-full flex flex-col ${
        mode === "dark"
          ? "bg-[#172840] border-gray-700/60 hover:border-gray-600/80"
          : "bg-[#172840] border-gray-200/70 hover:border-gray-300/80"
      } ${
        isRestricted
          ? "opacity-50 cursor-not-allowed"
          : "hover:shadow-2xl cursor-pointer hover:scale-[1.02] hover:-translate-y-2"
      }`}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-disabled={isRestricted}
      role="button"
      tabIndex={isRestricted ? -1 : 0}
      aria-label={
        isRestricted
          ? `Restricted update: ${update.title}`
          : `View update: ${update.title}`
      }
    >
      {/* Background Gradient Overlay */}
      <div
        className={`absolute inset-0 bg-[#172840] opacity-5 transition-opacity duration-300 ${
          isHovered ? "opacity-10" : "opacity-5"
        } ${isRestricted ? "bg-[#172840]" : ""}`}
      ></div>

      {/* Animated Border */}
      {!isRestricted && (
        <div
          className={`absolute inset-0 rounded-2xl bg-[#172840] opacity-0 transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        ></div>
      )}

      <div className="relative p-6 flex-1 flex flex-col">
        {/* Header */}
        <div className="mb-4">
          {/* First Row: Icon and Title */}
          <div className="flex items-start space-x-3 mb-3">
            {/* Type Icon */}
            <div
              className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                mode === "dark"
                  ? "bg-gray-700/50 text-paan-blue"
                  : "bg-white text-paan-yellow"
              } ${isHovered ? "scale-95 rotate-12" : ""}`}
            >
              <IconComponent icon={getUpdateIcon(update)} className="text-3xl" />
            </div>

            <div className="flex-1 min-w-0">
              <h3
                className={`font-normal text-lg leading-tight mb-1 transition-colors duration-200 ${
                  mode === "dark" ? "text-white" : "text-white"
                } ${isRestricted ? "text-gray-500 dark:text-gray-400" : ""} ${
                  isHovered ? "text-paan-blue dark:text-paan-blue" : ""
                }`}
              >
                {update.title}
              </h3>
            </div>
          </div>

          {/* Second Row: Tier Badge, Category and Status Badge */}
          <div className="flex items-center justify-between">
            <div className="[&>span]:!bg-white [&>span]:!text-gray-900 [&>span]:!border-gray-200 [&>span>svg]:!text-[#f25749]">
              <TierBadge
                tier={update.tier_restriction || "Free Member"}
                mode={mode}
              />
            </div>

            {update.category && (
              <p
                className={`text-sm font-medium flex bg-gray-100/50 text-gray-100 px-2 py-1 rounded-full w-fit ${
                  isRestricted ? "text-gray-400 dark:text-gray-500" : ""
                }`}
              >
                {update.category}
              </p>
            )}

            {/* Status Badges */}
            <div className="flex gap-2">
              {/* Restricted Badge */}
              {isRestricted && (
                <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">
                  <IconComponent icon="mdi:lock" className="text-sm mr-1" />
                  Restricted
                </div>
              )}

              {/* NEW Badge */}
              {update.is_new && !isRestricted && (
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                  NEW
                </div>
              )}

              {/* External Link Badge */}
              {update.cta_url && !isRestricted && (
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                  External Link
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        {update.description && (
          <p
            className={`text-sm mb-4 line-clamp-3 leading-relaxed ${
              mode === "dark" ? "text-gray-400" : "text-white"
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
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                  mode === "dark"
                    ? "bg-gray-700/60 text-gray-300 hover:bg-gray-600/60"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                } ${isHovered ? "scale-105" : ""}`}
              >
                <IconComponent icon="mdi:tag" className="text-teal-500 text-sm mr-1" />
                {tag}
              </span>
            ))}
            {update.tags.length > 3 && (
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                  mode === "dark"
                    ? "bg-gray-700/60 text-gray-400"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                +{update.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Details Row */}
        <div
          className={`flex flex-wrap items-center gap-6 text-sm mb-4 ${
            mode === "dark" ? "text-gray-400" : "text-gray-600"
          } ${isRestricted ? "text-gray-400 dark:text-gray-500" : ""}`}
        >
          {/* Created Date */}
          {update.created_at && (
            <div className="flex items-center space-x-1.5 hover:scale-105 transition-transform duration-200 text-white">
              <IconComponent icon="mdi:calendar" className="text-lg text-[#f25749]" />
              <span>
                {new Date(update.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          )}

          {/* Category */}
          {update.category && (
            <div className="flex items-center space-x-1.5 hover:scale-105 transition-transform duration-200 text-white">
              <IconComponent icon="mdi:folder" className="text-lg text-[#85c1da]" />
              <span>{update.category}</span>
            </div>
          )}

          {/* CTA URL */}
          {update.cta_url && (
            <div className="flex items-center space-x-1.5 hover:scale-105 transition-transform duration-200 text-white">
              <IconComponent icon="mdi:link" className="text-lg text-green-500" />
              <span>External link</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 mt-auto">
          {update.cta_text && (
            <div className="flex items-center space-x-1.5 text-xs text-gray-500 dark:text-gray-400">
              <IconComponent icon="mdi:arrow-right" className="text-sm" />
              <span>{update.cta_text}</span>
            </div>
          )}
          <button
            onClick={handleViewMoreInfo}
            className={`px-4 py-2 rounded-full font-normal text-xs transition-colors ${
              isRestricted
                ? "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-600 dark:text-gray-400"
                : "bg-paan-yellow hover:bg-paan-yellow/80 dark:bg-paan-yellow dark:hover:bg-paan-yellow/80"
            }`}
            disabled={isRestricted}
            aria-label={`View details for ${update.title}`}
          >
            View Details
          </button>
        </div>

        {/* Hover Glow Effect */}
        {!isRestricted && (
          <div
            className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-paan-blue/5 via-paan-blue/5 to-paan-red/5 opacity-0 transition-opacity duration-500 pointer-events-none ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          ></div>
        )}
      </div>
    </div>
  );
};

export default UpdateCard;
