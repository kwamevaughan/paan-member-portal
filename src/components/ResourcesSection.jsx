import React, { useState } from "react";
import { createStatsConfig } from "@/utils/statsConfig";
import { hasTierAccess } from "@/utils/tierUtils";
import SectionCard from "./SectionCard";
import ResourceCard from "./ResourceCard.jsx";
import FilterDropdown from "./FilterDropdown";
import { Icon } from "@iconify/react";

const ResourcesSection = ({
  resources = [],
  resourcesLoading,
  resourcesError,
  resourceFilters,
  handleResourceFilterChange,
  resourceFilterOptions,
  user,
  handleRestrictedClick,
  mode,
  Icon,
  onClick,
}) => {
  const [statsFilter, setStatsFilter] = useState("total");
  const [selectedResource, setSelectedResource] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [itemsToShow, setItemsToShow] = useState(9);



  const statsConfig = createStatsConfig({
    items: resources,
    user,
    hasTierAccess,
    categories: resourceFilterOptions.resourceTypes,
    sectionName: "Resources",
  });

  const handleStatsFilter = (filter) => {
    setStatsFilter(filter);
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
            <Icon icon="mdi:folder-open-outline" className="text-3xl" />
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
              aria-label={`Filter by ${filter} resources`}
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

        {/* Resources grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-fr">
          {sortedResources.slice(0, itemsToShow).map((resource, index) => (
            <div
              key={resource.id}
              className="animate-fade-in-up"
              style={{
                animationDelay: `${index * 50}ms`,
                animationFillMode: "both",
              }}
            >
              <ResourceCard
                resource={resource}
                user={user}
                mode={mode}
                onClick={onClick}
                isRestricted={!hasTierAccess(resource.tier_restriction, user)}
                onRestrictedClick={handleRestrictedClick}
                Icon={Icon}
              />
            </div>
          ))}
        </div>
        {itemsToShow < sortedResources.length && (
          <div className="flex justify-center mt-6">
            <button
              className="px-6 py-2 rounded-lg bg-paan-blue text-white hover:bg-paan-dark-blue transition"
              onClick={() => setItemsToShow((prev) => prev + 9)}
            >
              Load More
            </button>
          </div>
        )}
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