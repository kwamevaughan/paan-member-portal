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
import TabsSelector from "@/components/TabsSelector";
import MarketIntelItem from "@/components/MarketIntelItem";
import SimpleModal from "@/components/SimpleModal";
import UnifiedModalContent from "@/components/UnifiedModalContent";
import PdfViewerModal from "@/components/PdfViewerModal";
import { hasTierAccess } from "@/utils/tierUtils";
import AccessCoverageCard from "@/components/AccessCoverageCard";

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
    tier_restriction: "",
    region: "",
    type: "",
  });
  const [activeTab, setActiveTab] = useState("all");
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  // Modal state for market intelligence
  const [modalData, setModalData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // PDF modal state
  const [pdfModalData, setPdfModalData] = useState(null);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

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
    "",
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

  if (userLoading) {
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

  const handleResetFilters = (e) => {
    e.preventDefault();
    setFilters({
      tier_restriction: "",
      region: "",
      type: "",
    });
    setActiveTab("all");
  };

  const handleRestrictedClick = (message) => {
    toast.error(message);
  };

  const handleViewIntelligence = (item) => {
    // If the item has a PDF file, open PDF modal directly
    if (item.file_path) {
      handleOpenPdfModal(item);
    } else {
      // Otherwise, use the general intelligence modal
      setModalData({ ...item, type: 'intelligence' });
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalData(null);
  };

  // PDF modal handlers
  const handleOpenPdfModal = (data) => {
    setPdfModalData(data);
    setIsPdfModalOpen(true);
  };

  const handleClosePdfModal = () => {
    setIsPdfModalOpen(false);
    setPdfModalData(null);
  };

  // Filter by active tab
  const filteredByTab = activeTab === "all" 
    ? marketIntel 
    : marketIntel.filter((intel) => hasTierAccess(intel.tier_restriction, user));

  // Define main tabs like other pages
  const mainTabs = [
    { id: "all", label: "All Market Intel", icon: "mdi:view-grid" },
    { id: "accessible", label: "For Your Tier", icon: "mdi:accessibility" },
  ];

  // Define filter tabs
  const regionTabs = [
    { id: "", label: "All Regions", icon: "mdi:map-marker" },
    ...(filterOptions.regions?.map((region) => ({
      id: region,
      label: region,
      icon: "mdi:map-marker",
    })) || []),
  ];

  const typeTabs = [
    { id: "", label: "All Types", icon: "mdi:tag" },
    ...(filterOptions.types?.map((type) => ({
      id: type,
      label: type,
      icon: "mdi:tag",
    })) || []),
  ];

  const tierTabs = [
    { id: "", label: "All Tiers", icon: "mdi:crown-outline" },
    ...(filterOptions.tier_restrictions?.map((tier) => ({
      id: tier,
      label: tier,
      icon: "mdi:crown-outline",
    })) || []),
  ];

  return (
    <div
      className={`min-h-screen flex flex-col ${
        mode === "dark"
          ? "bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-white"
          : "bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900"
      }`}
    >
      <Toaster />
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
          className={`flex-1 p-4 md:p-6 lg:p-8 transition-all mt-10 ${
            isSidebarOpen && !isMobile ? "ml-60" : "ml-60"
          }`}
        >
          <div className="max-w-7xl mx-auto space-y-6">
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
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center gap-1.5">
                        <Icon icon="mdi:map-marker" />
                        Region
                      </label>
                      <TabsSelector
                        tabs={regionTabs}
                        selectedTab={filters.region}
                        onSelect={(value) =>
                          setFilters((prev) => ({ ...prev, region: value }))
                        }
                        mode={mode}
                        icon="mdi:map-marker"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center gap-1.5">
                        <Icon icon="mdi:tag" />
                        Type
                      </label>
                      <TabsSelector
                        tabs={typeTabs}
                        selectedTab={filters.type}
                        onSelect={(value) =>
                          setFilters((prev) => ({ ...prev, type: value }))
                        }
                        mode={mode}
                        icon="mdi:tag"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center gap-1.5">
                        <Icon icon="mdi:crown-outline" />
                        Tier
                      </label>
                      <TabsSelector
                        tabs={tierTabs}
                        selectedTab={filters.tier_restriction}
                        onSelect={(value) =>
                          setFilters((prev) => ({ ...prev, tier_restriction: value }))
                        }
                        mode={mode}
                        icon="mdi:crown-outline"
                      />
                    </div>
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
                  market intel items found
                </span>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Showing {Math.min(12, filteredByTab.length)} of{" "}
                {filteredByTab.length}
              </div>
            </div>

            <AccessCoverageCard
              mode={mode}
              userTier={user?.selected_tier}
              sectionLabel={"market intelligence"}
              onUpgrade={() => window.open("https://paan.africa/#membership", "_blank", "noopener,noreferrer")}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {marketIntelLoading && (
                <div className="col-span-full flex justify-center py-8">
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-paan-blue"></div>
                    <span>Loading market intel...</span>
                  </div>
                </div>
              )}
              {!marketIntelLoading && filteredByTab.map((intel) => (
                <MarketIntelItem
                  key={intel.id}
                  intel={intel}
                  mode={mode}
                  Icon={Icon}
                  isRestricted={!hasTierAccess(intel.tier_restriction, user)}
                  onRestrictedClick={() =>
                    handleRestrictedClick(
                      `Access restricted: ${intel.tier_restriction} tier required for "${intel.title}"`
                    )
                  }
                  toast={toast}
                  onClick={handleViewIntelligence}
                />
              ))}
            </div>

            {!marketIntelLoading && filteredByTab.length === 0 && (
              <div
                className={`text-center py-12 rounded-2xl ${
                  mode === "dark" ? "bg-gray-800" : "bg-white"
                } shadow-sm border dark:border-gray-700`}
              >
                <Icon
                  icon="mdi:chart-line"
                  className="inline-block text-5xl text-gray-400 mb-4"
                />
                <h3 className="text-xl font-semibold mb-2">No Market Intel Found</h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                  No market intelligence items match your current filters. Try adjusting your
                  search criteria or check back later for new insights.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="mt-6 px-6 py-2 bg-paan-blue hover:bg-paan-blue/80 text-white rounded-lg font-medium transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            )}
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

      {/* PDF Viewer Modal */}
      <PdfViewerModal
        isOpen={isPdfModalOpen}
        onClose={handleClosePdfModal}
        pdfUrl={pdfModalData?.file_path}
        title={pdfModalData?.title}
        mode={mode}
      />
    </div>
  );
}
