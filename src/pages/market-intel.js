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
  const [selectedIntel, setSelectedIntel] = useState(null);
  const [isIntelModalOpen, setIsIntelModalOpen] = useState(false);

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
    console.log('MarketIntel page handleViewIntelligence called with:', item);
    setSelectedIntel(item);
    setIsIntelModalOpen(true);
  };

  const handleCloseIntelModal = () => {
    setIsIntelModalOpen(false);
    setSelectedIntel(null);
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
