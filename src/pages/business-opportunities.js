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

  const handleResetFilters = useCallback(() => {
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

  if (userLoading || loading) return LoadingComponent;
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
          className={`flex-1 p-4 md:p-6 lg:p-8 transition-all ${
            isSidebarOpen && !isMobile ? "ml-52" : "ml-20"
          }`}
        >
          <div className="max-w-7xl mx-auto space-y-6 pt-14">
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
              {isMobile ? (
                <select
                  value={activeTab}
                  onChange={(e) => setActiveTab(e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg border shadow-sm ${
                    mode === "dark"
                      ? "bg-gray-800 text-white border-gray-600"
                      : "bg-white text-gray-900 border-gray-200"
                  }`}
                >
                  {[
                    { id: "all", label: "All Opportunities" },
                    { id: "accessible", label: "For Your Tier" },
                    { id: "trending", label: "Trending" },
                    { id: "deadlineSoon", label: "Closing Soon" },
                  ].map((tab) => (
                    <option key={tab.id} value={tab.id}>
                      {tab.label}
                    </option>
                  ))}
                </select>
              ) : (
                <TabsSelector
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  mode={mode}
                />
              )}
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
