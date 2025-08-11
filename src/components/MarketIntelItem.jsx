import React, { useState } from "react";
import { TierBadge } from "./Badge";
import { Icon } from "@iconify/react";
import PdfThumbnail from "./PdfThumbnail";

const MarketIntelItem = ({
  intel,
  mode,
  isRestricted,
  onRestrictedClick,
  onClick,
  Icon: CustomIcon,
  toast,
}) => {
  const IconComponent = CustomIcon || Icon;
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (isRestricted) {
      onRestrictedClick?.(intel);
      return;
    }
    onClick?.(intel); // Call onClick for accessible items
  };

  const handleViewMoreInfo = (e) => {
    e.stopPropagation(); // Prevent card click
    if (isRestricted) {
      onRestrictedClick?.(intel);
      return;
    }
    onClick?.(intel); // Call onClick for accessible items
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
          ? `Restricted market intelligence: ${intel.title}`
          : `View market intelligence: ${intel.title}`
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
        {/* PDF Thumbnail */}
        {intel.file_path && (
          <PdfThumbnail
            pdfUrl={intel.file_path}
            title={intel.title}
            IconComponent={IconComponent}
          />
        )}

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
              <IconComponent icon="mdi:chart-line" className="text-3xl" />
            </div>

            <div className="flex-1 min-w-0">
              <h3
                className={`font-normal text-lg leading-tight mb-1 transition-colors duration-200 ${
                  mode === "dark" ? "text-white" : "text-white"
                } ${isRestricted ? "text-gray-500 dark:text-gray-400" : ""} ${
                  isHovered ? "text-paan-blue dark:text-paan-blue" : ""
                }`}
              >
                {intel.title}
              </h3>
            </div>
          </div>

          {/* Second Row: Tier Badge, Type and Status Badge */}
          <div className="flex items-center justify-between">
            <div className="w-full [&>span]:!bg-white [&>span]:!text-gray-900 [&>span]:!border-gray-200 [&>span>svg]:!text-paan-red">
              <TierBadge
                tier={intel.tier_restriction || "Free Member"}
                mode={mode}
              />
            </div>

            {intel.type && (
              <p
                className={`w-full justify-center text-sm font-medium flex bg-gray-100/50 text-gray-100 px-2 py-1 rounded-full ${
                  isRestricted ? "text-gray-400 dark:text-gray-500" : ""
                }`}
              >
                {intel.type}
              </p>
            )}

            {/* Status Badges */}
            <div className="flex gap-2">
              {/* Restricted Badge */}
              {isRestricted && (
                <div className="w-full inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">
                  <IconComponent icon="mdi:lock" className="text-sm mr-1" />
                  Restricted
                </div>
              )}

              {/* NEW Badge */}
              {intel.is_new && !isRestricted && (
                <div className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                  NEW
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        {intel.description && (
          <p
            className={`text-sm mb-4 line-clamp-3 leading-relaxed ${
              mode === "dark" ? "text-gray-400" : "text-white"
            } ${isRestricted ? "text-gray-400 dark:text-gray-500" : ""}`}
          >
            {intel.description}
          </p>
        )}

        {/* Tags */}
        {intel.tags && intel.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {intel.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                  mode === "dark"
                    ? "bg-gray-700/60 text-gray-300 hover:bg-gray-600/60"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                } ${isHovered ? "scale-105" : ""}`}
              >
                <IconComponent
                  icon="mdi:tag"
                  className="text-paan-yellow text-sm mr-1"
                />
                {tag}
              </span>
            ))}
            {intel.tags.length > 3 && (
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                  mode === "dark"
                    ? "bg-gray-700/60 text-gray-400"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                +{intel.tags.length - 3} more
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
          {/* Region */}
          {intel.region && (
            <div className="flex items-center space-x-1.5 hover:scale-105 transition-transform duration-200">
              <IconComponent
                icon="mdi:map-marker"
                className="text-lg text-paan-yellow"
              />
              <span className="truncate text-white">{intel.region}</span>
            </div>
          )}

          {/* Created Date */}
          {intel.created_at && (
            <div className="flex items-center space-x-1.5 hover:scale-105 transition-transform duration-200 text-white">
              <IconComponent
                icon="mdi:calendar"
                className="text-lg text-paan-red"
              />
              <span>
                Published on: {new Date(intel.created_at).toLocaleDateString()}
              </span>
            </div>
          )}

          {/* Downloadable */}
          {intel.downloadable && (
            <div className="flex items-center space-x-1.5 hover:scale-105 transition-transform duration-200">
              <IconComponent
                icon="mdi:download"
                className="text-lg text-paan-yellow"
              />
              <span className="font-semibold text-paan-yellow dark:text-paan-yellow">
                Downloadable
              </span>
            </div>
          )}

          {/* Intel Type */}
          {intel.intel_type && (
            <div className="flex items-center space-x-1.5 hover:scale-105 transition-transform duration-200 text-white group relative">
              <IconComponent
                icon="mdi:file-chart"
                className="text-lg text-paan-blue flex-shrink-0"
              />
              <div className="relative">
                <span
                  className="truncate max-w-[80px] block"
                  title={intel.intel_type}
                >
                  {intel.intel_type}
                </span>
                {/* Hover tooltip for truncated text */}
                {intel.intel_type.length > 15 && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                    {intel.intel_type}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 mt-auto">
          {intel.view_count && (
            <div className="flex items-center space-x-1.5 text-xs text-gray-500 dark:text-gray-400">
              <IconComponent icon="mdi:eye" className="text-sm" />
              <span>{intel.view_count} views</span>
            </div>
          )}
          <button
            onClick={handleViewMoreInfo}
            className={`px-4 py-2 rounded-full font-normal text-xs transition-colors ${
              isRestricted
                ? "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-600 dark:text-gray-400"
                : "bg-paan-yellow  hover:bg-paan-yellow/80 dark:bg-paan-yellow dark:hover:bg-paan-yellow/80"
            }`}
            disabled={isRestricted}
            aria-label={`View details for ${intel.title}`}
          >
            View Report
          </button>
        </div>

        {/* Hover Glow Effect */}
        {!isRestricted && (
          <div
            className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 transition-opacity duration-500 pointer-events-none ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          ></div>
        )}
      </div>
    </div>
  );
};

export default MarketIntelItem;
