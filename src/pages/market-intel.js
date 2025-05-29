import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/router";
import { Icon } from "@iconify/react";
import { useUser } from "@/hooks/useUser";
import useMarketIntel from "@/hooks/useMarketIntel";
import useLogout from "@/hooks/useLogout";
import HrHeader from "@/layouts/hrHeader";
import HrSidebar from "@/layouts/hrSidebar";
import SimpleFooter from "@/layouts/simpleFooter";
import useSidebar from "@/hooks/useSidebar";
import toast, { Toaster } from "react-hot-toast";
import TitleCard from "@/components/TitleCard";
import MarketIntelSection from "@/components/MarketIntelSection";

export default function MarketIntel({ mode = "light", toggleMode }) {
  const { isSidebarOpen, toggleSidebar, sidebarState, updateDragOffset } =
    useSidebar();
  const router = useRouter();
  const { user, loading: userLoading, LoadingComponent } = useUser();
  const { handleLogout } = useLogout();
  const [filters, setFilters] = useState({
    tier_restriction: "", // Ensure default is empty
    region: "",
    type: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const memoizedFilters = useMemo(
    () => filters,
    [filters.tier_restriction, filters.region, filters.type]
  );

  const {
    marketIntel,
    filterOptions,
    loading: marketIntelLoading,
    error,
  } = useMarketIntel(
    memoizedFilters,
    searchTerm,
    [],
    user?.selected_tier || "Free Member"
  );

  // Get latest market intel date
  const latestMarketIntelDate =
    marketIntel.length > 0
      ? (() => {
          const dates = marketIntel
            .map((intel) => new Date(intel.updated_at || intel.created_at))
            .filter((date) => !isNaN(date.getTime())); // Filter valid dates
          return dates.length > 0
            ? new Date(Math.max(...dates)).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : "No valid dates available";
        })()
      : "No market intel available";

  

  if (userLoading || marketIntelLoading) {
    return LoadingComponent;
  }

  if (!user) {
    console.log("[MarketIntel] No user, redirecting to /login");
    router.push("/login");
    return null;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        Error: {error}
      </div>
    );
  }

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleRestrictedClick = (message) => {
    toast.error(message);
  };

  return (
    <div
      className={`min-h-screen flex flex-col ${
        mode === "dark"
          ? "bg-gray-950"
          : "bg-gradient-to-br from-slate-50 to-blue-50"
      }`}
    >
      
      <HrHeader
        toggleSidebar={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
        sidebarState={sidebarState}
        fullName={user?.name ?? "Member"}
        jobTitle={user?.job_type}
        selectedTier={user?.selected_tier || "Free Member"}
        agencyName={user?.agencyName}
        mode={mode}
        toggleMode={toggleMode}
        onLogout={handleLogout}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Market Intel" }]}
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
          className={`flex-1 p-4 md:p-6 lg:p-8 transition-all duration-300 overflow-auto`}
          style={{
            marginLeft: sidebarState.hidden
              ? "0px"
              : `${84 + (isSidebarOpen ? 120 : 0) + sidebarState.offset}px`,
          }}
        >
          <div className="max-w-7xl mx-auto space-y-8">
            <TitleCard
              title="Market Intel"
              description="Explore cutting-edge market intelligence, regional insights, and interactive visualizations."
              mode={mode}
              user={user}
              Icon={Icon}
              Link={React.Fragment}
              TierBadge={() => null}
              JobTypeBadge={() => null}
              toast={toast}
              pageTable="market_intel"
              lastUpdated={latestMarketIntelDate}
            />
            <MarketIntelSection
              marketIntel={marketIntel}
              marketIntelLoading={marketIntelLoading}
              marketIntelError={error}
              marketIntelFilters={filters}
              handleMarketIntelFilterChange={handleFilterChange}
              marketIntelFilterOptions={filterOptions}
              user={user}
              handleRestrictedClick={handleRestrictedClick}
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
