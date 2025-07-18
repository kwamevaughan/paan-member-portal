import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Icon } from "@iconify/react";
import TitleCard from "@/components/TitleCard";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@/hooks/useUser";
import useUpdates from "@/hooks/useUpdates";
import useLogout from "@/hooks/useLogout";
import HrHeader from "@/layouts/hrHeader";
import HrSidebar from "@/layouts/hrSidebar";
import SimpleFooter from "@/layouts/simpleFooter";
import useSidebar from "@/hooks/useSidebar";
import toast from "react-hot-toast";
import { hasTierAccess, normalizeTier } from "@/utils/tierUtils";
import Link from "next/link";
import { TierBadge, JobTypeBadge } from "@/components/Badge";
import TabsSelector from "@/components/TabsSelector";
import UpdateCard from "@/components/UpdateCard";
import SimpleModal from "@/components/SimpleModal";
import UnifiedModalContent from "@/components/UnifiedModalContent";

export default function Updates({ mode = "light", toggleMode }) {
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
  const [filters, setFilters] = useState({ tags: "All" });
  const [filterTerm, setFilterTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  // Unified modal state
  const [modalData, setModalData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    updates,
    filterOptions,
    loading: updatesLoading,
    error,
  } = useUpdates(filters, user || { selected_tier: "Free Member" });

  const title = "Updates Hub";
  const description =
    "Stay informed with the latest opportunities, announcements, and events curated for you.";

  // Get latest update date
  const latestUpdateDate =
    updates.length > 0
      ? new Date(
          Math.max(...updates.map((update) => new Date(update.updated_at)))
        ).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "No updates available";

  // Handle click on restricted update
  const handleDisabledClick = (requiredTier) => {
    toast.error(
      `Upgrade to ${normalizeTier(requiredTier)} to access this update`,
      {
        duration: 4000,
        style: {
          borderRadius: "12px",
          padding: "16px",
          boxShadow:
            mode === "dark"
              ? "0 20px 25px -5px rgba(0, 0, 0, 0.5)"
              : "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
          background: mode === "dark" ? "#1F2937" : "#FFFFFF",
          color: mode === "dark" ? "#FFFFFF" : "#1F2937",
          border: mode === "dark" ? "1px solid #374151" : "1px solid #E5E7EB",
        },
      }
    );
  };

  const handleUpdateClick = (update) => {
    setModalData({ ...update, type: 'update' });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalData(null);
  };

  const handleResetFilters = (e) => {
    e.preventDefault();
    setFilters({ tags: "All" });
    setFilterTerm("");
  };

  // Filter and sort updates
  const filteredUpdates = updates
    .filter((update) => {
      if (!update.title) return false;
      const searchTerm = filterTerm.toLowerCase();
      return (
        update.title.toLowerCase().includes(searchTerm) ||
        update.description?.toLowerCase().includes(searchTerm)
      );
    })
    .sort((a, b) => {
      const aAccessible = hasTierAccess(a.tier_restriction, user);
      const bAccessible = hasTierAccess(b.tier_restriction, user);
      if (aAccessible && !bAccessible) return -1;
      if (!aAccessible && bAccessible) return 1;
      return new Date(b.created_at) - new Date(a.created_at);
    });

  // Filter by active tab
  const filteredByTab = activeTab === "all" 
    ? filteredUpdates 
    : filteredUpdates.filter((update) => hasTierAccess(update.tier_restriction, user));

  if (userLoading) return LoadingComponent;
  if (!user) {
    router.push("/");
    return null;
  }
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-600">
        Error: {error}
      </div>
    );
  }

  // Define main tabs like resources page
  const mainTabs = [
    { id: "all", label: "All Updates", icon: "mdi:view-grid" },
    { id: "accessible", label: "For Your Tier", icon: "mdi:accessibility" },
  ];

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
          className={`flex-1 p-4 md:p-6 lg:p-8 transition-all ${
            isSidebarOpen && !isMobile ? "ml-52" : "ml-52"
          }`}
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
              toast={toast}
              pageTable="updates"
              lastUpdated={latestUpdateDate}
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
                {((filters.tags !== "All") || filterTerm) && (
                  <span className="flex items-center justify-center w-5 h-5 text-xs font-medium rounded-full bg-blue-600 text-white">
                    {((filters.tags !== "All") ? 1 : 0) + (filterTerm ? 1 : 0)}
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center gap-1.5">
                        <Icon icon="mdi:tag" />
                        Tags
                      </label>
                      <TabsSelector
                        tabs={filterOptions.tags}
                        selectedTab={filters.tags}
                        onSelect={(tag) => setFilters({ tags: tag })}
                        mode={mode}
                        icon="mdi:tag"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center gap-1.5">
                        <Icon icon="mdi:magnify" />
                        Search Updates
                      </label>
                      <input
                        type="text"
                        placeholder="Search updates..."
                        value={filterTerm}
                        onChange={(e) => setFilterTerm(e.target.value)}
                        className={`w-full px-4 py-3 rounded-lg border transition-all ${
                          mode === "dark"
                            ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                            : "bg-white border-gray-200 text-gray-800 placeholder-gray-500"
                        } focus:ring-2 focus:ring-paan-blue focus:border-paan-blue`}
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
                  updates found
                </span>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Showing {Math.min(12, filteredByTab.length)} of{" "}
                {filteredByTab.length}
              </div>
            </div>

            {/* Updates Feed */}
            <AnimatePresence mode="wait">
              {updatesLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="col-span-full flex justify-center py-8"
                >
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-paan-blue"></div>
                    <span>Loading updates...</span>
                  </div>
                </motion.div>
              )}
              {!updatesLoading && filteredByTab.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={`text-center py-16 px-8 rounded-2xl ${
                    mode === "dark"
                      ? "bg-gray-800/30 border border-gray-700/30"
                      : "bg-white/50 border border-gray-200/30"
                  } backdrop-blur-lg`}
                >
                  <Icon
                    icon="mdi:inbox"
                    className={`w-16 h-16 mx-auto mb-4 ${
                      mode === "dark" ? "text-gray-600" : "text-gray-400"
                    }`}
                  />
                  <h3
                    className={`text-xl font-semibold mb-2 ${
                      mode === "dark" ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    No updates found
                  </h3>
                  <p
                    className={`${
                      mode === "dark" ? "text-gray-500" : "text-gray-500"
                    }`}
                  >
                    Try adjusting your search or tag filter
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="mt-6 px-6 py-2 bg-paan-blue hover:bg-paan-blue/80 text-white rounded-lg font-medium transition-colors"
                  >
                    Reset Filters
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {filteredByTab.map((update, index) => {
                    const isAccessible = hasTierAccess(
                      update.tier_restriction,
                      user
                    );
                    return (
                      <motion.div
                        key={update.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.5,
                          delay: index * 0.1,
                          type: "spring",
                          stiffness: 100,
                        }}
                        whileHover={
                          isAccessible
                            ? { y: -4, transition: { duration: 0.2 } }
                            : undefined
                        }
                      >
                        <UpdateCard
                          update={update}
                          mode={mode}
                          isRestricted={!isAccessible}
                          onRestrictedClick={() => handleDisabledClick(update.tier_restriction)}
                          onClick={handleUpdateClick}
                          Icon={Icon}
                        />
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <SimpleFooter mode={mode} isSidebarOpen={isSidebarOpen} />
        </div>
      </div>

      {/* Unified Modal */}
      <SimpleModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={modalData?.title || "Update Details"}
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
