import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { useRouter } from "next/router";
import { useUser } from "@/hooks/useUser";
import { useBusinessOpportunities } from "@/hooks/useBusinessOpportunities";
import useLogout from "@/hooks/useLogout";
import HrHeader from "@/layouts/hrHeader";
import HrSidebar from "@/layouts/hrSidebar";
import SimpleFooter from "@/layouts/simpleFooter";
import useSidebar from "@/hooks/useSidebar";
import toast from "react-hot-toast";
import TitleCard from "@/components/TitleCard";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { hasTierAccess, normalizeTier } from "@/utils/tierUtils";
import { TierBadge, JobTypeBadge } from "@/components/Badge";
import TabsSelector from "@/components/TabsSelector";
import OpportunitiesSection from "@/components/OpportunitiesSection";

export default function BusinessOpportunities({ mode = "light", toggleMode }) {
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
  const renderCount = useRef(0);

  const [filters, setFilters] = useState({
    country: "",
    serviceType: "",
    industry: "",
    projectType: "",
    tier_restriction: "",
  });
  const [activeTab, setActiveTab] = useState("all");
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  const {
    opportunities,
    filterOptions,
    loading: opportunitiesLoading,
    error,
  } = useBusinessOpportunities(filters, user);

  const isFreelancer = user?.job_type?.toLowerCase() === "freelancer";

  // Reset filters for freelancers
  useEffect(() => {
    if (isFreelancer) {
      setFilters({
        country: "",
        serviceType: "",
        industry: "",
        projectType: "",
        tier_restriction: "",
      });
    }
  }, [isFreelancer]);

  // Track render count
  useEffect(() => {
    renderCount.current++;
  });

  // Memoized values
  const title = useMemo(
    () => (isFreelancer ? "Gigs" : "Business Opportunities"),
    [isFreelancer]
  );

  const description = useMemo(
    () =>
      isFreelancer
        ? "Discover and apply for freelance gigs tailored to your skills."
        : "Discover and connect with premium business leads tailored to your expertise and membership tier.",
    [isFreelancer]
  );

  const latestOpportunityDate = useMemo(
    () =>
      opportunities.length > 0
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
              const deadlineDate = new Date(opp.deadline);
              const today = new Date();
              const diffTime = deadlineDate - today;
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              return diffDays <= 7 && diffDays >= 0;
            }
            return true;
          }),
    [activeTab, opportunities, user]
  );

  // Memoized handlers
  const handleFilterChange = useCallback((e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleResetFilters = useCallback((e) => {
    e.preventDefault();
    setFilters({
      country: "",
      serviceType: "",
      industry: "",
      projectType: "",
      tier_restriction: "",
    });
  }, []);

  const handleExpressInterest = useCallback(
    (opportunity) => {
      if (!hasTierAccess(opportunity.tier_restriction, user)) {
        toast.error(
          `This opportunity is available to ${normalizeTier(
            opportunity.tier_restriction
          )} only. Consider upgrading your membership.`
        );
        return;
      }
      toast.success(`Interest expressed for ${opportunity.title}!`);
      
    },
    [user]
  );

  if (userLoading || opportunitiesLoading) {
    return LoadingComponent;
  }

  if (!user) {
    console.log("[BusinessOpportunities] No user, redirecting to /");
    router.push("/");
    return null;
  }

  if (error) {
    console.error("[BusinessOpportunities] Error:", error);
    return (
      <div className="flex items-center justify-center min-h-screen text-red-600">
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
              pageTable="business_opportunities"
              lastUpdated={latestOpportunityDate}
            />

            <div className="flex flex-col md:flex-row-reverse md:items-center justify-between gap-4">
              {isMobile ? (
                <div className="w-full">
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
                </div>
              ) : (
                <TabsSelector
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  mode={mode}
                />
              )}

              <button
                onClick={() => setShowFilterPanel(!showFilterPanel)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${
                  mode === "dark"
                    ? "bg-gray-800 hover:bg-gray-700 text-white"
                    : "bg-white hover:bg-gray-100 text-gray-900"
                } ${showFilterPanel ? "ring-2 ring-blue-600" : ""}`}
              >
                <Icon icon="mdi:filter" />
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
                className={`rounded-2xl shadow-lg rounded-lg ${
                  mode === "dark"
                    ? "bg-gray-800 border border-gray-400"
                    : "bg-white border border-gray-200"
                }`}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-lg font-semibold">
                      <Icon
                        icon="mdi:filter-variant"
                        className="h-5 w-5 text-blue-600"
                      />
                      <span>Refine Your Search</span>
                    </div>
                    <button
                      onClick={handleResetFilters}
                      className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                    >
                      <Icon icon="mdi:refresh" />
                      Reset All
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {[
                      { key: "country", icon: "mdi:earth", label: "Country" },
                      {
                        key: "serviceType",
                        icon: "mdi:cog",
                        label: "Service Type",
                      },
                      {
                        key: "industry",
                        icon: "mdi:industry",
                        label: "Industry",
                      },
                      {
                        key: "projectType",
                        icon: "mdi:folder",
                        label: "Project Type",
                      },
                      {
                        key: "tier_restriction",
                        icon: "mdi:crown",
                        label: "Tier",
                      },
                    ].map(({ key, icon, label }) => (
                      <div key={key} className="space-y-1">
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
                          <Icon icon={icon} className="h-4 w-4" />
                          {label}
                        </label>
                        <select
                          name={key}
                          value={filters[key]}
                          onChange={handleFilterChange}
                          className={`w-full p-2 rounded-lg border ${
                            mode === "dark"
                              ? "bg-gray-700 border-gray-600 text-white"
                              : "bg-white bg-white border-gray-200 text-gray-900"
                          } focus:border-blue-500`}
                        >
                          <option value="">All {label}</option>
                          {(filterOptions[`${key}s`] || []).map((val, idx) => (
                            <option key={val} value={val}>
                              {val}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <OpportunitiesSection
              opportunities={filteredByTab}
              opportunitiesLoading={opportunitiesLoading}
              opportunitiesError={error}
              user={user}
              handleRestrictedClick={handleExpressInterest}
              mode={mode}
              Icon={Icon}
            />
          </div>
          <SimpleFooter mode={mode} isSidebarOpen={isSidebarOpen} />
        </div>
      </div>
    </div>
  );
}
