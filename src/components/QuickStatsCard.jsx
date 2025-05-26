import React from "react";

const QuickStatsCard = ({ title, value, change, icon, color, mode }) => (
  <div
    className={`rounded-xl p-6 backdrop-blur-sm border transition-all duration-300 hover:scale-105 hover:shadow-lg animate-pulse-once ${
      mode === "dark"
        ? "bg-gray-800/50 border-gray-700 hover:bg-gray-800/70"
        : "bg-white/80 border-gray-200 hover:bg-white/90"
    }`}
  >
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-lg ${color}`}>
        <iconify-icon
          icon={icon}
          className="text-2xl text-white"
        ></iconify-icon>
      </div>
      <div
        className={`text-sm font-medium animate-change ${
          change >= 0 ? "text-green-600" : "text-red-600"
        }`}
      >
        {change >= 0 ? "+" : ""}
        {change}%
      </div>
    </div>
    <div
      className={`text-2xl font-bold mb-1 ${
        mode === "dark" ? "text-white" : "text-gray-900"
      }`}
    >
      {value}
    </div>
    <div
      className={`text-sm ${
        mode === "dark" ? "text-gray-400" : "text-gray-600"
      }`}
    >
      {title}
    </div>
  </div>
);

export default QuickStatsCard;
