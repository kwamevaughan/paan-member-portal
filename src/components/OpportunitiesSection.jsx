import React from "react";
import SectionCard from "./SectionCard";
import OpportunityCard from "./OpportunityCard";
import FilterDropdown from "./FilterDropdown";
import { canAccessTier } from "@/utils/tierUtils";
import { normalizeTier } from "@/components/Badge";

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
}) => {
  const renderContent = () => {
    if (opportunitiesLoading) {
      return (
        <div className="text-center py-4">
          <span className="text-gray-500">Loading opportunities...</span>
        </div>
      );
    }
    if (opportunitiesError) {
      return (
        <div className="text-center py-4 text-sm text-red-600 dark:text-red-400">
          {opportunitiesError}
        </div>
      );
    }
    if (opportunities.length === 0) {
      return (
        <div className="text-center py-4 text-gray-500 dark:text-gray-400">
          No opportunities available
          {opportunityFilters.country
            ? ` in ${opportunityFilters.country}`
            : ""}
          .
        </div>
      );
    }

    // Log input opportunities and current filters
    console.log(
      "[OpportunitiesSection] Input opportunities:",
      opportunities.map((o) => ({
        id: o.id,
        title: o.title,
        tier: o.tier_restriction,
        country: o.location,
        isAccessible: canAccessTier(o.tier_restriction, user.selected_tier),
      }))
    );
    console.log("[OpportunitiesSection] Current filters:", opportunityFilters);

    // Sorting is now handled in useBusinessOpportunities, but verify
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {opportunities.map((opportunity) => (
          <OpportunityCard
            key={opportunity.id}
            opportunity={opportunity}
            mode={mode}
            isRestricted={
              !canAccessTier(opportunity.tier_restriction, user.selected_tier)
            }
            onRestrictedClick={() =>
              handleRestrictedClick(
                `Access restricted: ${opportunity.tier_restriction} tier required for "${opportunity.title}"`
              )
            }
          />
        ))}
      </div>
    );
  };

  return (
    <SectionCard
      title="Business Opportunities"
      icon="mdi:briefcase"
      mode={mode}
      headerAction={
        <div className="flex space-x-2">
          <FilterDropdown
            value={opportunityFilters.country || ""}
            onChange={(value) => {
              console.log(
                `[OpportunitiesSection] Country filter changed to: ${value}`
              );
              handleOpportunityFilterChange("country", value);
            }}
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
          <FilterDropdown
            value={opportunityFilters.tier_restriction || ""}
            onChange={(value) => {
              console.log(
                `[OpportunitiesSection] Tier filter changed to: ${value}`
              );
              handleOpportunityFilterChange("tier_restriction", value);
            }}
            options={[
              { value: "", label: "All Tiers" },
              ...opportunityFilterOptions.tiers
                .filter((t) => t !== "all")
                .map((tier) => ({
                  value: tier,
                  label: canAccessTier(tier, user.selected_tier)
                    ? tier
                    : `${tier} (Restricted)`,
                  disabled: !canAccessTier(tier, user.selected_tier),
                })),
            ]}
            mode={mode}
            ariaLabel="Filter opportunities by membership tier"
            optionClassName={(option) =>
              canAccessTier(option.value, user.selected_tier) || !option.value
                ? ""
                : "text-gray-400"
            }
          />
        </div>
      }
    >
      {opportunityFilters.tier_restriction &&
        !canAccessTier(
          opportunityFilters.tier_restriction,
          user.selected_tier
        ) && (
          <div className="text-center py-2 text-yellow-600 dark:text-yellow-400">
            You are viewing opportunities restricted to{" "}
            {opportunityFilters.tier_restriction}. Upgrade your tier to access
            them.
          </div>
        )}
      {renderContent()}
    </SectionCard>
  );
};

export default OpportunitiesSection;
