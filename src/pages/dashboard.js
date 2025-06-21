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

const StatsChart = dynamic(() => import("../components/StatsChart"), {
  ssr: false,
  loading: () => (
    <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-lg w-full min-h-[400px] flex items-center justify-center">
      <div className="text-gray-500">Loading chart...</div>
    </div>
  ),
});

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

  // Modal state for market intelligence
  const [selectedIntel, setSelectedIntel] = useState(null);
  const [isIntelModalOpen, setIsIntelModalOpen] = useState(false);

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
    console.log('Setting modal state - isIntelModalOpen will be true');
    setSelectedIntel(item);
    setIsIntelModalOpen(true);
    console.log('Modal state set - selectedIntel:', item);
  };

  const handleCloseIntelModal = () => {
    setIsIntelModalOpen(false);
    setSelectedIntel(null);
  };

  // Debug modal state
  console.log('Dashboard render - isIntelModalOpen:', isIntelModalOpen, 'selectedIntel:', selectedIntel);

  // Memoize the main dashboard content to prevent unnecessary re-renders
  const dashboardContent = useMemo(() => (
    <div className="max-w-7xl mx-auto space-y-8 pb-10 pt-14">
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
            toast={toast}
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
          className={`flex-1 p-4 md:p-6 lg:p-8 transition-all ${
            isSidebarOpen && !isMobile ? "ml-52" : "ml-20"
          }`}
        >
          <ErrorBoundary>
            {dashboardContent}
          </ErrorBoundary>
          <SimpleFooter mode={mode} isSidebarOpen={isSidebarOpen} />
        </div>
      </div>

      {/* Market Intelligence Details Modal */}
      <SimpleModal
        isOpen={isIntelModalOpen}
        onClose={handleCloseIntelModal}
        title={selectedIntel?.title || "Market Intelligence Details"}
        mode={mode}
        width="max-w-4xl"
      >
        {selectedIntel && (
          <div className="space-y-6">
            {/* Intelligence Header */}
            <div className="flex items-start space-x-4">
              <div
                className={`flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center ${
                  mode === "dark"
                    ? "bg-gray-700/50 text-paan-blue"
                    : "bg-white text-paan-yellow"
                }`}
              >
                <Icon icon="mdi:chart-line" className="text-3xl" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2">{selectedIntel.title}</h3>
                {selectedIntel.type && (
                  <p className={`text-sm font-medium ${
                    mode === "dark" ? "text-gray-300" : "text-gray-600"
                  }`}>
                    {selectedIntel.type}
                  </p>
                )}
              </div>
              <div className="flex-shrink-0">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  mode === "dark" 
                    ? "bg-blue-900/30 text-blue-400 border border-blue-700/50"
                    : "bg-blue-100 text-blue-800 border border-blue-200"
                }`}>
                  {selectedIntel.tier_restriction || "All Members"}
                </span>
              </div>
            </div>

            {/* Description */}
            {selectedIntel.description && (
              <div>
                <h4 className={`text-lg font-semibold mb-2 ${
                  mode === "dark" ? "text-gray-200" : "text-gray-800"
                }`}>
                  Description
                </h4>
                <p className={`text-sm leading-relaxed ${
                  mode === "dark" ? "text-gray-300" : "text-gray-600"
                }`}>
                  {selectedIntel.description}
                </p>
              </div>
            )}

            {/* Tags */}
            {selectedIntel.tags && selectedIntel.tags.length > 0 && (
              <div>
                <h4 className={`text-lg font-semibold mb-3 ${
                  mode === "dark" ? "text-gray-200" : "text-gray-800"
                }`}>
                  Tags
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedIntel.tags.map((tag, index) => (
                    <span
                      key={index}
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        mode === "dark"
                          ? "bg-gray-700/60 text-gray-300"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      <Icon icon="mdi:tag" className="text-paan-yellow text-sm mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Region */}
              {selectedIntel.region && (
                <div className={`p-4 rounded-lg ${
                  mode === "dark" ? "bg-gray-800/50" : "bg-gray-50"
                }`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon icon="mdi:map-marker" className="text-lg text-paan-yellow" />
                    <span className={`font-semibold ${
                      mode === "dark" ? "text-gray-200" : "text-gray-800"
                    }`}>
                      {selectedIntel.region}
                    </span>
                  </div>
                  <p className={`text-sm ${
                    mode === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}>
                    Region
                  </p>
                </div>
              )}

              {/* Created Date */}
              {selectedIntel.created_at && (
                <div className={`p-4 rounded-lg ${
                  mode === "dark" ? "bg-gray-800/50" : "bg-gray-50"
                }`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon icon="mdi:calendar" className="text-lg text-paan-red" />
                    <span className={`font-semibold ${
                      mode === "dark" ? "text-gray-200" : "text-gray-800"
                    }`}>
                      {new Date(selectedIntel.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className={`text-sm ${
                    mode === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}>
                    Created Date
                  </p>
                </div>
              )}

              {/* Downloadable */}
              {selectedIntel.downloadable && (
                <div className={`p-4 rounded-lg ${
                  mode === "dark" ? "bg-gray-800/50" : "bg-gray-50"
                }`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon icon="mdi:download" className="text-lg text-paan-yellow" />
                    <span className={`font-semibold ${
                      mode === "dark" ? "text-paan-yellow" : "text-paan-yellow"
                    }`}>
                      Available
                    </span>
                  </div>
                  <p className={`text-sm ${
                    mode === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}>
                    Downloadable
                  </p>
                </div>
              )}

              {/* Intel Type */}
              {selectedIntel.intel_type && (
                <div className={`p-4 rounded-lg ${
                  mode === "dark" ? "bg-gray-800/50" : "bg-gray-50"
                }`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon icon="mdi:file-chart" className="text-lg text-paan-blue" />
                    <span className={`font-semibold ${
                      mode === "dark" ? "text-gray-200" : "text-gray-800"
                    }`}>
                      {selectedIntel.intel_type}
                    </span>
                  </div>
                  <p className={`text-sm ${
                    mode === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}>
                    Intelligence Type
                  </p>
                </div>
              )}

              {/* View Count */}
              {selectedIntel.view_count && (
                <div className={`p-4 rounded-lg ${
                  mode === "dark" ? "bg-gray-800/50" : "bg-gray-50"
                }`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon icon="mdi:eye" className="text-lg text-green-500" />
                    <span className={`font-semibold ${
                      mode === "dark" ? "text-green-400" : "text-green-600"
                    }`}>
                      {selectedIntel.view_count}
                    </span>
                  </div>
                  <p className={`text-sm ${
                    mode === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}>
                    Views
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleCloseIntelModal}
                className={`px-6 py-3 text-sm font-medium rounded-xl border transition-all duration-200 ${
                  mode === "dark"
                    ? "border-gray-600 text-gray-200 bg-gray-800 hover:bg-gray-700"
                    : "border-gray-200 text-gray-700 bg-white hover:bg-gray-50"
                }`}
              >
                Close
              </button>
              {selectedIntel.url && (
                <button
                  onClick={() => window.open(selectedIntel.url, "_blank")}
                  className={`px-6 py-3 text-sm font-medium rounded-xl text-white bg-[#f25749] hover:bg-[#e04a3d] transition-all duration-200 ${
                    mode === "dark" ? "shadow-white/10" : "shadow-gray-200"
                  }`}
                >
                  View Report
                </button>
              )}
              {selectedIntel.downloadable && (
                <button
                  className={`px-6 py-3 text-sm font-medium rounded-xl text-white bg-paan-blue hover:bg-paan-blue/80 transition-all duration-200 ${
                    mode === "dark" ? "shadow-white/10" : "shadow-gray-200"
                  }`}
                >
                  Download
                </button>
              )}
            </div>
          </div>
        )}
      </SimpleModal>
    </div>
  );
}
