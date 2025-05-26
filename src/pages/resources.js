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
import { supabase } from "@/lib/supabase";
import VideoModal from "@/components/VideoModal";
import { tierBadgeStyles } from "@/components/Badge";

export default function Resources({ mode = "light", toggleMode }) {
  const { isSidebarOpen, toggleSidebar, sidebarState, updateDragOffset } =
    useSidebar();
  const router = useRouter();
  const { user, loading: userLoading, LoadingComponent } = useUser();
  const handleLogout = useLogout();
  const [filters, setFilters] = useState({
    resource_type: "",
    tier_restriction: "",
  });
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
  } = useResources(filters);

  const canAccessResource = (resourceTier) => {
    if (resourceTier === "All") return true;
    const tiers = ["Associate", "Full", "Gold", "Free"];
    const userTier = user?.selected_tier || "Free Member";
    const userTierIndex = tiers.indexOf(userTier);
    const resourceTierIndex = tiers.indexOf(resourceTier);
    return userTierIndex >= resourceTierIndex;
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      resource_type: "",
      tier_restriction: "",
    });
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
    if (!canAccessResource(resource.tier_restriction)) {
      toast.error(
        `This resource is available to ${resource.tier_restriction} Members only. Consider upgrading your membership to unlock this resource.`,
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


  if (userLoading || resourcesLoading) {
    return LoadingComponent;
  }

  if (!user) {
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
        mode === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <Toaster
        position="top-center"
        toastOptions={{
          className:
            "!bg-white !text-gray-800 dark:!bg-gray-800 dark:!text-white font-medium",
          style: {
            borderRadius: "10px",
            padding: "16px",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
          },
        }}
      />
      <HrHeader
        toggleSidebar={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
        sidebarState={sidebarState}
        fullName={user?.name ?? "Member"}
        jobTitle={user.job_type}
        selectedTier={user?.selected_tier}
        agencyName={user.agencyName}
        mode={mode}
        toggleMode={toggleMode}
        onLogout={handleLogout}
        pageName="Resources"
        pageDescription="Access valuable tools, templates, and learning materials."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Resources" }]}
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
            {/* Hero Section */}
            <div
              className={`relative overflow-hidden rounded-3xl ${
                mode === "dark" ? "bg-gray-800" : "bg-white"
              } shadow-lg`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-40"></div>
              <div className="absolute top-0 right-0 -mt-12 -mr-12 w-40 h-40 bg-blue-500 rounded-full opacity-20 blur-3xl"></div>
              <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-40 h-40 bg-purple-500 rounded-full opacity-20 blur-3xl"></div>
              <div className="relative p-8 md:p-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                      Resources
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 max-w-2xl">
                      Access valuable tools, templates, and learning materials
                      to grow your agency.
                    </p>
                  </div>
                  <div className="md:self-end">
                    <div
                      className={`rounded-xl p-3 backdrop-blur-sm ${
                        mode === "dark" ? "bg-gray-700/50" : "bg-gray-50/50"
                      } border border-gray-200 dark:border-gray-700`}
                    >
                      <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Your current tier
                      </div>
                      <div
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${
                          tierBadgeStyles[user?.selected_tier || "Free Member"]
                        }`}
                      >
                        <Icon icon="mdi:crown" />
                        <span className="font-semibold">
                          {user?.selected_tier || "Free Member"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex overflow-x-auto no-scrollbar gap-2 pb-2">
                {[
                  { id: "all", label: "All Resources", icon: "mdi:view-grid" },
                  {
                    id: "accessible",
                    label: "For Your Tier",
                    icon: "mdi:shield-check",
                  },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() =>
                      setFilters({
                        ...filters,
                        tier_restriction:
                          tab.id === "accessible" ? user?.selected_tier : "",
                      })
                    }
                    className={`px-4 py-2 rounded-full whitespace-nowrap flex items-center gap-2 transition-all ${
                      filters.tier_restriction ===
                      (tab.id === "accessible" ? user?.selected_tier : "")
                        ? "bg-blue-600 text-white font-medium shadow-md"
                        : mode === "dark"
                        ? "bg-gray-800 hover:bg-gray-700"
                        : "bg-white hover:bg-gray-100 shadow-sm"
                    }`}
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

            {/* Filter Panel */}
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
                  <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                          {filterOptions[`${key}s`].map((val) => (
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

            {/* Resource Count */}
            <div className="flex justify-between items-center">
              <div
                className={`px-4 py-2 rounded-lg ${
                  mode === "dark" ? "bg-gray-800" : "bg-white"
                } shadow-sm`}
              >
                <span className="font-semibold">{resources.length}</span>
                <span className="text-gray-600 dark:text-gray-400">
                  {" "}
                  resources found
                </span>
              </div>
            </div>

            {/* Resources Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.map((resource) => {
                const embedUrl = getVideoEmbedUrl(resource.video_url);
                const canAccess = canAccessResource(resource.tier_restriction);
                return (
                  <div
                    key={resource.id}
                    onClick={() => handleResourceClick(resource)}
                    className={`relative flex flex-col h-full rounded-2xl border-0 ${
                      mode === "dark" ? "bg-gray-800/50" : "bg-white"
                    } shadow-lg overflow-hidden hover:shadow-xl transition-all duration-200 group cursor-pointer ${
                      !canAccess ? "opacity-75" : ""
                    }`}
                  >
                    <div className="px-6 pt-6 pb-4 border-b border-gray-100 dark:border-gray-700">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                          {resource.title}
                        </h3>
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                            tierBadgeStyles[resource.tier_restriction]
                          }`}
                        >
                          {resource.tier_restriction === "All"
                            ? "All Members"
                            : resource.tier_restriction}
                        </span>
                      </div>
                      <div className="flex items-center mt-1.5">
                        <Icon
                          icon={
                            resource.resource_type === "PDF"
                              ? "heroicons:document-text"
                              : resource.resource_type === "Video"
                              ? "heroicons:video-camera"
                              : "heroicons:academic-cap"
                          }
                          className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-1.5 flex-shrink-0"
                        />
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {resource.resource_type}
                        </p>
                      </div>
                    </div>
                    <div className="px-6 py-4 flex-grow">
                      {resource.description && (
                        <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 mb-4">
                          {resource.description}
                        </p>
                      )}
                      {canAccess ? (
                        <>
                          {resource.file_path ? (
                            <a
                              href={
                                supabase.storage
                                  .from("resources")
                                  .getPublicUrl(resource.file_path).data
                                  .publicUrl
                              }
                              download
                              onClick={(e) => e.stopPropagation()}
                              className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center"
                            >
                              <Icon
                                icon="heroicons:download"
                                className="w-4 h-4 mr-1"
                              />
                              Download Resource
                            </a>
                          ) : resource.video_url && embedUrl ? (
                            <div
                              className="relative"
                              style={{ paddingBottom: "56.25%" }}
                            >
                              <iframe
                                src={embedUrl}
                                className="absolute top-0 left-0 w-full h-full rounded-lg"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              ></iframe>
                            </div>
                          ) : resource.url ? (
                            <a
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                            >
                              Access Resource
                            </a>
                          ) : (
                            <p className="text-sm text-gray-500">
                              No resource link available
                            </p>
                          )}
                        </>
                      ) : (
                        <div className="mt-4 p-3 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center">
                          <Icon
                            icon="heroicons:lock-closed"
                            className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-2"
                          />
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            Locked for {resource.tier_restriction} members and
                            above.{" "}
                            <a
                              href="/membership"
                              className="text-indigo-600 dark:text-indigo-400 hover:underline"
                            >
                              Upgrade to {resource.tier_restriction} Membership
                            </a>
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 mt-auto bg-gray-50 dark:bg-gray-800/80">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Added on{" "}
                        {new Date(resource.created_at).toLocaleDateString(
                          "en-US",
                          {
                            month: "numeric",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* No Resources */}
            {resources.length === 0 && (
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
                  search criteria or check back later.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            )}

            {/* Video Modal */}
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
