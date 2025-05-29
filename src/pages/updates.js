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
import toast, { Toaster } from "react-hot-toast";
import { hasTierAccess, normalizeTier } from "@/utils/tierUtils";
import Link from "next/link";
import { TierBadge, JobTypeBadge } from "@/components/Badge";

export default function Updates({ mode = "light", toggleMode }) {
  const { isSidebarOpen, toggleSidebar, sidebarState, updateDragOffset } =
    useSidebar();
  const router = useRouter();
  const { user, loading: userLoading, LoadingComponent } = useUser();
  const { handleLogout } = useLogout();
  const [filters, setFilters] = useState({ tags: "All" });
  const [filterTerm, setFilterTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
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

  // Debug data
  useEffect(() => {
    console.log("[Updates] User:", user);
    console.log("[Updates] User Tier:", user?.selected_tier);
    console.log("[Updates] Updates:", updates);
    console.log("[Updates] Latest Update Date:", latestUpdateDate);
    console.log("[Updates] Filters:", filters);
    updates.forEach((update) => {
      console.log(
        `[Updates] Update "${update.title}" (Tier: ${
          update.tier_restriction
        }): Accessible = ${hasTierAccess(update.tier_restriction, user)}`
      );
    });
  }, [user, updates, filters, latestUpdateDate]);

  if (userLoading || updatesLoading) return LoadingComponent;
  if (!user) {
    console.log("[Updates] No user, redirecting to /login");
    router.push("/login");
    return null;
  }
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-600">
        Error: {error}
      </div>
    );
  }

  const getUpdateTypeIcon = (update) => {
    if (update.cta_url) return "mdi:external-link";
    if (update.title.toLowerCase().includes("event")) return "mdi:calendar";
    if (update.title.toLowerCase().includes("opportunity"))
      return "mdi:briefcase";
    return "mdi:information";
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
        jobTitle={user.job_type}
        agencyName={user.agencyName}
        mode={mode}
        toggleMode={toggleMode}
        onLogout={handleLogout}
        pageName=""
        pageDescription=""
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Updates" }]}
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
          className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto"
          style={{
            marginLeft: sidebarState.hidden
              ? "0px"
              : `${84 + (isSidebarOpen ? 120 : 0) + sidebarState.offset}px`,
          }}
        >
          <div className="max-w-7xl mx-auto space-y-8">
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
                  {filterOptions.tags.map((tag) => (
                    <motion.button
                      type="button"
                      key={tag}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.preventDefault();
                        console.log("[Updates] Setting tag filter:", tag);
                        setFilters({ tags: tag });
                      }}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                        filters.tags === tag
                          ? mode === "dark"
                            ? "bg-blue-600 text-white shadow-lg"
                            : "bg-blue-500 text-white shadow-lg"
                          : mode === "dark"
                          ? "bg-gray-700/50 text-gray-300 hover:bg-gray-600/50"
                          : "bg-gray-100/80 text-gray-600 hover:bg-gray-200/80"
                      }`}
                    >
                      <Icon icon="mdi:tag" className="w-4 h-4" />
                      <span className="text-sm">{tag}</span>
                    </motion.button>
                  ))}
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
                        onClick={
                          !isAccessible
                            ? () => handleDisabledClick(update.tier_restriction)
                            : undefined
                        }
                        className={`group relative overflow-hidden rounded-2xl ${
                          mode === "dark"
                            ? isAccessible
                              ? "bg-gray-800/60 border border-gray-700/50 hover:border-gray-600/70"
                              : "bg-gray-700/50 border border-gray-700/50 opacity-60 cursor-not-allowed"
                            : isAccessible
                            ? "bg-white/80 border border-gray-200/50 hover:border-gray-300/70"
                            : "bg-gray-100/50 border border-gray-200/50 opacity-60 cursor-not-allowed"
                        } backdrop-blur-md shadow-lg ${
                          isAccessible ? "hover:shadow-2xl" : ""
                        } transition-all duration-300 ${
                          viewMode === "list"
                            ? "flex items-center gap-6 p-6"
                            : "p-6"
                        }`}
                      >
                        <div
                          className={`absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 ${
                            isAccessible ? "group-hover:opacity-100" : ""
                          } transition-opacity duration-300 rounded-2xl`}
                        />

                        <div
                          className={`relative ${
                            viewMode === "list" ? "flex-1" : ""
                          }`}
                        >
                          {/* Badges */}
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex flex-wrap gap-2">
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                  mode === "dark"
                                    ? "bg-indigo-700 text-white"
                                    : "bg-indigo-100 text-indigo-800"
                                }`}
                              >
                                {update.category || "General"}
                              </span>
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                  mode === "dark"
                                    ? "bg-purple-700 text-white"
                                    : "bg-purple-100 text-purple-800"
                                }`}
                              >
                                {normalizeTier(update.tier_restriction)}
                              </span>
                            </div>
                          </div>

                          {/* Icon and Title */}
                          <div
                            className={`flex items-start gap-4 ${
                              viewMode === "list" ? "mb-0" : "mb-4"
                            }`}
                          >
                            <div
                              className={`p-3 rounded-xl ${
                                mode === "dark"
                                  ? isAccessible
                                    ? "bg-blue-500/20 text-blue-400"
                                    : "bg-gray-600/20 text-gray-500"
                                  : isAccessible
                                  ? "bg-blue-500/10 text-blue-600"
                                  : "bg-gray-200/20 text-gray-400"
                              } ${
                                isAccessible ? "group-hover:scale-110" : ""
                              } transition-transform duration-200`}
                            >
                              <Icon
                                icon={getUpdateTypeIcon(update)}
                                className="w-6 h-6"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3
                                className={`text-lg font-bold mb-2 line-clamp-2 ${
                                  mode === "dark"
                                    ? isAccessible
                                      ? "text-white"
                                      : "text-gray-400"
                                    : isAccessible
                                    ? "text-gray-900"
                                    : "text-gray-500"
                                } ${
                                  isAccessible
                                    ? "group-hover:text-blue-500"
                                    : ""
                                } transition-colors`}
                              >
                                {update.title}
                              </h3>
                              <p
                                className={`text-sm leading-relaxed ${
                                  mode === "dark"
                                    ? isAccessible
                                      ? "text-gray-300"
                                      : "text-gray-500"
                                    : isAccessible
                                    ? "text-gray-600"
                                    : "text-gray-400"
                                } ${
                                  viewMode === "grid"
                                    ? "line-clamp-3"
                                    : "line-clamp-2"
                                }`}
                              >
                                {update.description}
                              </p>
                            </div>
                          </div>

                          {/* Footer */}
                          <div
                            className={`flex items-center justify-between gap-4 ${
                              viewMode === "list" ? "mt-0" : "mt-6"
                            }`}
                          >
                            <div
                              className={`text-xs font-medium ${
                                mode === "dark"
                                  ? isAccessible
                                    ? "text-gray-400"
                                    : "text-gray-500"
                                  : isAccessible
                                  ? "text-gray-500"
                                  : "text-gray-400"
                              }`}
                            >
                              {new Date(update.created_at).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </div>

                            {update.cta_text && update.cta_url && (
                              <motion.a
                                href={update.cta_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={isAccessible ? { scale: 1.05 } : {}}
                                whileTap={isAccessible ? { scale: 0.95 } : {}}
                                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                                  mode === "dark"
                                    ? isAccessible
                                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                                      : "bg-gray-600 text-gray-400 cursor-not-allowed"
                                    : isAccessible
                                    ? "bg-blue-500 hover:bg-blue-600 text-white"
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                } shadow-md ${
                                  isAccessible ? "hover:shadow-lg" : ""
                                }`}
                                onClick={(e) =>
                                  !isAccessible && e.preventDefault()
                                }
                              >
                                <span>{update.cta_text}</span>
                                <Icon
                                  icon="mdi:arrow-right"
                                  className="w-4 h-4"
                                />
                              </motion.a>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <SimpleFooter mode={mode} isSidebarOpen={isSidebarOpen} />
      </div>
    </div>
  );
}
