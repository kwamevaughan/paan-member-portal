import React from "react";
import SectionCard from "./SectionCard";
import MarketIntelItem from "./MarketIntelItem";
import FilterDropdown from "./FilterDropdown";

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
}) => {
  const renderContent = () => {
    if (marketIntelLoading) {
      return (
        <div className="text-center py-4">
          <span className="text-gray-500">Loading market intelligence...</span>
        </div>
      );
    }
    if (marketIntelError) {
      return (
        <div className="text-center py-4 text-sm text-red-600 dark:text-red-400">
          {marketIntelError}
        </div>
      );
    }
    if (marketIntel.length === 0) {
      return (
        <div className="text-center py-4 text-gray-500 dark:text-gray-400">
          No market intelligence available.
        </div>
      );
    }

    // Log input market intel and current filters
    console.log(
      "[MarketIntelSection] Input market intel:",
      marketIntel.map((i) => ({
        id: i.id,
        title: i.title,
        tier: i.tier_restriction,
        region: i.region,
        type: i.type,
        isAccessible: i.isAccessible,
      }))
    );
    console.log("[MarketIntelSection] Current filters:", marketIntelFilters);

    return (
      <>
        {marketIntel.map((intel) => (
          <MarketIntelItem
            key={intel.id}
            intel={intel}
            mode={mode}
            isRestricted={!intel.isAccessible}
            onRestrictedClick={() =>
              handleRestrictedClick(
                `Access restricted: ${intel.tier_restriction} tier required for "${intel.title}"`
              )
            }
          />
        ))}
      </>
    );
  };

  return (
    <SectionCard
      title="Market Intelligence"
      icon="mdi:chart-line"
      mode={mode}
      headerAction={
        <div className="flex space-x-2">
          <FilterDropdown
            value={marketIntelFilters.region || ""}
            onChange={(value) => {
              console.log(
                `[MarketIntelSection] Region filter changed to: ${value}`
              );
              handleMarketIntelFilterChange("region", value);
            }}
            options={[
              { value: "", label: "All Regions" },
              ...marketIntelFilterOptions.regions
                .filter((r) => r !== "all")
                .map((r) => ({
                  value: r,
                  label: r,
                })),
            ]}
            mode={mode}
            ariaLabel="Filter market intelligence by region"
          />
          <FilterDropdown
            value={marketIntelFilters.type || ""}
            onChange={(value) => {
              console.log(
                `[MarketIntelSection] Type filter changed to: ${value}`
              );
              handleMarketIntelFilterChange("type", value);
            }}
            options={[
              { value: "", label: "All Types" },
              ...marketIntelFilterOptions.types
                .filter((t) => t !== "all")
                .map((t) => ({
                  value: t,
                  label: t,
                })),
            ]}
            mode={mode}
            ariaLabel="Filter market intelligence by type"
          />
          <FilterDropdown
            value={marketIntelFilters.tier_restriction || ""}
            onChange={(value) => {
              console.log(
                `[MarketIntelSection] Tier filter changed to: ${value}`
              );
              handleMarketIntelFilterChange("tier_restriction", value);
            }}
            options={[
              { value: "", label: "All Tiers" },
              ...marketIntelFilterOptions.tier_restrictions
                .filter((t) => t !== "all")
                .map((t) => ({
                  value: t,
                  label: t,
                })),
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
