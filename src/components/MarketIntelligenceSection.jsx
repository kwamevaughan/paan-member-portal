import React, { useState } from "react";
import { createStatsConfig } from "@/utils/statsConfig";
import { hasTierAccess } from "@/utils/tierUtils";
import SectionCard from "./SectionCard";
import MarketIntelItem from "./MarketIntelItem";
import FilterDropdown from "./FilterDropdown";
import { Icon } from "@iconify/react";

const MarketIntelligenceSection = ({
  marketIntel = [],
  marketIntelLoading,
  marketIntelError,
  marketIntelFilters,
  handleMarketIntelFilterChange,
  marketIntelFilterOptions,
  user,
  handleRestrictedClick,
  mode,
  Icon,
}) => {
  const [statsFilter, setStatsFilter] = useState("total");
  const [selectedIntel, setSelectedIntel] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  const statsConfig = createStatsConfig({
    items: marketIntel,
    user,
    hasTierAccess,
    categories: marketIntelFilterOptions.intelTypes,
    sectionName: "Market Intelligence",
  });

  const handleStatsFilter = (filter) => {
    setStatsFilter(filter);
  };

  const handleViewIntelligence = (item) => {
    if (item.url) window.open(item.url, "_blank");
  };

  const renderContent = () => {
    if (marketIntelLoading) {
      return (
        <div className="space-y-4">
          {/* Loading skeleton */}
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`animate-pulse rounded-2xl p-6 ${
                mode === "dark" ? "bg-gray-800/50" : "bg-gray-100"
              }`}
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`w-14 h-14 rounded-2xl ${
                    mode === "dark" ? "bg-gray-700" : "bg-gray-200"
                  }`}
                />
                <div className="flex-1 space-y-3">
                  <div
                    className={`h-5 rounded-lg ${
                      mode === "dark" ? "bg-gray-700" : "bg-gray-200"
                    }`}
                    style={{ width: "60%" }}
                  />
                  <div className="flex space-x-2">
                    <div
                      className={`h-4 rounded-full ${
                        mode === "dark" ? "bg-gray-700" : "bg-gray-200"
                      }`}
                      style={{ width: "80px" }}
                    />
                    <div
                      className={`h-4 rounded-full ${
                        mode === "dark" ? "bg-gray-700" : "bg-gray-200"
                      }`}
                      style={{ width: "100px" }}
                    />
                  </div>
                  <div
                    className={`h-3 rounded ${
                      mode === "dark" ? "bg-gray-700" : "bg-gray-200"
                    }`}
                    style={{ width: "80%" }}
                  />
                </div>
                <div
                  className={`w-10 h-10 rounded-xl ${
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
            <Icon icon="mdi:chart-line" className="text-2xl" />
          </div>
          <h3
            className={`text-lg font-semibold mb-2 ${
              mode === "dark" ? "text-red-400" : "text-red-600"
            }`}
          >
            Unable to Load Market Intelligence
          </h3>
          <p
            className={`text-sm ${
              mode === "dark" ? "text-red-300/80" : "text-red-600/80"
            }`}
          >
            {marketIntelError}
          </p>
        </div>
      );
    }

    if (marketIntel.length === 0) {
      return (
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
            <Icon icon="mdi:chart-line" className="text-3xl" />
          </div>
          <h3
            className={`text-xl font-semibold mb-2 ${
              mode === "dark" ? "text-gray-300" : "text-gray-700"
            }`}
          >
            No Market Intelligence Available
          </h3>
          <p
            className={`text-sm ${
              mode === "dark" ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Market intelligence reports will appear here when they become available
          </p>
        </div>
      );
    }

    // Calculate access statistics
    const accessibleIntelligence = marketIntel.filter((item) =>
      hasTierAccess(item.tier_restriction, user)
    );
    const restrictedIntelligence = marketIntel.filter(
      (item) => !hasTierAccess(item.tier_restriction, user)
    );

    // Group intelligence by type for categories
    const intelligenceByType = marketIntel.reduce((acc, item) => {
      const type = item.intel_type;
      if (!acc[type]) acc[type] = [];
      acc[type].push(item);
      return acc;
    }, {});

    // Filter intelligence based on statsFilter
    let filteredIntelligence = [...marketIntel];
    if (statsFilter === "available") {
      filteredIntelligence = accessibleIntelligence;
    } else if (statsFilter === "restricted") {
      filteredIntelligence = restrictedIntelligence;
    } else if (statsFilter === "categories" && selectedCategory) {
      filteredIntelligence = intelligenceByType[selectedCategory] || [];
    }

    // Sort intelligence: accessible ones first, then by type and title
    const sortedIntelligence = filteredIntelligence.sort((a, b) => {
      const aAccessible = hasTierAccess(a.tier_restriction, user);
      const bAccessible = hasTierAccess(b.tier_restriction, user);

      if (aAccessible === bAccessible) {
        if (a.intel_type === b.intel_type) {
          return a.title.localeCompare(b.title);
        }
        return a.intel_type.localeCompare(b.intel_type);
      }
      return aAccessible ? -1 : 1;
    });

    return (
      <div className="space-y-6">
        {/* Stats dashboard */}
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

        {/* Category dropdown when "Categories" is selected */}
        {statsFilter === "categories" && (
          <div className="mb-4">
            <FilterDropdown
              value={selectedCategory}
              onChange={(value) => setSelectedCategory(value)}
              options={[
                { value: "", label: "All Categories" },
                ...Object.keys(intelligenceByType).map((type) => ({
                  value: type,
                  label: type,
                })),
              ]}
              mode={mode}
              ariaLabel="Filter market intelligence by category"
            />
          </div>
        )}

        {/* Market Intelligence grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-fr">
          {sortedIntelligence.map((item, index) => (
            <div
              key={item.id}
              className="animate-fade-in-up"
              style={{
                animationDelay: `${index * 50}ms`,
                animationFillMode: "both",
              }}
            >
              <MarketIntelItem
                intel={item}
                mode={mode}
                Icon={Icon}
                isRestricted={!hasTierAccess(item.tier_restriction, user)}
                onRestrictedClick={() =>
                  handleRestrictedClick(
                    `Access restricted: ${item.tier_restriction} tier required for "${item.title}"`
                  )
                }
              />
            </div>
          ))}
        </div>
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
          <div className="relative">
            <FilterDropdown
              value={marketIntelFilters.intel_type || ""}
              onChange={(value) =>
                handleMarketIntelFilterChange("intel_type", value)
              }
              options={[
                { value: "", label: "All Types" },
                ...marketIntelFilterOptions.intel_types.map((t) => ({
                  value: t,
                  label: t,
                })),
              ]}
              mode={mode}
              ariaLabel="Filter market intelligence by type"
            />
          </div>
          <div className="relative">
            <FilterDropdown
              value={marketIntelFilters.tier_restriction || ""}
              onChange={(value) =>
                handleMarketIntelFilterChange("tier_restriction", value)
              }
              options={[
                { value: "", label: "All Tiers" },
                ...marketIntelFilterOptions.tier_restrictions.map((t) => ({
                  value: t,
                  label: t,
                })),
              ]}
              mode={mode}
              ariaLabel="Filter market intelligence by membership tier"
            />
          </div>
        </div>
      }
    >
      {renderContent()}
    </SectionCard>
  );
};

export default MarketIntelligenceSection; 