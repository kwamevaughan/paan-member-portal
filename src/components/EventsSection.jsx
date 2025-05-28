import React, { useState } from "react";
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
  Icon,
}) => {
  const [statsFilter, setStatsFilter] = useState("total"); // Track selected stat filter

  const handleStatsFilter = (filter) => {
    setStatsFilter(filter);
  };

  const renderContent = () => {
    if (eventsLoading) {
      return (
        <div className="space-y-4">
          {/* Loading skeleton */}
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
    }

    if (eventsError) {
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
            <Icon icon="mdi:alert-circle-outline" className="text-2xl" />
          </div>
          <h3
            className={`text-lg font-semibold mb-2 ${
              mode === "dark" ? "text-red-400" : "text-red-600"
            }`}
          >
            Unable to Load Events
          </h3>
          <p
            className={`text-sm ${
              mode === "dark" ? "text-red-300/80" : "text-red-600/80"
            }`}
          >
            {eventsError}
          </p>
        </div>
      );
    }

    if (events.length === 0) {
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
        canAccessTier(e.tier_restriction, user.selected_tier)
      );
    } else if (statsFilter === "restricted") {
      filteredEvents = events.filter(
        (e) => !canAccessTier(e.tier_restriction, user.selected_tier)
      );
    } else if (statsFilter === "registered") {
      filteredEvents = events.filter((e) =>
        registeredEvents.some((reg) => reg.id === e.id)
      );
    }

    // Sort events: accessible ones first, then by date
    const sortedEvents = filteredEvents.sort((a, b) => {
      const aAccess = canAccessTier(a.tier_restriction, user.selected_tier);
      const bAccess = canAccessTier(b.tier_restriction, user.selected_tier);

      if (aAccess === bAccess) {
        return new Date(a.date) - new Date(b.date);
      }
      return aAccess ? -1 : 1;
    });

    return (
      <div className="space-y-6">
        {/* Stats bar */}
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
            aria-label="Filter by total events"
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
              {events.length}
            </div>
            <div
              className={`text-sm font-medium ${
                mode === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Total Events
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
            aria-label="Filter by available events"
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
              {
                events.filter((e) =>
                  canAccessTier(e.tier_restriction, user.selected_tier)
                ).length
              }
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
              statsFilter === "registered"
                ? mode === "dark"
                  ? "bg-purple-900/30 border border-purple-700"
                  : "bg-purple-100/50 border border-purple-300"
                : ""
            } ${
              mode === "dark"
                ? "hover:bg-purple-900/30 hover:border hover:border-purple-700"
                : "hover:bg-purple-100/50 hover:border hover:border-purple-300"
            }`}
            onClick={() => handleStatsFilter("registered")}
            role="button"
            tabIndex={0}
            aria-label="Filter by registered events"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleStatsFilter("registered");
              }
            }}
          >
            <div
              className={`text-3xl font-bold ${
                mode === "dark" ? "text-purple-400" : "text-purple-600"
              }`}
            >
              {registeredEvents.length}
            </div>
            <div
              className={`text-sm font-medium ${
                mode === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Registered
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
            aria-label="Filter by restricted events"
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
              {
                events.filter(
                  (e) => !canAccessTier(e.tier_restriction, user.selected_tier)
                ).length
              }
            </div>
            <div
              className={`text-sm font-medium ${
                mode === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Restricted
            </div>
          </div>
        </div>

        {/* Events grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {sortedEvents.map((event, index) => (
            <div
              key={event.id}
              className="animate-fade-in-up"
              style={{
                animationDelay: `${index * 100}ms`,
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
                isRestricted={
                  !canAccessTier(event.tier_restriction, user.selected_tier)
                }
                onRestrictedClick={() =>
                  handleRestrictedClick(
                    `Access restricted: ${event.tier_restriction} tier required for "${event.title}"`
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
