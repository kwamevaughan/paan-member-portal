// pages/business-opportunities.js
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useUser } from "@/hooks/useUser";
import { useBusinessOpportunities } from "@/hooks/useBusinessOpportunities";
import useLogout from "@/hooks/useLogout";
import HrHeader from "@/layouts/hrHeader";
import HrSidebar from "@/layouts/hrSidebar";
import SimpleFooter from "@/layouts/simpleFooter";
import useSidebar from "@/hooks/useSidebar";
import toast, { Toaster } from "react-hot-toast";
import { TierBadge } from "@/components/Badge";

export default function BusinessOpportunities({ mode = "light", toggleMode }) {
  const { isSidebarOpen, toggleSidebar, sidebarState, updateDragOffset } =
    useSidebar();
  const router = useRouter();
  const { user, loading: userLoading, LoadingComponent } = useUser();
  const { handleLogout } = useLogout();
  const [filters, setFilters] = useState({
    country: "",
    serviceType: "",
    industry: "",
    projectType: "",
    tier: "",
  });

  const [activeTab, setActiveTab] = useState("all");
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  const {
    opportunities,
    filterOptions,
    loading: opportunitiesLoading,
    error,
  } = useBusinessOpportunities(filters);

  
  // Global error handler
  useEffect(() => {
    const handleError = (event) => {
      console.error("Global error:", event.error);
    };
    window.addEventListener("error", handleError);
    return () => window.removeEventListener("error", handleError);
  }, []);

  const handleFilterChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleResetFilters = (e) => {
    e.preventDefault();
    setFilters({
      country: "",
      serviceType: "",
      industry: "",
      projectType: "",
      tier: "",
    });
  };

  const canAccessOpportunity = (opportunityTier) => {
    const tiers = [
      "Associate Member (Tier 1)",
      "Full Member (Tier 2)",
      "Gold Member (Tier 3)",
      "Free Member (Tier 4)",
    ];
    const userTier = user?.selected_tier || "Free Member (Tier 4)";
    const userTierIndex = tiers.indexOf(userTier);
    const oppTierIndex = tiers.indexOf(opportunityTier);
    return userTierIndex >= oppTierIndex;
  };

  const handleExpressInterest = (opportunity) => {
    if (!canAccessOpportunity(opportunity.tier)) {
      toast.error(
        `This opportunity is available to ${opportunity.tier} Members only. Consider upgrading your membership to unlock this opportunity.`
      );
      return;
    }
    toast.success(`Interest expressed for ${opportunity.title}!`);
    // Implement application logic here
  };

  const filteredByTab =
    activeTab === "all"
      ? opportunities
      : opportunities.filter((opp) => {
          if (activeTab === "accessible") return canAccessOpportunity(opp.tier);
          if (activeTab === "trending") return opp.trending;
          if (activeTab === "deadlineSoon") {
            // Example logic for deadline soon - within the next 7 days
            const deadlineDate = new Date(opp.deadline);
            const today = new Date();
            const diffTime = deadlineDate - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays <= 7 && diffDays >= 0;
          }
          return true;
        });

  if (userLoading || opportunitiesLoading) {
    
    return LoadingComponent;
  }

  if (!user) {
    console.log("No user, returning null");
    return null;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        Error: {error}
      </div>
    );
  }

  

  return (
    <div
      className={`min-h-screen flex flex-col ${
        mode === "dark"
          ? "bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-white"
          : "bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900"
      }`}
    >
      <Toaster
        position="top-center"
        toastOptions={{
          className:
            "!bg-white !text-gray-800 dark:!bg-gray-800 dark:!text-white font-medium",
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
        selectedTier={user?.selected_tier}
        agencyName={user.agencyName}
        mode={mode}
        toggleMode={toggleMode}
        onLogout={handleLogout}
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
          className={`content-container flex-1 p-4 md:p-6 lg:p-8 transition-all duration-300 overflow-hidden ${
            isSidebarOpen ? "sidebar-open" : ""
          } ${sidebarState.hidden ? "sidebar-hidden" : ""}`}
          style={{
            marginLeft: sidebarState.hidden
              ? "0px"
              : `${84 + (isSidebarOpen ? 120 : 0) + sidebarState.offset}px`,
          }}
        >
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Hero Section */}
            <div
              className={`relative overflow-hidden rounded-3xl ${
                mode === "dark" ? "bg-gray-800" : "bg-white"
              } shadow-lg`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-40"></div>
              <div className="absolute top-0 right-0 -mt-12 -mr-12 w-40 h-40 bg-blue-500 rounded-full opacity-20 blur-3xl"></div>
              <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-40 h-40 bg-purple-500 rounded-full opacity-20 blur-3xl"></div>

              <div className="relative p-8 md:p-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                      Business Opportunities
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 max-w-2xl">
                      Discover and connect with premium business leads tailored
                      to your expertise and membership tier.
                    </p>
                  </div>

                  <div className="md:self-end">
                    <div
                      className={`rounded-xl p-3 backdrop-blur-sm ${
                        mode === "dark" ? "bg-gray-700/50" : "bg-gray-50/50"
                      } border border-gray-200 dark:border-gray-700`}
                    >
                      <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Your current tier
                      </div>
                      <div
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${(
                          <TierBadge tier={user?.selected_tier} mode={mode} />
                        )}`}
                      >
                        <span className="iconify" data-icon="mdi:crown"></span>
                        <span className="font-semibold">
                          {user?.selected_tier || "Free Member (Tier 4)"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs and Filters */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Category Tabs */}
              <div className="flex overflow-x-auto no-scrollbar gap-2 pb-2">
                {[
                  {
                    id: "all",
                    label: "All Opportunities",
                    icon: "mdi:view-grid",
                  },
                  {
                    id: "accessible",
                    label: "For Your Tier",
                    icon: "mdi:shield-check",
                  },
                  {
                    id: "trending",
                    label: "Trending",
                    icon: "mdi:trending-up",
                  },
                  {
                    id: "deadlineSoon",
                    label: "Closing Soon",
                    icon: "mdi:clock-fast",
                  },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 rounded-full whitespace-nowrap flex items-center gap-2 transition-all ${
                      activeTab === tab.id
                        ? "bg-blue-600 text-white font-medium shadow-md"
                        : `${
                            mode === "dark"
                              ? "bg-gray-800 hover:bg-gray-700"
                              : "bg-white hover:bg-gray-100"
                          } shadow-sm`
                    }`}
                  >
                    <span className="iconify" data-icon={tab.icon}></span>
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Filter Button */}
              <button
                onClick={() => setShowFilterPanel(!showFilterPanel)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition ${
                  mode === "dark"
                    ? "bg-gray-800 hover:bg-gray-700"
                    : "bg-white hover:bg-gray-100"
                } ${showFilterPanel ? "ring-2 ring-blue-500" : ""} shadow-sm`}
              >
                <span className="iconify" data-icon="mdi:filter-variant"></span>
                <span>Filters</span>
                {Object.values(filters).some((val) => val !== "") && (
                  <span className="flex items-center justify-center w-5 h-5 text-xs font-medium rounded-full bg-blue-600 text-white">
                    {Object.values(filters).filter((val) => val !== "").length}
                  </span>
                )}
              </button>
            </div>

            {/* Filters Panel */}
            {showFilterPanel && (
              <div
                className={`rounded-2xl shadow-lg overflow-hidden transition-all ${
                  mode === "dark"
                    ? "bg-gray-800 border border-gray-700"
                    : "bg-white"
                }`}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-lg font-semibold">
                      <span
                        className="iconify text-blue-500"
                        data-icon="mdi:filter-variant"
                      ></span>
                      <span>Refine Your Search</span>
                    </div>
                    <button
                      onClick={handleResetFilters}
                      className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500 transition"
                    >
                      <span className="iconify" data-icon="mdi:restart"></span>
                      Reset All
                    </button>
                  </div>

                  <form
                    onSubmit={(e) => e.preventDefault()}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4"
                  >
                    {[
                      { key: "country", icon: "mdi:earth", label: "Country" },
                      {
                        key: "serviceType",
                        icon: "mdi:cog-outline",
                        label: "Service Type",
                      },
                      {
                        key: "industry",
                        icon: "mdi:domain",
                        label: "Industry",
                      },
                      {
                        key: "projectType",
                        icon: "mdi:folder-outline",
                        label: "Project Type",
                      },
                      { key: "tier", icon: "mdi:crown-outline", label: "Tier" },
                    ].map(({ key, icon, label }) => (
                      <div key={key} className="space-y-1">
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center gap-1.5">
                          <span className="iconify" data-icon={icon}></span>
                          {label}
                        </label>
                        <select
                          name={key}
                          value={filters[key]}
                          onChange={handleFilterChange}
                          className={`w-full p-2.5 rounded-lg border ${
                            mode === "dark"
                              ? "bg-gray-700 border-gray-600 text-white"
                              : "bg-white border-gray-200 text-gray-800"
                          } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                        >
                          <option value="">All {label}s</option>
                          {(filterOptions[`${key}s`] || []).map((val, idx) => (
                            <option key={`${val}-${idx}`} value={val}>
                              {val}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </form>
                </div>
              </div>
            )}

            {/* Opportunity Count */}
            <div className="flex justify-between items-center">
              <div
                className={`px-4 py-2 rounded-lg ${
                  mode === "dark" ? "bg-gray-800" : "bg-white"
                } shadow-sm`}
              >
                <span className="font-semibold">{filteredByTab.length}</span>
                <span className="text-gray-600 dark:text-gray-400">
                  {" "}
                  opportunities found
                </span>
              </div>

              <div className="text-sm text-gray-500 dark:text-gray-400">
                Showing {Math.min(12, filteredByTab.length)} of{" "}
                {filteredByTab.length}
              </div>
            </div>

            {/* Opportunities Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredByTab.map((opp) => (
                <div
                  key={opp.id}
                  className={`group rounded-2xl overflow-hidden border shadow-sm hover:shadow-xl transition-all duration-300 ${
                    mode === "dark"
                      ? "bg-gray-800 border-gray-700 hover:border-gray-600"
                      : "bg-white border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="relative h-40 bg-gradient-to-r from-blue-400 to-indigo-600 overflow-hidden">
                    <div className="absolute inset-0 opacity-20 bg-pattern"></div>
                    <div className="absolute top-0 right-0 p-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                          opp.tier.includes("Associate")
                            ? "bg-blue-600 text-white"
                            : opp.tier.includes("Full")
                            ? "bg-emerald-600 text-white"
                            : "bg-amber-600 text-white"
                        }`}
                      >
                        <span
                          className="iconify"
                          data-icon={
                            opp.tier.includes("Associate")
                              ? "mdi:crown"
                              : opp.tier.includes("Full")
                              ? "mdi:check-decagram"
                              : "mdi:star"
                          }
                        ></span>
                        {opp.tier.split("(")[0].trim()}
                      </span>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                      <div className="flex items-center gap-2 text-white font-semibold">
                        <span
                          className="iconify"
                          data-icon="mdi:map-marker"
                        ></span>
                        {opp.location}
                      </div>
                    </div>
                  </div>

                  <div className="p-5 space-y-4">
                    <div>
                      <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {opp.title}
                      </h3>
                      <p
                        className={`text-sm ${
                          mode === "dark" ? "text-gray-300" : "text-gray-600"
                        } line-clamp-3`}
                      >
                        {opp.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div
                        className={`rounded-lg p-3 ${
                          mode === "dark" ? "bg-gray-700/60" : "bg-gray-50"
                        }`}
                      >
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          Industry
                        </div>
                        <div className="font-medium truncate">
                          {opp.industry || "Multiple Industries"}
                        </div>
                      </div>

                      <div
                        className={`rounded-lg p-3 ${
                          mode === "dark" ? "bg-gray-700/60" : "bg-gray-50"
                        }`}
                      >
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          Deadline
                        </div>
                        <div className="font-medium flex items-center gap-1.5">
                          <span
                            className="iconify text-red-500"
                            data-icon="mdi:calendar-clock"
                          ></span>
                          {opp.deadline}
                        </div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={() => {
                          if (!canAccessOpportunity(opp.tier)) {
                            toast.error(
                              `This opportunity is available to ${opp.tier} Members only. Consider upgrading your membership to unlock this opportunity.`
                            );
                            return;
                          }
                          handleExpressInterest(opp);
                        }}
                        className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                          canAccessOpportunity(opp.tier)
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        Express Interest
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* No Opportunities Found */}
            {filteredByTab.length === 0 && (
              <div
                className={`text-center py-12 rounded-2xl ${
                  mode === "dark" ? "bg-gray-800" : "bg-white"
                } shadow-sm border dark:border-gray-700`}
              >
                <div
                  className="iconify inline-block text-5xl text-gray-400 mb-4"
                  data-icon="mdi:magnify"
                ></div>
                <h3 className="text-xl font-semibold mb-2">
                  No Opportunities Found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                  No opportunities match your current filters. Try adjusting
                  your search criteria or check back later for new listings.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {filteredByTab.length > 12 && (
              <div className="flex justify-center mt-8">
                <div className="flex items-center space-x-2">
                  <button
                    className={`w-10 h-10 flex items-center justify-center rounded-lg ${
                      mode === "dark"
                        ? "bg-gray-800 hover:bg-gray-700"
                        : "bg-white hover:bg-gray-100"
                    } border dark:border-gray-700 shadow-sm`}
                  >
                    <span
                      className="iconify"
                      data-icon="mdi:chevron-left"
                    ></span>
                  </button>

                  {[1, 2, 3].map((num) => (
                    <button
                      key={num}
                      className={`w-10 h-10 flex items-center justify-center rounded-lg font-medium ${
                        num === 1
                          ? "bg-blue-600 text-white"
                          : `${
                              mode === "dark"
                                ? "bg-gray-800 hover:bg-gray-700"
                                : "bg-white hover:bg-gray-100"
                            } border dark:border-gray-700`
                      } shadow-sm`}
                    >
                      {num}
                    </button>
                  ))}

                  <button
                    className={`w-10 h-10 flex items-center justify-center rounded-lg ${
                      mode === "dark"
                        ? "bg-gray-800 hover:bg-gray-700"
                        : "bg-white hover:bg-gray-100"
                    } border dark:border-gray-700 shadow-sm`}
                  >
                    <span
                      className="iconify"
                      data-icon="mdi:chevron-right"
                    ></span>
                  </button>
                </div>
              </div>
            )}
          </div>
          <SimpleFooter mode={mode} isSidebarOpen={isSidebarOpen} />
        </div>
      </div>
    </div>
  );
}
