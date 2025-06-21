import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useUser } from "@/hooks/useUser";
import useEvents from "@/hooks/useEvents";
import useLogout from "@/hooks/useLogout";
import HrHeader from "@/layouts/hrHeader";
import HrSidebar from "@/layouts/hrSidebar";
import SimpleFooter from "@/layouts/simpleFooter";
import useSidebar from "@/hooks/useSidebar";
import toast, { Toaster } from "react-hot-toast";
import TitleCard from "@/components/TitleCard";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { hasTierAccess, normalizeTier } from "@/utils/tierUtils";
import { TierBadge, JobTypeBadge } from "@/components/Badge";
import RegisteredEventsModal from "@/components/RegisteredEventsModal";
import TabsSelector from "@/components/TabsSelector";
import EventCard from "@/components/EventCard";
import SimpleModal from "@/components/SimpleModal";
import Image from "next/image";

export default function Events({ mode = "light", toggleMode }) {
  const {
    isSidebarOpen,
    toggleSidebar,
    sidebarState,
    updateDragOffset,
    isMobile,
  } = useSidebar();
  const router = useRouter();
  const { user, loading: userLoading, LoadingComponent } = useUser();
  const { handleLogout } = useLogout();
  const { eventType } = router.query;

  const title = "Events";
  const description =
    "Connect with industry leaders and grow your network through our exclusive events tailored for your membership tier.";

  const [filters, setFilters] = useState({
    eventType: "",
    tier_restriction: "",
  });
  const [activeTab, setActiveTab] = useState("all");
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [showRegistrationsModal, setShowRegistrationsModal] = useState(false);

  // Modal state for event details
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);

  const {
    events,
    registeredEvents,
    filterOptions,
    loading: eventsLoading,
    error,
    eventsLoading: registrationLoading,
    handleEventRegistration,
  } = useEvents(filters, user);

  // Get latest event date
  const latestEventsDate =
    events.length > 0
      ? new Date(
          Math.max(...events.map((event) => new Date(event.updated_at)))
        ).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "No events available";

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

  const formatDateRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // If same day, just show start time
    if (start.toDateString() === end.toDateString()) {
      return `${formatDate(startDate)} - ${end.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // If different days, show both dates
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  };

  const getDaysRemaining = (date) => {
    const today = new Date();
    const eventDate = new Date(date);
    const diffTime = eventDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  useEffect(() => {
    if (eventType && typeof eventType === "string") {
      const capitalizedEventType =
        eventType.charAt(0).toUpperCase() + eventType.slice(1).toLowerCase();
      if (
        filterOptions.eventTypes?.includes(capitalizedEventType) &&
        filters.eventType !== capitalizedEventType
      ) {
        setFilters((prev) => ({ ...prev, eventType: capitalizedEventType }));
        setShowFilterPanel(true);
      }
    } else if (!eventType && filters.eventType) {
      setFilters((prev) => ({ ...prev, eventType: "" }));
    }
  }, [eventType, filterOptions.eventTypes]);

  

  useEffect(() => {
    const handleError = (event) => {
      console.error("[Events] Global error:", event.error);
    };
    window.addEventListener("error", handleError);
    return () => window.removeEventListener("error", handleError);
  }, []);

  const handleFilterChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFilters((prev) => {
      const newFilters = { ...prev, [name]: value };
      if (name === "eventType") {
        const newUrl = value
          ? `/events?eventType=${value.toLowerCase()}`
          : "/events";
        router.push(newUrl, undefined, { shallow: true });
      }
      return newFilters;
    });
  };

  const handleResetFilters = (e) => {
    e.preventDefault();
    setFilters({
      eventType: "",
      tier_restriction: "",
    });
    setShowFilterPanel(false);
    router.push("/events", undefined, { shallow: true });
  };

  const handleRegister = (event) => {
    if (!hasTierAccess(event.tier_restriction, user)) {
      toast.error(
        `This event is available to ${normalizeTier(
          event.tier_restriction
        )} only. Consider upgrading your membership to register.`
      );
      return;
    }
    handleEventRegistration(event.id);
  };

  const handleEventClick = (event) => {
    console.log('Events page handleEventClick called with:', event);
    setSelectedEvent(event);
    setIsEventModalOpen(true);
  };

  const handleCloseEventModal = () => {
    setIsEventModalOpen(false);
    setSelectedEvent(null);
  };

  const tabs = [
    { id: "all", label: "All Events", icon: "mdi:view-grid" },
    { id: "accessible", label: "For Your Tier", icon: "mdi:accessibility" },
    { id: "trending", label: "Trending", icon: "mdi:trending-up" },
    { id: "upcoming", label: "Upcoming", icon: "mdi:clock-fast" },
    {
      id: "registrations",
      label: "My Registrations",
      icon: "mdi:calendar-check",
    },
  ];


  const filteredByTab =
    activeTab === "all"
      ? events
      : events.filter((event) => {
          if (activeTab === "accessible") {
            return hasTierAccess(event.tier_restriction, user);
          }
          if (activeTab === "upcoming") {
            const eventDate = new Date(event.date);
            const today = new Date();
            const diffTime = eventDate - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays <= 7 && diffDays >= 0;
          }
          if (activeTab === "trending") {
            return event.trending;
          }
          return true;
        });

  if (userLoading || eventsLoading) {
    return LoadingComponent;
  }

  if (!user) {
    router.push("/");
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
        mode === "dark"
          ? "bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-white"
          : "bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900"
      }`}
    >
      <Toaster />
      <HrHeader
        toggleSidebar={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
        sidebarState={sidebarState}
        user={user}
        mode={mode}
        toggleMode={toggleMode}
        onLogout={handleLogout}
      />
      <div className="flex flex-1">
        <HrSidebar
          isOpen={isSidebarOpen}
          user={user}
          mode={mode}
          toggleSidebar={toggleSidebar}
          onLogout={handleLogout}
          setDragOffset={updateDragOffset}
          toggleMode={toggleMode}
        />
        <div
          className={`content-container flex-1 p-4 md:p-6 lg:p-8 transition-all duration-300 ${
            isSidebarOpen && !isMobile ? "sidebar-open" : ""
          }`}
          style={{
            marginLeft: isMobile ? "0px" : isSidebarOpen ? "200px" : "80px",
          }}
        >
          <div className="max-w-7xl mx-auto space-y-6">
            <TitleCard
              title={title}
              description={description}
              mode={mode}
              user={user}
              Icon={Icon}
              Link={Link}
              TierBadge={TierBadge}
              JobTypeBadge={JobTypeBadge}
              toast={toast}
              pageTable="events"
              lastUpdated={latestEventsDate}
            />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <TabsSelector
                tabs={tabs}
                selectedTab={activeTab}
                onSelect={(id) => {
                  if (id === "registrations") {
                    if (!eventsLoading) setShowRegistrationsModal(true);
                  } else {
                    setActiveTab(id);
                  }
                }}
                mode={mode}
              />

              <button
                onClick={() => setShowFilterPanel(!showFilterPanel)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition ${
                  mode === "dark"
                    ? "bg-gray-800 hover:bg-gray-700"
                    : "bg-white hover:bg-gray-100"
                } ${showFilterPanel ? "ring-2 ring-blue-500" : ""} shadow-sm`}
              >
                <Icon icon="mdi:filter-variant" />
                <span>Filters</span>
                {Object.values(filters).some((val) => val !== "") && (
                  <span className="flex items-center justify-center w-5 h-5 text-xs font-medium rounded-full bg-blue-600 text-white">
                    {Object.values(filters).filter((val) => val !== "").length}
                  </span>
                )}
              </button>
            </div>

            {showFilterPanel && (
              <div
                className={`rounded-2xl shadow-lg overflow-hidden transition-all ${
                  mode === "dark"
                    ? "bg-gray-800 border border-gray-700"
                    : "bg-white"
                }`}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-lg font-semibold">
                      <Icon
                        icon="mdi:filter-variant"
                        className="text-blue-500"
                      />
                      <span>Refine Your Search</span>
                    </div>
                    <button
                      onClick={handleResetFilters}
                      className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500 transition"
                    >
                      <Icon icon="mdi:restart" />
                      Reset All
                    </button>
                  </div>

                  <form
                    onSubmit={(e) => e.preventDefault()}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    {[
                      {
                        key: "eventType",
                        icon: "mdi:calendar-star",
                        label: "Event Type",
                      },
                      {
                        key: "tier_restriction",
                        icon: "mdi:crown-outline",
                        label: "Tier",
                      },
                    ].map(({ key, icon, label }) => (
                      <div key={key} className="space-y-1">
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center gap-1.5">
                          <Icon icon={icon} />
                          {label}
                        </label>
                        <select
                          name={key}
                          value={filters[key]}
                          onChange={handleFilterChange}
                          className={`w-full p-2.5 rounded-lg border ${
                            mode === "dark"
                              ? "bg-gray-700 border-gray-600 text-white"
                              : "bg-white border-gray-200 text-gray-800"
                          } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                        >
                          <option value="">All {label}s</option>
                          {(filterOptions[`${key}s`] || []).map((val, idx) => (
                            <option key={`${val}-${idx}`} value={val}>
                              {val}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </form>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center">
              <div
                className={`px-4 py-2 rounded-lg ${
                  mode === "dark" ? "bg-gray-800" : "bg-white"
                } shadow-sm`}
              >
                <span className="font-semibold">{filteredByTab.length}</span>
                <span className="text-gray-600 dark:text-gray-400">
                  {" "}
                  events found
                </span>
              </div>

              <div className="text-sm text-gray-500 dark:text-gray-400">
                Showing {Math.min(12, filteredByTab.length)} of{" "}
                {filteredByTab.length}
              </div>
            </div>

            <RegisteredEventsModal
              isOpen={showRegistrationsModal}
              onClose={() => setShowRegistrationsModal(false)}
              registeredEvents={registeredEvents || []}
              mode={mode}
              formatDate={formatDate}
              getDaysRemaining={getDaysRemaining}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredByTab.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  mode={mode}
                  onRegister={handleEventRegistration}
                  isRegistered={registeredEvents.some(reg => reg.id === event.id)}
                  isRestricted={!hasTierAccess(event.tier_restriction, user)}
                  onRestrictedClick={() => {
                    toast.error(
                      `This event is available to ${normalizeTier(
                        event.tier_restriction
                      )} only. Consider upgrading your membership to register.`
                    );
                  }}
                  onClick={handleEventClick}
                  Icon={Icon}
                />
              ))}
            </div>

            {filteredByTab.length === 0 && (
              <div
                className={`text-center py-12 rounded-2xl ${
                  mode === "dark" ? "bg-gray-800" : "bg-white"
                } shadow-sm border dark:border-gray-700`}
              >
                <Icon
                  icon="mdi:calendar-remove"
                  className="inline-block text-5xl text-gray-400 mb-4"
                />
                <h3 className="text-xl font-semibold mb-2">No Events Found</h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                  No events match your current filters. Try adjusting your
                  search criteria or check back later for new events.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="mt-6 px-6 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            )}

            {filteredByTab.length > 12 && (
              <div className="flex justify-center mt-8">
                <div className="flex items-center space-x-2">
                  <button
                    className={`w-10 h-10 flex items-center justify-center rounded-lg ${
                      mode === "dark"
                        ? "bg-gray-800 hover:bg-gray-700"
                        : "bg-white hover:bg-gray-100"
                    } border dark:border-gray-700 shadow-sm`}
                  >
                    <Icon icon="mdi:chevron-left" />
                  </button>

                  {[1, 2, 3].map((num) => (
                    <button
                      key={num}
                      className={`w-10 h-10 flex items-center justify-center rounded-lg font-medium ${
                        num === 1
                          ? "bg-blue-600 text-white"
                          : mode === "dark"
                          ? "bg-gray-800 hover:bg-gray-700"
                          : "bg-white hover:bg-gray-100"
                      } border dark:border-gray-700 shadow-sm`}
                    >
                      {num}
                    </button>
                  ))}

                  <button
                    className={`w-10 h-10 flex items-center justify-center rounded-lg ${
                      mode === "dark"
                        ? "bg-gray-800 hover:bg-gray-700"
                        : "bg-white hover:bg-gray-100"
                    } border dark:border-gray-700 shadow-sm`}
                  >
                    <Icon icon="mdi:chevron-right" />
                  </button>
                </div>
              </div>
            )}
          </div>
          <SimpleFooter mode={mode} isSidebarOpen={isSidebarOpen} />
        </div>
      </div>

      {/* Event Details Modal */}
      <SimpleModal
        isOpen={isEventModalOpen}
        onClose={handleCloseEventModal}
        title={selectedEvent?.title || "Event Details"}
        mode={mode}
        width="max-w-4xl"
      >
        {selectedEvent && (
          <div className="space-y-6">
            {/* Event Header */}
            <div className="flex items-start space-x-4">
              <div
                className={`flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center ${
                  mode === "dark"
                    ? "bg-gray-700/50 text-paan-blue"
                    : "bg-white text-paan-yellow"
                }`}
              >
                <Icon icon="mdi:calendar-star" className="text-3xl" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2">{selectedEvent.title}</h3>
                {selectedEvent.event_type && (
                  <p className={`text-sm font-medium ${
                    mode === "dark" ? "text-gray-300" : "text-gray-600"
                  }`}>
                    {selectedEvent.event_type}
                  </p>
                )}
              </div>
              <div className="flex-shrink-0">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  mode === "dark" 
                    ? "bg-blue-900/30 text-blue-400 border border-blue-700/50"
                    : "bg-blue-100 text-blue-800 border border-blue-200"
                }`}>
                  {selectedEvent.tier_restriction || "All Members"}
                </span>
              </div>
            </div>

            {/* Banner Image in Modal */}
            {selectedEvent.banner_image && (
              <div className="relative h-100 rounded-lg overflow-hidden">
                <Image
                  src={selectedEvent.banner_image}
                  width={800}
                  height={200}
                  alt={`Banner for ${selectedEvent.title}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}

            {/* Description */}
            {selectedEvent.description && (
              <div>
                <h4 className={`text-lg font-semibold mb-2 ${
                  mode === "dark" ? "text-gray-200" : "text-gray-800"
                }`}>
                  Description
                </h4>
                <p className={`text-sm leading-relaxed ${
                  mode === "dark" ? "text-gray-300" : "text-gray-600"
                }`}>
                  {selectedEvent.description}
                </p>
              </div>
            )}

            {/* Event Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date */}
              <div className={`p-4 rounded-lg ${
                mode === "dark" ? "bg-gray-800/50" : "bg-gray-50"
              }`}>
                <div className="flex items-center space-x-2 mb-2">
                  <Icon icon="mdi:calendar" className="text-lg text-paan-red" />
                  <span className={`font-semibold ${
                    mode === "dark" ? "text-gray-200" : "text-gray-800"
                  }`}>
                    {new Date(selectedEvent.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <p className={`text-sm ${
                  mode === "dark" ? "text-gray-400" : "text-gray-600"
                }`}>
                  Event Date & Time
                </p>
              </div>

              {/* Location */}
              {selectedEvent.location && (
                <div className={`p-4 rounded-lg ${
                  mode === "dark" ? "bg-gray-800/50" : "bg-gray-50"
                }`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon icon="mdi:map-marker" className="text-lg text-paan-yellow" />
                    <span className={`font-semibold ${
                      mode === "dark" ? "text-gray-200" : "text-gray-800"
                    }`}>
                      {selectedEvent.location}
                    </span>
                  </div>
                  <p className={`text-sm ${
                    mode === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}>
                    Location
                  </p>
                </div>
              )}

              {/* Virtual Event */}
              {selectedEvent.is_virtual && (
                <div className={`p-4 rounded-lg ${
                  mode === "dark" ? "bg-gray-800/50" : "bg-gray-50"
                }`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon icon="mdi:video" className="text-lg text-paan-blue" />
                    <span className={`font-semibold ${
                      mode === "dark" ? "text-paan-blue" : "text-paan-blue"
                    }`}>
                      Virtual Event
                    </span>
                  </div>
                  <p className={`text-sm ${
                    mode === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}>
                    Event Type
                  </p>
                </div>
              )}

              {/* Registration Status */}
              <div className={`p-4 rounded-lg ${
                mode === "dark" ? "bg-gray-800/50" : "bg-gray-50"
              }`}>
                <div className="flex items-center space-x-2 mb-2">
                  <Icon 
                    icon={registeredEvents.some(reg => reg.id === selectedEvent.id) ? "mdi:check-circle" : "mdi:account-plus"} 
                    className={`text-lg ${registeredEvents.some(reg => reg.id === selectedEvent.id) ? "text-green-500" : "text-paan-yellow"}`} 
                  />
                  <span className={`font-semibold ${
                    mode === "dark" 
                      ? registeredEvents.some(reg => reg.id === selectedEvent.id) ? "text-green-400" : "text-gray-200"
                      : registeredEvents.some(reg => reg.id === selectedEvent.id) ? "text-green-600" : "text-gray-800"
                  }`}>
                    {registeredEvents.some(reg => reg.id === selectedEvent.id) ? "Registered" : "Not Registered"}
                  </span>
                </div>
                <p className={`text-sm ${
                  mode === "dark" ? "text-gray-400" : "text-gray-600"
                }`}>
                  Registration Status
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleCloseEventModal}
                className={`px-6 py-3 text-sm font-medium rounded-xl border transition-all duration-200 ${
                  mode === "dark"
                    ? "border-gray-600 text-gray-200 bg-gray-800 hover:bg-gray-700"
                    : "border-gray-200 text-gray-700 bg-white hover:bg-gray-50"
                }`}
              >
                Close
              </button>
              {!registeredEvents.some(reg => reg.id === selectedEvent.id) && (
                <button
                  onClick={() => {
                    if (selectedEvent.registration_link) {
                      window.open(selectedEvent.registration_link, '_blank', 'noopener,noreferrer');
                    } else {
                      handleEventRegistration(selectedEvent.id);
                    }
                  }}
                  className={`px-6 py-3 text-sm font-medium rounded-xl text-white transition-all duration-200 ${
                    selectedEvent.registration_link
                      ? "bg-paan-red hover:bg-paan-red/80"
                      : "bg-paan-blue hover:bg-paan-blue/80"
                  } ${
                    mode === "dark" ? "shadow-white/10" : "shadow-gray-200"
                  }`}
                >
                  {selectedEvent.registration_link ? "Register Online" : "Register Now"}
                </button>
              )}
            </div>
          </div>
        )}
      </SimpleModal>
    </div>
  );
}
