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
    return (
      <>
        {offers.map((offer) => (
          <OfferItem
            key={offer.id}
            offer={offer}
            mode={mode}
            isRestricted={
              !canAccessTier(offer.tier_restriction, user.selected_tier)
            }
            onRestrictedClick={() =>
              handleRestrictedClick(
                `Access restricted: ${offer.tier_restriction} tier required for "${offer.title}"`
              )
            }
          />
        ))}
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
              ...offerFilterOptions.tier_restrictions.map((t) => ({
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
