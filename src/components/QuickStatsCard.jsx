import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { format } from "date-fns";

const QuickStatsCard = ({ title, value, icon, color, mode, lastUpdated }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    console.log("Icon prop received:", icon);
    console.log("Last updated prop received:", lastUpdated);

    setIsVisible(true);
    const finalValue = parseInt(value) || 0;
    let current = 0;
    const increment = finalValue / 30;
    const timer = setInterval(() => {
      current += increment;
      if (current >= finalValue) {
        setAnimatedValue(finalValue);
        clearInterval(timer);
      } else {
        setAnimatedValue(Math.floor(current));
      }
    }, 50);

    return () => clearInterval(timer);
  }, [value, icon, lastUpdated]);

  const getColorClasses = (colorProp) => {
    const colorMap = {
      "bg-gradient-to-r from-blue-500 to-blue-600": {
        bg: "from-blue-500/80 to-blue-600/80",
        glow: "shadow-blue-500/25 hover:shadow-blue-500/40",
        border: "border-blue-400/30 hover:border-blue-400/50",
        dot: "text-blue-400",
      },
      "bg-gradient-to-r from-green-500 to-green-600": {
        bg: "from-green-500/80 to-green-600/80",
        glow: "shadow-green-500/25 hover:shadow-green-500/40",
        border: "border-green-400/30 hover:border-green-400/50",
        dot: "text-green-400",
      },
      "bg-gradient-to-r from-purple-500 to-purple-600": {
        bg: "from-purple-500/80 to-purple-600/80",
        glow: "shadow-purple-500/25 hover:shadow-purple-500/40",
        border: "border-purple-400/30 hover:border-purple-400/50",
        dot: "text-purple-400",
      },
      "bg-gradient-to-r from-orange-500 to-orange-600": {
        bg: "from-orange-500/80 to-orange-600/80",
        glow: "shadow-orange-500/25 hover:shadow-orange-500/40",
        border: "border-orange-400/30 hover:border-orange-400/50",
        dot: "text-orange-400",
      },
      "bg-gradient-to-r from-amber-500 to-amber-600": {
        bg: "from-amber-500/80 to-amber-600/80",
        glow: "shadow-amber-500/25 hover:shadow-amber-500/40",
        border: "border-amber-400/30 hover:border-amber-400/50",
        dot: "text-amber-400",
      },
      "bg-gradient-to-r from-pink-500 to-pink-600": {
        bg: "from-pink-500/80 to-pink-600/80",
        glow: "shadow-pink-500/25 hover:shadow-pink-500/40",
        border: "border-pink-400/30 hover:border-pink-400/50",
        dot: "text-pink-400",
      },
    };
    return (
      colorMap[colorProp] ||
      colorMap["bg-gradient-to-r from-blue-500 to-blue-600"]
    );
  };

  const colorClasses = getColorClasses(color);
  const fallbackIcon = "mdi:alert-circle";

  // Validate lastUpdated before parsing
  const isValidDate = (dateString) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
  };

  const formattedLastUpdated = isValidDate(lastUpdated)
    ? format(new Date(lastUpdated), "MMM d, yyyy 'at' h:mm a")
    : "No recent updates";

  return (
    <div
      className={`group relative overflow-hidden transition-all duration-500 rounded-lg ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
      }`}
    >
      <div
        className={`absolute -inset-0.5 bg-gradient-to-r ${colorClasses.bg} rounded-2xl blur opacity-20 group-hover:opacity-40 transition-all duration-700`}
      ></div>
      <div
        className={`relative rounded-2xl p-6 backdrop-blur-xl border transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-2xl ${
          colorClasses.glow
        } ${
          mode === "dark"
            ? `bg-gray-900/60 border-gray-700/50 ${colorClasses.border} group-hover:bg-gray-900/80`
            : `bg-white/70 border-white/20 ${colorClasses.border} group-hover:bg-white/90`
        }`}
      >
        <div className="relative flex items-start justify-between mb-6">
          <div
            className={`relative p-4 rounded-xl bg-gradient-to-br ${colorClasses.bg} shadow-lg group-hover:shadow-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3`}
          >
            <div className="absolute inset-0 bg-white/20 rounded-xl backdrop-blur-sm"></div>
            <Icon
              icon={icon || fallbackIcon}
              className="relative text-3xl text-white drop-shadow-lg"
              onError={() =>
                console.error(
                  `Failed to load header icon: ${icon || fallbackIcon}`
                )
              }
            />
            <div
              className={`absolute inset-0 bg-gradient-to-br ${colorClasses.bg} rounded-xl blur-md opacity-50 scale-110 group-hover:scale-125 transition-transform duration-500`}
            ></div>
          </div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-10">
            <div
              className={`min-w-48 px-4 py-2 text-sm font-medium rounded-lg shadow-lg backdrop-blur-md border transform scale-x-0 group-hover:scale-x-100 transition-transform duration-600 origin-left ${
                mode === "dark"
                  ? "bg-gray-800/10 border-gray-700/50 text-gray-200"
                  : "bg-white/10 border-white/50 text-gray-800"
              }`}
            >
              Last updated: {formattedLastUpdated}
            </div>
          </div>
        </div>
        <div className="relative mb-4">
          <div
            className={`text-4xl font-black mb-2 bg-gradient-to-r bg-clip-text text-transparent transition-all duration-500 group-hover:scale-105 ${
              mode === "dark"
                ? "from-white via-gray-100 to-gray-300"
                : "from-gray-900 via-gray-800 to-gray-700"
            }`}
          >
            <span className="font-mono tracking-tight">
              {animatedValue.toLocaleString()}
            </span>
          </div>
          <div
            className={`h-1 bg-gradient-to-r ${colorClasses.bg} rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-600 origin-left`}
          ></div>
        </div>
        <div
          className={`text-base font-medium transition-all duration-300 group-hover:translate-x-1 ${
            mode === "dark"
              ? "text-gray-300 group-hover:text-white"
              : "text-gray-600 group-hover:text-gray-800"
          }`}
        >
          {title}
        </div>
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 translate-x-full group-hover:-translate-x-full transition-transform duration-1000 ease-in-out"></div>
      </div>
    </div>
  );
};

export default QuickStatsCard;
