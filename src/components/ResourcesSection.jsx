import React, { useState } from "react";
import SectionCard from "./SectionCard";
import ResourceItem from "./ResourceItem";
import FilterDropdown from "./FilterDropdown";
import { hasTierAccess } from "@/utils/tierUtils";

const ResourcesSection = ({
  resources,
  resourcesLoading,
  resourcesError,
  resourceFilters,
  handleResourceFilterChange,
  resourceFilterOptions,
  user,
  handleRestrictedClick,
  mode,
  Icon,
}) => {
  const [statsFilter, setStatsFilter] = useState("total"); // Track selected stat filter
  const [selectedCategory, setSelectedCategory] = useState(""); // Track selected category for "Categories" filter

  const handleStatsFilter = (filter) => {
    setStatsFilter(filter);
    if (filter !== "categories") {
      setSelectedCategory(""); // Reset category selection unless "categories" is clicked
    }
  };

  const renderContent = () => {
    if (resourcesLoading) {
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

    if (resourcesError) {
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
            <iconify-icon
              icon="mdi:folder-alert-outline"
              className="text-2xl"
            />
          </div>
          <h3
            className={`text-lg font-semibold mb-2 ${
              mode === "dark" ? "text-red-400" : "text-red-600"
            }`}
          >
            Unable to Load Resources
          </h3>
          <p
            className={`text-sm ${
              mode === "dark" ? "text-red-300/80" : "text-red-600/80"
            }`}
          >
            {resourcesError}
          </p>
        </div>
      );
    }

    if (resources.length === 0) {
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
            <iconify-icon icon="mdi:folder-open-outline" className="text-3xl" />
          </div>
          <h3
            className={`text-xl font-semibold mb-2 ${
              mode === "dark" ? "text-gray-300" : "text-gray-700"
            }`}
          >
            No Resources Available
          </h3>
          <p
            className={`text-sm ${
              mode === "dark" ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Resources will appear here when they become available
          </p>
        </div>
      );
    }

    // Calculate access statistics
    const accessibleResources = resources.filter((resource) =>
      hasTierAccess(resource.tier_restriction, user)
    );
    const restrictedResources = resources.filter(
      (resource) => !hasTierAccess(resource.tier_restriction, user)
    );

    // Group resources by type for categories
    const resourcesByType = resources.reduce((acc, resource) => {
      const type = resource.resource_type;
      if (!acc[type]) acc[type] = [];
      acc[type].push(resource);
      return acc;
    }, {});

    // Filter resources based on statsFilter
    let filteredResources = [...resources];
    if (statsFilter === "available") {
      filteredResources = accessibleResources;
    } else if (statsFilter === "restricted") {
      filteredResources = restrictedResources;
    } else if (statsFilter === "categories" && selectedCategory) {
      filteredResources = resourcesByType[selectedCategory] || [];
    }

    // Sort resources: accessible ones first, then by type and title
    const sortedResources = filteredResources.sort((a, b) => {
      const aAccessible = hasTierAccess(a.tier_restriction, user);
      const bAccessible = hasTierAccess(b.tier_restriction, user);

      if (aAccessible === bAccessible) {
        if (a.resource_type === b.resource_type) {
          return a.title.localeCompare(b.title);
        }
        return a.resource_type.localeCompare(b.resource_type);
      }
      return aAccessible ? -1 : 1;
    });

    return (
      <div className="space-y-6">
        {/* Stats dashboard */}
        <div
          className={`grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl ${
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
                : ""
            } ${
              mode === "dark"
                ? "hover:bg-blue-900/30 hover:border hover:border-blue-700"
                : "hover:bg-blue-100/50 hover:border hover:border-blue-300"
            }`}
            onClick={() => handleStatsFilter("total")}
            role="button"
            tabIndex={0}
            aria-label="Filter by total resources"
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
              {resources.length}
            </div>
            <div
              className={`text-sm font-medium ${
                mode === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Total Resources
            </div>
          </div>
          <div
            className={`text-center cursor-pointer p-2 rounded-lg transition-all duration-200 ${
              statsFilter === "available"
                ? mode === "dark"
                  ? "bg-green-900/30 border border-green-700"
                  : "bg-green-100/50 border border-green-300"
                : ""
            } ${
              mode === "dark"
                ? "hover:bg-green-900/30 hover:border hover:border-green-700"
                : "hover:bg-green-100/50 hover:border hover:border-green-300"
            }`}
            onClick={() => handleStatsFilter("available")}
            role="button"
            tabIndex={0}
            aria-label="Filter by available resources"
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
              {accessibleResources.length}
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
                : ""
            } ${
              mode === "dark"
                ? "hover:bg-orange-900/30 hover:border hover:border-orange-700"
                : "hover:bg-orange-100/50 hover:border hover:border-orange-300"
            }`}
            onClick={() => handleStatsFilter("restricted")}
            role="button"
            tabIndex={0}
            aria-label="Filter by restricted resources"
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
              {restrictedResources.length}
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
                : ""
            } ${
              mode === "dark"
                ? "hover:bg-purple-900/30 hover:border hover:border-purple-700"
                : "hover:bg-purple-100/50 hover:border hover:border-purple-300"
            }`}
            onClick={() => handleStatsFilter("categories")}
            role="button"
            tabIndex={0}
            aria-label="Filter by resource categories"
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
              {Object.keys(resourcesByType).length}
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
        {statsFilter === "categories" && (
          <div className="mb-4">
            <FilterDropdown
              value={selectedCategory}
              onChange={(value) => setSelectedCategory(value)}
              options={[
                { value: "", label: "All Categories" },
                ...Object.keys(resourcesByType).map((type) => ({
                  value: type,
                  label: type,
                })),
              ]}
              mode={mode}
              ariaLabel="Filter resources by category"
            />
          </div>
        )}

        {/* Resources list */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedResources.map((resource, index) => (
            <div
              key={resource.id}
              className="animate-fade-in-up"
              style={{
                animationDelay: `${index * 50}ms`,
                animationFillMode: "both",
              }}
            >
              <ResourceItem
                resource={resource}
                mode={mode}
                Icon={Icon}
                isRestricted={
                  !hasTierAccess(resource.tier_restriction, user)
                }
                onRestrictedClick={() =>
                  handleRestrictedClick(
                    `Access restricted: ${resource.tier_restriction} tier required for "${resource.title}"`
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
      title="Resources Library"
      icon="mdi:library-shelves"
      mode={mode}
      headerAction={
        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <FilterDropdown
              value={resourceFilters.resource_type || ""}
              onChange={(value) =>
                handleResourceFilterChange("resource_type", value)
              }
              options={[
                { value: "", label: "All Types" },
                ...resourceFilterOptions.resource_types.map((t) => ({
                  value: t,
                  label: t,
                })),
              ]}
              mode={mode}
              ariaLabel="Filter resources by type"
            />
          </div>
          <div className="relative">
            <FilterDropdown
              value={resourceFilters.tier_restriction || ""}
              onChange={(value) =>
                handleResourceFilterChange("tier_restriction", value)
              }
              options={[
                { value: "", label: "All Tiers" },
                ...resourceFilterOptions.tier_restrictions.map((t) => ({
                  value: t,
                  label: t,
                })),
              ]}
              mode={mode}
              ariaLabel="Filter resources by membership tier"
            />
          </div>
        </div>
      }
    >
      {renderContent()}
    </SectionCard>
  );
};

export default ResourcesSection;