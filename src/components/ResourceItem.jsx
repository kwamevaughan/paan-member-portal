import React from "react";
import { TierBadge } from "./Badge";

const ResourceItem = ({ resource, mode, isRestricted, onRestrictedClick }) => {
  const handleClick = () => {
    if (isRestricted) {
      onRestrictedClick();
    } else {
      if (resource.url) window.open(resource.url, "_blank");
      // Add logic if opening video, file_path, etc.
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200
        ${mode === "dark" ? "border-gray-600" : "border-gray-200"}
        ${
          isRestricted
            ? mode === "dark"
              ? "bg-gray-700/20 text-gray-400 cursor-not-allowed"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
            : mode === "dark"
            ? "bg-gray-700/30 hover:bg-gray-700/50 cursor-pointer"
            : "bg-gray-50 hover:bg-gray-100 cursor-pointer"
        }
      `}
      style={{
        pointerEvents: isRestricted ? "auto" : "auto", // keep clickable to show message on restricted
      }}
      aria-disabled={isRestricted}
      role={isRestricted ? "button" : undefined}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleClick();
        }
      }}
    >
      <div className="flex items-center space-x-3">
        <div
          className={`p-2 rounded ${
            isRestricted
              ? "bg-gray-400"
              : "bg-gradient-to-r from-green-500 to-teal-600"
          }`}
        >
          <iconify-icon
            icon={
              resource.resource_type === "Video"
                ? "mdi:play-circle"
                : resource.resource_type === "PDF"
                ? "mdi:file-pdf-box"
                : "mdi:folder-multiple"
            }
            className="text-white text-sm"
          ></iconify-icon>
        </div>
        <div>
          <h4
            className={`font-medium ${
              isRestricted
                ? "text-gray-400"
                : mode === "dark"
                ? "text-white"
                : "text-gray-900"
            }`}
          >
            {resource.title}
          </h4>
          <p
            className={`text-sm ${
              isRestricted
                ? "text-gray-400"
                : mode === "dark"
                ? "text-gray-400"
                : "text-gray-600"
            }`}
          >
            {resource.resource_type}
          </p>
          {resource.tier_restriction && (
            <TierBadge
              tier={resource.tier_restriction || "Free Member"}
              mode={mode}
            />
          )}
        </div>
      </div>

      <iconify-icon
        icon={isRestricted ? "mdi:lock" : "mdi:chevron-right"}
        className={`text-xl ${
          isRestricted
            ? mode === "dark"
              ? "text-red-400"
              : "text-red-600"
            : mode === "dark"
            ? "text-gray-400"
            : "text-gray-600"
        }`}
      ></iconify-icon>
    </div>
  );
};

export default ResourceItem;
