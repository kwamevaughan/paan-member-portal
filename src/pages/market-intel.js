import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/router";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@/hooks/useUser";
import useMarketIntel from "@/hooks/useMarketIntel";
import useLogout from "@/hooks/useLogout";
import HrHeader from "@/layouts/hrHeader";
import HrSidebar from "@/layouts/hrSidebar";
import SimpleFooter from "@/layouts/simpleFooter";
import useSidebar from "@/hooks/useSidebar";
import toast, { Toaster } from "react-hot-toast";
import { tierBadgeStyles, normalizeTier } from "@/components/Badge";
import MarketIntelCard from "@/components/market-intel/MarketIntelCard";

export default function MarketIntel({ mode = "light", toggleMode }) {
  const { isSidebarOpen, toggleSidebar, sidebarState, updateDragOffset } =
    useSidebar();
  const router = useRouter();
  const { user, loading: userLoading, LoadingComponent } = useUser();
  const handleLogout = useLogout();
  const [filters, setFilters] = useState({
    tier_restriction: "all",
    region: "all",
    type: "all",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const memoizedFilters = useMemo(
    () => filters,
    [filters.tier_restriction, filters.region, filters.type]
  );

  const {
    marketIntel,
    filterOptions,
    loading: marketIntelLoading,
    error,
  } = useMarketIntel(
    memoizedFilters,
    searchTerm,
    [],
    user?.selected_tier || "Associate Members"
  );

  useEffect(() => {
    console.log(
      "[MarketIntel] Rendered - User:",
      { id: user?.id, tier: user?.selected_tier },
      "Filters:",
      filters,
      "MarketIntelCount:",
      marketIntel.length
    );
  }, [user, filters, marketIntel]);

  if (userLoading || marketIntelLoading) {
    return LoadingComponent;
  }

  if (!user) {
    console.log("[MarketIntel] No user, redirecting to /login");
    router.push("/login");
    return null;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        Error: {error}
      </div>
    );
  }

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div
      className={`min-h-screen flex flex-col bg-gradient-to-br ${
        mode === "dark"
          ? "from-gray-900 via-indigo-950 to-purple-950"
          : "from-indigo-100 via-purple-100 to-pink-100"
      }`}
    >
      <Toaster
        position="top-center"
        toastOptions={{
          className: `!${
            mode === "dark"
              ? "bg-gray-800/50 text-white"
              : "bg-white/50 text-gray-800"
          } font-medium backdrop-blur-lg`,
          style: {
            borderRadius: "10px",
            padding: "16px",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
          },
        }}
      />
      <HrHeader
        toggleSidebar={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
        sidebarState={sidebarState}
        fullName={user?.name ?? "Member"}
        jobTitle={user.job_type}
        selectedTier={normalizeTier(user?.selected_tier)}
        agencyName={user.agencyName}
        mode={mode}
        toggleMode={toggleMode}
        onLogout={handleLogout}
        pageName="Market Intel"
        pageDescription="Explore cutting-edge market intelligence, regional insights, and interactive visualizations."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Market Intel" }]}
      />
      <div className="flex flex-1">
        <HrSidebar
          isOpen={isSidebarOpen}
          mode={mode}
          toggleMode={toggleMode}
          onLogout={handleLogout}
          toggleSidebar={toggleSidebar}
          setDragOffset={updateDragOffset}
        />
        <div
          className={`flex-1 p-4 md:p-6 lg:p-8 transition-all duration-300 overflow-auto`}
          style={{
            marginLeft: sidebarState.hidden
              ? "0px"
              : `${84 + (isSidebarOpen ? 120 : 0) + sidebarState.offset}px`,
          }}
        >
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className={`relative overflow-hidden rounded-3xl ${
                mode === "dark" ? "bg-gray-800/10" : "bg-white/10"
              } backdrop-blur-lg shadow-lg border ${
                mode === "dark" ? "border-gray-700/50" : "border-gray-200/50"
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 opacity-50" />
              <div className="absolute top-0 right-0 -mt-12 -mr-12 w-48 h-48 bg-indigo-500 rounded-full opacity-20 blur-3xl" />
              <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-48 h-48 bg-purple-500 rounded-full opacity-20 blur-3xl" />
              <div className="relative p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <h1 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
                      Market Intel
                    </h1>
                    <p
                      className={`text-md ${
                        mode === "dark" ? "text-gray-300" : "text-gray-600"
                      } max-w-2xl`}
                    >
                      Discover exclusive insights, reports, and data
                      visualizations tailored to your membership tier.
                    </p>
                  </div>
                  <div className="md:self-end">
                    <div
                      className={`rounded-xl p-4 backdrop-blur-sm ${
                        mode === "dark" ? "bg-gray-700/50" : "bg-gray-50/50"
                      } border ${
                        mode === "dark"
                          ? "border-gray-700/50"
                          : "border-gray-200/50"
                      }`}
                    >
                      <div
                        className={`text-sm font-medium ${
                          mode === "dark" ? "text-gray-400" : "text-gray-500"
                        } mb-2`}
                      >
                        Your Membership Tier
                      </div>
                      <div
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${
                          tierBadgeStyles[normalizeTier(user?.selected_tier)]
                        }`}
                      >
                        <Icon icon="mdi:crown" className="w-5 h-5" />
                        <span className="font-semibold">
                          {normalizeTier(user?.selected_tier)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Filter and Search */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className={`rounded-3xl ${
                mode === "dark" ? "bg-gray-800/10" : "bg-white/10"
              } backdrop-blur-lg p-6 shadow-xl border ${
                mode === "dark" ? "border-gray-700/50" : "border-gray-200/50"
              }`}
            >
              <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                <h2
                  className={`text-2xl font-semibold ${
                    mode === "dark" ? "text-gray-100" : "text-gray-800"
                  }`}
                >
                  Explore Market Intel
                </h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setShowFilters(!showFilters)}
                  className={`px-4 py-2 rounded-lg ${
                    mode === "dark" ? "bg-indigo-600/50" : "bg-indigo-500/50"
                  } text-white shadow-sm hover:bg-indigo-600/70 flex items-center gap-2`}
                >
                  <Icon icon="heroicons:funnel" className="w-5 h-5" />
                  {showFilters ? "Hide Filters" : "Show Filters"}
                </motion.button>
              </div>
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label
                          className={`block text-sm font-medium ${
                            mode === "dark" ? "text-gray-400" : "text-gray-600"
                          } mb-2`}
                        >
                          Search
                        </label>
                        <div className="relative">
                          <Icon
                            icon="heroicons:magnifying-glass"
                            className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                              mode === "dark"
                                ? "text-gray-400"
                                : "text-gray-500"
                            }`}
                          />
                          <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by title..."
                            className={`w-full pl-10 pr-4 py-2 rounded-lg ${
                              mode === "dark"
                                ? "bg-gray-700/50 text-gray-200 border-gray-600/50"
                                : "bg-gray-100/50 text-gray-800 border-gray-200/50"
                            } border focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                          />
                        </div>
                      </div>
                      <div>
                        <label
                          className={`block text-sm font-medium ${
                            mode === "dark" ? "text-gray-400" : "text-gray-600"
                          } mb-2`}
                        >
                          Tier
                        </label>
                        <select
                          value={filters.tier_restriction}
                          onChange={(e) =>
                            handleFilterChange(
                              "tier_restriction",
                              e.target.value
                            )
                          }
                          className={`w-full px-4 py-2 rounded-lg ${
                            mode === "dark"
                              ? "bg-gray-700/50 text-gray-200 border-gray-600/50"
                              : "bg-gray-100/50 text-gray-800 border-gray-200/50"
                          } border focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                        >
                          {filterOptions.tier_restrictions.map((tier) => (
                            <option key={tier} value={tier}>
                              {tier === "all" ? "All Accessible Tiers" : tier}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label
                          className={`block text-sm font-medium ${
                            mode === "dark" ? "text-gray-400" : "text-gray-600"
                          } mb-2`}
                        >
                          Region
                        </label>
                        <select
                          value={filters.region}
                          onChange={(e) =>
                            handleFilterChange("region", e.target.value)
                          }
                          className={`w-full px-4 py-2 rounded-lg ${
                            mode === "dark"
                              ? "bg-gray-700/50 text-gray-200 border-gray-600/50"
                              : "bg-gray-100/50 text-gray-800 border-gray-200/50"
                          } border focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                        >
                          {filterOptions.regions.map((region) => (
                            <option key={region} value={region}>
                              {region === "all" ? "All Regions" : region}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label
                          className={`block text-sm font-medium ${
                            mode === "dark" ? "text-gray-400" : "text-gray-600"
                          } mb-2`}
                        >
                          Type
                        </label>
                        <select
                          value={filters.type}
                          onChange={(e) =>
                            handleFilterChange("type", e.target.value)
                          }
                          className={`w-full px-4 py-2 rounded-lg ${
                            mode === "dark"
                              ? "bg-gray-700/50 text-gray-200 border-gray-600/50"
                              : "bg-gray-100/50 text-gray-800 border-gray-200/50"
                          } border focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                        >
                          {filterOptions.types.map((type) => (
                            <option key={type} value={type}>
                              {type === "all" ? "All Types" : type}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Market Intel Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="space-y-6"
            >
              {marketIntel.length === 0 ? (
                <div className="text-center py-12">
                  <Icon
                    icon="heroicons:document-text"
                    className={`w-20 h-20 ${
                      mode === "dark" ? "text-indigo-400" : "text-indigo-500"
                    } mx-auto`}
                  />
                  <p
                    className={`mt-4 text-lg ${
                      mode === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    No market intel entries found. Try adjusting your filters.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {marketIntel.map((intel) => (
                    <MarketIntelCard
                      key={intel.id}
                      mode={mode}
                      intel={intel}
                      isAccessible={intel.isAccessible}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </div>
          <SimpleFooter mode={mode} isSidebarOpen={isSidebarOpen} />
        </div>
      </div>
    </div>
  );
}
