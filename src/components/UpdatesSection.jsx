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

    

    // Normalize tier for comparison
    const normalizeTier = (tier) => {
      if (!tier) return "free member";
      const tierMap = {
        "gold member (tier 3)": "gold member",
        "full member (tier 2)": "full member",
        "associate member (tier 1)": "associate member",
        "free member (tier 4)": "free member",
        "associate agency (tier 1)": "associate member",
        "gold member": "gold member",
        "full member": "full member",
        "associate member": "associate member",
        "free member": "free member",
      };
      const cleanTier = tier
        .replace(/\(.*?\)/g, "")
        .trim()
        .toLowerCase();
      return tierMap[cleanTier] || cleanTier;
    };

    const userTier = normalizeTier(user.selected_tier);
    const tierHierarchy = [
      "gold member",
      "full member",
      "associate member",
      "free member",
    ];

    // Sort updates: exact tier match first, then other accessible, then restricted
    const sortedUpdates = [...updates].sort((a, b) => {
      const aTier = normalizeTier(a.tier_restriction);
      const bTier = normalizeTier(b.tier_restriction);
      const aIndex = tierHierarchy.indexOf(aTier);
      const bIndex = tierHierarchy.indexOf(bTier);
      const userIndex = tierHierarchy.indexOf(userTier);

      // Determine sorting based on tier proximity
      if (a.isAccessible && b.isAccessible) {
        // Both accessible: prioritize exact tier match
        const aIsExact = aIndex === userIndex;
        const bIsExact = bIndex === userIndex;
        if (aIsExact !== bIsExact) {
          
          return aIsExact ? -1 : 1;
        }
        // Both same precedence (exact or not), maintain order
        
        return 0;
      }

      // One accessible, one not
      if (a.isAccessible !== b.isAccessible) {
        
        return a.isAccessible ? -1 : 1;
      }

      // Both restricted, maintain order
      
      return 0;
    });

    

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sortedUpdates.map((update) => {
          const isRestricted = !update.isAccessible;
          
          return (
            <UpdateCard
              key={update.id}
              update={update}
              mode={mode}
              isRestricted={isRestricted}
              onRestrictedClick={() =>
                handleRestrictedClick(
                  `Access restricted: ${update.tier_restriction} tier required for "${update.title}"`
                )
              }
            />
          );
        })}
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
