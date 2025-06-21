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
import SimpleModal from "@/components/SimpleModal";
import UnifiedModalContent from "@/components/UnifiedModalContent";

export default function MarketIntel({ mode = "light", toggleMode }) {
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
  const [filters, setFilters] = useState({
    tier_restriction: "", // Ensure default is empty
    region: "",
    type: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Modal state for market intelligence
  const [modalData, setModalData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleRestrictedClick = (message) => {
    toast.error(message);
  };

  const handleViewIntelligence = (item) => {
    setModalData({ ...item, type: 'intelligence' });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalData(null);
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
              toast={toast}
              onClick={handleViewIntelligence}
            />
          </div>
          <SimpleFooter mode={mode} isSidebarOpen={isSidebarOpen} />
        </div>
      </div>

      {/* Market Intelligence Details Modal */}
      <SimpleModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={modalData?.title || "Market Intelligence Details"}
        mode={mode}
        width="max-w-4xl"
      >
        <UnifiedModalContent
          modalData={modalData}
          mode={mode}
          onClose={handleCloseModal}
        />
      </SimpleModal>
    </div>
  );
}
