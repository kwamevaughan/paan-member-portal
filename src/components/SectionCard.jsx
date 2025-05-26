import React from "react";

const SectionCard = ({ title, icon, children, mode, headerAction }) => (
  <div
    className={`rounded-xl p-6 backdrop-blur-sm border transition-all duration-300 ${
      mode === "dark"
        ? "bg-gray-800/50 border-gray-700"
        : "bg-white/80 border-gray-200"
    }`}
  >
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-3">
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
      </div>
      {headerAction}
    </div>
    <div className="space-y-4">{children}</div>
  </div>
);

export default SectionCard;
