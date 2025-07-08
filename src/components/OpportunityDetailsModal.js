import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import SimpleModal from "./SimpleModal";
import { TierBadge } from "./Badge";
import { supabase } from "@/lib/supabase";

function isEmbeddableDoc(url) {
  if (!url) return false;
  const lower = url.toLowerCase();
  return (
    lower.endsWith(".pdf") ||
    lower.endsWith(".doc") ||
    lower.endsWith(".docx") ||
    lower.includes("docs.google.com")
  );
}

const OpportunityDetailsModal = ({
  isOpen,
  onClose,
  opportunity,
  mode,
  user,
  onExpressInterest,
  isFreelancer,
  toast,
}) => {
  const [hasExpressedInterest, setHasExpressedInterest] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpressingInterest, setIsExpressingInterest] = useState(false);
  const [showDocViewer, setShowDocViewer] = useState(false);
  const itemLabel = isFreelancer ? "Gig" : "Opportunity";
  const [docUrl, setDocUrl] = useState(null);

  useEffect(() => {
    if (!isOpen || !user || !opportunity) return;

    const checkInterestStatus = async () => {
      setIsLoading(true);
      try {
        const { data: authData, error: authError } = await supabase.auth.getUser();
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
        setHasExpressedInterest(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkInterestStatus();
  }, [isOpen, user, opportunity]);

  if (!opportunity) {
    return null;
  }

  // Check if this is a tender opportunity
  const isTender = opportunity.is_tender || 
    (opportunity.tender_organization && opportunity.tender_category && opportunity.tender_issued && opportunity.tender_closing);
  
  // Calculate tender deadline if it's a tender
  const tenderDaysUntilDeadline = isTender && opportunity.tender_closing ? 
    Math.ceil((new Date(opportunity.tender_closing) - new Date()) / (1000 * 60 * 60 * 24)) : null;
  
  const isTenderUrgent = tenderDaysUntilDeadline !== null && tenderDaysUntilDeadline <= 7 && tenderDaysUntilDeadline > 0;
  const isTenderExpired = tenderDaysUntilDeadline !== null && tenderDaysUntilDeadline < 0;

  const daysUntilDeadline = Math.ceil(
    (new Date(opportunity.deadline) - new Date()) / (1000 * 60 * 60 * 24)
  );
  const isUrgent = daysUntilDeadline <= 7 && daysUntilDeadline > 0;
  const isExpired = daysUntilDeadline < 0;

  const handleExpressInterestClick = async () => {
    // If already expressed interest, open tender URL or show embedded doc
    if (hasExpressedInterest) {
      const tenderUrl = opportunity.tender_access_link || opportunity.application_link;
      if (tenderUrl) {
        if (isEmbeddableDoc(tenderUrl)) {
          setDocUrl(tenderUrl);
          setShowDocViewer(true);
        } else {
          window.open(tenderUrl, '_blank', 'noopener,noreferrer');
        }
      } else {
        toast.error("No tender URL available for this opportunity.");
      }
      return;
    }

    // Set loading state
    setIsExpressingInterest(true);

    try {
      // Get authenticated user
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !authUser) {
        toast.error("User not authenticated. Please log in.");
        return;
      }

      // Insert interest directly
      const { error: insertError } = await supabase
        .from("opportunity_interests")
        .insert({
          user_id: authUser.id,
          opportunity_id: opportunity.id,
        });

      if (insertError) {
        if (insertError.code === "23505") {
          toast.error("You have already expressed interest in this opportunity.");
        } else {
          console.error("Insert error:", insertError);
          toast.error("Failed to express interest. Please try again.");
        }
      } else {
        toast.success(`Interest expressed for ${opportunity.title}!`);
        setHasExpressedInterest(true);
      }
    } catch (err) {
      console.error("Error saving interest:", err);
      toast.error("Failed to express interest. Please try again.");
    } finally {
      setIsExpressingInterest(false);
    }
  };

  const isButtonDisabled = isLoading || isExpired || (isExpressingInterest && !hasExpressedInterest);

  // Helper to get Google Docs Viewer URL
  function getGoogleViewerUrl(url) {
    if (!url) return null;
    if (url.includes("docs.google.com")) return url;
    return `https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`;
  }

  return (
    <>
      <SimpleModal
        isOpen={isOpen}
        onClose={onClose}
        title={`${itemLabel} Details`}
        mode={mode}
      >
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3
                className={`text-2xl font-medium mb-2 ${
                  mode === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {opportunity.title}
              </h3>
              {(opportunity.company || (isTender && opportunity.tender_organization)) && (
                <p
                  className={`text-sm font-medium ${
                    mode === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {isTender ? opportunity.tender_organization : opportunity.company}
                </p>
              )}
              {isTender && opportunity.tender_category && (
                <p
                  className={`text-xs ${
                    mode === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Category: {opportunity.tender_category}
                </p>
              )}
            </div>
            {!isFreelancer && (
              <div className="[&>span]:!bg-white [&>span]:!text-gray-900 [&>span]:!border-gray-200 [&>span>svg]:!text-paan-red">
                <TierBadge
                  tier={opportunity.tier_restriction || "Free Member"}
                  mode={mode}
                />
              </div>
            )}
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            {isTender && (
              <span className="bg-paan-red text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                Tender
              </span>
            )}
            {(isUrgent || isTenderUrgent) && (
              <span className="bg-paan-red text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                URGENT: {isTender ? tenderDaysUntilDeadline : daysUntilDeadline} days left
              </span>
            )}
            {(isExpired || isTenderExpired) && (
              <span className="bg-paan-red text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                EXPIRED
              </span>
            )}
            {opportunity.is_new && (
              <span className="bg-paan-yellow text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                NEW
              </span>
            )}
            {opportunity.remote_work && !isTender && (
              <span className="bg-paan-blue text-white text-xs font-semibold px-2 py-0.5 rounded-full">
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
                <Icon icon="mdi:map-marker" className="text-paan-yellow text-lg" />
                <span
                  className={`text-sm ${
                    mode === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Location: {opportunity.location}
                </span>
              </div>
            )}
            
            {/* Tender-specific details */}
            {isTender ? (
              <>
                {opportunity.tender_issued && (
                  <div className="flex items-center space-x-2">
                    <Icon icon="mdi:calendar-plus" className="text-paan-blue text-lg" />
                    <span
                      className={`text-sm ${
                        mode === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Issued: {new Date(opportunity.tender_issued).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {opportunity.tender_closing && (
                  <div className="flex items-center space-x-2">
                    <Icon
                      icon={isTenderUrgent ? "mdi:clock-alert" : "mdi:calendar"}
                      className={`text-lg ${
                        isTenderUrgent ? "text-paan-red" : "text-paan-yellow"
                      }`}
                    />
                    <span
                      className={`text-sm ${
                        mode === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Closing: {new Date(opportunity.tender_closing).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </>
            ) : (
              <>
                {opportunity.deadline && (
                  <div className="flex items-center space-x-2">
                    <Icon
                      icon={isUrgent ? "mdi:clock-alert" : "mdi:calendar"}
                      className={`text-lg ${
                        isUrgent ? "text-paan-red" : "text-paan-yellow"
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
                    <Icon icon="mdi:cash" className="text-paan-yellow text-lg" />
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
                    <Icon icon="mdi:briefcase" className="text-paan-yellow text-lg" />
                    <span
                      className={`text-sm ${
                        mode === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Job Type: {opportunity.job_type}
                    </span>
                  </div>
                )}
                {opportunity.remote_work !== null && (
                  <div className="flex items-center space-x-2">
                    <Icon
                      icon="mdi:home"
                      className={`text-lg ${
                        opportunity.remote_work ? "text-paan-yellow" : "text-paan-yellow"
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
              </>
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
            {opportunity.service_type && !isTender && (
              <div className="flex items-center space-x-2">
                <Icon icon="mdi:cog" className="text-paan-yellow text-lg" />
                <span
                  className={`text-sm ${
                    mode === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Service Type: {opportunity.service_type}
                </span>
              </div>
            )}
            {opportunity.industry && !isTender && (
              <div className="flex items-center space-x-2">
                <Icon icon="mdi:industry" className="text-paan-yellow text-lg" />
                <span
                  className={`text-sm ${
                    mode === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Industry: {opportunity.industry}
                </span>
              </div>
            )}
            {opportunity.project_type && !isTender && (
              <div className="flex items-center space-x-2">
                <Icon icon="mdi:folder" className="text-paan-yellow text-lg" />
                <span
                  className={`text-sm ${
                    mode === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Project Type: {opportunity.project_type}
                </span>
              </div>
            )}
            {opportunity.estimated_duration && !isTender && (
              <div className="flex items-center space-x-2">
                <Icon icon="mdi:timer" className="text-paan-yellow text-lg" />
                <span
                  className={`text-sm ${
                    mode === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Duration: {opportunity.estimated_duration}
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

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-full font-normal ${
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
              className={`px-4 py-2 rounded-full font-normal transition-colors ${
                isButtonDisabled
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-600 dark:text-gray-400"
                  : "bg-paan-yellow text-white hover:bg-paan-blue dark:bg-paan-yellow dark:hover:bg-paan-yellow-600"
              }`}
              aria-disabled={isButtonDisabled}
              aria-label={
                isButtonDisabled
                  ? isExpired
                    ? `${opportunity.title} has expired`
                    : `Checking interest status for ${opportunity.title}`
                  : hasExpressedInterest
                  ? `View opportunity details for ${opportunity.title}`
                  : `Express interest in ${opportunity.title}`
              }
            >
              {isLoading
                ? "Checking..."
                : isExpressingInterest
                ? "Expressing Interest..."
                : hasExpressedInterest
                ? "View Opportunity"
                : "Express Interest"}
            </button>
          </div>
        </div>
      </SimpleModal>
      {/* Separate modal for document viewer */}
      <SimpleModal
        isOpen={showDocViewer}
        onClose={() => setShowDocViewer(false)}
        title={`Document: ${opportunity?.title || 'Viewer'}`}
        mode={mode}
        width="max-w-7xl"
      >
        <div className="w-full h-[70vh] flex flex-col">
          <iframe
            src={getGoogleViewerUrl(docUrl)}
            title="Tender Document"
            className="flex-1 w-full rounded-lg border border-gray-200 dark:border-gray-700"
            style={{ minHeight: "60vh" }}
            frameBorder="0"
            allowFullScreen
          />
        </div>
      </SimpleModal>
    </>
  );
};

export default OpportunityDetailsModal;