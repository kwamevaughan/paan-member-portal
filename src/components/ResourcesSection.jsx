import React from "react";
import SectionCard from "./SectionCard";
import ResourceItem from "./ResourceItem";
import FilterDropdown from "./FilterDropdown";
import { canAccessTier } from "@/utils/tierUtils";

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
}) => {
  const renderContent = () => {
    if (resourcesLoading) {
      return (
        <div className="text-center py-4">
          <span className="text-gray-500">Loading resources...</span>
        </div>
      );
    }
    if (resourcesError) {
      return (
        <div className="text-center py-4 text-sm text-red-600 dark:text-red-400">
          {resourcesError}
        </div>
      );
    }
    if (resources.length === 0) {
      return (
        <div className="text-center py-4 text-gray-500 dark:text-gray-400">
          No resources available.
        </div>
      );
    }

    resources.forEach((resource) => {
      const canAccess = canAccessTier(
        resource.tier_restriction,
        user.selected_tier
      );
    });

    const sortedResources = [...resources].sort((a, b) => {
      const aAccessible = canAccessTier(a.tier_restriction, user.selected_tier);
      const bAccessible = canAccessTier(b.tier_restriction, user.selected_tier);
      return aAccessible === bAccessible ? 0 : aAccessible ? -1 : 1;
    });

    return (
      <>
        {sortedResources.map((resource) => (
          <ResourceItem
            key={resource.id}
            resource={resource}
            mode={mode}
            isRestricted={
              !canAccessTier(resource.tier_restriction, user.selected_tier)
            }
            onRestrictedClick={() =>
              handleRestrictedClick(
                `Access restricted: ${resource.tier_restriction} tier required for "${resource.title}"`
              )
            }
          />
        ))}
      </>
    );
  };


  return (
    <SectionCard
      title="Resources Library"
      icon="mdi:folder"
      mode={mode}
      headerAction={
        <div className="flex space-x-2">
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
      }
    >
      {renderContent()}
    </SectionCard>
  );
};

export default ResourcesSection;
