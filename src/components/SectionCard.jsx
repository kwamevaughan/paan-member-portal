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
  <div className="relative mb-10 group">
    {/* Glassmorphism background */}
    <div
      className={`absolute inset-0 rounded-3xl backdrop-blur-xl ${
        mode === "dark"
          ? "bg-gradient-to-br from-slate-800/60 via-slate-900/40 to-slate-800/60"
          : "bg-gradient-to-br from-white/80 via-white/20 to-white/80"
      } border ${
        mode === "dark" ? "border-white/10" : "border-white/20"
      } shadow-2xl group-hover:shadow-3xl transition-all duration-500`}
    ></div>

    {/* Main content */}
    <div className="relative p-8">
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
          {/* Icon container */}
          <div className="relative">
            <div
              className={`absolute inset-0 rounded-2xl blur-md ${
                mode === "dark" ? "bg-amber-400/30" : "bg-amber-500/30"
              } animate-pulse`}
            ></div>
            <div
              className={`relative p-2 rounded-2xl ${
                mode === "dark"
                  ? "bg-gradient-to-br from-amber-400/20 to-orange-500/20 border border-amber-400/30"
                  : "bg-gradient-to-br from-amber-100 to-orange-100 border border-amber-200"
              }`}
            >
              <iconify-icon
                icon={icon}
                className={`text-xl ${
                  mode === "dark" ? "text-amber-400" : "text-amber-600"
                } animate-bounce`}
                style={{
                  animationDuration: "2s",
                  animationIterationCount: "infinite",
                }}
              ></iconify-icon>
            </div>
          </div>
          {/* Title */}
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
        {/* Header action (e.g., filter dropdowns) */}
        {headerAction && <div>{headerAction}</div>}
      </div>
      {/* Content */}
      <div className="space-y-4">{children}</div>
    </div>

    {/* Bottom gradient accent */}
    <div
      className={`absolute bottom-0 left-0 right-0 h-1 ${
        mode === "dark"
          ? "bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500"
          : "bg-gradient-to-r from-[#3c82f6] to-[#dbe9fe]"
      }`}
    ></div>

    {/* Floating dot elements */}
    <div className="absolute -top-2 -right-2 w-4 h-4 bg-[#85c2da] rounded-full opacity-60"></div>
    <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-[#f3584a] rounded-full opacity-40 animate-pulse delay-1000"></div>
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
