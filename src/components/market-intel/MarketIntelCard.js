import React, { useState, useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import FeedbackModal from "@/components/FeedbackModal";
import DetailsModal from "./DetailsModal";
import FullScreenChartModal from "./FullScreenChartModal";
import MarketIntelChart from "./MarketIntelChart";
import { normalizeTier } from "@/components/Badge";

export default function MarketIntelCard({ mode, intel, isAccessible = true }) {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isFullScreenOpen, setIsFullScreenOpen] = useState(false);
  const modalRef = useRef(null);

  const handleCardClick = () => {
    if (!isAccessible) {
      toast.error(
        `This content is restricted to ${normalizeTier(
          intel.tier_restriction
        )} or higher. Upgrade your membership to access.`,
        {
          duration: 4000,
          style: {
            background:
              mode === "dark"
                ? "rgba(31, 41, 55, 0.8)"
                : "rgba(255, 255, 255, 0.8)",
            color: mode === "dark" ? "#fff" : "#1f2937",
            backdropFilter: "blur(4px)",
          },
        }
      );
    }
  };

  const handleFeedbackClick = (e) => {
    e.stopPropagation();
    if (isAccessible) {
      setIsFeedbackOpen(true);
    } else {
      handleCardClick();
    }
  };

  const handleDetailsClick = (e) => {
    e.stopPropagation();
    if (isAccessible) {
      setIsDetailsOpen(true);
    } else {
      handleCardClick();
    }
  };

  const handleFullScreenClick = (e) => {
    e.stopPropagation();
    if (isAccessible) {
      setIsFullScreenOpen(true);
    } else {
      handleCardClick();
    }
  };

  const closeModal = () => {
    setIsFeedbackOpen(false);
    setIsDetailsOpen(false);
    setIsFullScreenOpen(false);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        e.key === "Escape" &&
        (isFeedbackOpen || isDetailsOpen || isFullScreenOpen)
      ) {
        closeModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFeedbackOpen, isDetailsOpen, isFullScreenOpen]);

  useEffect(() => {
    if (isFeedbackOpen || isDetailsOpen) {
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements?.[0];
      firstElement?.focus();

      const handleTab = (e) => {
        if (e.key === "Tab") {
          const lastElement = focusableElements[focusableElements.length - 1];
          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      };
      window.addEventListener("keydown", handleTab);
      return () => window.removeEventListener("keydown", handleTab);
    }
  }, [isFeedbackOpen, isDetailsOpen]);

  console.log("[MarketIntelCard] Props for FullScreenChartModal:", {
    intel: intel?.title,
    chartData: !!intel?.chart_data,
    isAccessible,
    feedbackCount: intel?.feedback?.length,
  });

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        onClick={handleCardClick}
        className={`relative bg-white rounded-2xl p-6 backdrop-blur-lg shadow-xl border transition-all duration-300 ${
          isAccessible
            ? mode === "dark"
              ? "bg-gray-800/10 border-gray-700/50 hover:bg-gray-700/20"
              : "bg-white/90 border-gray-200/50 hover:bg-white/20"
            : mode === "dark"
            ? "bg-gray-800/5 border-gray-700/30 opacity-50 cursor-not-allowed"
            : "bg-white/50 border-gray-200/30 opacity-50 cursor-not-allowed"
        }`}
      >
        {/* Header Section */}
        <div className="flex items-center gap-4 mb-4">
          <img
            src={
              intel.icon_url || "https://www.paan.africa/assets/images/logo.png"
            }
            alt={intel.title}
            className={`w-10 h-10 rounded-full object-cover ${
              !isAccessible ? "grayscale" : ""
            }`}
            onError={(e) =>
              (e.target.src = "https://www.paan.africa/assets/images/logo.png")
            }
          />
          <div>
            <h3
              className={`text-lg font-semibold ${
                mode === "dark" ? "text-gray-100" : "text-gray-800"
              }`}
            >
              {intel.title}
            </h3>
            <p
              className={`text-sm ${
                mode === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {normalizeTier(intel.tier_restriction)}
            </p>
          </div>
        </div>

        {/* Chart or Description */}
        {intel.chart_data && isAccessible ? (
          <div className="relative">
            <MarketIntelChart mode={mode} chartData={intel.chart_data} />
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={handleFullScreenClick}
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
            className={`text-sm mb-4 line-clamp-3 ${
              mode === "dark" ? "text-gray-300" : "text-gray-600"
            } ${!isAccessible ? "opacity-70" : ""}`}
          >
            {intel.chart_data
              ? "Chart restricted. Upgrade to view."
              : intel.description}
          </p>
        )}

        {/* Footer Section */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Icon
                key={i}
                icon={
                  i < Math.round(intel.averageRating)
                    ? "mdi:star"
                    : "mdi:star-outline"
                }
                className={`w-5 h-5 ${
                  i < Math.round(intel.averageRating)
                    ? "text-yellow-400"
                    : mode === "dark"
                    ? "text-gray-500"
                    : "text-gray-400"
                } ${!isAccessible ? "grayscale" : ""}`}
              />
            ))}
            <span
              className={`text-sm ${
                mode === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              ({intel.feedbackCount})
            </span>
          </div>
          {intel.downloadable && (
            <Icon
              icon="mdi:download"
              className={`w-6 h-6 ${
                isAccessible
                  ? mode === "dark"
                    ? "text-indigo-400"
                    : "text-indigo-500"
                  : "text-gray-500 grayscale"
              }`}
            />
          )}
        </div>
        <div className="flex gap-2">
          <motion.button
            whileHover={isAccessible ? { scale: 1.05 } : {}}
            onClick={handleFeedbackClick}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium ${
              isAccessible
                ? mode === "dark"
                  ? "bg-indigo-600/50 text-white hover:bg-indigo-600/70"
                  : "bg-indigo-500/50 text-white hover:bg-indigo-600/70"
                : "bg-gray-500/50 text-gray-400 cursor-not-allowed"
            }`}
          >
            Feedback
          </motion.button>
          <motion.button
            whileHover={isAccessible ? { scale: 1.05 } : {}}
            onClick={handleDetailsClick}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium ${
              isAccessible
                ? mode === "dark"
                  ? "bg-purple-600/50 text-white hover:bg-purple-600/70"
                  : "bg-purple-500/50 text-white hover:bg-purple-600/70"
                : "bg-gray-500/50 text-gray-400 cursor-not-allowed"
            }`}
          >
            Details
          </motion.button>
        </div>
      </motion.div>

      {(isFeedbackOpen || isDetailsOpen || isFullScreenOpen) && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
            mode === "dark" ? "bg-black/60" : "bg-black/40"
          } backdrop-blur-sm`}
          onClick={closeModal}
        >
          <div
            ref={modalRef}
            className={`relative rounded-2xl p-6 ${
              mode === "dark" ? "bg-gray-800/90" : "bg-white/90"
            } backdrop-blur-lg border ${
              mode === "dark" ? "border-gray-700/50" : "border-gray-200/50"
            } ${
              isFullScreenOpen
                ? "w-full h-full max-w-7xl max-h-[90vh]"
                : "max-w-lg w-full"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className={`absolute top-4 right-4 ${
                mode === "dark"
                  ? "text-gray-400 hover:text-gray-200"
                  : "text-gray-600 hover:text-gray-800"
              } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              aria-label="Close modal"
            >
              <Icon icon="mdi:close" className="w-6 h-6" />
            </button>
            {isFeedbackOpen && (
              <FeedbackModal
                isOpen={isFeedbackOpen}
                mode={mode}
                feedback={intel.feedback || []}
                onClose={closeModal}
              />
            )}
            {isDetailsOpen && (
              <DetailsModal
                mode={mode}
                intel={intel}
                isAccessible={isAccessible}
                onClose={closeModal}
                onFullScreen={() => {
                  setIsDetailsOpen(false);
                  setIsFullScreenOpen(true);
                }}
              />
            )}
            {isFullScreenOpen && (
              <FullScreenChartModal
                mode={mode}
                intel={intel}
                chartData={intel.chart_data}
                isAccessible={isAccessible}
                onClose={closeModal}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}
