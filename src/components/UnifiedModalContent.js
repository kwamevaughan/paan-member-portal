import { Icon } from "@iconify/react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
import ImageGallery from "./ImageGallery";

// Shared Components
const ModalHero = ({ title, subtitle, icon, tier, mode, bannerImage, children }) => (
  <div className="relative">
    {bannerImage ? (
      <div className="relative w-full h-64 rounded-2xl overflow-hidden mb-6">
        <Image
          src={bannerImage}
          width={1200}
          height={0}
          alt={`Banner for ${title}`}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2 text-white">{title}</h2>
              {subtitle && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20 backdrop-blur-sm text-white border border-white/30">
                  <Icon icon={icon} className="mr-2 text-lg" />
                  {subtitle}
                </span>
              )}
            </div>
            <div className="text-right">
              <span className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold ${
                mode === "dark" 
                  ? "bg-blue-900/80 text-blue-100 border border-blue-700/50 backdrop-blur-sm" 
                  : "bg-white/90 text-blue-800 border border-white/20 backdrop-blur-sm"
              }`}>
                {tier || "All Members"}
              </span>
            </div>
          </div>
        </div>
      </div>
    ) : (
      <div className="mb-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className={`text-3xl font-bold mb-3 ${mode === "dark" ? "text-white" : "text-gray-900"}`}>
              {title}
            </h2>
            {subtitle && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-paan-blue text-white">
                <Icon icon={icon} className="mr-2 text-lg" />
                {subtitle}
              </span>
            )}
          </div>
          <div>
            <span className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold ${
              mode === "dark" 
                ? "bg-blue-900/30 text-blue-400 border border-blue-700/50" 
                : "bg-blue-100 text-blue-800 border border-blue-200"
            }`}>
              {tier || "All Members"}
            </span>
          </div>
        </div>
      </div>
    )}
    {children}
  </div>
);

const InfoCard = ({ icon, label, value, iconColor, iconBgColor, mode }) => (
  <div className={`p-4 rounded-xl border ${
    mode === "dark" 
      ? "bg-gray-800/50 border-gray-700" 
      : "bg-white border-gray-200 shadow-sm"
  }`}>
    <div className="flex items-center space-x-3">
      <div className={`p-2 rounded-lg ${iconBgColor}`}>
        <Icon icon={icon} className={`text-2xl ${iconColor}`} />
      </div>
      <div>
        <p className={`text-sm font-medium ${
          mode === "dark" ? "text-gray-400" : "text-gray-600"
        }`}>{label}</p>
        <p className={`font-semibold ${
          mode === "dark" ? "text-white" : "text-gray-900"
        }`}>{value}</p>
      </div>
    </div>
  </div>
);

const InfoGrid = ({ children, mode }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {children}
  </div>
);

const DescriptionSection = ({ title, description, mode }) => {
  if (!description) return null;
  
  return (
    <div className={`p-6 rounded-xl ${
      mode === "dark" ? "bg-gray-800/30" : "bg-gray-50"
    }`}>
      <h3 className={`text-xl font-semibold mb-3 ${
        mode === "dark" ? "text-white" : "text-gray-900"
      }`}>
        {title}
      </h3>
      <p className={`text-sm leading-relaxed ${
        mode === "dark" ? "text-gray-300" : "text-gray-700"
      }`}>
        {description}
      </p>
    </div>
  );
};

const TagsSection = ({ tags, mode }) => {
  if (!tags || tags.length === 0) return null;
  
  return (
    <div>
      <h3 className={`text-xl font-semibold mb-4 ${
        mode === "dark" ? "text-white" : "text-gray-900"
      }`}>
        Tags
      </h3>
      <div className="flex flex-wrap gap-3">
        {tags.map((tag, index) => (
          <span
            key={index}
            className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              mode === "dark"
                ? "bg-gray-700/60 text-gray-300 hover:bg-gray-600/60"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <Icon
              icon="mdi:tag"
              className="text-paan-yellow text-sm mr-2"
            />
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

const ActionButtons = ({ onClose, actions = [], mode }) => (
  <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
    <button
      onClick={onClose}
      className={`px-8 py-3 text-sm font-semibold rounded-xl border transition-all duration-200 ${
        mode === "dark"
          ? "border-gray-600 text-gray-200 bg-gray-800 hover:bg-gray-700 hover:border-gray-500"
          : "border-gray-200 text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300"
      }`}
    >
      Close
    </button>
    {actions.map((action, index) => (
      <button
        key={index}
        onClick={action.onClick}
        className={`px-8 py-3 text-sm font-semibold rounded-xl text-white transition-all duration-200 ${
          action.color || "bg-paan-blue hover:bg-paan-blue/80"
        } shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${mode === "dark" ? "shadow-white/10" : "shadow-gray-200"}`}
      >
        {action.label}
      </button>
    ))}
  </div>
);

// Utility Functions
const getIconColors = (type) => {
  const colors = {
    red: {
      icon: mode === "dark" ? "bg-red-900/30" : "bg-red-50",
      text: "text-[#f25749]"
    },
    yellow: {
      icon: mode === "dark" ? "bg-yellow-900/30" : "bg-yellow-50",
      text: "text-paan-yellow"
    },
    blue: {
      icon: mode === "dark" ? "bg-blue-900/30" : "bg-blue-50",
      text: "text-paan-blue"
    },
    green: {
      icon: mode === "dark" ? "bg-green-900/30" : "bg-green-50",
      text: "text-green-500"
    },
    amber: {
      icon: mode === "dark" ? "bg-amber-900/30" : "bg-amber-50",
      text: "text-amber-400"
    }
  };
  return colors[type] || colors.blue;
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString();
};

const formatDateTime = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Feedback Form Component for Offers
const OfferFeedbackForm = ({ offerId, title, mode }) => {
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

      const { error } = await supabase.from("offer_feedback").insert({
        offer_id: offerId,
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
      console.error("[OfferFeedbackForm] Error submitting feedback:", err);
      toast.error("Failed to submit feedback");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
      <h3 className={`text-lg font-semibold mb-4 ${
        mode === "dark" ? "text-gray-200" : "text-gray-800"
      }`}>
        Rate this Offer
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
  );
};

// Feedback Form Component for Video Resources
const VideoFeedbackForm = ({ resourceId, title, mode }) => {
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
      console.error("[VideoFeedbackForm] Error submitting feedback:", err);
      toast.error("Failed to submit feedback");
    } finally {
      setSubmitting(false);
    }
  };

  return (
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
  );
};

// Video Player Component
const VideoPlayer = ({ videoUrl, mode }) => {
  const getVideoEmbedUrl = (url) => {
    if (!url) return null;
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const videoId =
        url.match(/(?:v=)([^&]+)/)?.[1] ||
        url.match(/youtu\.be\/([^?]+)/)?.[1];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    } else if (url.includes("vimeo.com")) {
      const videoId = url.match(/vimeo\.com\/(\d+)/)?.[1];
      return videoId ? `https://player.vimeo.com/video/${videoId}` : null;
    }
    return null;
  };

  const embedUrl = getVideoEmbedUrl(videoUrl);

  if (!embedUrl) {
    return (
      <div className={`text-center py-8 rounded-lg ${
        mode === "dark" ? "bg-gray-800" : "bg-gray-100"
      }`}>
        <p className={`text-sm ${
          mode === "dark" ? "text-gray-300" : "text-gray-600"
        }`}>
          Video URL not supported or invalid
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative" style={{ paddingBottom: "56.25%" }}>
        <iframe
          src={embedUrl}
          className="absolute top-0 left-0 w-full h-full rounded-lg"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
      <div className="text-center">
        <p className={`text-sm ${
          mode === "dark" ? "text-gray-300" : "text-gray-600"
        }`}>
          Click the video player above to watch the full content
        </p>
      </div>
    </div>
  );
};

// Modal Content Components
const UpdateModalContent = ({ modalData, mode, onClose }) => {
  const actions = [];
  
  if (modalData.cta_url) {
    actions.push({
      label: modalData.cta_text || "Visit Link",
      onClick: () => window.open(modalData.cta_url, "_blank", "noopener,noreferrer"),
      color: "bg-paan-blue hover:bg-paan-blue/80"
    });
  }

  return (
    <div className="space-y-8">
      <ModalHero
        title={modalData.title}
        subtitle={modalData.category}
        icon="mdi:folder"
        tier={modalData.tier_restriction}
        mode={mode}
      />

      <InfoGrid mode={mode}>
        {modalData.created_at && (
          <InfoCard
            icon="mdi:calendar"
            label="Created Date"
            value={formatDate(modalData.created_at)}
            iconColor="text-[#f25749]"
            iconBgColor={mode === "dark" ? "bg-red-900/30" : "bg-red-50"}
            mode={mode}
          />
        )}
        
        {modalData.cta_url && (
          <InfoCard
            icon="mdi:link"
            label="External Link"
            value="Available"
            iconColor="text-green-500"
            iconBgColor={mode === "dark" ? "bg-green-900/30" : "bg-green-50"}
            mode={mode}
          />
        )}
        
        {modalData.cta_text && (
          <InfoCard
            icon="mdi:arrow-right"
            label="Call to Action"
            value={modalData.cta_text}
            iconColor="text-paan-yellow"
            iconBgColor={mode === "dark" ? "bg-yellow-900/30" : "bg-yellow-50"}
            mode={mode}
          />
        )}
      </InfoGrid>
      
      <DescriptionSection title="Description" description={modalData.description} mode={mode} />
      <TagsSection tags={modalData.tags} mode={mode} />
      <ActionButtons onClose={onClose} actions={actions} mode={mode} />
    </div>
  );
};

const IntelligenceModalContent = ({ modalData, mode, onClose }) => {
  const actions = [];
  
  if (modalData.url) {
    actions.push({
      label: "View Report",
      onClick: () => window.open(modalData.url, "_blank"),
      color: "bg-[#f25749] hover:bg-[#e04a3d]"
    });
  }
  
  if (modalData.downloadable) {
    actions.push({
      label: "Download",
      onClick: () => {},
      color: "bg-paan-blue hover:bg-paan-blue/80"
    });
  }

  return (
    <div className="space-y-8">
      <ModalHero
        title={modalData.title}
        subtitle={modalData.type}
        icon="mdi:chart-line"
        tier={modalData.tier_restriction}
        mode={mode}
      />

      <InfoGrid mode={mode}>
        {modalData.region && (
          <InfoCard
            icon="mdi:map-marker"
            label="Region"
            value={modalData.region}
            iconColor="text-paan-yellow"
            iconBgColor={mode === "dark" ? "bg-yellow-900/30" : "bg-yellow-50"}
            mode={mode}
          />
        )}
        
        {modalData.created_at && (
          <InfoCard
            icon="mdi:calendar"
            label="Created Date"
            value={formatDate(modalData.created_at)}
            iconColor="text-paan-red"
            iconBgColor={mode === "dark" ? "bg-red-900/30" : "bg-red-50"}
            mode={mode}
          />
        )}
        
        {modalData.downloadable && (
          <InfoCard
            icon="mdi:download"
            label="Downloadable"
            value="Available"
            iconColor="text-paan-yellow"
            iconBgColor={mode === "dark" ? "bg-yellow-900/30" : "bg-yellow-50"}
            mode={mode}
          />
        )}
        
        {modalData.intel_type && (
          <InfoCard
            icon="mdi:file-chart"
            label="Intelligence Type"
            value={modalData.intel_type}
            iconColor="text-paan-blue"
            iconBgColor={mode === "dark" ? "bg-blue-900/30" : "bg-blue-50"}
            mode={mode}
          />
        )}
        
        {modalData.view_count && (
          <InfoCard
            icon="mdi:eye"
            label="Views"
            value={modalData.view_count}
            iconColor="text-green-500"
            iconBgColor={mode === "dark" ? "bg-green-900/30" : "bg-green-50"}
            mode={mode}
          />
        )}
      </InfoGrid>
      
      <DescriptionSection title="Description" description={modalData.description} mode={mode} />
      <TagsSection tags={modalData.tags} mode={mode} />
      <ActionButtons onClose={onClose} actions={actions} mode={mode} />
    </div>
  );
};

const EventModalContent = ({ modalData, mode, onClose, registeredEvents = [], handleEventRegistration }) => {
  const isRegistered = registeredEvents.some(reg => reg.id === modalData.id);
  const eventDate = new Date(modalData.date);
  const today = new Date();
  const isPast = eventDate < today;
  const actions = [];
  
  if (!isRegistered && !isPast) {
    actions.push({
      label: modalData.registration_link ? "Register Online" : "Register Now",
      onClick: () => {
        if (modalData.registration_link) {
          window.open(modalData.registration_link, "_blank", "noopener,noreferrer");
        } else {
          handleEventRegistration(modalData.id);
        }
      },
      color: modalData.registration_link 
        ? "bg-[#f25749] hover:bg-[#e04a3d]" 
        : "bg-paan-blue hover:bg-paan-blue/80"
    });
  }

  return (
    <div className="space-y-8">
      <ModalHero
        title={modalData.title}
        subtitle={modalData.event_type}
        icon="mdi:calendar-star"
        tier={modalData.tier_restriction}
        mode={mode}
        bannerImage={modalData.banner_image}
      />

      {/* Past Event Indicator */}
      {isPast && (
        <div className="mb-6 p-4 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <Icon icon="mdi:clock-alert" className="text-lg text-gray-500" />
            <span className="font-medium">This event has already taken place</span>
          </div>
        </div>
      )}

      <InfoGrid mode={mode}>
        <InfoCard
          icon="mdi:calendar"
          label="Event Date & Time"
          value={formatDateTime(modalData.date)}
          iconColor="text-paan-red"
          iconBgColor={mode === "dark" ? "bg-red-900/30" : "bg-red-50"}
          mode={mode}
        />
        
        {modalData.location && (
          <InfoCard
            icon="mdi:map-marker"
            label="Location"
            value={modalData.location}
            iconColor="text-paan-yellow"
            iconBgColor={mode === "dark" ? "bg-yellow-900/30" : "bg-yellow-50"}
            mode={mode}
          />
        )}
        
        {modalData.is_virtual && (
          <InfoCard
            icon="mdi:video"
            label="Event Type"
            value="Virtual Event"
            iconColor="text-paan-blue"
            iconBgColor={mode === "dark" ? "bg-blue-900/30" : "bg-blue-50"}
            mode={mode}
          />
        )}
        
        <InfoCard
          icon={isPast ? "mdi:clock-alert" : (isRegistered ? "mdi:check-circle" : "mdi:account-plus")}
          label="Registration Status"
          value={isPast ? "Past Event" : (isRegistered ? "Registered" : "Not Registered")}
          iconColor={isPast ? "text-gray-500" : (isRegistered ? "text-green-500" : "text-paan-yellow")}
          iconBgColor={isPast 
            ? (mode === "dark" ? "bg-gray-800" : "bg-gray-100")
            : (isRegistered 
              ? (mode === "dark" ? "bg-green-900/30" : "bg-green-50")
              : (mode === "dark" ? "bg-yellow-900/30" : "bg-yellow-50")
            )
          }
          mode={mode}
        />
      </InfoGrid>
      
      <DescriptionSection title="About This Event" description={modalData.description} mode={mode} />
      <ActionButtons onClose={onClose} actions={actions} mode={mode} />
    </div>
  );
};

const ResourceModalContent = ({ modalData, mode, onClose }) => {
  const actions = [];
  
  if (modalData.file_path) {
    actions.push({
      label: "Download Resource",
      onClick: () => window.open(modalData.file_path, "_blank", "noopener,noreferrer"),
      color: "bg-paan-blue hover:bg-paan-blue/80"
    });
  } else if (modalData.url && modalData.resource_type !== "Video") {
    actions.push({
      label: "Access Resource",
      onClick: () => window.open(modalData.url, "_blank", "noopener,noreferrer"),
      color: "bg-paan-blue hover:bg-paan-blue/80"
    });
  }

  return (
    <div className="space-y-8">
      <ModalHero
        title={modalData.title}
        subtitle={modalData.resource_type}
        icon="mdi:book-open"
        tier={modalData.tier_restriction}
        mode={mode}
      />

      <InfoGrid mode={mode}>
        {modalData.format && (
          <InfoCard
            icon="mdi:file-document"
            label="Format"
            value={modalData.format}
            iconColor="text-amber-400"
            iconBgColor={mode === "dark" ? "bg-amber-900/30" : "bg-amber-50"}
            mode={mode}
          />
        )}
        
        {modalData.duration && (
          <InfoCard
            icon="mdi:clock-outline"
            label="Duration"
            value={modalData.duration}
            iconColor="text-[#f25749]"
            iconBgColor={mode === "dark" ? "bg-red-900/30" : "bg-red-50"}
            mode={mode}
          />
        )}
        
        {modalData.language && (
          <InfoCard
            icon="mdi:translate"
            label="Language"
            value={modalData.language}
            iconColor="text-green-500"
            iconBgColor={mode === "dark" ? "bg-green-900/30" : "bg-green-50"}
            mode={mode}
          />
        )}
        
        {modalData.file_size && (
          <InfoCard
            icon="mdi:file-size"
            label="File Size"
            value={modalData.file_size}
            iconColor="text-[#85c1da]"
            iconBgColor={mode === "dark" ? "bg-blue-900/30" : "bg-blue-50"}
            mode={mode}
          />
        )}
        
        {modalData.created_at && (
          <InfoCard
            icon="mdi:calendar"
            label="Created Date"
            value={formatDate(modalData.created_at)}
            iconColor="text-[#f25749]"
            iconBgColor={mode === "dark" ? "bg-red-900/30" : "bg-red-50"}
            mode={mode}
          />
        )}
        
        <InfoCard
          icon="mdi:download"
          label="Downloads"
          value={modalData.download_count || 0}
          iconColor="text-paan-yellow"
          iconBgColor={mode === "dark" ? "bg-yellow-900/30" : "bg-yellow-50"}
          mode={mode}
        />
      </InfoGrid>
      
      <DescriptionSection title="Description" description={modalData.description} mode={mode} />
      <TagsSection tags={modalData.tags} mode={mode} />
      
      {/* Video Player for video resources */}
      {modalData.resource_type === "Video" && modalData.video_url && (
        <div className={`p-6 rounded-xl ${
          mode === "dark" ? "bg-gray-800/30" : "bg-gray-50"
        }`}>
          <h3 className={`text-xl font-semibold mb-4 ${
            mode === "dark" ? "text-white" : "text-gray-900"
          }`}>
            Watch Video
          </h3>
          <VideoPlayer videoUrl={modalData.video_url} mode={mode} />
        </div>
      )}
      
      {/* Add video feedback form for video resources */}
      {modalData.resource_type === "Video" && modalData.video_url && (
        <VideoFeedbackForm resourceId={modalData.id} title={modalData.title} mode={mode} />
      )}
      
      <ActionButtons onClose={onClose} actions={actions} mode={mode} />
    </div>
  );
};

const OfferModalContent = ({ modalData, mode, onClose }) => {
  const actions = [];
  
  if (modalData.url) {
    actions.push({
      label: "Access Offer",
      onClick: () => window.open(modalData.url, "_blank", "noopener,noreferrer"),
      color: "bg-paan-blue hover:bg-paan-blue/80"
    });
  }

  return (
    <div className="space-y-8">
      <ModalHero
        title={modalData.title}
        subtitle={modalData.offer_type}
        icon="mdi:tag"
        tier={modalData.tier_restriction}
        mode={mode}
      />

      <InfoGrid mode={mode}>
        <InfoCard
          icon="mdi:star"
          label={`Rating (${modalData.feedbackCount || 0} reviews)`}
          value={modalData.averageRating?.toFixed(1) || "N/A"}
          iconColor="text-yellow-500"
          iconBgColor={mode === "dark" ? "bg-yellow-900/30" : "bg-yellow-50"}
          mode={mode}
        />
        
        {modalData.created_at && (
          <InfoCard
            icon="mdi:calendar"
            label="Created Date"
            value={formatDate(modalData.created_at)}
            iconColor="text-paan-red"
            iconBgColor={mode === "dark" ? "bg-red-900/30" : "bg-red-50"}
            mode={mode}
          />
        )}
        
        {modalData.limited_time && (
          <InfoCard
            icon="mdi:clock-alert"
            label="Offer Type"
            value="Limited Time"
            iconColor="text-red-500"
            iconBgColor={mode === "dark" ? "bg-red-900/30" : "bg-red-50"}
            mode={mode}
          />
        )}
        
        {modalData.offer_type === "Premium" && (
          <InfoCard
            icon="mdi:crown"
            label="Offer Category"
            value="Premium Offer"
            iconColor="text-yellow-500"
            iconBgColor={mode === "dark" ? "bg-yellow-900/30" : "bg-yellow-50"}
            mode={mode}
          />
        )}
      </InfoGrid>
      
      <DescriptionSection title="About This Offer" description={modalData.description} mode={mode} />
      <OfferFeedbackForm offerId={modalData.id} title={modalData.title} mode={mode} />
      <ActionButtons onClose={onClose} actions={actions} mode={mode} />
    </div>
  );
};

// Add AccessHubModalContent for access hub details
const AccessHubModalContent = ({ modalData, mode, onClose, handleAccessHubRegistration }) => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [registrationAttempted, setRegistrationAttempted] = useState(0);

  // Utility to strip HTML tags
  const stripHtml = (html) => html ? html.replace(/<[^>]+>/g, '') : '';

  const handleRegister = async () => {
    if (isRegistered) {
      toast.error('You are already registered for this access hub.');
      return;
    }
    await handleAccessHubRegistration(modalData.id);
    setRegistrationAttempted((prev) => prev + 1);
  };

  useEffect(() => {
    const checkRegistration = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsRegistered(false);
        setLoading(false);
        return;
      }
      // Get candidate id for this user
      const { data: candidate } = await supabase
        .from('candidates')
        .select('id')
        .eq('auth_user_id', user.id)
        .single();
      if (!candidate) {
        setIsRegistered(false);
        setLoading(false);
        return;
      }
      // Check for registration
      const { data: reg } = await supabase
        .from('access_hub_registrations')
        .select('id')
        .eq('access_hub_id', modalData.id)
        .eq('user_id', candidate.id)
        .maybeSingle();
      setIsRegistered(!!reg);
      setLoading(false);
    };
    if (modalData?.id) checkRegistration();
  }, [modalData?.id, registrationAttempted]);

  // Amenity icons mapping
  const amenityIcons = {
    'WiFi': 'mdi:wifi',
    'Coffee': 'mdi:coffee',
    'Printing': 'mdi:printer',
    'Meeting Rooms': 'mdi:account-group',
    'Parking': 'mdi:car',
    'Kitchen': 'mdi:food-fork-drink',
    'Security': 'mdi:shield-check',
    '24/7 Access': 'mdi:clock-outline',
    'Phone Booths': 'mdi:phone',
    'Lounge': 'mdi:sofa',
    'Gym': 'mdi:dumbbell',
    'Shower': 'mdi:shower',
    'Mail Services': 'mdi:email',
    'Reception': 'mdi:deskphone',
    'Storage': 'mdi:package-variant',
    'Events': 'mdi:calendar-star',
    'Networking': 'mdi:account-multiple',
    'Mentorship': 'mdi:account-star',
    'Workshops': 'mdi:school',
    'Funding': 'mdi:cash-multiple'
  };

  return (
    <div className="space-y-8">
      <ModalHero
        title={modalData.title}
        subtitle={modalData.space_type}
        icon="mdi:office-building"
        tier={modalData.tier_restriction}
        mode={mode}
      />

      {/* Image Gallery */}
      {modalData.images && modalData.images.length > 0 && (
        <ImageGallery 
          images={modalData.images} 
          title={modalData.title} 
          mode={mode} 
        />
      )}

      <InfoGrid mode={mode}>
        {(modalData.city || modalData.country) && (
          <InfoCard
            icon="mdi:map-marker"
            label="Location"
            value={[modalData.city, modalData.country].filter(Boolean).join(", ")}
            iconColor="text-paan-yellow"
            iconBgColor={mode === "dark" ? "bg-yellow-900/30" : "bg-yellow-50"}
            mode={mode}
          />
        )}
        
        {modalData.capacity && (
          <InfoCard
            icon="mdi:account-group"
            label="Capacity"
            value={`${modalData.capacity} people`}
            iconColor="text-green-500"
            iconBgColor={mode === "dark" ? "bg-green-900/30" : "bg-green-50"}
            mode={mode}
          />
        )}
        
        {modalData.pricing_per_day && (
          <InfoCard
            icon="mdi:currency-usd"
            label="Daily Rate"
            value={`$${modalData.pricing_per_day}`}
            iconColor="text-paan-yellow"
            iconBgColor={mode === "dark" ? "bg-yellow-900/30" : "bg-yellow-50"}
            mode={mode}
          />
        )}
      </InfoGrid>

      <DescriptionSection title="About This Space" description={stripHtml(modalData.description)} mode={mode} />

      {/* Amenities Section */}
      {modalData.amenities && modalData.amenities.length > 0 && (
        <div>
          <h3 className={`text-xl font-semibold mb-4 ${
            mode === "dark" ? "text-white" : "text-gray-900"
          }`}>
            Available Amenities
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {modalData.amenities.map((amenity, index) => (
              <div
                key={index}
                className={`flex items-center space-x-3 p-3 rounded-lg border transition-all duration-200 ${
                  mode === "dark"
                    ? "bg-gray-800/50 border-gray-700 hover:bg-gray-700/50"
                    : "bg-white border-gray-200 hover:bg-gray-50 shadow-sm"
                }`}
              >
                <Icon
                  icon={amenityIcons[amenity] || "mdi:star"}
                  className="text-lg text-paan-yellow flex-shrink-0"
                />
                <span className={`text-sm font-medium ${
                  mode === "dark" ? "text-gray-200" : "text-gray-700"
                }`}>
                  {amenity}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Additional Details */}
      {modalData.updated_at && (
        <div className={`p-4 rounded-xl ${
          mode === "dark" ? "bg-gray-800/30" : "bg-gray-50"
        }`}>
          <div className="flex items-center space-x-3">
            <Icon icon="mdi:calendar-clock" className="text-lg text-paan-red" />
            <div>
              <p className={`text-sm font-medium ${
                mode === "dark" ? "text-gray-400" : "text-gray-600"
              }`}>Last Updated</p>
              <p className={`font-semibold ${
                mode === "dark" ? "text-white" : "text-gray-900"
              }`}>
                {formatDate(modalData.updated_at)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={onClose}
          className={`px-8 py-3 text-sm font-semibold rounded-xl border transition-all duration-200 ${
            mode === "dark"
              ? "border-gray-600 text-gray-200 bg-gray-800 hover:bg-gray-700 hover:border-gray-500"
              : "border-gray-200 text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300"
          }`}
        >
          Close
        </button>
        <button
          onClick={handleRegister}
          disabled={loading}
          className={`px-8 py-3 text-sm font-semibold rounded-xl text-white transition-all duration-200 ${
            isRegistered || loading
              ? "bg-green-500 cursor-not-allowed"
              : "bg-gradient-to-r from-paan-yellow to-yellow-500 hover:from-yellow-500 hover:to-paan-yellow shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          } ${mode === "dark" ? "shadow-white/10" : "shadow-gray-200"}`}
        >
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Checking...</span>
            </div>
          ) : isRegistered ? (
            <div className="flex items-center space-x-2">
              <Icon icon="mdi:check-circle" className="text-lg" />
              <span>Booked</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Icon icon="mdi:account-plus" className="text-lg" />
              <span>Book Now</span>
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

// Main Component
const UnifiedModalContent = ({ 
  modalData, 
  mode, 
  registeredAccessHubs = [], 
  registeredEvents = [],
  handleAccessHubRegistration, 
  handleEventRegistration,
  onClose 
}) => {
  if (!modalData) return null;

  const modalComponents = {
    update: UpdateModalContent,
    intelligence: IntelligenceModalContent,
    event: EventModalContent,
    resource: ResourceModalContent,
    offer: OfferModalContent,
    accessHub: AccessHubModalContent
  };

  const ModalComponent = modalComponents[modalData.type];
  
  if (!ModalComponent) return null;

  // Pass specific props based on modal type
  const modalProps = {
    modalData,
    mode,
    onClose,
    ...(modalData.type === 'event' && { 
      registeredEvents, 
      handleEventRegistration 
    }),
    ...(modalData.type === 'accessHub' && { 
      handleAccessHubRegistration 
    })
  };

  return <ModalComponent {...modalProps} />;
};

export default UnifiedModalContent; 