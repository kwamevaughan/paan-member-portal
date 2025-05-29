import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Icon } from "@iconify/react";
import { useUser } from "@/hooks/useUser";
import useResources from "@/hooks/useResources";
import useLogout from "@/hooks/useLogout";
import HrHeader from "@/layouts/hrHeader";
import HrSidebar from "@/layouts/hrSidebar";
import SimpleFooter from "@/layouts/simpleFooter";
import useSidebar from "@/hooks/useSidebar";
import toast, { Toaster } from "react-hot-toast";
import TitleCard from "@/components/TitleCard";
import VideoModal from "@/components/VideoModal";
import {
  getTierBadgeStyles,
  TierBadge,
  JobTypeBadge,
  normalizeTier,
} from "@/components/Badge";
import Link from "next/link";
import { hasTierAccess } from "@/utils/tierUtils";
import { supabase } from "@/lib/supabase";

export default function Resources({ mode = "light", toggleMode }) {
  const { isSidebarOpen, toggleSidebar, sidebarState, updateDragOffset } =
    useSidebar();
  const router = useRouter();
  const { user, loading: userLoading, LoadingComponent } = useUser();
  const { handleLogout } = useLogout();
  const [filters, setFilters] = useState({
    resource_type: "",
    tier_restriction: "",
  });
  const [activeTab, setActiveTab] = useState("all");
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState({
    url: "",
    resourceId: null,
  });

  const {
    resources,
    filterOptions,
    loading: resourcesLoading,
    error,
  } = useResources(filters, user);

  const title = "Resources";
  const description =
    "Access valuable tools, templates, and learning materials to grow your agency.";

  // Get latest resource date
  const latestResourceDate =
    resources.length > 0
      ? new Date(
          Math.max(...resources.map((res) => new Date(res.updated_at)))
        ).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "No resources available";

  useEffect(() => {
    console.log("[Resources] User:", user);
    console.log("[Resources] Resources:", resources);
    console.log("[Resources] Latest Resource Date:", latestResourceDate);
    console.log("[Resources] Filters:", filters);
    console.log("[Resources] FilterOptions:", filterOptions);
  }, [resources, user, latestResourceDate, filters, filterOptions]);

  useEffect(() => {
    const handleError = (event) => {
      console.error("[Resources] Global error:", event.error);
    };
    window.addEventListener("error", handleError);
    return () => window.removeEventListener("error", handleError);
  }, []);

  const handleFilterChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleResetFilters = (e) => {
    e.preventDefault();
    setFilters({
      resource_type: "",
      tier_restriction: "",
    });
    setActiveTab("all");
  };

  const getVideoEmbedUrl = (videoUrl) => {
    if (!videoUrl) return null;
    if (videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be")) {
      const videoId =
        videoUrl.match(/(?:v=)([^&]+)/)?.[1] ||
        videoUrl.match(/youtu\.be\/([^?]+)/)?.[1];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    } else if (videoUrl.includes("vimeo.com")) {
      const videoId = videoUrl.match(/vimeo\.com\/(\d+)/)?.[1];
      return videoId ? `https://player.vimeo.com/video/${videoId}` : null;
    }
    return null;
  };

  const handleResourceClick = (resource) => {
    if (!hasTierAccess(resource.tier_restriction, user)) {
      toast.error(
        `This resource is available to ${normalizeTier(
          resource.tier_restriction
        )} only. Consider upgrading your membership to unlock this resource.`,
        { duration: 5000 }
      );
      return;
    }
    if (resource.resource_type === "Video" && resource.video_url) {
      const embedUrl = getVideoEmbedUrl(resource.video_url);
      if (embedUrl) {
        setSelectedVideo({ url: embedUrl, resourceId: resource.id });
        setIsModalOpen(true);
      }
    }
  };

  const filteredResources =
    activeTab === "all"
      ? resources
      : resources.filter((res) => hasTierAccess(res.tier_restriction, user));

  if (userLoading || resourcesLoading) {
    return LoadingComponent;
  }

  if (!user) {
    console.log("[Resources] No user, redirecting to /login");
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
        fullName={user?.name ?? "Member"}
        jobTitle={user?.job_type}
        selectedTier={user?.selected_tier}
        agencyName={user?.agencyName}
        mode={mode}
        toggleMode={toggleMode}
        onLogout={handleLogout}
        pageName="Resources"
        pageDescription={description}
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
          className={`content-container flex-1 p-4 md:p-6 lg:p-8 transition-all duration-300 overflow-hidden ${
            isSidebarOpen ? "sidebar-open" : ""
          } ${sidebarState.hidden ? "sidebar-hidden" : ""}`}
          style={{
            marginLeft: sidebarState.hidden
              ? "0px"
              : `${84 + (isSidebarOpen ? 120 : 0) + sidebarState.offset}px`,
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
              toast={toast}
              pageTable="resources"
              lastUpdated={latestResourceDate}
            />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex overflow-x-auto no-scrollbar gap-2 pb-2">
                {[
                  { id: "all", label: "All Resources", icon: "mdi:view-grid" },
                  {
                    id: "accessible",
                    label: "For Your Tier",
                    icon: "mdi:accessibility",
                  },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 rounded-full whitespace-nowrap flex items-center gap-2 transition-all ${
                      activeTab === tab.id
                        ? "bg-blue-600 text-white font-medium shadow-md"
                        : mode === "dark"
                        ? "bg-gray-800 hover:bg-gray-700"
                        : "bg-white hover:bg-gray-100"
                    } shadow-sm`}
                  >
                    <Icon icon={tab.icon} />
                    {tab.label}
                  </button>
                ))}
              </div>
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
                        className="text-blue-500"
                      />
                      <span>Refine Your Search</span>
                    </div>
                    <button
                      onClick={handleResetFilters}
                      className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500 transition"
                    >
                      <Icon icon="mdi:restart" />
                      Reset All
                    </button>
                  </div>
                  <form
                    onSubmit={(e) => e.preventDefault()}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    {[
                      {
                        key: "resource_type",
                        icon: "mdi:tag",
                        label: "Resource Type",
                      },
                      {
                        key: "tier_restriction",
                        icon: "mdi:crown-outline",
                        label: "Tier",
                      },
                    ].map(({ key, icon, label }) => (
                      <div key={key} className="space-y-1">
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center gap-1.5">
                          <Icon icon={icon} />
                          {label}
                        </label>
                        <select
                          name={key}
                          value={filters[key]}
                          onChange={handleFilterChange}
                          className={`w-full p-2.5 rounded-lg border ${
                            mode === "dark"
                              ? "bg-gray-700 border-gray-600 text-white"
                              : "bg-white border-gray-200 text-gray-800"
                          } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                        >
                          <option value="">All {label}s</option>
                          {(filterOptions[`${key}s`] || []).map((val) => (
                            <option key={val} value={val}>
                              {val}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </form>
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
                  {filteredResources.length}
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  {" "}
                  resources found
                </span>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Showing {Math.min(12, filteredResources.length)} of{" "}
                {filteredResources.length}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource) => {
                const embedUrl = getVideoEmbedUrl(resource.video_url);
                const canAccess = hasTierAccess(
                  resource.tier_restriction,
                  user
                );
                return (
                  <div
                    key={resource.id}
                    onClick={() => handleResourceClick(resource)}
                    className={`group rounded-2xl overflow-hidden border shadow-sm hover:shadow-xl transition-all duration-300 ${
                      mode === "dark"
                        ? "bg-gray-800 border-gray-700 hover:border-gray-600"
                        : "bg-white border-gray-200 hover:border-gray-300"
                    } ${!canAccess ? "opacity-60" : ""}`}
                  >
                    <div className="relative h-40 bg-gradient-to-r from-blue-400 to-indigo-600 overflow-hidden">
                      <div className="absolute inset-0 opacity-20 bg-pattern"></div>
                      <div className="absolute top-0 right-0 p-3">
                        <TierBadge
                          tier={resource.tier_restriction}
                          mode={mode}
                          variant="solid"
                        />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                        <div className="flex items-center gap-2 text-white font-semibold">
                          <Icon icon="mdi:tag" />
                          {resource.resource_type}
                        </div>
                      </div>
                    </div>

                    <div className="p-5 space-y-4">
                      <div>
                        <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {resource.title}
                        </h3>
                        <p
                          className={`text-sm ${
                            mode === "dark" ? "text-gray-300" : "text-gray-600"
                          } line-clamp-3`}
                        >
                          {resource.description || "No description available."}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div
                          className={`rounded-lg p-3 ${
                            mode === "dark" ? "bg-gray-700/60" : "bg-gray-50"
                          }`}
                        >
                          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                            Type
                          </div>
                          <div className="font-medium truncate">
                            {resource.resource_type}
                          </div>
                        </div>
                        <div
                          className={`rounded-lg p-3 ${
                            mode === "dark" ? "bg-gray-700/60" : "bg-gray-50"
                          }`}
                        >
                          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                            Added
                          </div>
                          <div className="font-medium flex items-center gap-1.5">
                            <Icon
                              icon="mdi:calendar"
                              className="text-blue-500"
                            />
                            {new Date(resource.created_at).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="pt-2">
                        {canAccess ? (
                          resource.file_path ? (
                            <a
                              href={
                                supabase.storage
                                  .from("resources")
                                  .getPublicUrl(resource.file_path).data
                                  .publicUrl
                              }
                              download
                              onClick={(e) => e.stopPropagation()}
                              className="block w-full px-4 py-2 rounded-lg font-semibold text-center bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                            >
                              Download
                            </a>
                          ) : resource.video_url && embedUrl ? (
                            <button className="block w-full px-4 py-2 rounded-lg font-semibold text-center bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                              Watch Video
                            </button>
                          ) : resource.url ? (
                            <a
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="block w-full px-4 py-2 rounded-lg font-semibold text-center bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                            >
                              Access Resource
                            </a>
                          ) : (
                            <button
                              disabled
                              className="block w-full px-4 py-2 rounded-lg font-semibold text-center bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-600 dark:text-gray-400"
                            >
                              No Resource Available
                            </button>
                          )
                        ) : (
                          <button
                            disabled
                            className="block w-full px-4 py-2 rounded-lg font-semibold text-center bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-600 dark:text-gray-400"
                          >
                            Locked
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredResources.length === 0 && (
              <div
                className={`text-center py-12 rounded-2xl ${
                  mode === "dark" ? "bg-gray-800" : "bg-white"
                } shadow-sm border dark:border-gray-700`}
              >
                <Icon
                  icon="mdi:magnify"
                  className="inline-block text-5xl text-gray-400 mb-4"
                />
                <h3 className="text-xl font-semibold mb-2">
                  No Resources Found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                  No resources match your current filters. Try adjusting your
                  search criteria or check back later for new resources.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            )}

            {filteredResources.length > 12 && (
              <div className="flex justify-center mt-8">
                <div className="flex items-center space-x-2">
                  <button
                    className={`w-10 h-10 flex items-center justify-center rounded-lg ${
                      mode === "dark"
                        ? "bg-gray-800 hover:bg-gray-700"
                        : "bg-white hover:bg-gray-100"
                    } border dark:border-gray-700 shadow-sm`}
                  >
                    <Icon icon="mdi:chevron-left" />
                  </button>
                  {[1, 2, 3].map((num) => (
                    <button
                      key={num}
                      className={`w-10 h-10 flex items-center justify-center rounded-lg font-medium ${
                        num === 1
                          ? "bg-blue-600 text-white"
                          : mode === "dark"
                          ? "bg-gray-800 hover:bg-gray-700"
                          : "bg-white hover:bg-gray-100"
                      } border dark:border-gray-700 shadow-sm`}
                    >
                      {num}
                    </button>
                  ))}
                  <button
                    className={`w-10 h-10 flex items-center justify-center rounded-lg ${
                      mode === "dark"
                        ? "bg-gray-800 hover:bg-gray-700"
                        : "bg-white hover:bg-gray-100"
                    } border dark:border-gray-700 shadow-sm`}
                  >
                    <Icon icon="mdi:chevron-right" />
                  </button>
                </div>
              </div>
            )}

            <VideoModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              videoUrl={selectedVideo.url}
              resourceId={selectedVideo.resourceId}
              mode={mode}
            />
          </div>
          <SimpleFooter mode={mode} isSidebarOpen={isSidebarOpen} />
        </div>
      </div>
    </div>
  );
}
