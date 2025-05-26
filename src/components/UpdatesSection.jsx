import React from "react";
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
}) => {
  const renderContent = () => {
    if (updatesLoading) {
      return (
        <div className="text-center py-4">
          <span className="text-gray-500">Loading updates...</span>
        </div>
      );
    }
    if (updatesError) {
      return (
        <div className="text-center py-4 text-sm text-red-600 dark:text-red-400">
          {updatesError}
        </div>
      );
    }
    if (updates.length === 0) {
      return (
        <div className="text-center py-4 text-gray-500 dark:text-gray-400">
          No updates available.
        </div>
      );
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {updates.map((update) => (
          <UpdateCard
            key={update.id}
            update={update}
            mode={mode}
            isRestricted={
              !canAccessTier(update.tier_restriction, user.selected_tier)
            }
            onRestrictedClick={() =>
              handleRestrictedClick(
                `Access restricted: ${update.tier_restriction} tier required for "${update.title}"`
              )
            }
          />
        ))}
      </div>
    );
  };

  return (
    <SectionCard
      title="Latest Updates"
      icon="mdi:bell"
      mode={mode}
      headerAction={
        <div className="flex space-x-2">
          <FilterDropdown
            value={updateFilters.tags || ""}
            onChange={(value) => handleUpdateFilterChange("tags", value)}
            options={[
              { value: "", label: "All Tags" },
              ...updateFilterOptions.tags.map((t) => ({ value: t, label: t })),
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
