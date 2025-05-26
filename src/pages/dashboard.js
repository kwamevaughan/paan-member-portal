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
import { TierBadge } from "@/components/Badge";
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

export default function Dashboard({ mode = "light", toggleMode }) {
  const { isSidebarOpen, toggleSidebar, sidebarState, updateDragOffset } =
    useSidebar();
  const router = useRouter();
  const { user, loading: userLoading, LoadingComponent } = useUser();
  const { handleLogout } = useLogout();
  const [activeTab, setActiveTab] = useState("opportunities");
  const { filters, handleFilterChange } = useFilters();

  // Fetch data
  const {
    opportunities,
    filterOptions: opportunityFilterOptions,
    loading: opportunitiesLoading,
    error: opportunitiesError,
  } = useBusinessOpportunities(filters.opportunities);

  const {
    events,
    registeredEvents,
    filterOptions: eventFilterOptions,
    loading: eventsLoading,
    error: eventsError,
    handleEventRegistration,
  } = useEvents(filters.events, user?.selected_tier || "Associate Member");

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
  } = useUpdates(filters.updates, user);

  const {
    marketIntel,
    filterOptions: marketIntelFilterOptions,
    loading: marketIntelLoading,
    error: marketIntelError,
  } = useMarketIntel(
    filters.marketIntel,
    "",
    [],
    user?.selected_tier || "Associate Member"
  );

  const {
    offers,
    filterOptions: offerFilterOptions,
    loading: offersLoading,
    error: offersError,
  } = useOffers(filters.offers);

  // Handle restricted access
  const handleRestrictedClick = (message) => {
    toast.error(message, { duration: 3000 });
  };

  // Early returns
  if (userLoading && LoadingComponent) return LoadingComponent;
  if (!user) return null;

  return (
    <div
      className={`min-h-screen flex flex-col ${
        mode === "dark"
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
          : "bg-gradient-to-br from-blue-50 via-white to-purple-50"
      }`}
    >
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
          <div className="max-w-7xl mx-auto space-y-8">
            <WelcomeCard
              mode={mode}
              user={user}
              agencyName={user.agencyName}
              jobType={user.job_type}
              selectedTier={user.selected_tier}
              TierBadge={TierBadge}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <QuickStatsCard
                title="Active Opportunities"
                value={opportunities
                  .filter((item) =>
                    canAccessTier(item.tier_restriction, user.selected_tier)
                  )
                  .length.toString()}
                change={8}
                icon="mdi:briefcase"
                color="bg-gradient-to-r from-blue-500 to-blue-600"
                mode={mode}
              />
              <QuickStatsCard
                title="Upcoming Events"
                value={events
                  .filter((item) =>
                    canAccessTier(item.tier_restriction, user.selected_tier)
                  )
                  .length.toString()}
                change={-2}
                icon="mdi:calendar-check"
                color="bg-gradient-to-r from-green-500 to-green-600"
                mode={mode}
              />
              <QuickStatsCard
                title="New Resources"
                value={resources
                  .filter((item) =>
                    canAccessTier(item.tier_restriction, user.selected_tier)
                  )
                  .length.toString()}
                change={15}
                icon="mdi:file-document-multiple"
                color="bg-gradient-to-r from-purple-500 to-purple-600"
                mode={mode}
              />
              <QuickStatsCard
                title="Available Offers"
                value={offers
                  .filter((item) =>
                    canAccessTier(item.tier_restriction, user.selected_tier)
                  )
                  .length.toString()}
                change={0}
                icon="mdi:gift"
                color="bg-gradient-to-r from-orange-500 to-orange-600"
                mode={mode}
              />
            </div>
            <DashboardTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              mode={mode}
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
                  offerFilterOptions={offerFilterOptions}
                  user={user}
                  handleRestrictedClick={handleRestrictedClick}
                  mode={mode}
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
                />
              )}
            </TabContentTransition>
          </div>
          <SimpleFooter mode={mode} isSidebarOpen={isSidebarOpen} />
        </div>
      </div>
      <Toaster />
    </div>
  );
}
