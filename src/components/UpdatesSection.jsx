import React, { useState } from "react";
import SectionCard from "./SectionCard";
import UpdateCard from "./UpdateCard";
import FilterDropdown from "./FilterDropdown";
import { canAccessTier } from "@/utils/tierUtils";

const UpdatesSection = ({
  updates,
  updatesLoading,
  updatesError,
  updateFilters,
  handleUpdateFilterChange,
  updateFilterOptions,
  user,
  handleRestrictedClick,
  mode,
  Icon,
}) => {
  const [statsFilter, setStatsFilter] = useState("total"); // Track selected stat filter
  const [selectedCategory, setSelectedCategory] = useState(""); // Track selected tag for "Categories" filter

  const handleStatsFilter = (filter) => {
    setStatsFilter(filter);
    if (filter !== "categories") {
      setSelectedCategory(""); // Reset category selection unless "categories" is clicked
    }
  };

  const renderContent = () => {
    if (updatesLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

    if (updatesError) {
      return (
        <div
          className={`text-center py-12 rounded-xl border ${
            mode === "dark"
              ? "bg-gradient-to-br from-red-900/30 to-red-800/20 border-red-800/30"
              : "bg-gradient-to-br from-red-50 to-red-100/50 border-red-200"
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
            Unable to Load Updates
          </h3>
          <p
            className={`text-sm ${
              mode === "dark" ? "text-red-300/80" : "text-red-600/80"
            }`}
          >
            {updatesError}
          </p>
        </div>
      );
    }

    if (!updates || !Array.isArray(updates) || updates.length === 0) {
      return (
        <div
          className={`text-center py-16 rounded-xl border ${
            mode === "dark"
              ? "bg-gradient-to-br from-gray-800/30 to-gray-900/20 border-gray-700/30"
              : "bg-gradient-to-br from-gray-50 to-white border-gray-200/50"
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
              <Icon icon="mdi:bell-outline" className="text-3xl" />
            ) : (
              <span className="text-3xl">🔔</span>
            )}
          </div>
          <h3
            className={`text-xl font-semibold mb-2 ${
              mode === "dark" ? "text-gray-300" : "text-gray-700"
            }`}
          >
            No Updates Available
          </h3>
          <p
            className={`text-sm ${
              mode === "dark" ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Check back later for new updates and announcements.
          </p>
        </div>
      );
    }

    // Calculate stats using canAccessTier
    const accessibleUpdates = updates.filter((update) =>
      canAccessTier(update.tier_restriction, user.selected_tier)
    );
    const restrictedUpdates = updates.filter(
      (update) => !canAccessTier(update.tier_restriction, user.selected_tier)
    );
    const updatesByTag = updates.reduce((acc, update) => {
      (update.tags || []).forEach((tag) => {
        if (!acc[tag]) acc[tag] = [];
        acc[tag].push(update);
      });
      return acc;
    }, {});

    // Filter based on statsFilter
    let filteredUpdates = [...updates];
    if (statsFilter === "available") {
      filteredUpdates = accessibleUpdates;
    } else if (statsFilter === "restricted") {
      filteredUpdates = restrictedUpdates;
    } else if (statsFilter === "categories" && selectedCategory) {
      filteredUpdates = updatesByTag[selectedCategory] || [];
    }

    // Sort updates: accessible first, then by created_at descending
    const sortedUpdates = filteredUpdates.sort((a, b) => {
      const aAccessible = canAccessTier(a.tier_restriction, user.selected_tier);
      const bAccessible = canAccessTier(b.tier_restriction, user.selected_tier);
      if (aAccessible === bAccessible) {
        return new Date(b.created_at) - new Date(a.created_at);
      }
      return aAccessible ? -1 : 1;
    });

    return (
      <div className="space-y-6">
        {/* Stats dashboard */}
        <div
          className={`grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-xl ${
            mode === "dark"
              ? "bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-800/30"
              : "bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200/50"
          }`}
        >
          <div
            className={`text-center cursor-pointer p-2 rounded-lg transition-all duration-200 ${
              statsFilter === "total"
                ? mode === "dark"
                  ? "bg-blue-900/30 border border-blue-700"
                  : "bg-blue-100/50 border border-blue-300"
                : mode === "dark"
                ? "hover:bg-blue-900/30 hover:border hover:border-blue-700"
                : "hover:bg-blue-100/50 hover:border hover:border-blue-300"
            }`}
            onClick={() => handleStatsFilter("total")}
            role="button"
            tabIndex={0}
            aria-label="Filter by total updates"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleStatsFilter("total");
              }
            }}
          >
            <div
              className={`text-3xl font-bold ${
                mode === "dark" ? "text-blue-400" : "text-blue-600"
              }`}
            >
              {updates.length}
            </div>
            <div
              className={`text-sm font-medium ${
                mode === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Total Updates
            </div>
          </div>
          <div
            className={`text-center cursor-pointer p-2 rounded-lg transition-all duration-200 ${
              statsFilter === "available"
                ? mode === "dark"
                  ? "bg-green-900/30 border border-green-700"
                  : "bg-green-100/50 border border-green-300"
                : mode === "dark"
                ? "hover:bg-green-900/30 hover:border hover:border-green-700"
                : "hover:bg-green-100/50 hover:border hover:border-green-300"
            }`}
            onClick={() => handleStatsFilter("available")}
            role="button"
            tabIndex={0}
            aria-label="Filter by available updates"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleStatsFilter("available");
              }
            }}
          >
            <div
              className={`text-3xl font-bold ${
                mode === "dark" ? "text-green-400" : "text-green-600"
              }`}
            >
              {accessibleUpdates.length}
            </div>
            <div
              className={`text-sm font-medium ${
                mode === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Available
            </div>
          </div>
          <div
            className={`text-center cursor-pointer p-2 rounded-lg transition-all duration-200 ${
              statsFilter === "restricted"
                ? mode === "dark"
                  ? "bg-orange-900/30 border border-orange-700"
                  : "bg-orange-100/50 border border-orange-300"
                : mode === "dark"
                ? "hover:bg-orange-900/30 hover:border hover:border-orange-700"
                : "hover:bg-orange-100/50 hover:border hover:border-orange-300"
            }`}
            onClick={() => handleStatsFilter("restricted")}
            role="button"
            tabIndex={0}
            aria-label="Filter by restricted updates"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleStatsFilter("restricted");
              }
            }}
          >
            <div
              className={`text-3xl font-bold ${
                mode === "dark" ? "text-orange-400" : "text-orange-600"
              }`}
            >
              {restrictedUpdates.length}
            </div>
            <div
              className={`text-sm font-medium ${
                mode === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Restricted
            </div>
          </div>
          <div
            className={`text-center cursor-pointer p-2 rounded-lg transition-all duration-200 ${
              statsFilter === "categories"
                ? mode === "dark"
                  ? "bg-purple-900/30 border border-purple-700"
                  : "bg-purple-100/50 border border-purple-300"
                : mode === "dark"
                ? "hover:bg-purple-900/30 hover:border hover:border-purple-700"
                : "hover:bg-purple-100/50 hover:border hover:border-purple-300"
            }`}
            onClick={() => handleStatsFilter("categories")}
            role="button"
            tabIndex={0}
            aria-label="Filter by update categories"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleStatsFilter("categories");
              }
            }}
          >
            <div
              className={`text-3xl font-bold ${
                mode === "dark" ? "text-purple-400" : "text-purple-600"
              }`}
            >
              {Object.keys(updatesByTag).length}
            </div>
            <div
              className={`text-sm font-medium ${
                mode === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Categories
            </div>
          </div>
        </div>

        {/* Category dropdown when "Categories" is selected */}
        {statsFilter === "categories" &&
          Object.keys(updatesByTag).length > 1 && (
            <div className="mb-4">
              <FilterDropdown
                value={selectedCategory}
                onChange={(value) => setSelectedCategory(value)}
                options={[
                  { value: "", label: "All Categories" },
                  ...Object.keys(updatesByTag).map((tag) => ({
                    value: tag,
                    label: tag,
                  })),
                ]}
                mode={mode}
                ariaLabel="Filter updates by category"
              />
            </div>
          )}

        {/* Updates grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedUpdates.map((update, index) => (
            <div
              key={update.id}
              className="animate-fade-in-up"
              style={{
                animationDelay: `${index * 50}ms`,
                animationFillMode: "both",
              }}
            >
              <UpdateCard
                update={update}
                mode={mode}
                Icon={Icon}
                isRestricted={
                  !canAccessTier(update.tier_restriction, user.selected_tier)
                }
                onRestrictedClick={() =>
                  handleRestrictedClick(
                    `Access restricted: ${update.tier_restriction} tier required for "${update.title}"`
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
      title="Latest Updates"
      icon="mdi:bell"
      mode={mode}
      headerAction={
        <div className="flex flex-wrap gap-3">
          <FilterDropdown
            value={updateFilters.tags || ""}
            onChange={(value) => handleUpdateFilterChange("tags", value)}
            options={[
              { value: "", label: "All Tags" },
              ...(updateFilterOptions.tags || []).map((t) => ({
                value: t,
                label: t,
              })),
            ]}
            mode={mode}
            ariaLabel="Filter updates by tag"
          />
        </div>
      }
    >
      {renderContent()}
    </SectionCard>
  );
};

export default UpdatesSection;
