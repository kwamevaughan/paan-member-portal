import React, { useState, useMemo, useCallback, useEffect } from "react";
import SectionCard from "./SectionCard";
import OpportunityCard from "./OpportunityCard";
import FilterDropdown from "./FilterDropdown";
import { hasTierAccess } from "@/utils/tierUtils";
import { createStatsConfig } from "@/utils/statsConfig";
import { TierBadge } from "./Badge";
import { Icon } from "@iconify/react";
import debounce from "lodash.debounce";
import OpportunityDetailsModal from "./OpportunityDetailsModal";

const FilterField = ({
  key,
  icon,
  label,
  value = "",
  onChange,
  options = [],
  mode,
  isArrayFilter = false,
}) => {
  console.log(`[FilterField] ${label} options received:`, options);

  const safeOptions = Array.isArray(options) ? options : [];

  return (
    <div className="space-y-1">
      <label className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400">
        <Icon icon={icon} className="h-4 w-4" />
        {label}
      </label>
      <select
        name={key}
        value={value}
        onChange={onChange}
        className={`w-full p-2 rounded-lg border ${
          mode === "dark"
            ? "bg-gray-700 border-gray-600 text-white"
            : "bg-white border-gray-200 text-gray-900"
        } focus:ring-2 focus:ring-blue-500`}
        aria-label={`Filter by ${label}`}
      >
        <option value="">All {label}</option>
        {safeOptions.length === 0 ? (
          <option value="" disabled>
            No {label} available
          </option>
        ) : (
          safeOptions.map((val) => (
            <option key={val} value={val}>
              {key === "remoteWork"
                ? val === "true"
                  ? "Remote"
                  : "On-site"
                : val}
            </option>
          ))
        )}
      </select>
    </div>
  );
};

const OpportunitiesSection = ({
  opportunities = [],
  opportunitiesLoading: loading,
  opportunitiesError: error,
  user,
  handleRestrictedClick: handleExpressInterest,
  mode,
  Icon,
  opportunityFilterOptions: filterOptions = {},
  opportunityFilters: filters = {},
  handleOpportunityFilterChange: handleFilterChange,
  handleResetFilters,
  toast,
  router,
}) => {
  const [viewMode] = useState("grid");
  const [statsFilter, setStatsFilter] = useState("total");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);

  const isFreelancer = user?.job_type?.toLowerCase() === "freelancer";
  const itemLabel = isFreelancer ? "Gigs" : "Opportunities";

  const debouncedSearch = useCallback(
    debounce((value) => setSearchQuery(value), 300),
    []
  );
  useEffect(() => () => debouncedSearch.cancel(), [debouncedSearch]);

  const handleInputChange = useCallback(
    (e) => {
      const value = e.target.value;
      setInputValue(value);
      debouncedSearch(value);
    },
    [debouncedSearch]
  );

  const handleViewMoreInfo = useCallback((opportunity) => {
    setSelectedOpportunity(opportunity);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedOpportunity(null);
  }, []);

  // Create a wrapper function for express interest that ensures nothing is returned
  const handleExpressInterestWrapper = useCallback((opportunity) => {
    // Call the function but don't return anything
    handleExpressInterest(opportunity);
    return undefined; // Explicitly return undefined
  }, [handleExpressInterest]);

  const {
    searchedOpportunities,
    accessibleOpportunities,
    restrictedOpportunities,
    opportunitiesByType,
  } = useMemo(() => {
    const searched = opportunities.filter((opp) => {
      const title = opp.is_tender
        ? (opp.tender_title || opp.organization_name || '')
        : (opp.job_type === "Freelancer"
            ? opp.gig_title || ''
            : opp.organization_name || '');
      return `${title} ${opp.description || ''}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    });
    const userTier = user || { selected_tier: "Free Member" };
    return {
      searchedOpportunities: searched,
      accessibleOpportunities: searched.filter((opp) =>
        hasTierAccess(opp.tier_restriction, userTier)
      ),
      restrictedOpportunities: searched.filter(
        (opp) => !hasTierAccess(opp.tier_restriction, userTier)
      ),
      opportunitiesByType: searched.reduce((acc, opp) => {
        const type = opp.job_type || "Uncategorized";
        acc[type] = acc[type] || [];
        acc[type].push(opp);
        return acc;
      }, {}),
    };
  }, [opportunities, searchQuery, user]);

  const displayOpportunities = useMemo(() => {
    if (statsFilter === "available") return accessibleOpportunities;
    if (statsFilter === "restricted") return restrictedOpportunities;
    if (statsFilter === "categories" && selectedCategory)
      return opportunitiesByType[selectedCategory] || [];
    return searchedOpportunities;
  }, [
    statsFilter,
    selectedCategory,
    accessibleOpportunities,
    restrictedOpportunities,
    opportunitiesByType,
  ]);

  // Helper function to get the correct title for each opportunity type
  const getOpportunityTitle = (opportunity) => {
    if (opportunity.is_tender) {
      return opportunity.tender_title || opportunity.organization_name || '';
    } else if (opportunity.job_type === "Freelancer") {
      return opportunity.gig_title || '';
    } else {
      return opportunity.organization_name || '';
    }
  };

  const sortedOpportunities = useMemo(
    () =>
      [...displayOpportunities].sort((a, b) => {
        const aAccessible = hasTierAccess(
          a.tier_restriction,
          user || { selected_tier: "Free Member" }
        );
        const bAccessible = hasTierAccess(
          b.tier_restriction,
          user || { selected_tier: "Free Member" }
        );
        return aAccessible === bAccessible
          ? getOpportunityTitle(a).localeCompare(getOpportunityTitle(b))
          : aAccessible
          ? -1
          : 1;
      }),
    [displayOpportunities, user]
  );

  const statsConfig = createStatsConfig({
    items: opportunities,
    user,
    hasTierAccess,
    categories: opportunitiesByType,
    sectionName: itemLabel,
  });

  const renderLoadingState = () => (
    <div className="space-y-4">
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
          ? "bg-red-900/20 border border-red-800/30"
          : "bg-red-50 border border-red-200"
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
        Unable to Load {itemLabel}
      </h3>
      <p
        className={`text-sm ${
          mode === "dark" ? "text-red-300/80" : "text-red-600/80"
        }`}
      >
        {error}
      </p>
    </div>
  );

  const renderEmptyState = () => (
    <div
      className={`text-center py-16 rounded-2xl ${
        mode === "dark"
          ? "bg-gray-800/30 border border-gray-700/30"
          : "bg-gray-50 border border-gray-200/50"
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
        {searchQuery
          ? `No ${itemLabel} found for "${searchQuery}"`
          : `No ${itemLabel} Available`}
      </h3>
      <p
        className={`text-sm ${
          mode === "dark" ? "text-gray-400" : "text-gray-500"
        }`}
      >
        {searchQuery
          ? `Try adjusting your search or browse all ${itemLabel.toLowerCase()}`
          : `Check back later for new ${itemLabel.toLowerCase()}`}
      </p>
      {searchQuery && (
        <button
          onClick={() => {
            setInputValue("");
            setSearchQuery("");
          }}
          className={`mt-4 px-4 py-2 rounded-lg ${
            mode === "dark"
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          Clear Search
        </button>
      )}
    </div>
  );

  const renderContent = () => {
    if (loading) return renderLoadingState();
    if (error) return renderErrorState();
    const hasResults = sortedOpportunities.length > 0;
    const gridClass =
      viewMode === "grid"
        ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
        : "space-y-4";

    const filterFields = isFreelancer
      ? [
          {
            key: "skills",
            icon: "mdi:lightbulb-on",
            label: "Skills",
            isArrayFilter: true,
          },
          { key: "budgetRange", icon: "mdi:currency-usd", label: "Budget" },
          { key: "remoteWork", icon: "mdi:globe", label: "Work Type" },
          {
            key: "estimatedDuration",
            icon: "mdi:clock-outline",
            label: "Duration",
          },
          { key: "projectType", icon: "mdi:folder", label: "Project Type" },
        ]
      : [
          { key: "country", icon: "mdi:earth", label: "Country" },
          { key: "serviceType", icon: "mdi:cog", label: "Service Type" },
          { key: "industry", icon: "mdi:industry", label: "Industry" },
          { key: "tier_restriction", icon: "mdi:crown", label: "Tier" },
        ];

    return (
      <div className="">
        <div
          className={`grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-lg mb-6 ${
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
                  statsFilter === filter 
                    ? filter === "total" 
                      ? "#d3e9f1"
                      : filter === "available"
                        ? "#e8e7ca"
                        : filter === "restricted"
                          ? "#bdc9d2"
                          : filter === "categories"
                            ? "#e7d4d5"
                            : `${color}20` 
                    : "transparent",
                borderColor: statsFilter === filter 
                  ? filter === "total"
                    ? "#85c1da"
                    : filter === "available"
                      ? "#d4d3b0"
                      : filter === "restricted"
                        ? "#a8b4bd"
                        : filter === "categories"
                          ? "#d4c1c2"
                          : color 
                  : "transparent",
              }}
              onClick={() => {
                setStatsFilter(filter);
                if (filter !== "categories") setSelectedCategory("");
              }}
              role="button"
              tabIndex={0}
              aria-label={`Filter by ${filter} ${itemLabel.toLowerCase()}`}
              onKeyDown={(e) =>
                e.key === "Enter" &&
                (setStatsFilter(filter),
                filter !== "categories" && setSelectedCategory(""))
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
              onChange={setSelectedCategory}
              options={[
                { value: "", label: "All Categories" },
                ...Object.keys(opportunitiesByType).map((type) => ({
                  value: type,
                  label: type,
                })),
              ]}
              mode={mode}
              ariaLabel={`Filter ${itemLabel.toLowerCase()} by category`}
            />
          </div>
        )}

        {sortedOpportunities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {sortedOpportunities.map((opportunity, index) => {
              return (
                <div
                  key={`${opportunity.id}-${index}`}
                  className="animate-fade-in-up h-full"
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animationFillMode: "both",
                  }}
                >
                  <OpportunityCard
                    opportunity={opportunity}
                    mode={mode}
                    TierBadge={TierBadge}
                    toast={toast}
                    isRestricted={
                      !hasTierAccess(
                        opportunity.tier_restriction,
                        user || { selected_tier: "Free Member" }
                      )
                    }
                    onRestrictedClick={handleViewMoreInfo}
                    isFreelancer={isFreelancer}
                    showExpressInterestButton={false}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          renderEmptyState()
        )}

        <OpportunityDetailsModal
          isOpen={!!selectedOpportunity}
          onClose={handleCloseModal}
          opportunity={selectedOpportunity}
          mode={mode}
          user={user}
          onExpressInterest={handleExpressInterestWrapper}
          isFreelancer={isFreelancer}
          toast={toast}
        />
      </div>
    );
  };

  return (
    <SectionCard 
      title={itemLabel} 
      icon="mdi:briefcase" 
      mode={mode}
    >
      {renderContent()}
    </SectionCard>
  );
};

export default React.memo(OpportunitiesSection);
