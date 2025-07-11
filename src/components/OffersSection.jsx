import React, { useState } from "react";
import { createStatsConfig } from "@/utils/statsConfig";
import { hasTierAccess } from "@/utils/tierUtils";
import SectionCard from "./SectionCard";
import OfferCard from "./OfferCard";
import FilterDropdown from "./FilterDropdown";
import { Icon } from "@iconify/react";

const OffersSection = ({
  offers = [],
  // Changed from offerings
  offersLoading,
  // Changed from accessibleOfferings
  offersError,
  // Changed from offeringsError
  offerFilters,
  handleOfferFilter,
  // Changed from handleOfferFilterChange
  offersFilterOptions,
  // Changed from offerFilterOptions
  user,
  handleRestrictedClick,
  mode,
  Icon,
  toast,
  onClick,
}) => {
  const [statsFilter, setStatsFilter] = useState("total");
  const [selectedCategory, setSelectedCategory] = useState("");

  const statsConfig = createStatsConfig({
    items: offers,
    user,
    hasTierAccess,
    categories: offersFilterOptions.offerTypes,
    sectionName: "Offers",
  });

  const handleStatsFilter = (filter) => {
    setStatsFilter(filter);
  };

  const renderContent = () => {
    // Loading state
    if (offersLoading) {
      return (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className={`animate-pulse rounded-xl p-4 ${
                mode === "dark" ? "bg-gray-800/50" : "bg-gray-100/60"
              }`}
            >
              <div className="flex items-center space-x-2">
                <div
                  className={`w-14 h-14 rounded-lg ${
                    mode === "dark" ? "bg-gray-600/20" : "bg-gray-200"
                  }`}
                />
                <div className="flex-1 space-y-3">
                  <div
                    className={`h-5 rounded-full ${
                      mode === "dark" ? "bg-gray-600/20" : "bg-gray-200"
                    }`}
                    style={{ width: "60%" }}
                  />
                  <div className="flex space-x-2">
                    <div
                      className={`h-4 rounded-full ${
                        mode === "dark" ? "bg-gray-600/20" : "bg-gray-200"
                      }`}
                      style={{ width: "80px" }}
                    />
                    <div
                      className={`h-4 rounded-full ${
                        mode === "dark" ? "bg-gray-600/20" : "bg-gray-200"
                      }`}
                      style={{ width: "100px" }}
                    />
                  </div>
                  <div
                    className={`h-4 rounded-full ${
                      mode === "dark" ? "bg-gray-600/20" : "bg-gray-200"
                    }`}
                    style={{ width: "80%" }}
                  />
                </div>
                <div
                  className={`w-10 h-10 rounded-full ${
                    mode === "dark" ? "bg-gray-600/20" : "bg-gray-200"
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
      );
    }

    // Error state
    if (offersError) {
      return (
        <div
          className={`text-center py-12 rounded-xl ${
            mode === "dark"
              ? "bg-gradient-to-br from-red-900/30 to-red-800/20 border border-red-800/30"
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
            {Icon ? (
              <Icon icon="mdi:alert-circle-outline" className="text-2xl" />
            ) : (
              <span className="text-2xl">⚠</span>
            )}
          </div>
          <h3
            className={`text-lg font-semibold mb-2 ${
              mode === "dark" ? "text-red-400" : "text-red-600"
            }`}
          >
            Unable to Load Offers
          </h3>
          <p
            className={`text-sm ${
              mode === "dark" ? "text-red-300/80" : "text-red-600/80"
            }`}
          >
            {offersError}
          </p>
        </div>
      );
    }

    // Empty state
    if (!offers || !Array.isArray(offers) || offers.length === 0) {
      return (
        <div
          className={`text-center py-16 rounded-xl ${
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
            {Icon ? (
              <Icon icon="mdi:gift-outline" className="text-3xl" />
            ) : (
              <span className="text-3xl">🎁</span>
            )}
          </div>
          <h3
            className={`text-xl font-semibold mb-2 ${
              mode === "dark" ? "text-gray-300" : "text-gray-700"
            }`}
          >
            No Offers Available
          </h3>
          <p
            className={`text-sm ${
              mode === "dark" ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Offers will appear here when they become available.
          </p>
        </div>
      );
    }

    // Calculate access statistics
    const accessibleOffers = offers.filter((offer) =>
      hasTierAccess(offer.tier_restriction, user)
    );
    const restrictedOffers = offers.filter(
      (offer) => !hasTierAccess(offer.tier_restriction, user)
    );

    // Group offers by type
    const offerByType = offers.reduce((acc, offer) => {
      const type = offer.type || "General";
      if (!acc[type]) acc[type] = [];
      acc[type].push(offer);
      return acc;
    }, {});

    // Filter based on statsFilter
    let filteredOffers = [...offers];
    if (statsFilter === "available") {
      filteredOffers = accessibleOffers;
    } else if (statsFilter === "restricted") {
      filteredOffers = restrictedOffers;
    } else if (statsFilter === "categories" && selectedCategory) {
      filteredOffers = offerByType[selectedCategory] || [];
    }

    // Sort offers: accessible first, then by created_at descending
    const sortedOffers = filteredOffers.sort((a, b) => {
      const aAccessible = hasTierAccess(a.tier_restriction, user);
      const bAccessible = hasTierAccess(b.tier_restriction, user);
      if (aAccessible === bAccessible) {
        return new Date(b.created_at) - new Date(a.created_at);
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
              aria-label={`Filter by ${filter} offers`}
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
        {statsFilter === "categories" &&
          Object.keys(offerByType).length > 1 && (
            <div className="mb-4">
              <FilterDropdown
                value={selectedCategory}
                onChange={(value) => setSelectedCategory(value)}
                options={[
                  { value: "", label: "All Categories" },
                  ...Object.keys(offerByType).map((type) => ({
                    value: type,
                    label: type,
                  })),
                ]}
                mode={mode}
                ariaLabel="Filter offers by category"
              />
            </div>
          )}

        {/* Offers grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-fr">
          {sortedOffers.map((offer, index) => (
            <div
              key={offer.id}
              className="animate-fade-in-up"
              style={{
                animationDelay: `${index * 50}ms`,
                animationFillMode: "both",
              }}
            >
              <OfferCard
                offer={offer}
                mode={mode}
                isRestricted={!hasTierAccess(offer.tier_restriction, user)}
                onRestrictedClick={() => {
                  toast.error(
                    `This offer is available to ${normalizeTier(
                      offer.tier_restriction
                    )} only. Consider upgrading your membership to access this offer.`,
                    { duration: 5000 }
                  );
                }}
                onClick={onClick}
                Icon={Icon}
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <SectionCard
        title="Offers"
        icon="mdi:gift"
        mode={mode}
        headerAction={
          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <FilterDropdown
                value={offerFilters.tier_restriction || ""}
                onChange={(value) => handleOfferFilter("tier_restriction", value)}
                options={[
                  { value: "", label: "All Tiers" },
                  ...(offersFilterOptions.tier_restrictions || []).map((t) => ({
                    value: t,
                    label: t,
                  })),
                ]}
                mode={mode}
                ariaLabel="Filter offers by membership tier"
              />
            </div>
            {offersFilterOptions.offer_types?.length > 0 && (
              <div className="relative">
                <FilterDropdown
                  value={offerFilters.offer_type || ""}
                  onChange={(value) => handleOfferFilter("offer_type", value)}
                  options={[
                    { value: "", label: "All Types" },
                    ...(offersFilterOptions.offer_types || []).map((t) => ({
                      value: t,
                      label: t,
                    })),
                  ]}
                  mode={mode}
                  ariaLabel="Filter offers by type"
                />
              </div>
            )}
          </div>
        }
      >
        {renderContent()}
      </SectionCard>
    </>
  );
};

export default OffersSection;
