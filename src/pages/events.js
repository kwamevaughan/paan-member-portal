import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useUser } from "@/hooks/useUser";
import useEvents from "@/hooks/useEvents";
import useLogout from "@/hooks/useLogout";
import HrHeader from "@/layouts/hrHeader";
import HrSidebar from "@/layouts/hrSidebar";
import SimpleFooter from "@/layouts/simpleFooter";
import useSidebar from "@/hooks/useSidebar";
import toast from "react-hot-toast";
import { TierBadge, StatusBadge } from "@/components/Badge";
import RegisteredEventsModal from "@/components/RegisteredEventsModal";
import { useRouter } from "next/router";

export default function Events({ mode = "light", toggleMode }) {
  const { isSidebarOpen, toggleSidebar, sidebarState, updateDragOffset } =
    useSidebar();
  const { user, loading: userLoading, LoadingComponent } = useUser();
  const { handleLogout } = useLogout();
  const router = useRouter();
  const { eventType } = router.query; // Get eventType from query parameters

  const [filters, setFilters] = useState({
    eventType: "",
    tier: "",
  });
  const [activeTab, setActiveTab] = useState("all");
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [showRegistrationsModal, setShowRegistrationsModal] = useState(false);

  // Tier mappings
  const tierMap = {
    Founding: "Founding Agency (Tier 1)",
    Full: "Full Member (Tier 2)",
    Associate: "Associate Member (Tier 3)",
    All: "All Members",
  };
  const reverseTierMap = {
    "Founding Agency (Tier 1)": "Founding",
    "Full Member (Tier 2)": "Full",
    "Associate Member (Tier 3)": "Associate",
  };

  const {
    events,
    registeredEvents,
    filterOptions,
    loading: eventsLoading,
    error,
    handleEventRegistration,
  } = useEvents(filters, reverseTierMap[user?.selected_tier] || "Member");

  // Set eventType filter based on URL query
  useEffect(() => {
    if (eventType && typeof eventType === "string") {
      // Capitalize the event type to match filterOptions.eventTypes (e.g., "networking" -> "Networking")
      const capitalizedEventType =
        eventType.charAt(0).toUpperCase() + eventType.slice(1).toLowerCase();
      if (
        filterOptions.eventTypes.includes(capitalizedEventType) &&
        filters.eventType !== capitalizedEventType
      ) {
        setFilters((prev) => ({ ...prev, eventType: capitalizedEventType }));
        setShowFilterPanel(true); // Show filter panel when eventType is set
      }
    } else if (!eventType && filters.eventType) {
      // Clear eventType filter if URL has no eventType
      setFilters((prev) => ({ ...prev, eventType: "" }));
    }
  }, [eventType, filterOptions.eventTypes]);

  useEffect(() => {
    console.log("[Events] registeredEvents:", registeredEvents);
  }, [registeredEvents]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => {
      const newFilters = { ...prev, [name]: value };
      // Update URL only if eventType changes
      if (name === "eventType") {
        const newUrl = value
          ? `/events?eventType=${value.toLowerCase()}`
          : "/events";
        router.push(newUrl, undefined, { shallow: true });
      }
      return newFilters;
    });
  };

  const handleResetFilters = () => {
    setFilters({ eventType: "", tier: "" });
    setShowFilterPanel(false);
    router.push("/events", undefined, { shallow: true });
  };

  const canAccessEvent = (eventTier) => {
    if (eventTier === "All") return true;
    const tiers = ["Associate", "Full", "Founding"];
    const userTier = reverseTierMap[user?.selected_tier] || "Member";
    const eventTierIndex = tiers.indexOf(eventTier);
    const userTierIndex = tiers.indexOf(userTier);
    return userTierIndex >= eventTierIndex;
  };

  const filteredByTab =
    activeTab === "all"
      ? events
      : events.filter((event) => {
          if (activeTab === "accessible")
            return canAccessEvent(event.tier_restriction);
          if (activeTab === "upcoming") {
            const eventDate = new Date(event.date);
            const today = new Date();
            const diffTime = eventDate - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays <= 7 && diffDays >= 0;
          }
          return true;
        });

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleString("en-US", options);
  };

  const getDaysRemaining = (date) => {
    const today = new Date();
    const eventDate = new Date(date);
    const diffTime = eventDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (userLoading || eventsLoading) {
    return LoadingComponent;
  }

  if (!user) {
    console.log("[Events] No user, redirecting to login");
    return null;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen flex flex-col ${
        mode === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <HrHeader
        toggleSidebar={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
        sidebarState={sidebarState}
        fullName={user?.name ?? "Member"}
        jobTitle={user?.job_type}
        selectedTier={user?.selected_tier}
        agencyName={user?.agencyName}
        mode={mode}
        toggleMode={toggleMode}
        onLogout={handleLogout}
        pageName="Events"
        pageDescription="Discover and register for upcoming events."
        breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Events" }]}
      />
      <div className="flex flex-1">
        <HrSidebar
          isOpen={isSidebarOpen}
          mode={mode}
          toggleMode={toggleMode}
          onLogout={handleLogout}
          toggleSidebar={toggleSidebar}
          setDragOffset={updateDragOffset}
        />
        <div
          className={`content-container flex-1 p-4 md:p-6 lg:p-8 transition-all duration-300 overflow-hidden ${
            isSidebarOpen ? "sidebar-open" : ""
          } ${sidebarState.hidden ? "sidebar-hidden" : ""}`}
          style={{
            marginLeft: sidebarState.hidden
              ? "0px"
              : `${84 + (isSidebarOpen ? 120 : 0) + sidebarState.offset}px`,
          }}
        >
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Hero Section */}
            <div
              className={`relative overflow-hidden rounded-3xl ${
                mode === "dark" ? "bg-gray-800" : "bg-white"
              } shadow-lg`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-40"></div>
              <div className="absolute top-0 right-0 -mt-12 -mr-12 w-40 h-40 bg-blue-500 rounded-full opacity-20 blur-3xl"></div>
              <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-40 h-40 bg-purple-500 rounded-full opacity-20 blur-3xl"></div>
              <div className="relative p-8 md:p-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                      Events
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 max-w-2xl">
                      Connect with industry leaders and grow your network through
                      our exclusive events tailored for your membership tier.
                    </p>
                  </div>
                  <div className="md:self-end">
                    <div
                      className={`rounded-xl p-3 backdrop-blur-sm ${
                        mode === "dark" ? "bg-gray-700/50" : "bg-gray-50/50"
                      } border border-gray-200 dark:border-gray-700`}
                    >
                      <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Your current tier
                      </div>
                      <TierBadge tier={user?.selected_tier || "Member"} mode={mode} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs and Filters */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex flex-wrap space-x-2">
                <button
                  onClick={() => setActiveTab("all")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    activeTab === "all"
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                  }`}
                >
                  All Events
                </button>
                <button
                  onClick={() => setActiveTab("accessible")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    activeTab === "accessible"
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                  }`}
                >
                  Accessible
                </button>
                <button
                  onClick={() => setActiveTab("upcoming")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    activeTab === "upcoming"
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                  }`}
                >
                  Upcoming
                </button>
                <button
                  onClick={() => !eventsLoading && setShowRegistrationsModal(true)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    eventsLoading
                      ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                  }`}
                  disabled={eventsLoading}
                >
                  My Registrations
                </button>
              </div>
              <button
                onClick={() => setShowFilterPanel(!showFilterPanel)}
                className="inline-flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-lg text-sm font-medium"
              >
                <Icon icon="heroicons:funnel" className="w-5 h-5 mr-2" />
                {showFilterPanel ? "Hide Filters" : "Show Filters"}
              </button>
            </div>

            {/* Registered Events Modal */}
            <RegisteredEventsModal
              isOpen={showRegistrationsModal}
              onClose={() => setShowRegistrationsModal(false)}
              registeredEvents={registeredEvents || []}
              mode={mode}
              tierMap={tierMap}
              formatDate={formatDate}
              getDaysRemaining={getDaysRemaining}
            />

            {/* Filter Panel */}
            {showFilterPanel && (
              <div
                className={`p-6 rounded-xl ${
                  mode === "dark" ? "bg-gray-800" : "bg-white"
                } shadow-md`}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label
                      htmlFor="eventType"
                      className="block text-sm font-medium mb-1"
                    >
                      Event Type
                    </label>
                    <select
                      id="eventType"
                      name="eventType"
                      value={filters.eventType}
                      onChange={handleFilterChange}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        mode === "dark"
                          ? "bg-gray-700 border-gray-600 text-gray-200"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                    >
                      <option value="">All Event Types</option>
                      {filterOptions.eventTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="tier"
                      className="block text-sm font-medium mb-1"
                    >
                      Tier Restriction
                    </label>
                    <select
                      id="tier"
                      name="tier"
                      value={filters.tier}
                      onChange={handleFilterChange}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        mode === "dark"
                          ? "bg-gray-700 border-gray-600 text-gray-200"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                    >
                      <option value="">All Tiers</option>
                      {filterOptions.tiers.map((tier) => (
                        <option key={tier} value={tier}>
                          {tierMap[tier] || tier}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={handleResetFilters}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            )}

            {/* Events List */}
            {filteredByTab.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredByTab.map((event) => {
                  const displayTier =
                    tierMap[event.tier_restriction] || event.tier_restriction;
                  const daysLeft = getDaysRemaining(event.date);
                  const isAccessible = canAccessEvent(event.tier_restriction);

                  return (
                    <div
                      key={event.id}
                      className={`relative flex flex-col h-full rounded-2xl border-0 ${
                        mode === "dark" ? "bg-gray-800/50" : "bg-white"
                      } shadow-lg overflow-hidden hover:shadow-xl transition-all duration-200 group ${
                        !isAccessible
                          ? mode === "dark"
                            ? "opacity-60 bg-gray-900/50"
                            : "opacity-60 bg-gray-100"
                          : ""
                      }`}
                    >
                      <div className="px-6 pt-6 pb-4 border-b border-gray-100 dark:border-gray-700">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                            {event.title}
                          </h3>
                          <TierBadge tier={displayTier} mode={mode} />
                        </div>
                        <div className="flex items-center mt-1.5">
                          <Icon
                            icon="heroicons:map-pin"
                            className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-1.5 flex-shrink-0"
                          />
                          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                            {event.location || "Virtual"}
                          </p>
                        </div>
                      </div>
                      <div className="px-6 py-4 flex-grow">
                        {event.description && (
                          <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 mb-4">
                            {event.description}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-2 mb-4">
                          <div className="flex items-center text-xs px-2.5 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300">
                            <Icon
                              icon="heroicons:calendar"
                              className="w-3.5 h-3.5 mr-1.5"
                            />
                            <span className="font-medium">{event.event_type}</span>
                          </div>
                          {event.is_virtual && (
                            <div className="flex items-center text-xs px-2.5 py-1.5 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300">
                              <Icon
                                icon="heroicons:video-camera"
                                className="w-3.5 h-3.5 mr-1.5"
                              />
                              <span className="font-medium">Virtual</span>
                            </div>
                          )}
                        </div>
                        {!isAccessible && (
                          <p className="text-sm text-red-600 dark:text-red-400 italic">
                            Restricted to {displayTier}. Upgrade your membership to
                            access.
                          </p>
                        )}
                      </div>
                      <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 mt-auto bg-gray-50 dark:bg-gray-800/80">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                              Event Date
                            </p>
                            <StatusBadge days={daysLeft} mode={mode} />
                          </div>
                          <button
                            onClick={() =>
                              isAccessible
                                ? handleEventRegistration(event.id)
                                : toast.error(
                                    `This event is restricted to ${displayTier}. Upgrade your membership to access it.`
                                  )
                            }
                            className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg ${
                              isAccessible
                                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700"
                                : "bg-gray-400 text-gray-700 cursor-not-allowed"
                            }`}
                            disabled={!isAccessible}
                            title={
                              !isAccessible
                                ? `Restricted to ${displayTier}. Upgrade your membership.`
                                : "Register for this event"
                            }
                          >
                            <Icon icon="heroicons:plus" className="w-5 h-5 mr-2" />
                            Register
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-12 text-center">
                <div className="w-24 h-24 mx-auto bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mb-6">
                  <Icon
                    icon="heroicons:calendar"
                    className="h-12 w-12 text-indigo-500 dark:text-indigo-300"
                  />
                </div>
                <h3 className="mt-2 text-xl font-medium text-gray-900 dark:text-gray-200">
                  No events found
                </h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                  {filters.eventType || filters.tier
                    ? "Try adjusting your filters to find more events."
                    : "No upcoming events available."}
                </p>
              </div>
            )}
          </div>
          <SimpleFooter mode={mode} isSidebarOpen={isSidebarOpen} />
        </div>
      </div>
    </div>
  );
}