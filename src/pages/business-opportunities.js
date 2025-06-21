import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/router";
import { useUser } from "@/hooks/useUser";
import { useBusinessOpportunities } from "@/hooks/useBusinessOpportunities";
import useLogout from "@/hooks/useLogout";
import useSidebar from "@/hooks/useSidebar";
import toast from "react-hot-toast";
import HrHeader from "@/layouts/hrHeader";
import HrSidebar from "@/layouts/hrSidebar";
import SimpleFooter from "@/layouts/simpleFooter";
import TitleCard from "@/components/TitleCard";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { hasTierAccess, normalizeTier } from "@/utils/tierUtils";
import { TierBadge, JobTypeBadge } from "@/components/Badge";
import TabsSelector from "@/components/TabsSelector";
import OpportunitiesSection from "@/components/OpportunitiesSection";
import { supabase } from "@/lib/supabase";

export default function BusinessOpportunities({ mode = "light", toggleMode }) {
  const { isSidebarOpen, toggleSidebar, updateDragOffset, isMobile } =
    useSidebar();
  const router = useRouter();
  const { user, loading: userLoading, LoadingComponent } = useUser();
  const { handleLogout } = useLogout();

  const [filters, setFilters] = useState({
    country: "",
    serviceType: "",
    industry: "",
    projectType: "",
    tier_restriction: "",
    skills: "",
    budgetRange: "",
    remoteWork: "",
    estimatedDuration: "",
  });
  const [activeTab, setActiveTab] = useState("all");
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  const {
    opportunities,
    filterOptions = {},
    loading,
    error,
  } = useBusinessOpportunities(filters, user);
  const isFreelancer = user?.job_type?.toLowerCase() === "freelancer";

  useEffect(() => {
    // Reset filters based on user type
    setFilters((prev) => ({
      country: isFreelancer ? "" : prev.country,
      serviceType: isFreelancer ? "" : prev.serviceType,
      industry: isFreelancer ? "" : prev.industry,
      projectType: prev.projectType, // Keep for both
      tier_restriction: prev.tier_restriction, // Keep for both
      skills: isFreelancer ? prev.skills : "",
      budgetRange: isFreelancer ? prev.budgetRange : "",
      remoteWork: isFreelancer ? prev.remoteWork : "",
      estimatedDuration: isFreelancer ? prev.estimatedDuration : "",
    }));
  }, [isFreelancer]);

  const title = useMemo(
    () => (isFreelancer ? "Gigs" : "Business Opportunities"),
    [isFreelancer]
  );
  const description = useMemo(
    () =>
      isFreelancer
        ? "Discover freelance gigs tailored to your skills."
        : "Connect with premium business leads tailored to your expertise and tier.",
    [isFreelancer]
  );
  const latestOpportunityDate = useMemo(
    () =>
      opportunities.length
        ? new Date(
            Math.max(...opportunities.map((opp) => new Date(opp.updated_at)))
          ).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "No opportunities available",
    [opportunities]
  );

  const filteredByTab = useMemo(
    () =>
      activeTab === "all"
        ? opportunities
        : opportunities.filter((opp) => {
            if (activeTab === "accessible")
              return hasTierAccess(opp.tier_restriction, user);
            if (activeTab === "trending") return opp.trending;
            if (activeTab === "deadlineSoon") {
              const diffDays = Math.ceil(
                (new Date(opp.deadline) - new Date()) / (1000 * 60 * 60 * 24)
              );
              return diffDays <= 7 && diffDays >= 0;
            }
            return true;
          }),
    [activeTab, opportunities, user]
  );

  const handleFilterChange = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value || "" }));
  }, []);

  const handleResetFilters = useCallback((e) => {
    e.preventDefault();
    setFilters({
      country: "",
      serviceType: "",
      industry: "",
      projectType: "",
      tier_restriction: "",
      skills: "",
      budgetRange: "",
      remoteWork: "",
      estimatedDuration: "",
    });
  }, []);

  const handleExpressInterest = useCallback(
    async (opportunity) => {
      if (!hasTierAccess(opportunity.tier_restriction, user)) {
        toast.error(
          `This opportunity requires ${normalizeTier(
            opportunity.tier_restriction
          )}. Consider upgrading.`
        );
        return;
      }

      try {
        const {
          data: { user: authUser },
          error: authError,
        } = await supabase.auth.getUser();
        if (authError || !authUser) {
          toast.error("User not authenticated. Please log in.");
          return;
        }

        const { data: candidate, error: candidateError } = await supabase
          .from("candidates")
          .select("auth_user_id")
          .eq("auth_user_id", authUser.id)
          .single();

        if (candidateError || !candidate) {
          toast.error("Please complete your profile to express interest.");
          router.push("/profile");
          return;
        }

        const { error: insertError } = await supabase
          .from("opportunity_interests")
          .insert({
            user_id: authUser.id,
            opportunity_id: opportunity.id,
          });

        if (insertError) {
          if (insertError.code === "23505") {
            toast.error("You have already expressed interest in this gig.");
          } else {
            throw insertError;
          }
        } else {
          toast.success(`Interest expressed for ${opportunity.title}!`);
        }
      } catch (err) {
        console.error("Error saving interest:", err);
        toast.error("Failed to express interest. Please try again.");
      }
    },
    [user, router]
  );

  if (userLoading) return LoadingComponent;
  if (!user) {
    router.push("/");
    return null;
  }
  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen text-red-600">
        Error: {error}
      </div>
    );

  console.log("[BusinessOpportunities] filters:", filters);
  console.log("[BusinessOpportunities] filterOptions:", filterOptions);

  // Define main tabs like resources page
  const mainTabs = [
    { id: "all", label: "All Opportunities", icon: "mdi:view-grid" },
    { id: "accessible", label: "For Your Tier", icon: "mdi:accessibility" },
  ];

  return (
    <div
      className={`min-h-screen flex flex-col ${
        mode === "dark"
          ? "bg-gradient-to-br from-gray-900 to-gray-800 text-white"
          : "bg-white text-gray-900"
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
              pageTable="business_opportunities"
              lastUpdated={latestOpportunityDate}
            />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <TabsSelector
                tabs={mainTabs}
                selectedTab={activeTab}
                onSelect={setActiveTab}
                mode={mode}
                icon="mdi:view-grid"
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
                        className="text-paan-blue"
                      />
                      <span>Refine Your Search</span>
                    </div>
                    <button
                      onClick={handleResetFilters}
                      className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-paan-blue dark:text-gray-400 dark:hover:text-paan-blue transition"
                    >
                      <Icon icon="mdi:restart" />
                      Reset All
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {!isFreelancer && (
                      <>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center gap-1.5">
                            <Icon icon="mdi:map-marker" />
                            Country
                          </label>
                          <TabsSelector
                            tabs={[
                              { id: "", label: "All Countries" },
                              ...(filterOptions.countries?.map((country) => ({
                                id: country,
                                label: country,
                              })) || []),
                            ]}
                            selectedTab={filters.country}
                            onSelect={(value) => handleFilterChange("country", value)}
                            mode={mode}
                            icon="mdi:map-marker"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center gap-1.5">
                            <Icon icon="mdi:briefcase" />
                            Service Type
                          </label>
                          <TabsSelector
                            tabs={[
                              { id: "", label: "All Services" },
                              ...(filterOptions.serviceTypes?.map((type) => ({
                                id: type,
                                label: type,
                              })) || []),
                            ]}
                            selectedTab={filters.serviceType}
                            onSelect={(value) => handleFilterChange("serviceType", value)}
                            mode={mode}
                            icon="mdi:briefcase"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center gap-1.5">
                            <Icon icon="mdi:factory" />
                            Industry
                          </label>
                          <TabsSelector
                            tabs={[
                              { id: "", label: "All Industries" },
                              ...(filterOptions.industries?.map((industry) => ({
                                id: industry,
                                label: industry,
                              })) || []),
                            ]}
                            selectedTab={filters.industry}
                            onSelect={(value) => handleFilterChange("industry", value)}
                            mode={mode}
                            icon="mdi:factory"
                          />
                        </div>
                      </>
                    )}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center gap-1.5">
                        <Icon icon="mdi:projector" />
                        Project Type
                      </label>
                      <TabsSelector
                        tabs={[
                          { id: "", label: "All Types" },
                          ...(filterOptions.projectTypes?.map((type) => ({
                            id: type,
                            label: type,
                          })) || []),
                        ]}
                        selectedTab={filters.projectType}
                        onSelect={(value) => handleFilterChange("projectType", value)}
                        mode={mode}
                        icon="mdi:projector"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center gap-1.5">
                        <Icon icon="mdi:crown-outline" />
                        Tier
                      </label>
                      <TabsSelector
                        tabs={[
                          { id: "", label: "All Tiers" },
                          ...(filterOptions.tier_restrictions?.map((tier) => ({
                            id: tier,
                            label: tier,
                          })) || []),
                        ]}
                        selectedTab={filters.tier_restriction}
                        onSelect={(value) => handleFilterChange("tier_restriction", value)}
                        mode={mode}
                        icon="mdi:crown-outline"
                      />
                    </div>
                    {isFreelancer && (
                      <>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center gap-1.5">
                            <Icon icon="mdi:tools" />
                            Skills
                          </label>
                          <TabsSelector
                            tabs={[
                              { id: "", label: "All Skills" },
                              ...(filterOptions.skills?.map((skill) => ({
                                id: skill,
                                label: skill,
                              })) || []),
                            ]}
                            selectedTab={filters.skills}
                            onSelect={(value) => handleFilterChange("skills", value)}
                            mode={mode}
                            icon="mdi:tools"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center gap-1.5">
                            <Icon icon="mdi:currency-usd" />
                            Budget Range
                          </label>
                          <TabsSelector
                            tabs={[
                              { id: "", label: "All Budgets" },
                              ...(filterOptions.budgetRanges?.map((range) => ({
                                id: range,
                                label: range,
                              })) || []),
                            ]}
                            selectedTab={filters.budgetRange}
                            onSelect={(value) => handleFilterChange("budgetRange", value)}
                            mode={mode}
                            icon="mdi:currency-usd"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center gap-1.5">
                            <Icon icon="mdi:home" />
                            Remote Work
                          </label>
                          <TabsSelector
                            tabs={[
                              { id: "", label: "All Options" },
                              ...(filterOptions.remoteWorkOptions?.map((option) => ({
                                id: option,
                                label: option,
                              })) || []),
                            ]}
                            selectedTab={filters.remoteWork}
                            onSelect={(value) => handleFilterChange("remoteWork", value)}
                            mode={mode}
                            icon="mdi:home"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center gap-1.5">
                            <Icon icon="mdi:clock" />
                            Duration
                          </label>
                          <TabsSelector
                            tabs={[
                              { id: "", label: "All Durations" },
                              ...(filterOptions.estimatedDurations?.map((duration) => ({
                                id: duration,
                                label: duration,
                              })) || []),
                            ]}
                            selectedTab={filters.estimatedDuration}
                            onSelect={(value) => handleFilterChange("estimatedDuration", value)}
                            mode={mode}
                            icon="mdi:clock"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center">
              <div
                className={`px-4 py-2 rounded-lg ${
                  mode === "dark" ? "bg-gray-800" : "bg-white"
                } shadow-sm`}
              >
                <span className="font-semibold">
                  {filteredByTab.length}
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  {" "}
                  opportunities found
                </span>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Showing {Math.min(12, filteredByTab.length)} of{" "}
                {filteredByTab.length}
              </div>
            </div>

            <OpportunitiesSection
              opportunities={filteredByTab}
              opportunitiesLoading={loading}
              opportunitiesError={error}
              user={user}
              handleRestrictedClick={handleExpressInterest}
              mode={mode}
              Icon={Icon}
              opportunityFilterOptions={filterOptions}
              opportunityFilters={filters}
              handleOpportunityFilterChange={handleFilterChange}
              handleResetFilters={handleResetFilters}
              toast={toast}
            />
          </div>
          <SimpleFooter mode={mode} isSidebarOpen={isSidebarOpen} />
        </div>
      </div>
    </div>
  );
}
