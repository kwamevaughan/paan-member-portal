import React from "react";
import PropTypes from "prop-types";

const SectionCard = ({
  title,
  icon,
  children,
  mode,
  headerAction,
  onHeaderClick,
}) => (
  <div
    className={`rounded-xl p-6 backdrop-blur-sm border transition-all duration-300 ${
      mode === "dark"
        ? "bg-gray-800/50 border-gray-700"
        : "bg-white/80 border-gray-200"
    }`}
  >
    <div className="flex items-center justify-between mb-6">
      <div
        className={`flex items-center space-x-3 ${
          onHeaderClick
            ? "cursor-pointer hover:opacity-80 transition-opacity duration-200"
            : ""
        }`}
        onClick={onHeaderClick}
        role={onHeaderClick ? "button" : undefined}
        tabIndex={onHeaderClick ? 0 : undefined}
        aria-label={onHeaderClick ? `Toggle filters for ${title}` : undefined}
        aria-expanded={onHeaderClick ? !!headerAction : undefined}
        onKeyDown={(e) => {
          if (onHeaderClick && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            onHeaderClick();
          }
        }}
      >
        <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
          <iconify-icon
            icon={icon}
            className="text-xl text-white"
          ></iconify-icon>
        </div>
        <h2
          className={`text-xl font-semibold ${
            mode === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          {title}
        </h2>
        {onHeaderClick && (
          <iconify-icon
            icon="mdi:chevron-down"
            className={`text-xl transition-transform duration-200 ${
              headerAction ? "rotate-180" : ""
            } ${mode === "dark" ? "text-gray-300" : "text-gray-600"}`}
          ></iconify-icon>
        )}
      </div>
      {headerAction}
    </div>
    <div className="space-y-4">{children}</div>
  </div>
);

SectionCard.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  mode: PropTypes.oneOf(["light", "dark"]).isRequired,
  headerAction: PropTypes.node,
  onHeaderClick: PropTypes.func,
};

export default SectionCard;
