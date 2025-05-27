// components/EventsSection.jsx
import React from "react";
import SectionCard from "./SectionCard";
import EventCard from "./EventCard";
import FilterDropdown from "./FilterDropdown";
import { canAccessTier } from "@/utils/tierUtils";

const EventsSection = ({
  events,
  registeredEvents,
  eventsLoading,
  eventsError,
  eventFilters,
  handleEventFilterChange,
  eventFilterOptions,
  user,
  handleEventRegistration,
  handleRestrictedClick,
  mode,
}) => {
  const renderContent = () => {
    if (eventsLoading) {
      return (
        <div className="text-center py-4">
          <span className="text-gray-500">Loading events...</span>
        </div>
      );
    }
    if (eventsError) {
      return (
        <div className="text-center py-4 text-sm text-red-600 dark:text-red-400">
          {eventsError}
        </div>
      );
    }
    if (events.length === 0) {
      return (
        <div className="text-center py-4 text-gray-500 dark:text-gray-400">
          No events available.
        </div>
      );
    }

    // Sort events: accessible ones first
    const sortedEvents = [...events].sort((a, b) => {
      const aAccess = canAccessTier(a.tier_restriction, user.selected_tier);
      const bAccess = canAccessTier(b.tier_restriction, user.selected_tier);
      if (aAccess === bAccess) return 0;
      return aAccess ? -1 : 1;
    });

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sortedEvents.map((event) => {
          
          return (
            <EventCard
              key={event.id}
              event={event}
              mode={mode}
              onRegister={handleEventRegistration}
              isRegistered={registeredEvents.some((reg) => reg.id === event.id)}
              isRestricted={
                !canAccessTier(event.tier_restriction, user.selected_tier)
              }
              onRestrictedClick={() =>
                handleRestrictedClick(
                  `Access restricted: ${event.tier_restriction} tier required for "${event.title}"`
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
      title="Events & Workshops"
      icon="mdi:calendar"
      mode={mode}
      headerAction={
        <div className="flex space-x-2">
          <FilterDropdown
            value={eventFilters.eventType || ""}
            onChange={(value) => handleEventFilterChange("eventType", value)}
            options={[
              { value: "", label: "All Event Types" },
              ...eventFilterOptions.eventTypes.map((t) => ({
                value: t,
                label: t,
              })),
            ]}
            mode={mode}
            ariaLabel="Filter events by type"
          />
          <FilterDropdown
            value={eventFilters.tier || ""}
            onChange={(value) => handleEventFilterChange("tier", value)}
            options={[
              { value: "", label: "All Tiers" },
              ...eventFilterOptions.tiers.map((t) => ({ value: t, label: t })),
            ]}
            mode={mode}
            ariaLabel="Filter events by membership tier"
          />
        </div>
      }
    >
      {renderContent()}
    </SectionCard>
  );
};

export default EventsSection;
