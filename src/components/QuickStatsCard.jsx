import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { format } from "date-fns";
import { motion } from "framer-motion";

const QuickStatsCard = ({
  title,
  value,
  icon,
  backgroundIcon,
  color,
  mode,
  lastUpdated,
}) => {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
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
  }, [value]);

  const colorClasses = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    purple: "from-purple-500 to-purple-600",
    orange: "from-orange-500 to-orange-600",
    amber: "from-amber-500 to-amber-600",
    pink: "from-pink-500 to-pink-600",
  };

  const selectedColor = colorClasses[color] || colorClasses["blue"];

  const formattedLastUpdated =
    lastUpdated && !isNaN(new Date(lastUpdated))
      ? format(new Date(lastUpdated), "MMM d, yyyy 'at' h:mm a")
      : "No recent updates";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative group rounded-2xl overflow-hidden min-h-[200px]"
    >
      {/* Background Icon */}
      <Icon
        icon={backgroundIcon || "mdi:star-outline"}
        className={`absolute bottom-4 right-4 text-[5rem] pointer-events-none z-0 ${
          mode === "dark" ? "text-white/10" : "text-black/10"
        }`}
      />

      {/* Main Card */}
      <div
        className={`relative z-10 p-6 rounded-2xl transition duration-300 border ${
          mode === "dark"
            ? "bg-gray-900/60 text-white border-gray-700"
            : "bg-white text-gray-800 border-gray-200"
        } hover:shadow-lg`}
      >
        {/* Icon + Tooltip container */}
        <div className="flex justify-between items-start mb-4 relative group">
          <Icon icon={icon || "mdi:alert-circle"} className="text-3xl" />
          {/* Tooltip */}
          <div className="absolute top-full right-0 mt-2 hidden group-hover:block">
            <div
              className={`px-3 py-1 text-xs rounded-md shadow-md whitespace-nowrap ${
                mode === "dark"
                  ? "bg-gray-800 text-gray-100 border border-gray-700"
                  : "bg-white text-gray-700 border border-gray-200"
              }`}
            >
              Last updated: {formattedLastUpdated}
            </div>
          </div>
        </div>

        {/* Value */}
        <div className="mb-2">
          <h2
            className={`text-4xl font-bold bg-gradient-to-r ${selectedColor} bg-clip-text text-transparent`}
          >
            {animatedValue.toLocaleString()}
          </h2>
        </div>

        {/* Title */}
        <p className="text-base font-medium opacity-80">{title}</p>

        {/* Decorative bar */}
        <div
          className={`h-1 mt-4 bg-gradient-to-r ${selectedColor} rounded-full transition-all group-hover:w-full w-3/4`}
        />
      </div>
    </motion.div>
  );
};

export default QuickStatsCard;
