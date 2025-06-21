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

  if (userLoading || updatesLoading) return LoadingComponent;
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
            {/* Header Section */}
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

            {/* Controls Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className={`p-6 rounded-2xl ${
                mode === "dark"
                  ? "bg-gray-800/50 border border-gray-700/50"
                  : "bg-white/70 border border-gray-200/50"
              } backdrop-blur-lg shadow-lg`}
            >
              <div className="flex flex-col lg:flex-row gap-6 items-center">
                {/* Search Bar */}
                <div className="relative flex-1 max-w-md">
                  <Icon
                    icon="mdi:magnify"
                    className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                      mode === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  />
                  <input
                    type="text"
                    placeholder="Search updates..."
                    value={filterTerm}
                    onChange={(e) => setFilterTerm(e.target.value)}
                    className={`w-full pl-12 pr-4 py-3 rounded-xl border ${
                      mode === "dark"
                        ? "bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                        : "bg-white/80 border-gray-300 text-gray-900 placeholder-gray-500"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                  />
                </div>

                {/* Tag Filters */}
                <div className="flex flex-wrap gap-2">
                  <TabsSelector
                    tabs={filterOptions.tags}
                    selectedTab={filters.tags}
                    onSelect={(tag) => setFilters({ tags: tag })}
                    mode={mode}
                    icon="mdi:tag"
                  />
                </div>

                {/* View Toggle */}
                <div
                  className={`flex items-center gap-1 p-1 rounded-xl ${
                    mode === "dark" ? "bg-gray-700/50" : "bg-gray-100/80"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg transition-all ${
                      viewMode === "grid"
                        ? mode === "dark"
                          ? "bg-blue-600 text-white"
                          : "bg-blue-500 text-white"
                        : mode === "dark"
                        ? "text-gray-400 hover:text-gray-200"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    <Icon icon="mdi:view-grid" className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-lg transition-all ${
                      viewMode === "list"
                        ? mode === "dark"
                          ? "bg-blue-600 text-white"
                          : "bg-blue-500 text-white"
                        : mode === "dark"
                        ? "text-gray-400 hover:text-gray-200"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    <Icon icon="mdi:view-list" className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Updates Feed */}
            <AnimatePresence mode="wait">
              {filteredUpdates.length === 0 ? (
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
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={
                    viewMode === "grid"
                      ? "grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                      : "space-y-4"
                  }
                >
                  {filteredUpdates.map((update, index) => {
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
