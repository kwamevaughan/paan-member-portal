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
import {
  getTierBadgeStyles,
  TierBadge,
  JobTypeBadge,
  normalizeTier,
} from "@/components/Badge";
import Link from "next/link";
import { hasTierAccess } from "@/utils/tierUtils";
import { supabase } from "@/lib/supabase";
import TabsSelector from "@/components/TabsSelector";
import ResourceCard from "@/components/ResourceCard";
import SimpleModal from "@/components/SimpleModal";
import UnifiedModalContent from "@/components/UnifiedModalContent";

// Video Modal Content Component
const VideoModalContent = ({ videoUrl, resourceId, title, mode }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    if (!rating) {
      toast.error("Please select a rating");
      return;
    }

    setSubmitting(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in to submit feedback");
        return;
      }

      const { error } = await supabase.from("resource_feedback").insert({
        resource_id: resourceId,
        user_id: user.id,
        rating,
        comment: comment.trim() || null,
      });

      if (error)
        throw new Error(`Feedback submission failed: ${error.message}`);

      toast.success("Feedback submitted successfully!");
      setRating(0);
      setComment("");
    } catch (err) {
      console.error("[VideoModal] Error submitting feedback:", err);
      toast.error("Failed to submit feedback");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Video Player */}
      <div className="relative" style={{ paddingBottom: "56.25%" }}>
        <iframe
          src={videoUrl}
          className="absolute top-0 left-0 w-full h-full rounded-lg"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>

      {/* Video Info */}
      <div className="text-center">
        <p className={`text-sm ${
          mode === "dark" ? "text-gray-300" : "text-gray-600"
        }`}>
          Click the video player above to watch the full content
        </p>
      </div>

      {/* Feedback Form */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <h3 className={`text-lg font-semibold mb-4 ${
          mode === "dark" ? "text-gray-200" : "text-gray-800"
        }`}>
          Rate this Video
        </h3>
        
        {/* Star Rating */}
        <div className="flex items-center gap-2 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              className={`text-2xl transition-colors duration-200 ${
                star <= rating
                  ? "text-paan-yellow"
                  : "text-gray-400 dark:text-gray-600"
              } hover:text-paan-yellow`}
            >
              <Icon icon="heroicons:star-solid" />
            </button>
          ))}
        </div>

        {/* Comment Textarea */}
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Optional comments..."
          className={`w-full p-3 rounded-lg border transition-all ${
            mode === "dark"
              ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              : "bg-white border-gray-200 text-gray-800 placeholder-gray-500"
          } focus:ring-2 focus:ring-paan-blue focus:border-paan-blue`}
          rows={4}
        />

        {/* Submit Button */}
        <button
          onClick={handleSubmitFeedback}
          disabled={submitting}
          className={`mt-4 px-6 py-2 rounded-lg font-medium transition-colors ${
            submitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-paan-blue hover:bg-paan-blue/80 text-white"
          }`}
        >
          {submitting ? "Submitting..." : "Submit Feedback"}
        </button>
      </div>
    </div>
  );
};

export default function Resources({ mode = "light", toggleMode }) {
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
    resource_type: "",
    tier_restriction: "",
  });
  const [activeTab, setActiveTab] = useState("all");
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  // Unified modal state
  const [modalData, setModalData] = useState(null);
  const [isUnifiedModalOpen, setIsUnifiedModalOpen] = useState(false);

  // Video modal state
  const [selectedVideo, setSelectedVideo] = useState({
    url: "",
    resourceId: null,
    title: "",
  });
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

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
    const handleError = (event) => {
      console.error("[Resources] Global error:", event.error);
    };
    window.addEventListener("error", handleError);
    return () => window.removeEventListener("error", handleError);
  }, []);

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
    
    // Handle video resources with SimpleModal
    if (resource.resource_type === "Video" && resource.video_url) {
      const embedUrl = getVideoEmbedUrl(resource.video_url);
      if (embedUrl) {
        setSelectedVideo({ 
          url: embedUrl, 
          resourceId: resource.id,
          title: resource.title 
        });
        setIsVideoModalOpen(true);
        return;
      }
    }
    
    // Use unified modal for other resource details
    setModalData({ ...resource, type: 'resource' });
    setIsUnifiedModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsUnifiedModalOpen(false);
    setModalData(null);
  };

  const handleCloseVideoModal = () => {
    setIsVideoModalOpen(false);
    setSelectedVideo({ url: "", resourceId: null, title: "" });
  };

  const filteredResources =
    activeTab === "all"
      ? resources
      : resources.filter((res) => hasTierAccess(res.tier_restriction, user));

  // Sort resources: accessible first, then by created date descending
  const sortedResources = filteredResources.sort((a, b) => {
    const aAccessible = hasTierAccess(a.tier_restriction, user);
    const bAccessible = hasTierAccess(b.tier_restriction, user);
    
    // First sort by accessibility
    if (aAccessible !== bAccessible) {
      return aAccessible ? -1 : 1;
    }
    
    // Then sort by created date (newest first)
    return new Date(b.created_at) - new Date(a.created_at);
  });

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

  // Define tabs for the top-level filter
  const mainTabs = [
    { id: "all", label: "All Resources", icon: "mdi:view-grid" },
    { id: "accessible", label: "For Your Tier", icon: "mdi:accessibility" },
  ];

  // Define tabs for resource types and tiers
  const resourceTypeTabs = [
    { id: "", label: "All Types", icon: "mdi:tag" },
    ...(filterOptions.resource_types?.map((type) => ({
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
            isSidebarOpen && !isMobile ? "ml-60" : !isMobile ? "ml-60" : ""
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
              pageTable="resources"
              lastUpdated={latestResourceDate}
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center gap-1.5">
                        <Icon icon="mdi:tag" />
                        Resource Type
                      </label>
                      <TabsSelector
                        tabs={resourceTypeTabs}
                        selectedTab={filters.resource_type}
                        onSelect={(value) =>
                          setFilters((prev) => ({
                            ...prev,
                            resource_type: value,
                          }))
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
                          setFilters((prev) => ({
                            ...prev,
                            tier_restriction: value,
                          }))
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
                  {sortedResources.length}
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  {" "}
                  resources found
                </span>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Showing {Math.min(12, sortedResources.length)} of{" "}
                {sortedResources.length}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resourcesLoading && (
                <div className="col-span-full flex justify-center py-8">
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-paan-blue"></div>
                    <span>Loading resources...</span>
                  </div>
                </div>
              )}
              {!resourcesLoading && sortedResources.map((resource) => (
                <ResourceCard
                  key={resource.id}
                  resource={resource}
                  mode={mode}
                  isRestricted={!hasTierAccess(resource.tier_restriction, user)}
                  onRestrictedClick={() => {
                    toast.error(
                      `This resource is available to ${normalizeTier(
                        resource.tier_restriction
                      )} only. Consider upgrading your membership to unlock this resource.`
                    );
                  }}
                  onClick={handleResourceClick}
                  Icon={Icon}
                />
              ))}
            </div>

            {sortedResources.length === 0 && (
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
                  className="mt-6 px-6 py-2 bg-paan-blue hover:bg-paan-blue/80 text-white rounded-lg font-medium transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            )}

            {sortedResources.length > 12 && (
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
                          ? "bg-paan-blue text-white"
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
          </div>
          <SimpleFooter mode={mode} isSidebarOpen={isSidebarOpen} />
        </div>
      </div>

      {/* Unified Modal */}
      <SimpleModal
        isOpen={isUnifiedModalOpen}
        onClose={handleCloseModal}
        title={modalData?.title || "Resource Details"}
        mode={mode}
        width="max-w-4xl"
      >
        <UnifiedModalContent
          modalData={modalData}
          mode={mode}
          onClose={handleCloseModal}
        />
      </SimpleModal>

      {/* Video Modal */}
      <SimpleModal
        isOpen={isVideoModalOpen}
        onClose={handleCloseVideoModal}
        title={selectedVideo.title || "Video Resource"}
        mode={mode}
        width="max-w-4xl"
      >
        <VideoModalContent
          videoUrl={selectedVideo.url}
          resourceId={selectedVideo.resourceId}
          title={selectedVideo.title}
          mode={mode}
        />
      </SimpleModal>
    </div>
  );
}
