import { Icon } from "@iconify/react";
import Image from "next/image";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

// Common Components
const ModalHeader = ({ icon, title, subtitle, tier, mode }) => (
  <div className="flex items-start space-x-4">
    <div
      className={`flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center ${
        mode === "dark"
          ? "bg-gray-700/50 text-paan-blue"
          : "bg-white text-paan-yellow"
      }`}
    >
      <Icon icon={icon} className="text-3xl" />
    </div>
    <div className="flex-1">
      <h3 className="text-2xl font-bold mb-2">{title}</h3>
      {subtitle && (
        <p
          className={`text-sm font-medium ${
            mode === "dark" ? "text-gray-300" : "text-gray-600"
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
    <div className="flex-shrink-0">
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
          mode === "dark"
            ? "bg-blue-900/30 text-blue-400 border border-blue-700/50"
            : "bg-blue-100 text-blue-800 border border-blue-200"
        }`}
      >
        {tier || "All Members"}
      </span>
    </div>
  </div>
);

const Description = ({ description, mode }) => {
  if (!description) return null;
  
  return (
    <div>
      <h4
        className={`text-lg font-semibold mb-2 ${
          mode === "dark" ? "text-gray-200" : "text-gray-800"
        }`}
      >
        Description
      </h4>
      <p
        className={`text-sm leading-relaxed ${
          mode === "dark" ? "text-gray-300" : "text-gray-600"
        }`}
      >
        {description}
      </p>
    </div>
  );
};

const Tags = ({ tags, mode }) => {
  if (!tags || tags.length === 0) return null;
  
  return (
    <div>
      <h4
        className={`text-lg font-semibold mb-3 ${
          mode === "dark" ? "text-gray-200" : "text-gray-800"
        }`}
      >
        Tags
      </h4>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <span
            key={index}
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
              mode === "dark"
                ? "bg-gray-700/60 text-gray-300"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            <Icon
              icon="mdi:tag"
              className="text-paan-yellow text-sm mr-1"
            />
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

const DetailCard = ({ icon, label, value, iconColor, mode }) => (
  <div
    className={`p-4 rounded-lg ${
      mode === "dark" ? "bg-gray-800/50" : "bg-gray-50"
    }`}
  >
    <div className="flex items-center space-x-2 mb-2">
      <Icon icon={icon} className={`text-lg ${iconColor}`} />
      <span
        className={`font-semibold ${
          mode === "dark" ? "text-gray-200" : "text-gray-800"
        }`}
      >
        {value}
      </span>
    </div>
    <p
      className={`text-sm ${
        mode === "dark" ? "text-gray-400" : "text-gray-600"
      }`}
    >
      {label}
    </p>
  </div>
);

const ActionButtons = ({ onClose, actions = [], mode }) => (
  <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
    <button
      onClick={onClose}
      className={`px-6 py-3 text-sm font-medium rounded-xl border transition-all duration-200 ${
        mode === "dark"
          ? "border-gray-600 text-gray-200 bg-gray-800 hover:bg-gray-700"
          : "border-gray-200 text-gray-700 bg-white hover:bg-gray-50"
      }`}
    >
      Close
    </button>
    {actions.map((action, index) => (
      <button
        key={index}
        onClick={action.onClick}
        className={`px-6 py-3 text-sm font-medium rounded-xl text-white transition-all duration-200 ${
          action.color || "bg-paan-blue hover:bg-paan-blue/80"
        } ${mode === "dark" ? "shadow-white/10" : "shadow-gray-200"}`}
      >
        {action.label}
      </button>
    ))}
  </div>
);

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

  const details = [
    modalData.category && {
      icon: "mdi:folder",
      label: "Category",
      value: modalData.category,
      iconColor: "text-[#85c1da]"
    },
    modalData.created_at && {
      icon: "mdi:calendar",
      label: "Created Date",
      value: new Date(modalData.created_at).toLocaleDateString(),
      iconColor: "text-[#f25749]"
    },
    modalData.cta_url && {
      icon: "mdi:link",
      label: "External Link",
      value: "Available",
      iconColor: "text-green-500"
    },
    modalData.cta_text && {
      icon: "mdi:arrow-right",
      label: "Call to Action",
      value: modalData.cta_text,
      iconColor: "text-paan-yellow"
    }
  ].filter(Boolean);

  return (
    <div className="space-y-6">
      <ModalHeader
        icon="mdi:bell"
        title={modalData.title}
        subtitle={modalData.category}
        tier={modalData.tier_restriction}
        mode={mode}
      />
      
      <Description description={modalData.description} mode={mode} />
      <Tags tags={modalData.tags} mode={mode} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {details.map((detail, index) => (
          <DetailCard key={index} {...detail} mode={mode} />
        ))}
      </div>
      
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

  const details = [
    modalData.region && {
      icon: "mdi:map-marker",
      label: "Region",
      value: modalData.region,
      iconColor: "text-paan-yellow"
    },
    modalData.created_at && {
      icon: "mdi:calendar",
      label: "Created Date",
      value: new Date(modalData.created_at).toLocaleDateString(),
      iconColor: "text-paan-red"
    },
    modalData.downloadable && {
      icon: "mdi:download",
      label: "Downloadable",
      value: "Available",
      iconColor: "text-paan-yellow"
    },
    modalData.intel_type && {
      icon: "mdi:file-chart",
      label: "Intelligence Type",
      value: modalData.intel_type,
      iconColor: "text-paan-blue"
    },
    modalData.view_count && {
      icon: "mdi:eye",
      label: "Views",
      value: modalData.view_count,
      iconColor: "text-green-500"
    }
  ].filter(Boolean);

  return (
    <div className="space-y-6">
      <ModalHeader
        icon="mdi:chart-line"
        title={modalData.title}
        subtitle={modalData.type}
        tier={modalData.tier_restriction}
        mode={mode}
      />
      
      <Description description={modalData.description} mode={mode} />
      <Tags tags={modalData.tags} mode={mode} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {details.map((detail, index) => (
          <DetailCard key={index} {...detail} mode={mode} />
        ))}
      </div>
      
      <ActionButtons onClose={onClose} actions={actions} mode={mode} />
    </div>
  );
};

const EventModalContent = ({ modalData, mode, onClose, registeredEvents, handleEventRegistration }) => {
  const isRegistered = registeredEvents.some(reg => reg.id === modalData.id);
  const actions = [];
  
  if (!isRegistered) {
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

  const details = [
    {
      icon: "mdi:calendar",
      label: "Event Date & Time",
      value: new Date(modalData.date).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      iconColor: "text-paan-red"
    },
    modalData.location && {
      icon: "mdi:map-marker",
      label: "Location",
      value: modalData.location,
      iconColor: "text-paan-yellow"
    },
    modalData.is_virtual && {
      icon: "mdi:video",
      label: "Event Type",
      value: "Virtual Event",
      iconColor: "text-paan-blue"
    },
    {
      icon: isRegistered ? "mdi:check-circle" : "mdi:account-plus",
      label: "Registration Status",
      value: isRegistered ? "Registered" : "Not Registered",
      iconColor: isRegistered ? "text-green-500" : "text-paan-yellow"
    }
  ].filter(Boolean);

  return (
    <div className="space-y-6">
      <ModalHeader
        icon="mdi:calendar-star"
        title={modalData.title}
        subtitle={modalData.event_type}
        tier={modalData.tier_restriction}
        mode={mode}
      />
      
      {modalData.banner_image && (
        <div className="relative w-full h-full mb-4 rounded-lg overflow-hidden">
          <Image
            src={modalData.banner_image}
            width={1000}
            height={0}
            alt={`Banner for ${modalData.title}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        </div>
      )}
      
      <Description description={modalData.description} mode={mode} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {details.map((detail, index) => (
          <DetailCard key={index} {...detail} mode={mode} />
        ))}
      </div>
      
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

  const details = [
    modalData.format && {
      icon: "mdi:file-document",
      label: "Format",
      value: modalData.format,
      iconColor: "text-amber-400"
    },
    modalData.duration && {
      icon: "mdi:clock-outline",
      label: "Duration",
      value: modalData.duration,
      iconColor: "text-[#f25749]"
    },
    modalData.language && {
      icon: "mdi:translate",
      label: "Language",
      value: modalData.language,
      iconColor: "text-green-500"
    },
    modalData.file_size && {
      icon: "mdi:file-size",
      label: "File Size",
      value: modalData.file_size,
      iconColor: "text-[#85c1da]"
    },
    modalData.created_at && {
      icon: "mdi:calendar",
      label: "Created Date",
      value: new Date(modalData.created_at).toLocaleDateString(),
      iconColor: "text-[#f25749]"
    },
    {
      icon: "mdi:download",
      label: "Downloads",
      value: modalData.download_count || 0,
      iconColor: "text-paan-yellow"
    }
  ].filter(Boolean);

  return (
    <div className="space-y-6">
      <ModalHeader
        icon="mdi:book-open"
        title={modalData.title}
        subtitle={modalData.resource_type}
        tier={modalData.tier_restriction}
        mode={mode}
      />
      
      <Description description={modalData.description} mode={mode} />
      <Tags tags={modalData.tags} mode={mode} />
      
      {/* Video Player for video resources */}
      {modalData.resource_type === "Video" && modalData.video_url && (
        <VideoPlayer videoUrl={modalData.video_url} mode={mode} />
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {details.map((detail, index) => (
          <DetailCard key={index} {...detail} mode={mode} />
        ))}
      </div>
      
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

  const details = [
    {
      icon: "mdi:star",
      label: `Rating (${modalData.feedbackCount || 0} reviews)`,
      value: modalData.averageRating?.toFixed(1) || "N/A",
      iconColor: "text-yellow-500"
    },
    modalData.created_at && {
      icon: "mdi:calendar",
      label: "Created Date",
      value: new Date(modalData.created_at).toLocaleDateString(),
      iconColor: "text-paan-red"
    },
    modalData.limited_time && {
      icon: "mdi:clock-alert",
      label: "Offer Type",
      value: "Limited Time",
      iconColor: "text-red-500"
    },
    modalData.offer_type === "Premium" && {
      icon: "mdi:crown",
      label: "Offer Category",
      value: "Premium Offer",
      iconColor: "text-yellow-500"
    }
  ].filter(Boolean);

  return (
    <div className="space-y-6">
      <ModalHeader
        icon="mdi:tag"
        title={modalData.title}
        subtitle={modalData.offer_type}
        tier={modalData.tier_restriction}
        mode={mode}
      />
      
      <Description description={modalData.description} mode={mode} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {details.map((detail, index) => (
          <DetailCard key={index} {...detail} mode={mode} />
        ))}
      </div>
      
      <OfferFeedbackForm offerId={modalData.id} title={modalData.title} mode={mode} />
      
      <ActionButtons onClose={onClose} actions={actions} mode={mode} />
    </div>
  );
};

// Main Component
const UnifiedModalContent = ({ 
  modalData, 
  mode, 
  registeredEvents = [], 
  handleEventRegistration, 
  onClose 
}) => {
  if (!modalData) return null;

  const modalComponents = {
    update: UpdateModalContent,
    intelligence: IntelligenceModalContent,
    event: EventModalContent,
    resource: ResourceModalContent,
    offer: OfferModalContent
  };

  const ModalComponent = modalComponents[modalData.type];
  
  if (!ModalComponent) return null;

  return (
    <ModalComponent
      modalData={modalData}
      mode={mode}
      onClose={onClose}
      registeredEvents={registeredEvents}
      handleEventRegistration={handleEventRegistration}
    />
  );
};

export default UnifiedModalContent; 