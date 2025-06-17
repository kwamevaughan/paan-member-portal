import { Icon } from "@iconify/react";
import { useState } from "react";

const OpportunityCard = ({
  opportunity,
  mode,
  isRestricted,
  onRestrictedClick, // Triggers modal
  TierBadge,
  isFreelancer,
  showExpressInterestButton,
  toast,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (isRestricted) {
      toast.error(
        `This ${isFreelancer ? "gig" : "opportunity"} requires ${opportunity.tier_restriction} membership. Upgrade your membership to access it.`,
        {
          duration: 4000,
          position: "top-center",
          style: {
            background: mode === "dark" ? "#1F2937" : "#fff",
            color: mode === "dark" ? "#fff" : "#1F2937",
            border: mode === "dark" ? "1px solid #374151" : "1px solid #E5E7EB",
          },
        }
      );
      return;
    }
    onRestrictedClick(opportunity); // Trigger modal
  };

  const handleViewMoreInfo = (e) => {
    e.stopPropagation(); // Prevent card click
    if (isRestricted) {
      toast.error(
        `This ${isFreelancer ? "gig" : "opportunity"} requires ${opportunity.tier_restriction} membership. Upgrade your membership to access it.`,
        {
          duration: 4000,
          position: "top-center",
          style: {
            background: mode === "dark" ? "#1F2937" : "#fff",
            color: mode === "dark" ? "#fff" : "#1F2937",
            border: mode === "dark" ? "1px solid #374151" : "1px solid #E5E7EB",
          },
        }
      );
      return;
    }
    onRestrictedClick(opportunity); // Trigger modal
  };

  const daysUntilDeadline = Math.ceil(
    (new Date(opportunity.deadline) - new Date()) / (1000 * 60 * 60 * 24)
  );

  const isUrgent = daysUntilDeadline <= 7 && daysUntilDeadline > 0;
  const isExpired = daysUntilDeadline < 0;
  const itemLabel = isFreelancer ? "gig" : "opportunity";

  return (
    <div
      className={`group relative overflow-hidden rounded-lg border backdrop-blur-lg transition-all duration-300 transform h-full flex flex-col ${
        mode === "dark"
          ? "bg-[#172840] border-gray-700/60 hover:border-gray-600/80"
          : "bg-[#172840] border-gray-200/70 hover:border-gray-300/80"
      } ${
        isRestricted
          ? "opacity-50 cursor-not-allowed"
          : "hover:shadow-2xl cursor-pointer hover:scale-[1.02] hover:-translate-y-2"
      }`}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-disabled={isRestricted}
      role="button"
      tabIndex={isRestricted ? -1 : 0}
      aria-label={
        isRestricted
          ? `Restricted ${itemLabel}: ${opportunity.title}`
          : `View ${itemLabel}: ${opportunity.title}`
      }
    >
      {/* Background Gradient Overlay */}
      <div
        className={`absolute inset-0 bg-[#172840] opacity-5 transition-opacity duration-300 ${
          isHovered ? "opacity-10" : "opacity-5"
        } ${isRestricted ? "bg-[#172840]" : ""}`}
      ></div>

      {/* Animated Border */}
      {!isRestricted && (
        <div
          className={`absolute inset-0 rounded-2xl bg-[#172840] opacity-0 transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        ></div>
      )}

      <div className="relative p-6 flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-3 flex-1">
            {/* Type Icon */}
            <div
              className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                mode === "dark"
                  ? "bg-gray-700/50 text-blue-400"
                  : "bg-white text-amber-400"
              } ${isHovered ? "scale-95 rotate-12" : ""}`}
            >
              <Icon icon="material-symbols:star" className="text-3xl" />
            </div>

            <div className="flex-1 min-w-0">
              <h3
                className={`font-normal text-lg leading-tight mb-1 transition-colors duration-200 ${
                  mode === "dark" ? "text-white" : "text-white"
                } ${isRestricted ? "text-gray-500 dark:text-gray-400" : ""} ${
                  isHovered ? "text-blue-600 dark:text-blue-400" : ""
                }`}
              >
                {opportunity.title}
                {isRestricted && (
                  <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">
                    <Icon icon="mdi:lock" className="text-sm mr-1" />
                    Restricted
                  </span>
                )}
              </h3>

              {/* Company/Organization */}
              {opportunity.company && (
                <p
                  className={`text-sm font-medium ${
                    mode === "dark" ? "text-gray-300" : "text-gray-700"
                  } ${isRestricted ? "text-gray-400 dark:text-gray-500" : ""}`}
                >
                  {opportunity.company}
                </p>
              )}
            </div>
          </div>

          {!isFreelancer && (
            <div className="[&>span]:!bg-white [&>span]:!text-gray-900 [&>span]:!border-gray-200 [&>span>svg]:!text-[#f25749]">
              <TierBadge
                tier={opportunity.tier_restriction || "Free Member"}
                mode={mode}
              />
            </div>
          )}
        </div>

        {/* Description */}
        {opportunity.description && (
          <p
            className={`text-sm mb-4 line-clamp-3 leading-relaxed ${
              mode === "dark" ? "text-gray-400" : "text-white"
            } ${isRestricted ? "text-gray-400 dark:text-gray-500" : ""}`}
          >
            {opportunity.description}
          </p>
        )}

        {/* Tags */}
        {opportunity.tags && opportunity.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {opportunity.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                  mode === "dark"
                    ? "bg-gray-700/60 text-gray-300 hover:bg-gray-600/60"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                } ${isHovered ? "scale-105" : ""}`}
              >
                <Icon icon="mdi:tag" className="text-teal-500 text-sm mr-1" />
                {tag}
              </span>
            ))}
            {opportunity.tags.length > 3 && (
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                  mode === "dark"
                    ? "bg-gray-700/60 text-gray-400"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                +{opportunity.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Details Row */}
        <div
          className={`flex flex-wrap items-center gap-6 text-sm mb-4 ${
            mode === "dark" ? "text-gray-400" : "text-gray-600"
          } ${isRestricted ? "text-gray-400 dark:text-gray-500" : ""}`}
        >
          {/* Location */}
          {opportunity.location && (
            <div className="flex items-center space-x-1.5 hover:scale-105 transition-transform duration-200">
              <Icon icon="mdi:map-marker" className="text-lg text-amber-400" />
              <span className="truncate text-white">
                {opportunity.location}
              </span>
            </div>
          )}

          {/* Deadline */}
          {opportunity.deadline && (
            <div
              className={`flex items-center space-x-1.5 hover:scale-105 transition-transform duration-200 text-white ${
                isUrgent
                  ? "text-orange-500 font-semibold"
                  : isExpired
                  ? "text-red-500 font-semibold"
                  : ""
              }`}
            >
              <Icon
                icon={
                  isUrgent
                    ? "mdi:clock-alert"
                    : isExpired
                    ? "mdi:clock-remove"
                    : "mdi:calendar"
                }
                className={`text-lg ${
                  isUrgent
                    ? "text-orange-500"
                    : isExpired
                    ? "text-red-500"
                    : "text-[#f25749]"
                }`}
              />
              <span>
                {isExpired
                  ? "Expired"
                  : isUrgent
                  ? `${daysUntilDeadline} days left`
                  : new Date(opportunity.deadline).toLocaleDateString()}
              </span>
            </div>
          )}

          {/* Budget Range */}
          {opportunity.budget_range && (
            <div className="flex items-center space-x-1.5 hover:scale-105 transition-transform duration-200">
              <Icon icon="mdi:cash" className="text-lg text-green-500" />
              <span className="font-semibold text-green-600 dark:text-green-400">
                {opportunity.budget_range}
              </span>
            </div>
          )}

          {/* Job Type */}
          {opportunity.job_type && (
            <div className="flex items-center space-x-1.5 hover:scale-105 transition-transform duration-200 text-white">
              <Icon icon="mdi:briefcase" className="text-lg text-[#85c1da]" />
              <span>{opportunity.job_type}</span>
            </div>
          )}

          {/* Remote Work */}
          {opportunity.remote_work !== null && (
            <div className="flex items-center space-x-1.5 hover:scale-105 transition-transform duration-200 text-white">
              <Icon
                icon="mdi:home"
                className={`text-lg ${
                  opportunity.remote_work ? "text-blue-500" : "text-amber-400"
                }`}
              />
              <span>{opportunity.remote_work ? "Remote" : "On-site"}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 mt-auto">
          {opportunity.applicant_count && (
            <div className="flex items-center space-x-1.5 text-xs text-gray-500 dark:text-gray-400">
              <Icon icon="mdi:account-group" className="text-sm" />
              <span>{opportunity.applicant_count} applicants</span>
            </div>
          )}
          <button
            onClick={handleViewMoreInfo}
            className={`px-4 py-2 rounded-full font-normal text-xs transition-colors ${
              isRestricted
                ? "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-600 dark:text-gray-400"
                : "bg-amber-400  hover:bg-amber-500 dark:bg-amber-400 dark:hover:bg-amber-500"
            }`}
            disabled={isRestricted}
            aria-label={`View details for ${opportunity.title}`}
          >
            View Details
          </button>
        </div>

        {/* Hover Glow Effect */}
        {!isRestricted && (
          <div
            className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 transition-opacity duration-500 pointer-events-none ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          ></div>
        )}
      </div>

      {/* URGENT Badge */}
      {isUrgent && !isRestricted && (
        <div className="absolute top-4 right-4">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full animate-pulse">
            URGENT
          </div>
        </div>
      )}

      {/* NEW Badge */}
      {opportunity.is_new && !isRestricted && (
        <div className="absolute top-4 left-4">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
            NEW
          </div>
        </div>
      )}
    </div>
  );
};

export default OpportunityCard;
