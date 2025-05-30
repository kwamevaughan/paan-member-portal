import { useState, useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";

export default function OffersFilters({
  filterTerm,
  setFilterTerm,
  filterType,
  setFilterType,
  showFilters,
  setShowFilters,
  mode,
}) {
  const isDark = mode === "dark";
  const bgColor = isDark ? "bg-gray-900/50" : "bg-white/50";
  const textColor = isDark ? "text-white" : "text-gray-900";
  const inputBg = isDark ? "bg-gray-800/50" : "bg-white/80";
  const filterRef = useRef(null);

  // Debounce search input
  const [localFilterTerm, setLocalFilterTerm] = useState(filterTerm);
  useEffect(() => {
    const handler = setTimeout(() => {
      setFilterTerm(localFilterTerm);
    }, 300);
    return () => clearTimeout(handler);
  }, [localFilterTerm, setFilterTerm]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilters(false);
      }
    };

    if (showFilters) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showFilters, setShowFilters]);

  // Prevent Enter key from submitting
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.1 }}
        onClick={() => setShowFilters(!showFilters)}
        className={`fixed right-6 top-28 z-20 px-4 py-2 rounded-full ${
          isDark ? "bg-indigo-700" : "bg-indigo-600"
        } text-white flex items-center shadow-lg`}
      >
        <Icon icon="heroicons:filter" className="w-5 h-5 mr-2" />
        {showFilters ? "Close Filters" : "Filters"}
      </motion.button>
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/30 backdrop-blur-sm"
          >
            <motion.div
              ref={filterRef}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={`fixed right-0 top-0 h-full w-80 ${bgColor} backdrop-blur-lg shadow-2xl p-6 z-50`}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className={`text-xl font-semibold ${textColor}`}>
                  Filter Offers
                </h3>
                <motion.button
                  whileHover={{ scale: 1.2, rotate: 90 }}
                  onClick={() => setShowFilters(false)}
                  className={`p-2 rounded-full ${
                    isDark ? "bg-gray-700" : "bg-gray-200"
                  } ${textColor} hover:bg-${isDark ? "gray-600" : "gray-300"}`}
                >
                  <Icon icon="heroicons:x-mark" className="w-5 h-5" />
                </motion.button>
              </div>
              <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                <div>
                  <label className={`block text-sm ${textColor} mb-2`}>
                    Search
                  </label>
                  <input
                    type="text"
                    value={localFilterTerm}
                    onChange={(e) => setLocalFilterTerm(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className={`w-full px-4 py-3 rounded-xl ${inputBg} ${textColor} border border-transparent focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 backdrop-blur-sm`}
                    placeholder="Search by title or description"
                  />
                </div>
                <div>
                  <label className={`block text-sm ${textColor} mb-2`}>
                    Tier
                  </label>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl ${inputBg} ${textColor} border border-transparent focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 backdrop-blur-sm`}
                  >
                    <option value="all">All Tiers</option>
                    <option value="Associate Member">Associate Member</option>
                    <option value="Full Member">Full Member</option>
                    <option value="Gold Member">Gold Member</option>
                    <option value="Free Member">Free Member</option>
                  </select>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
