import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useUser } from "@/hooks/useUser";
import useAccessHubs from "@/hooks/useAccessHubs";
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
import AccessHubCard from "@/components/AccessHubCard";
import SimpleModal from "@/components/SimpleModal";
import UnifiedModalContent from "@/components/UnifiedModalContent";
import BookingForm from "@/components/BookingForm";

export default function AccessHubs({ mode = "light", toggleMode }) {
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
  const { spaceType } = router.query;

  const title = "Access Hubs";
  const description =
    "Explore our exclusive access hubs tailored for your membership tier.";

  const [filters, setFilters] = useState({
    spaceType: "",
    tier_restriction: "",
    city: "",
    country: "",
    is_available: "",
    pricing_range: "",
  });
  const [activeTab, setActiveTab] = useState("all");
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [showRegistrationsModal, setShowRegistrationsModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedAccessHub, setSelectedAccessHub] = useState(null);

  // Handle booking button click
  const handleBookNow = (accessHub) => {
    setSelectedAccessHub(accessHub);
    setShowBookingModal(true);
  };

  // Handle booking form close
  const handleBookingClose = () => {
    setShowBookingModal(false);
    setSelectedAccessHub(null);
  };

  // Handle successful booking submission
  const handleBookingSuccess = () => {
    setShowBookingModal(false);
    setSelectedAccessHub(null);
  };

  // Handle restricted access hub clicks
  const handleRestrictedClick = () => {
    toast.error(
      "This access hub is restricted. Please upgrade your membership to access this feature."
    );
  };

  // Modal state for access hub details
  const [modalData, setModalData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    accessHubs,
    registeredAccessHubs,
    filterOptions,
    loading: accessHubsLoading,
    error,
    accessHubsLoading: registrationLoading,
    handleAccessHubRegistration,
  } = useAccessHubs(filters, user);

  // Get latest access hub date
  const latestAccessHubsDate =
    accessHubs.length > 0
      ? new Date(
          Math.max(
            ...accessHubs.map((accessHub) => new Date(accessHub.updated_at))
          )
        ).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "No access hubs available";

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
      return `${formatDate(startDate)} - ${end.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    }

    // If different days, show both dates
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  };

  const getDaysRemaining = (date) => {
    const today = new Date();
    const accessHubDate = new Date(date);
    const diffTime = accessHubDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Sort access hubs by availability, then by user access and tier
  const sortAccessHubsByAccessAndTier = (accessHubs) => {
    const tierOrder = {
      "Gold Member": 0,
      "Full Member": 1,
      "Associate Member": 2,
      "Free Member": 3,
    };

    return [...accessHubs].sort((a, b) => {
      // First, sort by availability (available hubs first)
      if (a.is_available && !b.is_available) return -1;
      if (!a.is_available && b.is_available) return 1;

      // Then sort by user access
      const aHasAccess = hasTierAccess(a.tier_restriction, user);
      const bHasAccess = hasTierAccess(b.tier_restriction, user);

      if (aHasAccess && !bHasAccess) return -1;
      if (!aHasAccess && bHasAccess) return 1;

      // If both have same access status, sort by tier
      if (aHasAccess === bHasAccess) {
        const aTier = normalizeTier(a.tier_restriction);
        const bTier = normalizeTier(b.tier_restriction);
        const aTierIndex = tierOrder[aTier] ?? 4; // Default to lowest priority
        const bTierIndex = tierOrder[bTier] ?? 4;
        return aTierIndex - bTierIndex;
      }

      return 0;
    });
  };

  useEffect(() => {
    if (spaceType && typeof spaceType === "string") {
      const capitalizedSpaceType =
        spaceType.charAt(0).toUpperCase() + spaceType.slice(1).toLowerCase();
      if (
        filterOptions.spaceTypes?.includes(capitalizedSpaceType) &&
        filters.spaceType !== capitalizedSpaceType
      ) {
        setFilters((prev) => ({ ...prev, spaceType: capitalizedSpaceType }));
        setShowFilterPanel(true);
      }
    } else if (!spaceType && filters.spaceType) {
      setFilters((prev) => ({ ...prev, spaceType: "" }));
    }
  }, [spaceType, filterOptions.spaceTypes]);

  useEffect(() => {
    const handleError = (accessHub) => {
      console.error("[Access Hubs] Global error:", accessHub.error);
    };
    window.addEventListener("error", handleError);
    return () => window.removeEventListener("error", handleError);
  }, []);

  const handleFilterChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFilters((prev) => {
      const newFilters = { ...prev, [name]: value };
      if (name === "spaceType") {
        const newUrl = value
          ? `/access-hubs?spaceType=${value.toLowerCase()}`
          : "/access-hubs";
        router.push(newUrl, undefined, { shallow: true });
      }
      return newFilters;
    });
  };

  const handleResetFilters = (e) => {
    e.preventDefault();
    setFilters({
      spaceType: "",
      tier_restriction: "",
      city: "",
      country: "",
      is_available: "",
      pricing_range: "",
    });
    setShowFilterPanel(false);
    router.push("/access-hubs", undefined, { shallow: true });
  };

  const handleRegister = (accessHub) => {
    if (!hasTierAccess(accessHub.tier_restriction, user)) {
      toast.error(
        `This access hub is available to ${normalizeTier(
          accessHub.tier_restriction
        )} only. Consider upgrading your membership to register.`
      );
      return;
    }
    handleAccessHubRegistration(accessHub.id);
  };

  const handleAccessHubClick = (accessHub) => {
    setModalData({ ...accessHub, type: "accessHub" });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalData(null);
  };

  const tabs = [
    { id: "all", label: "All Access Hubs", icon: "mdi:view-grid" },
    {
      id: "registrations",
      label: "My Registrations",
      icon: "mdi:calendar-check",
    },
  ];

  const filteredByTab =
    activeTab === "all"
      ? sortAccessHubsByAccessAndTier(accessHubs)
      : activeTab === "registrations"
      ? registeredAccessHubs
      : sortAccessHubsByAccessAndTier(accessHubs);

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
          className={`flex-1 p-4 md:p-6 lg:p-8 transition-all ${
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
              pageTable="access-hubs"
              lastUpdated={latestAccessHubsDate}
            />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <TabsSelector
                tabs={tabs}
                selectedTab={activeTab}
                onSelect={(id) => {
                  if (id === "registrations") {
                    if (!accessHubsLoading) setShowRegistrationsModal(true);
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
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                  >
                    {[
                      {
                        key: "spaceType",
                        icon: "mdi:office-building",
                        label: "Space Type",
                        options: filterOptions.spaceTypes || [],
                        optionLabel: "All Space Types",
                      },
                      {
                        key: "tier_restriction",
                        icon: "mdi:crown-outline",
                        label: "Tier",
                        options: filterOptions.tiers || [],
                        optionLabel: "All Tiers",
                      },
                      {
                        key: "city",
                        icon: "mdi:city",
                        label: "City",
                        options: filterOptions.cities || [],
                        optionLabel: "All Cities",
                      },
                      {
                        key: "country",
                        icon: "mdi:earth",
                        label: "Country",
                        options: filterOptions.countries || [],
                        optionLabel: "All Countries",
                      },
                      {
                        key: "is_available",
                        icon: "mdi:check-circle-outline",
                        label: "Availability",
                        options: filterOptions.availability || [],
                        optionLabel: "All Availability",
                      },
                      {
                        key: "pricing_range",
                        icon: "mdi:currency-usd",
                        label: "Price Range",
                        options: filterOptions.pricingRanges || [],
                        optionLabel: "All Prices",
                      },
                    ].map(({ key, icon, label, options, optionLabel }) => (
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
                          <option value="">{optionLabel}</option>
                          {options.map((val, idx) => (
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
                  access hubs found
                </span>
              </div>

              <div className="text-sm text-gray-500 dark:text-gray-400">
                Showing {Math.min(12, filteredByTab.length)} of{" "}
                {filteredByTab.length}
              </div>
            </div>

            <SimpleModal
              isOpen={showRegistrationsModal}
              onClose={() => setShowRegistrationsModal(false)}
              title="My Registered Access Hubs"
              mode={mode}
              width="max-w-2xl"
            >
              {registeredAccessHubs && registeredAccessHubs.length > 0 ? (
                <div className="space-y-4">
                  {registeredAccessHubs.map((accessHub) => (
                    <div
                      key={accessHub.registration_id}
                      className={`p-4 rounded-lg border ${
                        mode === "dark" ? "bg-gray-700/50" : "bg-gray-50"
                      } animate-fade-in`}
                    >
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          {accessHub.title}
                        </h3>
                        <TierBadge
                          tier={accessHub.tier_restriction}
                          mode={mode}
                        />
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {accessHub.city && accessHub.country
                          ? `${accessHub.city}, ${accessHub.country}`
                          : ""}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          {accessHub.status}
                        </span>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Registered on{" "}
                          {accessHub.registered_at
                            ? formatDate(accessHub.registered_at)
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-300 text-center">
                  You haven't registered for any access hubs yet.
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
              {accessHubsLoading && (
                <div className="col-span-full flex justify-center py-8">
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-paan-blue"></div>
                    <span>Loading access hubs...</span>
                  </div>
                </div>
              )}
              {!accessHubsLoading &&
                filteredByTab.map((accessHub) => (
                  <AccessHubCard
                    key={accessHub.id}
                    accessHub={accessHub}
                    mode={mode}
                    onRegister={handleAccessHubRegistration}
                    isRegistered={registeredAccessHubs.some(
                      (hub) =>
                        hub.access_hub_id === accessHub.id &&
                        hub.status === "registered"
                    )}
                    isRestricted={
                      !hasTierAccess(accessHub.tier_restriction, user)
                    }
                    onRestrictedClick={handleRestrictedClick}
                    onBookNow={handleBookNow}
                    onClick={handleAccessHubClick}
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
                <h3 className="text-xl font-semibold mb-2">
                  No Access Hubs Found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                  No access hubs match your current filters. Try adjusting your
                  search criteria or check back later for new access hubs.
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

      {/* Access Hub Details Modal */}
      <SimpleModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={`Book ${modalData?.title || "Access Hub Details"}`}
        mode={mode}
        width="max-w-4xl"
      >
        <UnifiedModalContent
          modalData={modalData}
          mode={mode}
          user={user}
          registeredAccessHubs={registeredAccessHubs}
          handleAccessHubRegistration={handleAccessHubRegistration}
          onClose={handleCloseModal}
        />
      </SimpleModal>

      {/* Booking Modal */}
      <SimpleModal
        isOpen={showBookingModal}
        onClose={handleBookingClose}
        title={
          selectedAccessHub ? `Book ${selectedAccessHub.title}` : "Book Space"
        }
        mode={mode}
        width="max-w-2xl"
      >
        <div className="max-h-[80vh] overflow-y-auto">
          <BookingForm
            user={user}
            onClose={handleBookingClose}
            mode={mode}
            accessHub={selectedAccessHub}
            onSuccess={handleBookingSuccess}
          />
        </div>
      </SimpleModal>
    </div>
  );
}
