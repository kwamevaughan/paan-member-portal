import React, { useState } from "react";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabase";

const VideoModal = ({ isOpen, onClose, videoUrl, resourceId, mode }) => {
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className={`relative w-full max-w-4xl rounded-2xl shadow-xl p-6 ${
          mode === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <Icon icon="heroicons:x-mark" className="w-6 h-6" />
        </button>

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

        {/* Feedback Form */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Rate this Video</h3>
          <div className="flex items-center gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`text-2xl ${
                  star <= rating
                    ? "text-yellow-400"
                    : "text-gray-300 dark:text-gray-600"
                }`}
              >
                <Icon icon="heroicons:star-solid" />
              </button>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Optional comments..."
            className={`w-full p-3 rounded-lg border ${
              mode === "dark"
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-200 text-gray-800"
            } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
            rows={4}
          />
          <button
            onClick={handleSubmitFeedback}
            disabled={submitting}
            className={`mt-4 px-6 py-2 rounded-lg font-medium transition-colors ${
              submitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {submitting ? "Submitting..." : "Submit Feedback"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;
