import React from "react";
import SectionCard from "./SectionCard";
import OfferItem from "./OfferItem";
import FilterDropdown from "./FilterDropdown";
import { canAccessTier } from "@/utils/tierUtils";

const OffersSection = ({
  offers,
  offersLoading,
  offersError,
  offerFilters,
  handleOfferFilterChange,
  offerFilterOptions,
  user,
  handleRestrictedClick,
  mode,
}) => {
  const renderContent = () => {
    if (offersLoading) {
      return (
        <div className="text-center py-4">
          <span className="text-gray-500">Loading offers...</span>
        </div>
      );
    }
    if (offersError) {
      return (
        <div className="text-center py-4 text-sm text-red-600 dark:text-red-400">
          {offersError}
        </div>
      );
    }
    if (offers.length === 0) {
      return (
        <div className="text-center py-4 text-gray-500 dark:text-gray-400">
          No offers available.
        </div>
      );
    }

    const normalizeTier = (tier) => {
      if (!tier) return "free member";
      const tierMap = {
        "gold member (tier 3)": "gold member",
        "full member (tier 2)": "full member",
        "associate member (tier 1)": "associate member",
        "free member (tier 4)": "free member",
        "associate agency (tier 1)": "associate member",
        "gold member": "gold member",
        "full member": "full member",
        "associate member": "associate member",
        "free member": "free member",
      };
      const cleanTier = tier
        .replace(/\(.*?\)/g, "")
        .trim()
        .toLowerCase();
      return tierMap[cleanTier] || cleanTier;
    };

    const userTier = normalizeTier(user.selected_tier);
    const tierHierarchy = [
      "gold member",
      "full member",
      "associate member",
      "free member",
    ];

    const sortedOffers = [...offers].sort((a, b) => {
      const aTier = normalizeTier(a.tier_restriction);
      const bTier = normalizeTier(b.tier_restriction);
      const aIndex = tierHierarchy.indexOf(aTier);
      const bIndex = tierHierarchy.indexOf(bTier);
      const userIndex = tierHierarchy.indexOf(userTier);

      if (a.isAccessible && b.isAccessible) {
        const aIsExact = aIndex === userIndex;
        const bIsExact = bIndex === userIndex;
        if (aIsExact !== bIsExact) {
          return aIsExact ? -1 : 1;
        }
        return 0;
      }

      if (a.isAccessible !== b.isAccessible) {
        return a.isAccessible ? -1 : 1;
      }

      return 0;
    });

    return (
      <>
        {sortedOffers.map((offer) => {
          const isRestricted = !offer.isAccessible;
          return (
            <OfferItem
              key={offer.id}
              offer={offer}
              mode={mode}
              isRestricted={isRestricted}
              onRestrictedClick={() =>
                handleRestrictedClick(
                  `Access restricted: ${offer.tier_restriction} tier required for "${offer.title}"`
                )
              }
            />
          );
        })}
      </>
    );
  };

  return (
    <SectionCard
      title="Offers"
      icon="mdi:gift"
      mode={mode}
      headerAction={
        <div className="flex space-x-2">
          <FilterDropdown
            value={offerFilters.tier_restriction || ""}
            onChange={(value) =>
              handleOfferFilterChange("tier_restriction", value)
            }
            options={[
              { value: "", label: "All Tiers" },
              ...offerFilterOptions.tier_restrictions
                .filter((t) => t !== "all")
                .map((t) => ({
                  value: t,
                  label: t,
                })),
            ]}
            mode={mode}
            ariaLabel="Filter offers by membership tier"
          />
        </div>
      }
    >
      {renderContent()}
    </SectionCard>
  );
};

export default OffersSection;
