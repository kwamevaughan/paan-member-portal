import React, { useState } from "react";
import SectionCard from "./SectionCard";
import OpportunityCard from "./OpportunityCard";
import FilterDropdown from "./FilterDropdown";
import { hasTierAccess } from "@/utils/tierUtils";
import { TierBadge } from "./Badge";

const OpportunitiesSection = ({
  opportunities,
  opportunitiesLoading,
  opportunitiesError,
  opportunityFilters,
  handleOpportunityFilterChange,
  opportunityFilterOptions,
  user,
  handleRestrictedClick,
  mode,
  Icon,
}) => {
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [statsFilter, setStatsFilter] = useState("total"); // Track selected stat filter
  const [selectedCategory, setSelectedCategory] = useState(""); // Track selected category for "Categories" filter

  const handleStatsFilter = (filter) => {
    setStatsFilter(filter);
    if (filter !== "categories") {
      setSelectedCategory(""); // Reset category selection unless "categories" is clicked
    }
  };

  const renderLoadingState = () => (
    <div className="space-y-4">
      {/* Loading skeleton */}
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className={`animate-pulse rounded-2xl p-6 ${
            mode === "dark" ? "bg-gray-800/50" : "bg-gray-100"
          }`}
        >
          <div className="flex items-start justify-between mb-4">
            <div
              className={`w-16 h-16 rounded-xl ${
                mode === "dark" ? "bg-gray-700" : "bg-gray-200"
              }`}
            />
            <div
              className={`w-20 h-6 rounded-full ${
                mode === "dark" ? "bg-gray-700" : "bg-gray-200"
              }`}
            />
          </div>
          <div className="space-y-3">
            <div
              className={`h-6 rounded-lg ${
                mode === "dark" ? "bg-gray-700" : "bg-gray-200"
              }`}
              style={{ width: "70%" }}
            />
            <div
              className={`h-4 rounded ${
                mode === "dark" ? "bg-gray-700" : "bg-gray-200"
              }`}
              style={{ width: "50%" }}
            />
            <div
              className={`h-4 rounded ${
                mode === "dark" ? "bg-gray-700" : "bg-gray-200"
              }`}
              style={{ width: "60%" }}
            />
          </div>
        </div>
      ))}
    </div>
  );

  const renderErrorState = () => (
    <div
      className={`text-center py-12 rounded-2xl ${
        mode === "dark"
          ? "bg-gradient-to-br from-red-900/20 to-red-800/10 border border-red-800/30"
          : "bg-gradient-to-br from-red-50 to-red-100/50 border border-red-200"
      }`}
    >
      <div
        className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
          mode === "dark"
            ? "bg-red-900/50 text-red-400"
            : "bg-red-100 text-red-600"
        }`}
      >
        <Icon icon="mdi:alert-circle-outline" className="text-2xl" />
      </div>
      <h3
        className={`text-lg font-medium ${
          mode === "dark" ? "text-red-400" : "text-red-600"
        }`}
      >
        Unable to Load Opportunities
      </h3>
      <p
        className={`text-sm ${
          mode === "dark" ? "text-red-300/80" : "text-red-600/80"
        }`}
      >
        {opportunitiesError}
      </p>
    </div>
  );

  const renderEmptyState = () => (
    <div
      className={`text-center py-16 rounded-2xl ${
        mode === "dark"
          ? "bg-gradient-to-br from-gray-800/30 to-gray-900/20 border border-gray-700/30"
          : "bg-gradient-to-br from-gray-50 to-white border border-gray-200/50"
      }`}
    >
      <div
        className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${
          mode === "dark"
            ? "bg-gray-700/50 text-gray-400"
            : "bg-gray-100 text-gray-500"
        }`}
      >
        <Icon icon="mdi:briefcase-outline" className="text-3xl" />
      </div>
      <h3
        className={`text-xl font-medium ${
          mode === "dark" ? "text-gray-300" : "text-gray-700"
        }`}
      >
        No Opportunities Available
      </h3>
      <p
        className={`text-sm ${
          mode === "dark" ? "text-gray-400" : "text-gray-500"
        }`}
      >
        Check back later for new business opportunities
      </p>
    </div>
  );

  const renderOpportunities = () => {
    // Calculate access statistics
    const accessibleOpportunities = opportunities.filter((opportunity) =>
      hasTierAccess(
        opportunity.tier_restriction,
        user || { selected_tier: "Free Member" }
      )
    );
    const restrictedOpportunities = opportunities.filter(
      (opportunity) =>
        !hasTierAccess(
          opportunity.tier_restriction,
          user || { selected_tier: "Free Member" }
        )
    );

    // Group opportunities by type for categories
    const opportunitiesByType = opportunities.reduce((acc, opportunity) => {
      const type = opportunity.opportunity_type || "Uncategorized";
      if (!acc[type]) acc[type] = [];
      acc[type].push(opportunity);
      return acc;
    }, {});

    // Filter opportunities based on statsFilter
    let filteredOpportunities = [...opportunities];
    if (statsFilter === "available") {
      filteredOpportunities = accessibleOpportunities;
    } else if (statsFilter === "restricted") {
      filteredOpportunities = restrictedOpportunities;
    } else if (statsFilter === "categories" && selectedCategory) {
      filteredOpportunities = opportunitiesByType[selectedCategory] || [];
    }

    // Sort filtered opportunities: accessible ones first, then by title
    const sortedOpportunities = filteredOpportunities.sort((a, b) => {
      const aAccessible = hasTierAccess(
        a.tier_restriction,
        user || { selected_tier: "Free Member" }
      );
      const bAccessible = hasTierAccess(
        b.tier_restriction,
        user || { selected_tier: "Free Member" }
      );

      if (aAccessible === bAccessible) {
        return a.title.localeCompare(b.title);
      }
      return aAccessible ? -1 : 1;
    });

    const gridClass =
      viewMode === "grid"
        ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
        : "space-y-4";

    return (
      <div className="space-y-6">
        {/* Stats dashboard */}
        <div
          className={`grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl ${
            mode === "dark"
              ? "bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-800/30"
              : "bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200/50"
          }`}
        >
          <div
            className={`text-center cursor-pointer p-2 rounded-lg transition-all duration-200 ${
              statsFilter === "total"
                ? mode === "dark"
                  ? "bg-blue-900/30 border border-blue-700"
                  : "bg-blue-100/50 border border-blue-300"
                : ""
            } ${
              mode === "dark"
                ? "hover:bg-blue-900/30 hover:border hover:border-blue-700"
                : "hover:bg-blue-100/50 hover:border hover:border-blue-300"
            }`}
            onClick={() => handleStatsFilter("total")}
            role="button"
            tabIndex={0}
            aria-label="Filter by total opportunities"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleStatsFilter("total");
              }
            }}
          >
            <div
              className={`text-3xl font-bold ${
                mode === "dark" ? "text-blue-400" : "text-blue-600"
              }`}
            >
              {opportunities.length}
            </div>
            <div
              className={`text-sm font-medium ${
                mode === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Total Opportunities
            </div>
          </div>
          <div
            className={`text-center cursor-pointer p-2 rounded-lg transition-all duration-200 ${
              statsFilter === "available"
                ? mode === "dark"
                  ? "bg-green-900/30 border border-green-700"
                  : "bg-green-100/50 border border-green-300"
                : ""
            } ${
              mode === "dark"
                ? "hover:bg-green-900/30 hover:border hover:border-green-700"
                : "hover:bg-green-100/50 hover:border hover:border-green-300"
            }`}
            onClick={() => handleStatsFilter("available")}
            role="button"
            tabIndex={0}
            aria-label="Filter by available opportunities"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleStatsFilter("available");
              }
            }}
          >
            <div
              className={`text-3xl font-bold ${
                mode === "dark" ? "text-green-400" : "text-green-600"
              }`}
            >
              {accessibleOpportunities.length}
            </div>
            <div
              className={`text-sm font-medium ${
                mode === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Available
            </div>
          </div>
          <div
            className={`text-center cursor-pointer p-2 rounded-lg transition-all duration-200 ${
              statsFilter === "restricted"
                ? mode === "dark"
                  ? "bg-orange-900/30 border border-orange-700"
                  : "bg-orange-100/50 border border-orange-300"
                : ""
            } ${
              mode === "dark"
                ? "hover:bg-orange-900/30 hover:border hover:border-orange-700"
                : "hover:bg-orange-100/50 hover:border hover:border-orange-300"
            }`}
            onClick={() => handleStatsFilter("restricted")}
            role="button"
            tabIndex={0}
            aria-label="Filter by restricted opportunities"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleStatsFilter("restricted");
              }
            }}
          >
            <div
              className={`text-3xl font-bold ${
                mode === "dark" ? "text-orange-400" : "text-orange-600"
              }`}
            >
              {restrictedOpportunities.length}
            </div>
            <div
              className={`text-sm font-medium ${
                mode === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Restricted
            </div>
          </div>
          <div
            className={`text-center cursor-pointer p-2 rounded-lg transition-all duration-200 ${
              statsFilter === "categories"
                ? mode === "dark"
                  ? "bg-purple-900/30 border border-purple-700"
                  : "bg-purple-100/50 border border-purple-300"
                : ""
            } ${
              mode === "dark"
                ? "hover:bg-purple-900/30 hover:border hover:border-purple-700"
                : "hover:bg-purple-100/50 hover:border hover:border-purple-300"
            }`}
            onClick={() => handleStatsFilter("categories")}
            role="button"
            tabIndex={0}
            aria-label="Filter by opportunity categories"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleStatsFilter("categories");
              }
            }}
          >
            <div
              className={`text-3xl font-bold ${
                mode === "dark" ? "text-purple-400" : "text-purple-600"
              }`}
            >
              {Object.keys(opportunitiesByType).length}
            </div>
            <div
              className={`text-sm font-medium ${
                mode === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Categories
            </div>
          </div>
        </div>

        {/* Category dropdown when "Categories" is selected */}
        {statsFilter === "categories" && (
          <div className="mb-4">
            <FilterDropdown
              value={selectedCategory}
              onChange={(value) => setSelectedCategory(value)}
              options={[
                { value: "", label: "All Categories" },
                ...Object.keys(opportunitiesByType).map((type) => ({
                  value: type,
                  label: type,
                })),
              ]}
              mode={mode}
              ariaLabel="Filter opportunities by category"
            />
          </div>
        )}

        {/* Opportunities list */}
        <div className={gridClass}>
          {sortedOpportunities.map((opportunity, index) => (
            <div
              key={opportunity.id}
              className="animate-fade-in-up"
              style={{
                animationDelay: `${index * 50}ms`,
                animationFillMode: "both",
              }}
            >
              <OpportunityCard
                opportunity={opportunity}
                mode={mode}
                TierBadge={TierBadge}
                isRestricted={
                  !hasTierAccess(
                    opportunity.tier_restriction,
                    user || { selected_tier: "Free Member" }
                  )
                }
                onRestrictedClick={() =>
                  handleRestrictedClick(
                    `Access restricted: ${opportunity.tier_restriction} tier required for "${opportunity.title}"`
                  )
                }
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (opportunitiesLoading) return renderLoadingState();
    if (opportunitiesError) return renderErrorState();
    if (opportunities.length === 0) return renderEmptyState();
    return renderOpportunities();
  };

  return (
    <SectionCard
      title="Business Opportunities"
      icon="mdi:briefcase"
      mode={mode}
      headerAction={
        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <FilterDropdown
              value={opportunityFilters.country || ""}
              onChange={(value) =>
                handleOpportunityFilterChange("country", value)
              }
              options={[
                { value: "", label: "All Countries" },
                ...opportunityFilterOptions.countries
                  .filter((c) => c !== "all")
                  .map((c) => ({
                    value: c,
                    label: c,
                  })),
              ]}
              mode={mode}
              ariaLabel="Filter opportunities by country"
            />
          </div>
          <div className="relative">
            <FilterDropdown
              value={opportunityFilters.serviceType || ""}
              onChange={(value) =>
                handleOpportunityFilterChange("serviceType", value)
              }
              options={[
                { value: "", label: "All Service Types" },
                ...opportunityFilterOptions.serviceTypes
                  .filter((s) => s !== "all")
                  .map((s) => ({
                    value: s,
                    label: s,
                  })),
              ]}
              mode={mode}
              ariaLabel="Filter opportunities by service type"
            />
          </div>
          <div className="relative">
            <FilterDropdown
              value={opportunityFilters.tier_restriction || ""}
              onChange={(value) =>
                handleOpportunityFilterChange("tier_restriction", value)
              }
              options={[
                { value: "", label: "All Tiers" },
                ...opportunityFilterOptions.tiers
                  .filter((t) => t !== "all")
                  .map((tier) => ({
                    value: tier,
                    label: tier,
                  })),
              ]}
              mode={mode}
              ariaLabel="Filter opportunities by membership tier"
            />
          </div>
        </div>
      }
    >
      {renderContent()}
    </SectionCard>
  );
};

export default OpportunitiesSection;
