import React, { useState } from "react";
import { TierBadge } from "./Badge";
import { Icon } from "@iconify/react";

const ResourceCard = ({
  resource,
  mode,
  onView,
  isRestricted,
  onRestrictedClick,
  onClick,
  Icon,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (isRestricted) {
      onRestrictedClick?.();
      return;
    }
    onClick?.(resource);
  };

  const handleViewMoreInfo = (e) => {
    e.stopPropagation(); // Prevent card click
    if (isRestricted) {
      onRestrictedClick?.();
      return;
    }
    onClick?.(resource);
  };

  const getResourceIcon = (type) => {
    const iconMap = {
      Video: "mdi:video",
      Document: "mdi:file-document",
      Template: "mdi:file-cog",
      Guide: "mdi:book-open",
      Tool: "mdi:wrench",
      Template: "mdi:file-cog",
      Checklist: "mdi:format-list-checks",
      Whitepaper: "mdi:file-document-multiple",
      Case: "mdi:briefcase",
      Webinar: "mdi:video-outline",
      Ebook: "mdi:book-open-variant",
      Infographic: "mdi:chart-line",
      Podcast: "mdi:microphone",
      Course: "mdi:school",
      Workshop: "mdi:account-group",
      Toolkit: "mdi:briefcase-outline",
    };
    return iconMap[type] || "mdi:file";
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
          ? `Restricted resource: ${resource.title}`
          : resource.resource_type === "Video" 
            ? `Watch video: ${resource.title}` 
            : `View details for ${resource.title}`
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
              <Icon icon={getResourceIcon(resource.resource_type)} className="text-3xl" />
            </div>

            <div className="flex-1 min-w-0">
              <h3
                className={`font-normal text-lg leading-tight mb-1 transition-colors duration-200 ${
                  mode === "dark" ? "text-white" : "text-white"
                } ${isRestricted ? "text-gray-500 dark:text-gray-400" : ""} ${
                  isHovered ? "text-paan-blue dark:text-paan-blue" : ""
                }`}
              >
                {resource.title}
              </h3>
            </div>
          </div>

          {/* Second Row: Tier Badge, Resource Type and Status Badge */}
          <div className="flex items-center justify-between">
            <div className="[&>span]:!bg-white [&>span]:!text-gray-900 [&>span]:!border-gray-200 [&>span>svg]:!text-[#f25749]">
              <TierBadge
                tier={resource.tier_restriction || "Free Member"}
                mode={mode}
              />
            </div>

            {resource.resource_type && (
              <p
                className={`text-sm font-medium flex bg-gray-100/50 text-gray-100 px-2 py-1 rounded-full w-fit ${
                  isRestricted ? "text-gray-400 dark:text-gray-500" : ""
                }`}
              >
                {resource.resource_type}
              </p>
            )}

            {/* Status Badges */}
            <div className="flex gap-2">
              {/* Restricted Badge */}
              {isRestricted && (
                <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">
                  <Icon icon="mdi:lock" className="text-sm mr-1" />
                  Restricted
                </div>
              )}

              {/* NEW Badge */}
              {resource.is_new && !isRestricted && (
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                  NEW
                </div>
              )}

              {/* Premium Badge */}
              {resource.premium && !isRestricted && (
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                  Premium
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        {resource.description && (
          <div
            className={`text-sm mb-4 line-clamp-3 leading-relaxed prose prose-sm max-w-none ${
              mode === "dark" ? "text-gray-400 prose-invert" : "text-white"
            } ${isRestricted ? "text-gray-400 dark:text-gray-500" : ""}`}
            dangerouslySetInnerHTML={{ __html: resource.description }}
          />
        )}

        {/* Tags */}
        {resource.tags && resource.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {resource.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                  mode === "dark"
                    ? "bg-gray-700/60 text-gray-300 hover:bg-gray-600/60"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                } ${isHovered ? "scale-105" : ""}`}
              >
                <Icon icon="mdi:tag" className="text-teal-500 text-sm mr-1" />
                {tag}
              </span>
            ))}
            {resource.tags.length > 3 && (
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                  mode === "dark"
                    ? "bg-gray-700/60 text-gray-400"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                +{resource.tags.length - 3} more
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
          {/* Format */}
          {resource.format && (
            <div className="flex items-center space-x-1.5 hover:scale-105 transition-transform duration-200 text-white">
              <Icon icon="mdi:file-document" className="text-lg text-amber-400" />
              <span>{resource.format}</span>
            </div>
          )}

          {/* Duration */}
          {resource.duration && (
            <div className="flex items-center space-x-1.5 hover:scale-105 transition-transform duration-200 text-white">
              <Icon icon="mdi:clock-outline" className="text-lg text-[#f25749]" />
              <span>{resource.duration}</span>
            </div>
          )}

          {/* Language */}
          {resource.language && (
            <div className="flex items-center space-x-1.5 hover:scale-105 transition-transform duration-200 text-white">
              <Icon icon="mdi:translate" className="text-lg text-green-500" />
              <span>{resource.language}</span>
            </div>
          )}

          {/* File Size */}
          {resource.file_size && (
            <div className="flex items-center space-x-1.5 hover:scale-105 transition-transform duration-200 text-white">
              <Icon icon="mdi:file-size" className="text-lg text-[#85c1da]" />
              <span>{resource.file_size}</span>
            </div>
          )}

          {/* Created Date */}
          {resource.created_at && (
            <div className="flex items-center space-x-1.5 hover:scale-105 transition-transform duration-200 text-white">
              <Icon icon="mdi:calendar" className="text-lg text-[#f25749]" />
              <span>
                {new Date(resource.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 mt-auto">
          <div className="flex items-center space-x-1.5 text-xs text-gray-500 dark:text-gray-400">
            <Icon icon="mdi:download" className="text-sm" />
            <span>{resource.download_count || 0} downloads</span>
          </div>
          <button
            onClick={handleViewMoreInfo}
            className={`px-4 py-2 rounded-full font-normal text-xs transition-colors ${
              isRestricted
                ? "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-600 dark:text-gray-400"
                : "bg-paan-yellow hover:bg-paan-yellow/80 dark:bg-paan-yellow dark:hover:bg-paan-yellow/80"
            }`}
            disabled={isRestricted}
            aria-label={`View details for ${resource.title}`}
          >
            {resource.resource_type === "Video" ? "Watch Video" : "View Details"}
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

export default ResourceCard; 