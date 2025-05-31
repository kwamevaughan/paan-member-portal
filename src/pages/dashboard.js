import { useState, useMemo, useEffect } from "react";
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
import toast from "react-hot-toast";
import WelcomeCard from "@/components/WelcomeCard";
import TabContentTransition from "@/components/TabContentTransition";
import OpportunitiesSection from "@/components/OpportunitiesSection";
import EventsSection from "@/components/EventsSection";
import ResourcesSection from "@/components/ResourcesSection";
import MarketIntelSection from "@/components/MarketIntelSection";
import OffersSection from "@/components/OffersSection";
import UpdatesSection from "@/components/UpdatesSection";
import YouTubeVideo from "@/components/YouTubeVideo";
import { Icon } from "@iconify/react";
import dynamic from "next/dynamic";
import Link from "next/link";

// Dynamically import StatsChart with SSR disabled
const StatsChart = dynamic(() => import("@/components/StatsChart"), {
  ssr: false,
});

export default function Dashboard({ mode = "light", toggleMode }) {
  const { isSidebarOpen, toggleSidebar, sidebarState, isMobile, windowWidth } =
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
  } = useLatestUpdate(user?.selected_tier || "Free Member");

  // Fetch data
  const {
    opportunities,
    filterOptions: opportunityFilterOptions,
    loading: opportunitiesLoading,
    error: opportunitiesError,
  } = useBusinessOpportunities(
    filters.opportunities,
    user?.selected_tier || "Free Member"
  );

  const {
    events,
    registeredEvents,
    filterOptions: eventFilterOptions,
    loading: eventsLoading,
    error: eventsError,
    handleEventRegistration,
  } = useEvents(filters.events, user?.selected_tier || "Free Member");

  const {
    resources,
    filterOptions: resourceFilterOptions,
    loading: resourcesLoading,
    error: resourcesError,
  } = useResources(filters.resources, user?.selected_tier || "Free Member");

  const {
    updates,
    filterOptions: updateFilterOptions,
    loading: updatesLoading,
    error: updatesError,
  } = useUpdates(filters.updates, user?.selected_tier || "Free Member");

  const {
    marketIntel,
    filterOptions: marketIntelFilterOptions,
    loading: marketIntelLoading,
    error: marketIntelError,
  } = useMarketIntel(
    filters.marketIntel,
    "",
    [],
    user?.selected_tier || "Free Member"
  );

  const {
    offers,
    filterOptions: offerFilterOptions,
    loading: offersLoading,
    error: offersError,
  } = useOffers(
    { tier_restriction: filters.offers?.tier_restriction || "" },
    user?.selected_tier || "Free Member"
  );

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

  // Handle auth=expired
  useEffect(() => {
    if (router.query.auth === "expired") {
      toast.error("Session expired. Please log in again.", { duration: 1000 });
      router.replace("/", undefined, { shallow: true });
    }
  }, [router]);

  // Empty state
  if (userLoading && LoadingComponent) return LoadingComponent;
  if (!user || windowWidth === null) {
    router.push("/");
    return null;
  }

  return (
    <div
      className={`min-h-screen flex flex-col ${
        mode === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      <HrHeader
        toggleSidebar={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
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
          <div className="max-w-7xl mx-auto space-y-8 pb-10">
            <WelcomeCard
              mode={mode}
              user={user}
              Icon={Icon}
              Link={Link}
              TierBadge={TierBadge}
              JobTypeBadge={JobTypeBadge}
              useLatestUpdate={useLatestUpdate}
            />

            <TabContentTransition
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              mode={mode}
              Icon={Icon}
            >
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
                  handleOfferFilter={(key, value) =>
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

            <div className="pb-12 grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              <StatsChart
                opportunities={opportunities}
                events={events}
                resources={resources}
                offers={offers}
                marketIntel={marketIntel}
                updates={updates}
                user={user}
                mode={mode}
                getLastUpdatedForSection={getLastUpdatedForSection}
                useRouter={useRouter}
              />
              <YouTubeVideo mode={mode} />
            </div>
          </div>
          <SimpleFooter mode={mode} isSidebarOpen={isSidebarOpen} />
        </div>
      </div>
    </div>
  );
}
