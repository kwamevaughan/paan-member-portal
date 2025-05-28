import { React, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useUser } from "@/hooks/useUser";
import useLogout from "@/hooks/useLogout";
import { useBusinessOpportunities } from "@/hooks/useBusinessOpportunities";
import useEvents from "@/hooks/useEvents";
import useResources from "@/hooks/useResources";
import useUpdates from "@/hooks/useUpdates";
import useMarketIntel from "@/hooks/useMarketIntel";
import useOffers from "@/hooks/useOffers";
import useFilters from "@/hooks/useFilters";
import { useLatestUpdate } from "@/hooks/useLatestUpdate";
import { TierBadge, JobTypeBadge } from "@/components/Badge";
import HrHeader from "@/layouts/hrHeader";
import HrSidebar from "@/layouts/hrSidebar";
import SimpleFooter from "@/layouts/simpleFooter";
import useSidebar from "@/hooks/useSidebar";
import toast, { Toaster } from "react-hot-toast";
import WelcomeCard from "@/components/WelcomeCard";
import DashboardTabs from "@/components/DashboardTabs";
import TabContentTransition from "@/components/TabContentTransition";
import QuickStatsCard from "@/components/QuickStatsCard";
import OpportunitiesSection from "@/components/OpportunitiesSection";
import EventsSection from "@/components/EventsSection";
import ResourcesSection from "@/components/ResourcesSection";
import MarketIntelSection from "@/components/MarketIntelSection";
import OffersSection from "@/components/OffersSection";
import UpdatesSection from "@/components/UpdatesSection";
import { canAccessTier } from "@/utils/tierUtils";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Link from "next/link";
import { Icon } from "@iconify/react";

export default function Dashboard({ mode = "light", toggleMode }) {
  const { isSidebarOpen, toggleSidebar, sidebarState, updateDragOffset } =
    useSidebar();
  const router = useRouter();
  const { user, loading: userLoading, LoadingComponent } = useUser();
  const { handleLogout } = useLogout();
  const [activeTab, setActiveTab] = useState("opportunities");
  const { filters, handleFilterChange } = useFilters();
  const {
    latestItems,
    loading: latestUpdateLoading,
    error: latestUpdateError,
  } = useLatestUpdate(
    user?.selected_tier?.replace(/\(.*?\)/g, "").trim() || "Free Member"
  );

  // Fetch data
  const {
    opportunities,
    filterOptions: opportunityFilterOptions,
    loading: opportunitiesLoading,
    error: opportunitiesError,
  } = useBusinessOpportunities(
    filters.opportunities,
    user?.selected_tier?.replace(/\(.*?\)/g, "").trim() || "Free Member"
  );

  const {
    events,
    registeredEvents,
    filterOptions: eventFilterOptions,
    loading: eventsLoading,
    error: eventsError,
    handleEventRegistration,
  } = useEvents(
    filters.events,
    user?.selected_tier?.replace(/\(.*?\)/g, "").trim() || "Free Member"
  );

  const {
    resources,
    filterOptions: resourceFilterOptions,
    loading: resourcesLoading,
    error: resourcesError,
  } = useResources(filters.resources);

  const {
    updates,
    filterOptions: updateFilterOptions,
    loading: updatesLoading,
    error: updatesError,
  } = useUpdates(
    filters.updates,
    user?.selected_tier?.replace(/\(.*?\)/g, "").trim() || "Free Member"
  );

  const {
    marketIntel,
    filterOptions: marketIntelFilterOptions,
    loading: marketIntelLoading,
    error: marketIntelError,
  } = useMarketIntel(
    filters.marketIntel,
    "",
    [],
    user?.selected_tier?.replace(/\(.*?\)/g, "").trim() || "Free Member"
  );

  const {
    offers,
    filterOptions: offerFilterOptions,
    loading: offersLoading,
    error: offersError,
  } = useOffers(
    filters.offers,
    user?.selected_tier?.replace(/\(.*?\)/g, "").trim() || "Free Member"
  );

  // Debug offers
  useEffect(() => {
    console.log("Offers:", offers);
    console.log("Offers Loading:", offersLoading);
    console.log("Offers Error:", offersError);
    console.log("Offer Filters:", filters.offers);
    console.log("Offer Filter Options:", offerFilterOptions);
  }, [offers, offersLoading, offersError, filters.offers, offerFilterOptions]);

  // Handle restricted access
  const handleRestrictedClick = (message) => {
    toast.error(message, { duration: 3000 });
  };

  // Map card titles to section names for lastUpdated
  const getLastUpdatedForSection = (sectionTitle) => {
    if (latestUpdateLoading || latestUpdateError) return null;
    const sectionMap = {
      "Active Opportunities": "Business Opportunities",
      "Upcoming Events": "Events",
      "New Resources": "Resources",
      "Available Offers": "Offers",
      "Market Intel": "Market Intel",
      Updates: "Updates",
    };
    const section = sectionMap[sectionTitle];
    return latestItems[section]?.timestamp || null;
  };

  // Empty state
  if (userLoading && LoadingComponent) return LoadingComponent;
  if (!user) return null;

  return (
    <div
      className={`min-h-screen flex flex-col ${
        mode === "dark"
          ? "bg-gradient-to-brick from-gray-900 via-gray-800 to-gray-900"
          : "bg-gradient-to-brick from-blue-50 via-white to-gray-100"
      }`}
    >
      <Toaster />
      <HrHeader
        toggleSidebar={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
        sidebarState={sidebarState}
        fullName={user?.name ?? "Member"}
        jobTitle={user.job_type}
        selectedTier={user.selected_tier}
        agencyName={user.agencyName}
        mode={mode}
        toggleMode={toggleMode}
        onLogout={handleLogout}
      />
      <div className="flex flex-1">
        <HrSidebar
          isOpen={isSidebarOpen}
          mode={mode}
          toggleSidebar={toggleSidebar}
          onLogout={handleLogout}
          setDragOffset={updateDragOffset}
          toggleMode={toggleMode}
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
          <div className="max-w-7xl mx-auto space-y-12 pb-20">
            <WelcomeCard mode={mode} user={user} />
            <div className="pb-12">
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={24}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                loop={true}
                autoplay={{
                  delay: 5000,
                  disableOnInteraction: false,
                }}
                breakpoints={{
                  640: { slidesPerView: 2 },
                  1024: { slidesPerView: 4 },
                }}
                className="pb-12"
              >
                <SwiperSlide>
                  <Link href="/opportunities">
                    <QuickStatsCard
                      title="Active Opportunities"
                      value={opportunities
                        .filter((item) =>
                          canAccessTier(
                            item.tier_restriction,
                            user.selected_tier
                          )
                        )
                        .length.toString()}
                      icon="mdi:home"
                      color="bg-gradient-to-r from-blue-500 to-blue-600"
                      mode={mode}
                      lastUpdated={getLastUpdatedForSection(
                        "Active Opportunities"
                      )}
                    />
                  </Link>
                </SwiperSlide>
                <SwiperSlide>
                  <Link href="/events">
                    <QuickStatsCard
                      title="Upcoming Events"
                      value={events
                        .filter((item) =>
                          canAccessTier(
                            item.tier_restriction,
                            user.selected_tier
                          )
                        )
                        .length.toString()}
                      icon="mdi:calendar-check"
                      color="bg-gradient-to-r from-green-500 to-green-600"
                      mode={mode}
                      lastUpdated={getLastUpdatedForSection("Upcoming Events")}
                    />
                  </Link>
                </SwiperSlide>
                <SwiperSlide>
                  <Link href="/resources">
                    <QuickStatsCard
                      title="New Resources"
                      value={resources
                        .filter((item) =>
                          canAccessTier(
                            item.tier_restriction,
                            user.selected_tier
                          )
                        )
                        .length.toString()}
                      icon="mdi:folder"
                      color="bg-gradient-to-r from-purple-500 to-purple-600"
                      mode={mode}
                      lastUpdated={getLastUpdatedForSection("New Resources")}
                    />
                  </Link>
                </SwiperSlide>
                <SwiperSlide>
                  <Link href="/offers">
                    <QuickStatsCard
                      title="Available Offers"
                      value={offers
                        .filter((item) =>
                          canAccessTier(
                            item.tier_restriction,
                            user.selected_tier
                          )
                        )
                        .length.toString()}
                      icon="mdi:gift"
                      color="bg-gradient-to-r from-orange-500 to-orange-600"
                      mode={mode}
                      lastUpdated={getLastUpdatedForSection("Available Offers")}
                    />
                  </Link>
                </SwiperSlide>
                <SwiperSlide>
                  <Link href="/market-intel">
                    <QuickStatsCard
                      title="Market Intel"
                      value={marketIntel
                        .filter((item) =>
                          canAccessTier(
                            item.tier_restriction,
                            user.selected_tier
                          )
                        )
                        .length.toString()}
                      icon="mdi:chart-line"
                      color="bg-gradient-to-r from-amber-500 to-amber-600"
                      mode={mode}
                      lastUpdated={getLastUpdatedForSection("Market Intel")}
                    />
                  </Link>
                </SwiperSlide>
                <SwiperSlide>
                  <Link href="/updates">
                    <QuickStatsCard
                      title="Updates"
                      value={updates
                        .filter((item) =>
                          canAccessTier(
                            item.tier_restriction,
                            user.selected_tier
                          )
                        )
                        .length.toString()}
                      icon="mdi:bell"
                      color="bg-gradient-to-r from-pink-500 to-pink-600"
                      mode={mode}
                      lastUpdated={getLastUpdatedForSection("Updates")}
                    />
                  </Link>
                </SwiperSlide>
              </Swiper>
            </div>
            <DashboardTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              mode={mode}
              Icon={Icon}
            />
            <TabContentTransition activeTab={activeTab}>
              {activeTab === "opportunities" && (
                <OpportunitiesSection
                  opportunities={opportunities}
                  opportunitiesLoading={opportunitiesLoading}
                  opportunitiesError={opportunitiesError}
                  opportunityFilters={filters.opportunities}
                  handleOpportunityFilterChange={(key, value) =>
                    handleFilterChange("opportunities", key, value)
                  }
                  opportunityFilterOptions={opportunityFilterOptions}
                  user={user}
                  handleRestrictedClick={handleRestrictedClick}
                  mode={mode}
                  Icon={Icon}
                />
              )}
              {activeTab === "events" && (
                <EventsSection
                  events={events}
                  registeredEvents={registeredEvents}
                  eventsLoading={eventsLoading}
                  eventsError={eventsError}
                  eventFilters={filters.events}
                  handleEventFilterChange={(key, value) =>
                    handleFilterChange("events", key, value)
                  }
                  eventFilterOptions={eventFilterOptions}
                  user={user}
                  handleEventRegistration={handleEventRegistration}
                  handleRestrictedClick={handleRestrictedClick}
                  mode={mode}
                  Icon={Icon}
                />
              )}
              {activeTab === "resources" && (
                <ResourcesSection
                  resources={resources}
                  resourcesLoading={resourcesLoading}
                  resourcesError={resourcesError}
                  resourceFilters={filters.resources}
                  handleResourceFilterChange={(key, value) =>
                    handleFilterChange("resources", key, value)
                  }
                  resourceFilterOptions={resourceFilterOptions}
                  user={user}
                  handleRestrictedClick={handleRestrictedClick}
                  mode={mode}
                  Icon={Icon}
                />
              )}
              {activeTab === "marketIntel" && (
                <MarketIntelSection
                  marketIntel={marketIntel}
                  marketIntelLoading={marketIntelLoading}
                  marketIntelError={marketIntelError}
                  marketIntelFilters={filters.marketIntel}
                  handleMarketIntelFilterChange={(key, value) =>
                    handleFilterChange("marketIntel", key, value)
                  }
                  marketIntelFilterOptions={marketIntelFilterOptions}
                  user={user}
                  handleRestrictedClick={handleRestrictedClick}
                  mode={mode}
                  Icon={Icon}
                />
              )}
              {activeTab === "offers" && (
                <OffersSection
                  offers={offers}
                  offersLoading={offersLoading}
                  offersError={offersError}
                  offerFilters={filters.offers}
                  handleOfferFilterChange={(key, value) =>
                    handleFilterChange("offers", key, value)
                  }
                  offersFilterOptions={offerFilterOptions}
                  user={user}
                  handleRestrictedClick={handleRestrictedClick}
                  mode={mode}
                  Icon={Icon}
                />
              )}
              {activeTab === "updates" && (
                <UpdatesSection
                  updates={updates}
                  updatesLoading={updatesLoading}
                  updatesError={updatesError}
                  updateFilters={filters.updates}
                  handleUpdateFilterChange={(key, value) =>
                    handleFilterChange("updates", key, value)
                  }
                  updateFilterOptions={updateFilterOptions}
                  user={user}
                  handleRestrictedClick={handleRestrictedClick}
                  mode={mode}
                  Icon={Icon}
                />
              )}
            </TabContentTransition>
          </div>
          <SimpleFooter mode={mode} isSidebarOpen={isSidebarOpen} />
        </div>
      </div>
    </div>
  );
}
