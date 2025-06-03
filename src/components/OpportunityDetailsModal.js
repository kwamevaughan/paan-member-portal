import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import SimpleModal from "./SimpleModal";
import { TierBadge } from "./Badge";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

const OpportunityDetailsModal = ({
  isOpen,
  onClose,
  opportunity,
  mode,
  user,
  onExpressInterest,
  isFreelancer,
}) => {
  const [hasExpressedInterest, setHasExpressedInterest] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const itemLabel = isFreelancer ? "Gig" : "Opportunity";

  useEffect(() => {
    if (!isOpen || !user || !opportunity) return;

    const checkInterestStatus = async () => {
      setIsLoading(true);
      try {
        const { data: authData, error: authError } =
          await supabase.auth.getUser();
        if (authError || !authData.user) {
          setHasExpressedInterest(false);
          return;
        }

        const { data, error } = await supabase
          .from("opportunity_interests")
          .select("id")
          .eq("user_id", authData.user.id)
          .eq("opportunity_id", opportunity.id)
          .single();

        if (error && error.code !== "PGRST116") {
          throw error;
        }

        setHasExpressedInterest(!!data);
      } catch (err) {
        console.error("Error checking interest status:", err);
      } finally {
        setIsLoading(false);
      }
    };

    checkInterestStatus();
  }, [isOpen, user, opportunity]);

  if (!opportunity) return null;

  const daysUntilDeadline = Math.ceil(
    (new Date(opportunity.deadline) - new Date()) / (1000 * 60 * 60 * 24)
  );
  const isUrgent = daysUntilDeadline <= 7 && daysUntilDeadline > 0;
  const isExpired = daysUntilDeadline < 0;

  const handleExpressInterestClick = () => {
    if (hasExpressedInterest) {
      toast.error(
        `You've already expressed interest in this ${itemLabel.toLowerCase()}.`,
        {
          style: {
            background: mode === "dark" ? "#1F2937" : "#FFFFFF",
            color: mode === "dark" ? "#F3F4F6" : "#111827",
            border: `1px solid ${mode === "dark" ? "#374151" : "#E5E7EB"}`,
          },
        }
      );
    } else if (isExpired) {
      toast.error(`${itemLabel} has expired`, {
        style: {
          background: mode === "dark" ? "#1F2937" : "#FFFFFF",
          color: mode === "dark" ? "#F3F4F6" : "#111827",
          border: `1px solid ${mode === "dark" ? "#374151" : "#E5E7EB"}`,
        },
      });
    } else if (isLoading) {
      toast.error("Checking interest status...", {
        style: {
          background: mode === "dark" ? "#1F2937" : "#FFFFFF",
          color: mode === "dark" ? "#F3F4F6" : "#111827",
          border: `1px solid ${mode === "dark" ? "#374151" : "#E5E7EB"}`,
        },
      });
    } else {
      onExpressInterest(opportunity);
    }
  };

  const isButtonDisabled = hasExpressedInterest || isLoading || isExpired;

  return (
    <SimpleModal
      isOpen={isOpen}
      onClose={onClose}
      title={`${itemLabel} Details`}
      mode={mode}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3
              className={`text-2xl font-semibold mb-2 ${
                mode === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              {opportunity.title}
            </h3>
            {opportunity.company && (
              <p
                className={`text-sm font-medium ${
                  mode === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {opportunity.company}
              </p>
            )}
          </div>
          {!isFreelancer && (
            <TierBadge
              tier={opportunity.tier_restriction || "Free Member"}
              mode={mode}
            />
          )}
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          {isUrgent && (
            <span className="bg-orange-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
              URGENT: {daysUntilDeadline} days left
            </span>
          )}
          {isExpired && (
            <span className="bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
              EXPIRED
            </span>
          )}
          {opportunity.is_new && (
            <span className="bg-green-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
              NEW
            </span>
          )}
          {opportunity.remote_work && (
            <span className="bg-blue-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
              Remote
            </span>
          )}
        </div>

        {/* Description */}
        {opportunity.description && (
          <div>
            <h4
              className={`text-lg font-medium mb-2 ${
                mode === "dark" ? "text-gray-200" : "text-gray-800"
              }`}
            >
              Description
            </h4>
            <p
              className={`text-sm leading-relaxed ${
                mode === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {opportunity.description}
            </p>
          </div>
        )}

        {/* Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {opportunity.location && (
            <div className="flex items-center space-x-2">
              <Icon icon="mdi:map-marker" className="text-blue-500 text-lg" />
              <span
                className={`text-sm ${
                  mode === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Location: {opportunity.location}
              </span>
            </div>
          )}
          {opportunity.deadline && (
            <div className="flex items-center space-x-2">
              <Icon
                icon={isUrgent ? "mdi:clock-alert" : "mdi:calendar"}
                className={`text-lg ${
                  isUrgent ? "text-orange-500" : "text-green-500"
                }`}
              />
              <span
                className={`text-sm ${
                  mode === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Deadline: {new Date(opportunity.deadline).toLocaleDateString()}
              </span>
            </div>
          )}
          {opportunity.budget_range && (
            <div className="flex items-center space-x-2">
              <Icon icon="mdi:cash" className="text-green-500 text-lg" />
              <span
                className={`text-sm font-semibold ${
                  mode === "dark" ? "text-green-400" : "text-green-600"
                }`}
              >
                Budget: {opportunity.budget_range}
              </span>
            </div>
          )}
          {opportunity.job_type && (
            <div className="flex items-center space-x-2">
              <Icon icon="mdi:briefcase" className="text-purple-500 text-lg" />
              <span
                className={`text-sm ${
                  mode === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Job Type: {opportunity.job_type}
              </span>
            </div>
          )}
          {opportunity.applicant_count && (
            <div className="flex items-center space-x-2">
              <Icon
                icon="mdi:account-group"
                className="text-gray-500 text-lg"
              />
              <span
                className={`text-sm ${
                  mode === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Applicants: {opportunity.applicant_count}
              </span>
            </div>
          )}
          {opportunity.service_type && (
            <div className="flex items-center space-x-2">
              <Icon icon="mdi:cog" className="text-teal-500 text-lg" />
              <span
                className={`text-sm ${
                  mode === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Service Type: {opportunity.service_type}
              </span>
            </div>
          )}
          {opportunity.industry && (
            <div className="flex items-center space-x-2">
              <Icon icon="mdi:industry" className="text-indigo-500 text-lg" />
              <span
                className={`text-sm ${
                  mode === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Industry: {opportunity.industry}
              </span>
            </div>
          )}
          {opportunity.project_type && (
            <div className="flex items-center space-x-2">
              <Icon icon="mdi:folder" className="text-orange-500 text-lg" />
              <span
                className={`text-sm ${
                  mode === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Project Type: {opportunity.project_type}
              </span>
            </div>
          )}
          {opportunity.estimated_duration && (
            <div className="flex items-center space-x-2">
              <Icon icon="mdi:timer" className="text-yellow-500 text-lg" />
              <span
                className={`text-sm ${
                  mode === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Duration: {opportunity.estimated_duration}
              </span>
            </div>
          )}
          {opportunity.remote_work !== null && (
            <div className="flex items-center space-x-2">
              <Icon
                icon="mdi:home"
                className={`text-lg ${
                  opportunity.remote_work ? "text-blue-500" : "text-red-500"
                }`}
              />
              <span
                className={`text-sm ${
                  mode === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Remote Work: {opportunity.remote_work ? "Yes" : "No"}
              </span>
            </div>
          )}
        </div>

        {/* Skills Required */}
        {opportunity.skills_required &&
          Array.isArray(opportunity.skills_required) &&
          opportunity.skills_required.length > 0 && (
            <div>
              <h4
                className={`text-lg font-medium mb-2 ${
                  mode === "dark" ? "text-gray-200" : "text-gray-800"
                }`}
              >
                Skills Required
              </h4>
              <div className="flex flex-wrap gap-2">
                {opportunity.skills_required.map((skill, index) => (
                  <span
                    key={index}
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      mode === "dark"
                        ? "bg-gray-700/60 text-gray-300"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

        {/* Application Link */}
        {opportunity.application_link && (
          <div>
            <h4
              className={`text-lg font-medium mb-2 ${
                mode === "dark" ? "text-gray-200" : "text-gray-800"
              }`}
            >
              Apply
            </h4>
            <a
              href={opportunity.application_link}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center text-sm font-medium ${
                mode === "dark"
                  ? "text-blue-400 hover:text-blue-300"
                  : "text-blue-600 hover:text-blue-700"
              }`}
              aria-label={`Apply for ${opportunity.title} (opens in new tab)`}
            >
              <Icon icon="mdi:open-in-new" className="mr-2" />
              Apply Now
            </a>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg font-semibold ${
              mode === "dark"
                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            aria-label={`Close ${itemLabel} details`}
          >
            Close
          </button>
          <button
            onClick={handleExpressInterestClick}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              isButtonDisabled
                ? "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-600 dark:text-gray-400"
                : "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
            }`}
            aria-disabled={isButtonDisabled}
            aria-label={
              isButtonDisabled
                ? hasExpressedInterest
                  ? `Interest already expressed for ${opportunity.title}`
                  : isExpired
                  ? `${opportunity.title} has expired`
                  : `Checking interest status for ${opportunity.title}`
                : `Express interest in ${opportunity.title}`
            }
          >
            {isLoading
              ? "Checking..."
              : hasExpressedInterest
              ? "Interest Expressed"
              : `Express Interest`}
          </button>
        </div>
      </div>
    </SimpleModal>
  );
};

export default OpportunityDetailsModal;
