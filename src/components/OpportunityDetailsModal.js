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
  // Function to generate description from available data
  const generateDescription = (opp, isTender, isFreelancer) => {
    const sentenceParts = [];
    
    // Add organization/company name using the same logic as title
    let organizationName = '';
    if (isTender) {
      organizationName = opp.tender_organization;
    } else if (isFreelancer) {
      organizationName = opp.gig_title;
    } else {
      organizationName = opp.tender_organization;
    }
    
    if (organizationName) {
      sentenceParts.push(`${organizationName}`);
    }
    
    // Add service type to the main sentence
    if (opp.project_type) {
      sentenceParts.push(`is seeking ${opp.project_type} services`);
    } else if (opp.service_type) {
      sentenceParts.push(`is seeking ${opp.service_type} services`);
    }
    
    // Add industry to the main sentence
    if (opp.industry) {
      sentenceParts.push(`in the ${opp.industry} industry`);
    }
    
    // Add deadline information
    if (opp.deadline) {
      const deadline = new Date(opp.deadline);
      sentenceParts.push(`The deadline is ${deadline.toLocaleDateString()}`);
    }
    
    // Combine sentence parts
    let description = '';
    if (sentenceParts.length > 0) {
      description = sentenceParts.join(' ');
    }
    
    if (description) {
    description += '. Apply to this opportunity';
      return description;
    }
    
    // Fallback description
    return `New ${isTender ? 'tender' : isFreelancer ? 'gig' : 'opportunity'} available. Apply now`;
  };
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
      // Ensure a candidates row exists for this user (admins may not have one)
      const ensureCandidateExists = async () => {
        const { data: existingCandidate } = await supabase
          .from("candidates")
          .select("id")
          .eq("id", authUser.id)
          .single();

        if (existingCandidate) return true;

        const name = authUser.user_metadata?.full_name || authUser.user_metadata?.name || "Admin User";
        const email = authUser.email || authUser.user_metadata?.email || "";

        const { error: insertCandidateError } = await supabase
          .from("candidates")
          .insert({
            id: authUser.id,
            auth_user_id: authUser.id,
            primaryContactName: name,
            primaryContactEmail: email,
            job_type: "agency",
            selected_tier: "Admin",
          });
        if (insertCandidateError) {
          console.error("Failed to create candidate for user:", insertCandidateError);
          return false;
        }
        return true;
      };

      const ensured = await ensureCandidateExists();
      if (!ensured) {
        toast.error("Failed to express interest. Please try again.");
        setIsExpressingInterest(false);
        return;
      }

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
        toast.success(`Interest expressed for ${isTender
          ? (opportunity.tender_title || opportunity.organization_name)
          : (opportunity.job_type === "Freelancer"
              ? opportunity.gig_title
              : opportunity.organization_name)
        }!`);
        setHasExpressedInterest(true);
      }
    } catch (err) {
      console.error("Error saving interest:", err);
      toast.error("Failed to express interest. Please try again.");
    } finally {
      setIsExpressingInterest(false);
    }
  };

  const isButtonDisabled = isLoading || isExpired || isTenderExpired || (isExpressingInterest && !hasExpressedInterest);

  // Helper to get Google Docs Viewer URL
  function getGoogleViewerUrl(url) {
    if (!url) return null;
    if (url.includes("docs.google.com")) return url;
    return `https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`;
  }

  // Helper to format date as '20th July, 2025'
  function formatDateWithOrdinal(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    // Ordinal suffix
    const j = day % 10, k = day % 100;
    let ordinal = 'th';
    if (j === 1 && k !== 11) ordinal = 'st';
    else if (j === 2 && k !== 12) ordinal = 'nd';
    else if (j === 3 && k !== 13) ordinal = 'rd';
    return `${day}${ordinal} ${month}, ${year}`;
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
          {/* Past Opportunity Indicator */}
          {(isExpired || isTenderExpired) && (
            <div className="mb-4 p-4 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <Icon icon="mdi:clock-alert" className="text-lg text-gray-500" />
                <span className="font-medium">This opportunity has already expired</span>
              </div>
            </div>
          )}

          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3
                className={`text-2xl font-medium mb-2  ${
                  mode === "dark" ? "text-white" : "text-gray-900"
                }`}
                title={isTender
                  ? (opportunity.tender_title || opportunity.organization_name)
                  : (opportunity.job_type === "Freelancer"
                      ? opportunity.gig_title
                      : opportunity.organization_name)
                }
              >
                {isTender
                  ? (opportunity.tender_title || opportunity.organization_name)
                  : (opportunity.job_type === "Freelancer"
                      ? opportunity.gig_title
                      : opportunity.organization_name)
                }
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
          {(opportunity.description || true) && (
            <div>
              <h4
                className={`text-lg font-medium mb-2 ${
                  mode === "dark" ? "text-gray-200" : "text-gray-800"
                }`}
              >
                Description
              </h4>
              <div
                className={`text-sm leading-relaxed prose prose-sm max-w-none ${
                  mode === "dark" ? "text-gray-400 prose-invert" : "text-gray-600"
                }`}
                dangerouslySetInnerHTML={{ 
                  __html: opportunity.description || generateDescription(opportunity, isTender, isFreelancer)
                }}
              />
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
                    ? `${isTender
                        ? (opportunity.tender_title || opportunity.organization_name)
                        : (opportunity.job_type === "Freelancer"
                            ? opportunity.gig_title
                            : opportunity.organization_name)
                      } has expired`
                    : `Checking interest status for ${isTender
                        ? (opportunity.tender_title || opportunity.organization_name)
                        : (opportunity.job_type === "Freelancer"
                            ? opportunity.gig_title
                            : opportunity.organization_name)
                      }`
                  : hasExpressedInterest
                  ? `View opportunity details for ${isTender
                      ? (opportunity.tender_title || opportunity.organization_name)
                      : (opportunity.job_type === "Freelancer"
                          ? opportunity.gig_title
                          : opportunity.organization_name)
                    }`
                  : `Express interest in ${isTender
                      ? (opportunity.tender_title || opportunity.organization_name)
                      : (opportunity.job_type === "Freelancer"
                          ? opportunity.gig_title
                          : opportunity.organization_name)
                    }`
              }
            >
              {isLoading
                ? "Checking..."
                : isExpired || isTenderExpired
                ? "Expired"
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
        title={`Organization: ${isTender
          ? (opportunity?.tender_title?.length > 50 ? opportunity?.tender_title?.substring(0, 50) + '...' : opportunity?.tender_title || opportunity?.organization_name || 'Viewer')
          : (opportunity?.job_type === "Freelancer"
              ? (opportunity?.gig_title?.length > 50 ? opportunity?.gig_title?.substring(0, 50) + '...' : opportunity?.gig_title || 'Viewer')
              : (opportunity?.organization_name?.length > 50 ? opportunity?.organization_name?.substring(0, 50) + '...' : opportunity?.organization_name || 'Viewer'))
        } | Expires on: ${formatDateWithOrdinal(opportunity?.tender_closing)}`}
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