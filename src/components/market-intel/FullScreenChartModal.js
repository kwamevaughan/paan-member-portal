import React, { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import FeedbackModal from "@/components/FeedbackModal";
import MarketIntelChart from "./MarketIntelChart";
import { normalizeTier } from "@/components/Badge";

export default function FullScreenChartModal({
  mode,
  intel,
  chartData,
  isAccessible = true,
  onClose,
}) {
  const modalRef = useRef(null);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  // Focus trapping
  useEffect(() => {
    const focusableElements = modalRef.current?.querySelectorAll(
      'button, [tabindex]:not([tabindex="-1"])'
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
  }, [isFeedbackOpen]);

  // Escape key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsFeedbackOpen(false);
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleFeedbackClick = (e) => {
    e.stopPropagation();
    console.log("[FullScreenChartModal] Feedback clicked:", {
      isAccessible,
      intel: intel?.title,
      isFeedbackOpen,
    });
    if (isAccessible) {
      setIsFeedbackOpen(true);
    } else {
      toast.error(
        `This content is restricted to ${normalizeTier(
          intel?.tier_restriction || "Unknown"
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

  console.log("[FullScreenChartModal] Render:", {
    isFeedbackOpen,
    intel: intel?.title,
    isAccessible,
    feedbackCount: intel?.feedback?.length,
  });

  // Defensive checks
  if (!intel || !chartData) {
    console.error("[FullScreenChartModal] Missing intel or chartData:", {
      intel,
      chartData,
    });
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-50 flex items-center justify-center p-0 rounded-3xl backdrop-blur-md`}
      onClick={() => {
        setIsFeedbackOpen(false);
        onClose();
      }}
    >
      <motion.div
        ref={modalRef}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={`relative w-full h-full max-w-7xl max-h-[90vh] rounded-3xl p-8 overflow-hidden ${
          mode === "dark"
            ? "bg-gradient-to-br from-gray-800/95 to-gray-900/95 border-gray-700/50"
            : "bg-gradient-to-br from-white/95 to-gray-100/95 border-gray-200/50"
        } backdrop-blur-xl border shadow-2xl`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className={`text-2xl font-bold mb-6 ${
            mode === "dark" ? "text-white" : "text-gray-800"
          } tracking-tight`}
        >
          {intel.title}
        </motion.h2>

        {/* Chart */}
        <motion.div
          initial={{ scale: 0.98, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="w-full h-[calc(100%-4rem)] rounded-2xl overflow-hidden"
        >
          <MarketIntelChart
            mode={mode}
            chartData={{
              ...chartData,
              options: {
                ...chartData.options,
                chart: {
                  ...chartData.options.chart,
                  height: "100%",
                  animations: {
                    enabled: true,
                    easing: "easeinout",
                    speed: 800,
                  },
                },
              },
            }}
          />
        </motion.div>

        {/* Floating Toolbar */}
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          className={`absolute top-4 right-4 flex gap-2 p-2 rounded-full ${
            mode === "dark"
              ? "bg-gray-900/80 border-gray-700/50"
              : "bg-white/80 border-gray-200/50"
          } border shadow-lg backdrop-blur-md`}
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleFeedbackClick}
            className={`p-2 rounded-full ${
              isAccessible
                ? mode === "dark"
                  ? "bg-indigo-600/50 text-white hover:bg-indigo-600/70"
                  : "bg-indigo-500/50 text-white hover:bg-indigo-500/70"
                : "bg-gray-500/50 text-gray-400 cursor-not-allowed"
            } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            aria-label="Submit feedback for chart"
            disabled={!isAccessible}
          >
            <Icon icon="mdi:comment-outline" className="w-6 h-6" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className={`p-2 rounded-full ${
              mode === "dark"
                ? "bg-gray-700/50 text-gray-200 hover:bg-gray-600/70"
                : "bg-gray-200/50 text-gray-800 hover:bg-gray-300/70"
            } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            aria-label="Close full-screen chart"
          >
            <Icon icon="mdi:close" className="w-6 h-6" />
          </motion.button>
        </motion.div>

        {/* Feedback Modal */}
        {isFeedbackOpen && (
          <div>
            {(() => {
              try {
                return (
                  <FeedbackModal
                    isOpen={isFeedbackOpen}
                    mode={mode}
                    feedback={intel.feedback || []}
                    onClose={() => setIsFeedbackOpen(false)}
                  />
                );
              } catch (error) {
                console.error(
                  "[FullScreenChartModal] FeedbackModal error:",
                  error
                );
                return <div>Error loading feedback modal</div>;
              }
            })()}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
