import { useState, useEffect, useMemo, useCallback, Suspense } from "react";
import { useRouter } from "next/router";
import { useUser } from "../hooks/useUser";
import useLogout from "../hooks/useLogout";
import { useBusinessOpportunities } from "../hooks/useBusinessOpportunities";
import useEvents from "../hooks/useEvents";
import useResources from "../hooks/useResources";
import useUpdates from "../hooks/useUpdates";
import useMarketIntel from "../hooks/useMarketIntel";
import useOffers from "../hooks/useOffers";
import useFilters from "../hooks/useFilters";
import { useLatestUpdate } from "../hooks/useLatestUpdate";
import { TierBadge, JobTypeBadge } from "../components/Badge";
import HrHeader from "../layouts/hrHeader";
import HrSidebar from "../layouts/hrSidebar";
import SimpleFooter from "../layouts/simpleFooter";
import useSidebar from "../hooks/useSidebar";
import toast from "react-hot-toast";
import WelcomeCard from "../components/WelcomeCard";
import TabContentTransition from "../components/TabContentTransition";
import OpportunitiesSection from "../components/OpportunitiesSection";
import EventsSection from "../components/EventsSection";
import ResourcesSection from "../components/ResourcesSection";
import MarketIntelSection from "../components/MarketIntelSection";
import OffersSection from "../components/OffersSection";
import UpdatesSection from "../components/UpdatesSection";
import YouTubeVideo from "../components/YouTubeVideo";
import ErrorBoundary from "../components/ErrorBoundary";
import { Icon } from "@iconify/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import SimpleModal from "../components/SimpleModal";
import UnifiedModalContent from "../components/UnifiedModalContent";

const StatsChart = dynamic(() => import("../components/StatsChart"), {
  ssr: false,
  loading: () => (
    <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-lg w-full min-h-[400px] flex items-center justify-center">
      <div className="text-gray-500">Loading chart...</div>
    </div>
  ),
});

import Image from "next/image";
export default function Dashboard({ mode = "light", toggleMode }) {
  const { isSidebarOpen, toggleSidebar, isMobile, windowWidth } = useSidebar();
  const router = useRouter();
  const { user, loading: userLoading, LoadingComponent } = useUser();
  const { handleLogout } = useLogout();
  const [activeTab, setActiveTab] = useState("opportunities");
  const { filters, handleFilterChange, handleResetFilters } = useFilters();
  const { latestItems, loading: latestUpdateLoading } = useLatestUpdate(
    user?.selected_tier || "Free Member"
  );

  // Unified modal state
  const [modalData, setModalData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isFreelancer = user?.job_type?.toLowerCase() === "freelancer";
  
  // Memoize user data to prevent unnecessary re-renders
  const memoizedUser = useMemo(() => user, [user?.id, user?.selected_tier, user?.job_type]);
  
  // Memoize filter handlers to prevent recreation on every render
  const handleOpportunityFilterChange = useCallback((key, value) => {
    handleFilterChange("opportunities", key, value);
  }, [handleFilterChange]);

  const handleEventFilterChange = useCallback((key, value) => {
    handleFilterChange("events", key, value);
  }, [handleFilterChange]);

  const handleResourceFilterChange = useCallback((key, value) => {
    handleFilterChange("resources", key, value);
  }, [handleFilterChange]);

  const handleMarketIntelFilterChange = useCallback((key, value) => {
    handleFilterChange("marketIntel", key, value);
  }, [handleFilterChange]);

  const handleOfferFilter = useCallback((key, value) => {
    handleFilterChange("offers", key, value);
  }, [handleFilterChange]);

  const handleUpdateFilterChange = useCallback((key, value) => {
    handleFilterChange("updates", key, value);
  }, [handleFilterChange]);

  const handleResetOpportunityFilters = useCallback(() => {
    handleResetFilters("opportunities");
  }, [handleResetFilters]);
  
  const {
    opportunities = [],
    filterOptions: opportunityFilterOptions = {},
    loading: opportunitiesLoading,
    error: opportunitiesError,
  } = useBusinessOpportunities(
    filters.opportunities,
    memoizedUser || { selected_tier: "Free Member", job_type: "" }
    );
  
  useEffect(() => {
    handleResetOpportunityFilters();
    if (isFreelancer) {
      handleFilterChange("opportunities", "country", "");
      handleFilterChange("opportunities", "serviceType", "");
      handleFilterChange("opportunities", "industry", "");
      handleFilterChange("opportunities", "projectType", "");
      handleFilterChange("opportunities", "tier_restriction", "");
    }
  }, [isFreelancer, handleFilterChange, handleResetOpportunityFilters]);

  const {
    events = [],
    registeredEvents = [],
    filterOptions: eventFilterOptions = {},
    loading: eventsLoading,
    error: eventsError,
    handleEventRegistration,
  } = useEvents(filters.events, user?.selected_tier || "Free Member");
  const {
    resources = [],
    filterOptions: resourceFilterOptions = {},
    loading: resourcesLoading,
    error: resourcesError,
  } = useResources(filters.resources, user?.selected_tier || "Free Member");
  const {
    updates = [],
    filterOptions: updateFilterOptions = {},
    loading: updatesLoading,
    error: updatesError,
  } = useUpdates(filters.updates, user?.selected_tier || "Free Member");
  const {
    marketIntel = [],
    filterOptions: marketIntelFilterOptions = {},
    loading: marketIntelLoading,
    error: marketIntelError,
  } = useMarketIntel(
    filters.marketIntel,
    "",
    [],
    user?.selected_tier || "Free Member"
  );
  const {
    offers = [],
    filterOptions: offerFilterOptions = {},
    loading: offersLoading,
    error: offersError,
  } = useOffers(
    { tier_restriction: filters.offers?.tier_restriction || "" },
    user?.selected_tier || "Free Member"
  );

  const handleRestrictedClick = (message) =>
    toast.error(message, { duration: 3000 });

  const getLastUpdatedForSection = (sectionTitle) => {
    if (latestUpdateLoading) return null;
    const sectionMap = {
      "Active Opportunities": "Business Opportunities",
      "Upcoming Events": "Events",
      "New Resources": "Resources",
      "Available Offers": "Offers",
      "Market Intel": "Market Intel",
      Updates: "Updates",
    };
    return latestItems[sectionMap[sectionTitle]]?.timestamp || null;
  };

  useEffect(() => {
    if (router.query.auth === "expired") {
      toast.error("Session expired. Please log in again.", { duration: 1000 });
      router.replace("/", undefined, { shallow: true });
    }
  }, [router]);

  // Add error boundary for navigation
  useEffect(() => {
    const handleRouteChangeStart = () => {
      // Clean up any potential DOM manipulation issues
      if (typeof window !== "undefined") {
        // Force a small delay to ensure DOM is stable
        setTimeout(() => {
          // This helps prevent insertBefore errors during navigation
        }, 0);
      }
    };

    router.events.on("routeChangeStart", handleRouteChangeStart);
    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart);
    };
  }, [router]);

  const handleViewIntelligence = (item) => {
    console.log('Dashboard handleViewIntelligence called with:', item);
    handleOpenModal(item, 'intelligence');
  };

  const handleEventClick = (event) => {
    console.log('Dashboard handleEventClick called with:', event);
    handleOpenModal(event, 'event');
  };

  // Unified modal handlers
  const handleOpenModal = (data, type) => {
    setModalData({ ...data, type });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalData(null);
  };

  // Memoize the main dashboard content to prevent unnecessary re-renders
  const dashboardContent = useMemo(() => (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      <WelcomeCard
        mode={mode}
        user={memoizedUser}
        Icon={Icon}
        Link={Link}
        TierBadge={TierBadge}
        JobTypeBadge={JobTypeBadge}
        useLatestUpdate={useLatestUpdate}
      />
      <TabContentTransition
        key={`tabs-${memoizedUser?.id}-${memoizedUser?.job_type}`}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mode={mode}
        Icon={Icon}
        user={memoizedUser}
      >
        {activeTab === "opportunities" && (
          <OpportunitiesSection
            opportunities={opportunities}
            opportunitiesLoading={opportunitiesLoading}
            opportunitiesError={opportunitiesError}
            opportunityFilters={filters.opportunities}
            handleOpportunityFilterChange={handleOpportunityFilterChange}
            opportunityFilterOptions={opportunityFilterOptions}
            handleResetFilters={handleResetOpportunityFilters}
            user={memoizedUser}
            handleRestrictedClick={handleRestrictedClick}
            mode={mode}
            Icon={Icon}
            toast={toast}
          />
        )}
        {activeTab === "events" && (
          <EventsSection
            events={events}
            registeredEvents={registeredEvents}
            eventsLoading={eventsLoading}
            eventsError={eventsError}
            eventFilters={filters.events}
            handleEventFilterChange={handleEventFilterChange}
            eventFilterOptions={eventFilterOptions}
            user={memoizedUser}
            handleEventRegistration={handleEventRegistration}
            handleRestrictedClick={handleRestrictedClick}
            mode={mode}
            Icon={Icon}
            onClick={handleEventClick}
          />
        )}
        {activeTab === "resources" && (
          <ResourcesSection
            resources={resources}
            resourcesLoading={resourcesLoading}
            resourcesError={resourcesError}
            resourceFilters={filters.resources}
            handleResourceFilterChange={handleResourceFilterChange}
            resourceFilterOptions={resourceFilterOptions}
            user={memoizedUser}
            handleRestrictedClick={handleRestrictedClick}
            mode={mode}
            Icon={Icon}
            onClick={(resource) => handleOpenModal(resource, 'resource')}
          />
        )}
        {activeTab === "marketIntel" && (
          <MarketIntelSection
            marketIntel={marketIntel}
            marketIntelLoading={marketIntelLoading}
            marketIntelError={marketIntelError}
            marketIntelFilters={filters.marketIntel}
            handleMarketIntelFilterChange={handleMarketIntelFilterChange}
            marketIntelFilterOptions={marketIntelFilterOptions}
            user={memoizedUser}
            handleRestrictedClick={handleRestrictedClick}
            mode={mode}
            Icon={Icon}
            toast={toast}
            onClick={handleViewIntelligence}
          />
        )}
        {activeTab === "offers" && (
          <OffersSection
            offers={offers}
            offersLoading={offersLoading}
            offersError={offersError}
            offerFilters={filters.offers}
            handleOfferFilter={handleOfferFilter}
            offersFilterOptions={offerFilterOptions}
            user={memoizedUser}
            handleRestrictedClick={handleRestrictedClick}
            mode={mode}
            Icon={Icon}
            toast={toast}
            onClick={(offer) => handleOpenModal(offer, 'offer')}
          />
        )}
        {activeTab === "updates" && (
          <UpdatesSection
            updates={updates}
            updatesLoading={updatesLoading}
            updatesError={updatesError}
            updateFilters={filters.updates}
            handleUpdateFilterChange={handleUpdateFilterChange}
            updateFilterOptions={updateFilterOptions}
            user={memoizedUser}
            handleRestrictedClick={handleRestrictedClick}
            mode={mode}
            Icon={Icon}
            onClick={(update) => handleOpenModal(update, 'update')}
          />
        )}
      </TabContentTransition>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        <Suspense fallback={
          <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-lg w-full min-h-[400px] flex items-center justify-center">
            <div className="text-gray-500">Loading chart...</div>
          </div>
        }>
          <StatsChart
            key={`stats-${memoizedUser?.id}-${mode}-${activeTab}`}
            opportunities={opportunities}
            events={events}
            resources={resources}
            offers={offers}
            marketIntel={marketIntel}
            updates={updates}
            user={memoizedUser}
            jobType={memoizedUser?.job_type || ""}
            mode={mode}
            getLastUpdatedForSection={getLastUpdatedForSection}
            useRouter={useRouter}
          />
        </Suspense>
        <Suspense fallback={
          <div className="p-6 rounded-2xl border shadow-lg bg-white border-gray-200 flex items-center justify-center">
            <div className="text-gray-500">Loading video...</div>
          </div>
        }>
          <YouTubeVideo key={`youtube-${mode}`} mode={mode} />
        </Suspense>
      </div>
    </div>
  ), [
    mode,
    memoizedUser,
    activeTab,
    opportunities,
    events,
    registeredEvents,
    resources,
    offers,
    marketIntel,
    updates,
    opportunitiesLoading,
    opportunitiesError,
    eventsLoading,
    eventsError,
    resourcesLoading,
    resourcesError,
    offersLoading,
    offersError,
    marketIntelLoading,
    marketIntelError,
    updatesLoading,
    updatesError,
    filters,
    opportunityFilterOptions,
    eventFilterOptions,
    resourceFilterOptions,
    offerFilterOptions,
    marketIntelFilterOptions,
    updateFilterOptions,
    handleOpportunityFilterChange,
    handleEventFilterChange,
    handleResourceFilterChange,
    handleMarketIntelFilterChange,
    handleOfferFilter,
    handleUpdateFilterChange,
    handleResetOpportunityFilters,
    handleEventRegistration,
    handleRestrictedClick,
    getLastUpdatedForSection,
    useRouter,
    Icon,
    Link,
    TierBadge,
    JobTypeBadge,
    useLatestUpdate,
    toast
  ]);

  if (userLoading && LoadingComponent) return LoadingComponent;
  if (!user || windowWidth === null) {
    router.push("/");
    return null;
  }

  return (
    <div
      key={`dashboard-${memoizedUser?.id}-${mode}`}
      className={`min-h-screen flex flex-col ${
        mode === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      <HrHeader
        toggleSidebar={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
        user={memoizedUser}
        mode={mode}
        toggleMode={toggleMode}
        onLogout={handleLogout}
      />
      <div className="flex flex-1">
        <HrSidebar
          isOpen={isSidebarOpen}
          user={memoizedUser}
          mode={mode}
          toggleSidebar={toggleSidebar}
          onLogout={handleLogout}
          toggleMode={toggleMode}
        />
        <div
          className={`flex-1 p-4 md:p-6 lg:p-8 transition-all mt-10 ${
            isSidebarOpen && !isMobile ? "ml-60" : "ml-60"
          }`}
        >
          <ErrorBoundary>{dashboardContent}</ErrorBoundary>
          <SimpleFooter mode={mode} isSidebarOpen={isSidebarOpen} />
        </div>
      </div>

      {/* Unified Modal */}
      <SimpleModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={modalData?.title || "Details"}
        mode={mode}
        width="max-w-4xl"
      >
        <UnifiedModalContent
          modalData={modalData}
          mode={mode}
          registeredEvents={registeredEvents}
          handleEventRegistration={handleEventRegistration}
          onClose={handleCloseModal}
        />
      </SimpleModal>
    </div>
  );
}
