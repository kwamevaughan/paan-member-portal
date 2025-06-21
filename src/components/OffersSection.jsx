import React, { useState } from "react";
import { createStatsConfig } from "@/utils/statsConfig";
import { hasTierAccess } from "@/utils/tierUtils";
import SectionCard from "./SectionCard";
import OfferCard from "./OfferCard";
import FilterDropdown from "./FilterDropdown";
import SimpleModal from "./SimpleModal";
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
}) => {
  const [statsFilter, setStatsFilter] = useState("total");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleOfferClick = (offer) => {
    setSelectedOffer(offer);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOffer(null);
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
                isRestricted={
                  !hasTierAccess(offer.tier_restriction, user)
                }
                onRestrictedClick={() =>
                  handleRestrictedClick(
                    `Access restricted: ${offer.tier_restriction} tier required for "${offer.title}"`
                  )
                }
                onClick={handleOfferClick}
                Icon={Icon}
                toast={toast}
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

      {/* Offer Details Modal */}
      <SimpleModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedOffer?.title || "Offer Details"}
        mode={mode}
        width="max-w-4xl"
      >
        {selectedOffer && (
          <div className="space-y-6">
            {/* Offer Header */}
            <div className="flex items-start space-x-4">
              <div
                className={`flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center ${
                  mode === "dark"
                    ? "bg-gray-700/50 text-blue-400"
                    : "bg-white text-amber-400"
                }`}
              >
                <Icon icon="mdi:gift-outline" className="text-3xl" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2">{selectedOffer.title}</h3>
                {selectedOffer.type && (
                  <p className={`text-sm font-medium ${
                    mode === "dark" ? "text-gray-300" : "text-gray-600"
                  }`}>
                    {selectedOffer.type}
                  </p>
                )}
              </div>
              <div className="flex-shrink-0">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  mode === "dark" 
                    ? "bg-blue-900/30 text-blue-400 border border-blue-700/50"
                    : "bg-blue-100 text-blue-800 border border-blue-200"
                }`}>
                  {selectedOffer.tier_restriction || "All Members"}
                </span>
              </div>
            </div>

            {/* Description */}
            {selectedOffer.description && (
              <div>
                <h4 className={`text-lg font-semibold mb-2 ${
                  mode === "dark" ? "text-gray-200" : "text-gray-800"
                }`}>
                  Description
                </h4>
                <p className={`text-sm leading-relaxed ${
                  mode === "dark" ? "text-gray-300" : "text-gray-600"
                }`}>
                  {selectedOffer.description}
                </p>
              </div>
            )}

            {/* Tags */}
            {selectedOffer.tags && selectedOffer.tags.length > 0 && (
              <div>
                <h4 className={`text-lg font-semibold mb-3 ${
                  mode === "dark" ? "text-gray-200" : "text-gray-800"
                }`}>
                  Tags
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedOffer.tags.map((tag, index) => (
                    <span
                      key={index}
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        mode === "dark"
                          ? "bg-gray-700/60 text-gray-300"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      <Icon icon="mdi:tag" className="text-teal-500 text-sm mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Rating */}
              {selectedOffer.averageRating > 0 && (
                <div className={`p-4 rounded-lg ${
                  mode === "dark" ? "bg-gray-800/50" : "bg-gray-50"
                }`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon icon="mdi:star" className="text-lg text-amber-400" />
                    <span className={`font-semibold ${
                      mode === "dark" ? "text-amber-400" : "text-amber-600"
                    }`}>
                      {selectedOffer.averageRating.toFixed(1)}
                    </span>
                  </div>
                  <p className={`text-sm ${
                    mode === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}>
                    Average Rating
                  </p>
                </div>
              )}

              {/* Created Date */}
              {selectedOffer.created_at && (
                <div className={`p-4 rounded-lg ${
                  mode === "dark" ? "bg-gray-800/50" : "bg-gray-50"
                }`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon icon="mdi:calendar" className="text-lg text-[#f25749]" />
                    <span className={`font-semibold ${
                      mode === "dark" ? "text-gray-200" : "text-gray-800"
                    }`}>
                      {new Date(selectedOffer.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className={`text-sm ${
                    mode === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}>
                    Created Date
                  </p>
                </div>
              )}

              {/* Feedback Count */}
              {selectedOffer.feedbackCount > 0 && (
                <div className={`p-4 rounded-lg ${
                  mode === "dark" ? "bg-gray-800/50" : "bg-gray-50"
                }`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon icon="mdi:comment" className="text-lg text-green-500" />
                    <span className={`font-semibold ${
                      mode === "dark" ? "text-green-400" : "text-green-600"
                    }`}>
                      {selectedOffer.feedbackCount}
                    </span>
                  </div>
                  <p className={`text-sm ${
                    mode === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}>
                    Reviews
                  </p>
                </div>
              )}

              {/* Offer Type */}
              {selectedOffer.offer_type && (
                <div className={`p-4 rounded-lg ${
                  mode === "dark" ? "bg-gray-800/50" : "bg-gray-50"
                }`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon icon="mdi:gift" className="text-lg text-[#85c1da]" />
                    <span className={`font-semibold ${
                      mode === "dark" ? "text-gray-200" : "text-gray-800"
                    }`}>
                      {selectedOffer.offer_type}
                    </span>
                  </div>
                  <p className={`text-sm ${
                    mode === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}>
                    Offer Type
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleCloseModal}
                className={`px-6 py-3 text-sm font-medium rounded-xl border transition-all duration-200 ${
                  mode === "dark"
                    ? "border-gray-600 text-gray-200 bg-gray-800 hover:bg-gray-700"
                    : "border-gray-200 text-gray-700 bg-white hover:bg-gray-50"
                }`}
              >
                Close
              </button>
              <button
                className={`px-6 py-3 text-sm font-medium rounded-xl text-white bg-[#f25749] hover:bg-[#e04a3d] transition-all duration-200 ${
                  mode === "dark" ? "shadow-white/10" : "shadow-gray-200"
                }`}
              >
                Claim Offer
              </button>
            </div>
          </div>
        )}
      </SimpleModal>
    </>
  );
};

export default OffersSection;
