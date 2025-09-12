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
import TabsSelector from "@/components/TabsSelector";
import EventCard from "@/components/EventCard";
import SimpleModal from "@/components/SimpleModal";
import UnifiedModalContent from "@/components/UnifiedModalContent";
import AccessCoverageCard from "@/components/AccessCoverageCard";

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
  const [modalData, setModalData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    setModalData({ ...event, type: 'event' });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalData(null);
  };

  const tabs = [
    { id: "all", label: "All Events", icon: "mdi:view-grid" },
    { id: "accessible", label: "For Your Tier", icon: "mdi:accessibility" },
    { id: "upcoming", label: "Upcoming", icon: "mdi:clock-fast" },
    { id: "past", label: "Past Events", icon: "mdi:history" },
    {
      id: "registrations",
      label: "My Registrations",
      icon: "mdi:calendar-check",
    },
  ];


  const filteredByTab =
    activeTab === "all"
      ? events.sort((a, b) => {
          const aDate = new Date(a.date);
          const bDate = new Date(b.date);
          const today = new Date();
          
          // Upcoming events first (future dates)
          const aIsUpcoming = aDate > today;
          const bIsUpcoming = bDate > today;
          
          if (aIsUpcoming && !bIsUpcoming) return -1;
          if (!aIsUpcoming && bIsUpcoming) return 1;
          
          // Within each group, sort by date (earliest first for upcoming, latest first for past)
          if (aIsUpcoming && bIsUpcoming) {
            return aDate - bDate; // Upcoming: earliest first
          } else {
            return bDate - aDate; // Past: latest first
          }
        })
      : events.filter((event) => {
          if (activeTab === "accessible") {
            return hasTierAccess(event.tier_restriction, user);
          }
          if (activeTab === "upcoming") {
            const eventDate = new Date(event.date);
            const today = new Date();
            return eventDate > today;
          }
          if (activeTab === "past") {
            const eventDate = new Date(event.date);
            const today = new Date();
            return eventDate < today;
          }

          return true;
        });

  if (userLoading) {
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
          className={`flex-1 p-4 md:p-6 lg:p-8 transition-all mt-10 ${
            isSidebarOpen && !isMobile ? "ml-60" : "ml-60"
          }`}
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

            <AccessCoverageCard
              mode={mode}
              userTier={user?.selected_tier}
              sectionLabel={"events & workshops"}
              onUpgrade={() => window.open("https://paan.africa/#membership", "_blank", "noopener,noreferrer")}
            />

            <SimpleModal
              isOpen={showRegistrationsModal}
              onClose={() => setShowRegistrationsModal(false)}
              title="My Registered Events"
              mode={mode}
              width="max-w-2xl"
            >
              {registeredEvents && registeredEvents.length > 0 ? (
                <div className="space-y-4">
                  {registeredEvents.map((event) => {
                    const displayTier = normalizeTier(event.tier_restriction);
                    const daysLeft = getDaysRemaining(event.date);
                    return (
                      <div
                        key={event.registration_id}
                        className={`p-4 rounded-lg border ${
                          mode === "dark" ? "bg-gray-700/50" : "bg-gray-50"
                        } animate-fade-in`}
                      >
                        <div className="flex justify-between items-start">
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            {event.title}
                          </h3>
                          <TierBadge tier={event.tier_restriction} mode={mode} />
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                          {event.location || "Virtual"} • {formatDate(event.date)}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <RegistrationStatusBadge
                            status={event.status}
                            mode={mode}
                          />
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Registered on {formatDate(event.registered_at)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-300 text-center">
                  You haven't registered for any events yet.
                </p>
              )}
              <style jsx>{`
                @keyframes fadeIn {
                  from {
                    opacity: 0;
                    transform: translateY(10px);
                  }
                  to {
                    opacity: 1;
                    transform: translateY(0);
                  }
                }
                .animate-fade-in {
                  animation: fadeIn 0.3s ease-out;
                }
              `}</style>
            </SimpleModal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {eventsLoading && (
                <div className="col-span-full flex justify-center py-8">
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-paan-blue"></div>
                    <span>Loading events...</span>
                  </div>
                </div>
              )}
              {!eventsLoading && filteredByTab.map((event) => (
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
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={modalData?.title || "Event Details"}
        mode={mode}
        width="max-w-4xl"
      >
        <UnifiedModalContent
          modalData={modalData}
          mode={mode}
          user={user}
          registeredEvents={registeredEvents}
          handleEventRegistration={handleEventRegistration}
          onClose={handleCloseModal}
        />
      </SimpleModal>
    </div>
  );
}
