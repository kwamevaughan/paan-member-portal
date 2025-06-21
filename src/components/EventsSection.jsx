import React, { useState } from "react";
import { createStatsConfig } from "@/utils/statsConfig";
import { hasTierAccess } from "@/utils/tierUtils";
import SectionCard from "./SectionCard";
import EventCard from "./EventCard";
import FilterDropdown from "./FilterDropdown";
import { Icon } from "@iconify/react";

const EventsSection = ({
  events = [],
  registeredEvents = [],
  eventsLoading,
  eventsError,
  eventFilters,
  handleEventFilterChange,
  eventFilterOptions,
  user,
  handleEventRegistration,
  handleRestrictedClick,
  mode,
  Icon,
  onClick,
}) => {
  const [statsFilter, setStatsFilter] = useState("total");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const statsConfig = createStatsConfig({
    items: events,
    user,
    hasTierAccess,
    categories: eventFilterOptions.eventTypes,
    sectionName: "Events",
    registeredItems: registeredEvents,
  });

  const handleStatsFilter = (filter) => {
    setStatsFilter(filter);
  };

  const renderContent = () => {
    if (eventsLoading) {
      return (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
        </div>
      );
    }

    if (eventsError) {
      return (
        <div className="text-center p-8">
          <div
            className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${
              mode === "dark"
                ? "bg-gray-700/50 text-gray-400"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            <Icon icon="mdi:alert-circle-outline" className="text-3xl" />
          </div>
          <h3
            className={`text-xl font-semibold mb-2 ${
              mode === "dark" ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Error Loading Events
          </h3>
          <p
            className={`text-sm ${
              mode === "dark" ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {eventsError.message || "Please try again later"}
          </p>
        </div>
      );
    }

    if (!events.length) {
      return (
        <div className="text-center p-8">
          <div
            className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${
              mode === "dark"
                ? "bg-gray-700/50 text-gray-400"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            <Icon icon="mdi:calendar-blank-outline" className="text-3xl" />
          </div>
          <h3
            className={`text-xl font-semibold mb-2 ${
              mode === "dark" ? "text-gray-300" : "text-gray-700"
            }`}
          >
            No Events Available
          </h3>
          <p
            className={`text-sm ${
              mode === "dark" ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Check back later for upcoming events and workshops
          </p>
        </div>
      );
    }

    // Filter events based on statsFilter
    let filteredEvents = [...events];
    if (statsFilter === "available") {
      filteredEvents = events.filter((e) =>
        hasTierAccess(e.tier_restriction, user)
      );
    } else if (statsFilter === "restricted") {
      filteredEvents = events.filter(
        (e) => !hasTierAccess(e.tier_restriction, user)
      );
    } else if (statsFilter === "registered") {
      filteredEvents = events.filter((e) =>
        registeredEvents.some((reg) => reg.id === e.id)
      );
    }

    // Sort events: accessible ones first, then by date
    const sortedEvents = filteredEvents.sort((a, b) => {
      const aAccess = hasTierAccess(a.tier_restriction, user);
      const bAccess = hasTierAccess(b.tier_restriction, user);

      if (aAccess === bAccess) {
        return new Date(a.date) - new Date(b.date);
      }
      return aAccess ? -1 : 1;
    });

    return (
      <div className="space-y-6">
        {/* Stats bar */}
        <div
          className={`grid grid-cols-2 md:grid-cols-5 gap-4 p-6 rounded-lg ${
            mode === "dark"
              ? "bg-paan-dark-blue/20 border border-paan-dark-blue/30"
              : "bg-paan-blue/10 border border-paan-blue/20"
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
              aria-label={`Filter by ${filter} events`}
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

        {/* Events grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-fr">
          {sortedEvents.map((event, index) => (
            <div
              key={event.id}
              className="animate-fade-in-up"
              style={{
                animationDelay: `${index * 50}ms`,
                animationFillMode: "both",
              }}
            >
              <EventCard
                event={event}
                mode={mode}
                Icon={Icon}
                onRegister={handleEventRegistration}
                isRegistered={registeredEvents.some(
                  (reg) => reg.id === event.id
                )}
                isRestricted={!hasTierAccess(event.tier_restriction, user)}
                onRestrictedClick={() =>
                  handleRestrictedClick(
                    `Access restricted: ${event.tier_restriction} tier required for "${event.title}"`
                  )
                }
                onClick={onClick}
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <SectionCard
      title="Events & Workshops"
      icon="mdi:calendar-star"
      mode={mode}
      headerAction={
        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <FilterDropdown
              value={eventFilters.eventType || ""}
              onChange={(value) => handleEventFilterChange("eventType", value)}
              options={[
                { value: "", label: "All Types" },
                ...eventFilterOptions.eventTypes.map((t) => ({
                  value: t,
                  label: t,
                })),
              ]}
              mode={mode}
              ariaLabel="Filter events by type"
            />
          </div>
          <div className="relative">
            <FilterDropdown
              value={eventFilters.tier || ""}
              onChange={(value) => handleEventFilterChange("tier", value)}
              options={[
                { value: "", label: "All Tiers" },
                ...eventFilterOptions.tiers.map((t) => ({
                  value: t,
                  label: t,
                })),
              ]}
              mode={mode}
              ariaLabel="Filter events by membership tier"
            />
          </div>
        </div>
      }
    >
      {renderContent()}
    </SectionCard>
  );
};

export default EventsSection;