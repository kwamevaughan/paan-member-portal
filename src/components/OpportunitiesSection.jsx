import React, {
  useState,
  useMemo,
  useRef,
  useEffect,
  useCallback,
} from "react";
import SectionCard from "./SectionCard";
import OpportunityCard from "./OpportunityCard";
import FilterDropdown from "./FilterDropdown";
import { hasTierAccess } from "@/utils/tierUtils";
import { TierBadge } from "./Badge";
import { Icon } from "@iconify/react";
import debounce from "lodash.debounce";

const OpportunitiesSection = ({
  opportunities,
  opportunitiesLoading,
  opportunitiesError,
  user,
  handleRestrictedClick,
  mode,
  Icon,
}) => {
  const [viewMode, setViewMode] = useState("grid");
  const [statsFilter, setStatsFilter] = useState("total");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [inputValue, setInputValue] = useState(""); // Add separate input state
  const renderCount = useRef(0);

  const isFreelancer = user?.job_type?.toLowerCase() === "freelancer";
  const sectionTitle = isFreelancer ? "Gigs" : "Business Opportunities";
  const itemLabel = isFreelancer ? "Gigs" : "Opportunities";

  // Track render count
  useEffect(() => {
    renderCount.current++;
  });


  // Create stable debounced function using useCallback with empty dependency array
  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchQuery(value);
    }, 300), // Increased debounce delay for better UX
    []
  );

  // Handle input change - update input immediately, debounce search
  const handleInputChange = useCallback(
    (e) => {
      const value = e.target.value;
      setInputValue(value); // Update input immediately for responsive UI
      debouncedSearch(value); // Debounce the search query update
    },
    [debouncedSearch]
  );

  // Cleanup debounced function on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleStatsFilter = (filter) => {
    setStatsFilter(filter);
    if (filter !== "categories") {
      setSelectedCategory("");
    }
  };

  // Debug input focus/blur
  const handleInputFocus = () => {
  };

  const handleInputBlur = () => {
  };

  // Memoized computations
  const searchedOpportunities = useMemo(
    () =>
      opportunities.filter((opp) =>
        `${opp.title} ${opp.description}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      ),
    [opportunities, searchQuery]
  );

  const accessibleOpportunities = useMemo(
    () =>
      searchedOpportunities.filter((opportunity) =>
        hasTierAccess(
          opportunity.tier_restriction,
          user || { selected_tier: "Free Member" }
        )
      ),
    [searchedOpportunities, user]
  );

  const restrictedOpportunities = useMemo(
    () =>
      searchedOpportunities.filter(
        (opportunity) =>
          !hasTierAccess(
            opportunity.tier_restriction,
            user || { selected_tier: "Free Member" }
          )
      ),
    [searchedOpportunities, user]
  );

  const opportunitiesByType = useMemo(
    () =>
      searchedOpportunities.reduce((acc, opportunity) => {
        const type = opportunity.job_type || "Uncategorized";
        acc[type] = acc[type] || [];
        acc[type].push(opportunity);
        return acc;
      }, {}),
    [searchedOpportunities]
  );

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
    searchedOpportunities,
  ]);

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
        if (aAccessible === bAccessible) {
          return a.title.localeCompare(b.title);
        }
        return aAccessible ? -1 : 1;
      }),
    [displayOpportunities, user]
  );

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
        {opportunitiesError}
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
          ? `Try adjusting your search terms or browse all ${itemLabel.toLowerCase()}`
          : `Check back later for new ${itemLabel.toLowerCase()}`}
      </p>
      {searchQuery && (
        <button
          onClick={() => {
            setInputValue("");
            setSearchQuery("");
          }}
          className={`mt-4 px-4 py-2 rounded-lg transition-colors ${
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
    if (opportunitiesLoading) return renderLoadingState();
    if (opportunitiesError) return renderErrorState();

    const hasResults =
      searchedOpportunities && searchedOpportunities.length > 0;

    const gridClass =
      viewMode === "grid"
        ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
        : "space-y-4";

    return (
      <div className="space-y-6">
        {/* Header with Search and Filters - Always visible */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Icon
              icon="mdi:magnify"
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                mode === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            />
            <input
              type="text"
              placeholder={`Search ${itemLabel.toLowerCase()}...`}
              value={inputValue}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                mode === "dark"
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-200 text-gray-900"
              } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all z-10`}
              aria-label={`Search ${itemLabel.toLowerCase()}`}
            />
          </div>
        </div>

        {/* Stats dashboard */}
        <div
          className={`grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl ${
            mode === "dark"
              ? "bg-blue-900/20 border border-blue-800/30"
              : "bg-blue-50 border border-blue-200/50"
          }`}
        >
          {[
            {
              filter: "total",
              label: `Total ${itemLabel}`,
              count: searchedOpportunities.length,
              color: "blue",
            },
            {
              filter: "available",
              label: "Available",
              count: accessibleOpportunities.length,
              color: "green",
            },
            {
              filter: "restricted",
              label: "Restricted",
              count: restrictedOpportunities.length,
              color: "orange",
            },
            {
              filter: "categories",
              label: "Categories",
              count: Object.keys(opportunitiesByType).length,
              color: "purple",
            },
          ].map(({ filter, label, count, color }) => (
            <div
              key={filter}
              className={`text-center cursor-pointer p-2 rounded-lg transition-all duration-200 ${
                statsFilter === filter
                  ? mode === "dark"
                    ? `bg-${color}-900/30 border border-${color}-700`
                    : `bg-${color}-100/50 border border-${color}-300`
                  : ""
              } ${
                mode === "dark"
                  ? `hover:bg-${color}-900/30 hover:border hover:border-${color}-700`
                  : `hover:bg-${color}-100/50 hover:border hover:border-${color}-300`
              }`}
              onClick={() => handleStatsFilter(filter)}
              role="button"
              tabIndex={0}
              aria-label={`Filter by ${filter} ${itemLabel.toLowerCase()}`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleStatsFilter(filter);
                }
              }}
            >
              <div
                className={`text-3xl font-bold ${
                  mode === "dark" ? `text-${color}-400` : `text-${color}-600`
                }`}
              >
                {count}
              </div>
              <div
                className={`text-sm font-medium ${
                  mode === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* Category dropdown */}
        {statsFilter === "categories" && (
          <div className="mb-4">
            <FilterDropdown
              value={selectedCategory}
              onChange={(value) => {
                setSelectedCategory(value);
              }}
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

        {/* Results section */}
        {hasResults ? (
          <div className={gridClass}>
            {sortedOpportunities.map((opportunity, index) => (
              <div
                key={`${opportunity.id}-${index}`}
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
                  onRestrictedClick={() => handleRestrictedClick(opportunity)}
                  isFreelancer={isFreelancer}
                  showExpressInterestButton={true}
                />
              </div>
            ))}
          </div>
        ) : (
          renderEmptyState()
        )}
      </div>
    );
  };

  return (
    <SectionCard title={sectionTitle} icon="mdi:briefcase" mode={mode}>
      {renderContent()}
    </SectionCard>
  );
};

export default React.memo(OpportunitiesSection);
