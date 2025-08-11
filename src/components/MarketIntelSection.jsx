import React, { useState } from "react";
import { createStatsConfig } from "@/utils/statsConfig";
import { hasTierAccess } from "@/utils/tierUtils";
import SectionCard from "./SectionCard";
import MarketIntelItem from "./MarketIntelItem";
import FilterDropdown from "./FilterDropdown";
import { Icon } from "@iconify/react";

const MarketIntelSection = ({
  marketIntel,
  marketIntelLoading,
  marketIntelError,
  marketIntelFilters,
  handleMarketIntelFilterChange,
  marketIntelFilterOptions,
  user,
  handleRestrictedClick,
  mode,
  Icon,
  toast,
  onClick,
}) => {

  const [statsFilter, setStatsFilter] = useState("total");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [itemsToShow, setItemsToShow] = useState(9);

  const statsConfig = createStatsConfig({
    items: marketIntel,
    user,
    hasTierAccess,
    categories: marketIntelFilterOptions.types,
    sectionName: "Market Intelligence",
  });

  const handleStatsFilter = (filter) => {
    setStatsFilter(filter);
    if (filter !== "categories") {
      setSelectedCategory("");
    }
  };

  const renderContent = () => {
    if (marketIntelLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className={`rounded-xl border p-6 animate-pulse ${
                mode === "dark"
                  ? "bg-gray-800/40 border-gray-700/50"
                  : "bg-white/80 border-gray-200/60"
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-lg ${
                    mode === "dark" ? "bg-gray-700" : "bg-gray-200"
                  }`}
                />
                <div
                  className={`w-16 h-6 rounded-full ${
                    mode === "dark" ? "bg-gray-700" : "bg-gray-200"
                  }`}
                />
              </div>
              <div
                className={`h-6 rounded mb-2 ${
                  mode === "dark" ? "bg-gray-700" : "bg-gray-200"
                }`}
              />
              <div
                className={`h-4 rounded w-3/4 mb-4 ${
                  mode === "dark" ? "bg-gray-700" : "bg-gray-200"
                }`}
              />
              <div className="flex justify-between items-center">
                <div
                  className={`h-6 w-20 rounded ${
                    mode === "dark" ? "bg-gray-700" : "bg-gray-200"
                  }`}
                />
                <div
                  className={`h-6 w-6 rounded ${
                    mode === "dark" ? "bg-gray-700" : "bg-gray-200"
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (marketIntelError) {
      return (
        <div className="text-center py-12">
          <div
            className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
              mode === "dark" ? "bg-red-900/20" : "bg-red-50"
            }`}
          >
            <Icon icon="mdi:alert-circle" className="text-2xl text-red-500" />
          </div>
          <h3
            className={`text-lg font-semibold mb-2 ${
              mode === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Something went wrong
          </h3>
          <p className="text-sm text-red-600 dark:text-red-400 max-w-md mx-auto">
            {marketIntelError}
          </p>
        </div>
      );
    }

    if (marketIntel.length === 0) {
      return (
        <div className="text-center py-12">
          <div
            className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
              mode === "dark" ? "bg-gray-800" : "bg-gray-100"
            }`}
          >
            <Icon
              icon="mdi:chart-line"
              className={`text-2xl ${
                mode === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            />
          </div>
          <h3
            className={`text-lg font-semibold mb-2 ${
              mode === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            No market intelligence found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Try adjusting your filters or check back later for new insights.
          </p>
        </div>
      );
    }

    const accessibleIntel = marketIntel.filter((intel) =>
      hasTierAccess(intel.tier_restriction, user)
    );
    const restrictedIntel = marketIntel.filter(
      (intel) => !hasTierAccess(intel.tier_restriction, user)
    );
    const intelByType = marketIntel.reduce((acc, intel) => {
      const type = intel.type || "Other";
      acc[type] = acc[type] || [];
      acc[type].push(intel);
      return acc;
    }, {});

    let filteredIntel = [...marketIntel];
    if (statsFilter === "available") {
      filteredIntel = accessibleIntel;
    } else if (statsFilter === "restricted") {
      filteredIntel = restrictedIntel;
    } else if (statsFilter === "categories" && selectedCategory) {
      filteredIntel = intelByType[selectedCategory] || [];
    }

    // Sort by accessibility and updated_at
    const sortedIntel = filteredIntel.sort((a, b) => {
      const aAccessible = hasTierAccess(a.tier_restriction, user);
      const bAccessible = hasTierAccess(b.tier_restriction, user);
      if (aAccessible !== bAccessible) {
        return aAccessible ? -1 : 1;
      }
      return (
        new Date(b.updated_at || b.created_at) -
        new Date(a.updated_at || a.created_at)
      );
    });

    return (
      <div className="space-y-6">
        <div
          className={`grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-lg ${
            mode === "dark"
              ? "bg-blue-900/20 border border-blue-800/30"
              : "bg-[#e5f3f6] border border-[#84C1D9]"
          }`}
        >
          {statsConfig.map(({ filter, label, count, color }) => (
            <div
              key={filter}
              className={`text-center cursor-pointer p-5 rounded-lg transition-all ${
                statsFilter === filter
                  ? mode === "dark"
                    ? "bg-opacity-30 border"
                    : "bg-opacity-50 border"
                  : ""
              } ${
                mode === "dark"
                  ? "hover:bg-opacity-30 hover:border"
                  : "hover:bg-opacity-50 hover:border"
              }`}
              style={{
                backgroundColor:
                  statsFilter === filter ? `${color}20` : "transparent",
                borderColor: statsFilter === filter ? color : "transparent",
              }}
              onClick={() => handleStatsFilter(filter)}
              role="button"
              tabIndex={0}
              aria-label={`Filter by ${filter} market intelligence`}
              onKeyDown={(e) =>
                e.key === "Enter" && handleStatsFilter(filter)
              }
            >
              <div
                className="text-3xl font-semibold"
                style={{ color: "#f25749" }}
              >
                {count}
              </div>
              <div
                className={`text-sm font-normal ${
                  mode === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {label}
              </div>
            </div>
          ))}
        </div>

        {statsFilter === "categories" && (
          <div className="mb-4">
            <FilterDropdown
              value={selectedCategory}
              onChange={(value) => setSelectedCategory(value)}
              options={[
                { value: "", label: "All Categories" },
                ...Object.keys(intelByType).map((type) => ({
                  value: type,
                  label: type,
                })),
              ]}
              mode={mode}
              ariaLabel="Filter market intelligence by category"
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
          {sortedIntel.slice(0, itemsToShow).map((intel, index) => (
            <div
              key={intel.id}
              className="animate-fade-in-up"
              style={{
                animationDelay: `${index * 50}ms`,
                animationFillMode: "both",
              }}
            >
              <MarketIntelItem
                intel={intel}
                mode={mode}
                Icon={Icon}
                isRestricted={!hasTierAccess(intel.tier_restriction, user)}
                onRestrictedClick={() =>
                  handleRestrictedClick(
                    `Access restricted: ${intel.tier_restriction} tier required for "${intel.title}"`
                  )
                }
                toast={toast}
                onClick={onClick}
              />
            </div>
          ))}
        </div>
        {itemsToShow < sortedIntel.length && (
          <div className="flex justify-center mt-6">
            <button
              className="px-6 py-2 rounded-lg bg-paan-blue text-white hover:bg-paan-dark-blue transition"
              onClick={() => setItemsToShow((prev) => prev + 9)}
            >
              Load More
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <SectionCard
      title="Market Intelligence"
      icon="mdi:chart-line"
      mode={mode}
      headerAction={
        <div className="flex flex-wrap gap-3">
          <FilterDropdown
            value={marketIntelFilters.region || ""}
            onChange={(value) => handleMarketIntelFilterChange("region", value)}
            options={[
              { value: "", label: "All Regions" },
              ...marketIntelFilterOptions.regions
                .filter((r) => r)
                .map((r) => ({ value: r, label: r })),
            ]}
            mode={mode}
            ariaLabel="Filter market intelligence by region"
          />
          <FilterDropdown
            value={marketIntelFilters.type || ""}
            onChange={(value) => handleMarketIntelFilterChange("type", value)}
            options={[
              { value: "", label: "All Types" },
              ...marketIntelFilterOptions.types
                .filter((t) => t)
                .map((t) => ({ value: t, label: t })),
            ]}
            mode={mode}
            ariaLabel="Filter market intelligence by type"
          />
          <FilterDropdown
            value={marketIntelFilters.tier_restriction || ""}
            onChange={(value) =>
              handleMarketIntelFilterChange("tier_restriction", value)
            }
            options={[
              { value: "", label: "All Tiers" },
              ...marketIntelFilterOptions.tier_restrictions
                .filter((t) => t)
                .map((t) => ({ value: t, label: t })),
            ]}
            mode={mode}
            ariaLabel="Filter market intelligence by membership tier"
          />
        </div>
      }
    >
      {renderContent()}
    </SectionCard>
  );
};

export default MarketIntelSection;
