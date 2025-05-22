import React from "react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import MarketIntelChart from "./MarketIntelChart";

export default function DetailsModal({
  mode,
  intel,
  isAccessible = true,
  onClose,
  onFullScreen,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="p-6"
    >
      <h2
        className={`text-xl font-semibold mb-4 ${
          mode === "dark" ? "text-gray-100" : "text-gray-800"
        }`}
      >
        {intel.title}
      </h2>
      <div className="space-y-4">
        {intel.chart_data ? (
          <div className="relative">
            <MarketIntelChart mode={mode} chartData={intel.chart_data} />
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={onFullScreen}
              className={`absolute top-2 right-2 p-2 rounded-full ${
                mode === "dark"
                  ? "bg-gray-700/50 text-gray-200 hover:bg-gray-600/70"
                  : "bg-white/50 text-gray-800 hover:bg-white/70"
              } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              aria-label="View chart in full screen"
            >
              <Icon icon="mdi:fullscreen" className="w-6 h-6" />
            </motion.button>
          </div>
        ) : (
          <p
            className={`text-sm ${
              mode === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {intel.description}
          </p>
        )}
        <div>
          <h3
            className={`text-sm font-medium ${
              mode === "dark" ? "text-gray-200" : "text-gray-700"
            }`}
          >
            Details
          </h3>
          <p
            className={`text-sm ${
              mode === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            <strong>Region:</strong> {intel.region}
          </p>
          <p
            className={`text-sm ${
              mode === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            <strong>Type:</strong> {intel.type}
          </p>
          <p
            className={`text-sm ${
              mode === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            <strong>Access:</strong> {intel.tier_restriction}
          </p>
          {intel.url && (
            <p
              className={`text-sm ${
                mode === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              <strong>Source:</strong>{" "}
              <a
                href={intel.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`underline ${
                  mode === "dark" ? "text-indigo-400" : "text-indigo-500"
                }`}
              >
                View Source
              </a>
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
