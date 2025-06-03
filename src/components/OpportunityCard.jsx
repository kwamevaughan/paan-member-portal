import { Icon } from "@iconify/react";
import { useState } from "react";
import { useRouter } from "next/router";

const OpportunityCard = ({
  opportunity,
  mode,
  isRestricted,
  onRestrictedClick,
  TierBadge,
  isFreelancer,
  showExpressInterestButton,
}) => {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (isRestricted || showExpressInterestButton) {
      return; // Disable card click when restricted or button is present
    }
    if (opportunity.application_link) {
      window.location.href = opportunity.application_link;
    } else {
      router.push(`/opportunities/${opportunity.id}`);
    }
  };

  const handleExpressInterest = (e) => {
    e.stopPropagation(); // Prevent card click
    onRestrictedClick(opportunity); // Trigger handleExpressInterest
  };

  const daysUntilDeadline = Math.ceil(
    (new Date(opportunity.deadline) - new Date()) / (1000 * 60 * 60 * 24)
  );

  const isUrgent = daysUntilDeadline <= 7 && daysUntilDeadline > 0;
  const isExpired = daysUntilDeadline < 0;
  const itemLabel = isFreelancer ? "gig" : "opportunity";

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border backdrop-blur-lg transition-all duration-300 transform ${
        mode === "dark"
          ? "bg-gray-800/80 border-gray-700/60 hover:border-gray-600/80"
          : "bg-white/90 border-gray-200/70 hover:border-gray-300/80"
      } ${
        isRestricted
          ? "opacity-50 cursor-not-allowed"
          : showExpressInterestButton
          ? "hover:shadow-xl cursor-default"
          : "hover:shadow-2xl cursor-pointer hover:scale-[1.02] hover:translate-y-2"
      }`}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-disabled={isRestricted}
      role="button"
      tabIndex={isRestricted || showExpressInterestButton ? -1 : 0}
      aria-label={
        isRestricted
          ? `Restricted ${itemLabel}: ${opportunity.title}`
          : `View ${itemLabel}: ${opportunity.title}`
      }
    >
      {/* Background Gradient Overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-br opacity-5 transition-opacity duration-300 ${
          isHovered ? "opacity-10" : "opacity-5"
        } ${
          isRestricted
            ? "from-gray-500 to-gray-600"
            : "from-blue-500 via-purple-500 to-pink-500"
        }`}
      ></div>

      {/* Animated Border */}
      {!isRestricted && (
        <div
          className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-pink-500/30 opacity-0 transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        ></div>
      )}

      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-3 flex-1">
            {/* Type Icon */}
            <div
              className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                mode === "dark"
                  ? "bg-gray-700/50 text-blue-400"
                  : "bg-blue-50 text-blue-600"
              } ${isHovered ? "scale-110 rotate-12" : ""}`}
            >
              <Icon icon="mdi:star-circle" className="text-2xl" />
            </div>

            <div className="flex-1 min-w-0">
              <h3
                className={`font-semibold text-lg leading-tight mb-1 transition-colors duration-200 ${
                  mode === "dark" ? "text-white" : "text-gray-900"
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
            <TierBadge
              tier={opportunity.tier_restriction || "Free Member"}
              mode={mode}
            />
          )}
        </div>

        {/* Description */}
        {opportunity.description && (
          <p
            className={`text-sm mb-4 line-clamp-3 leading-relaxed ${
              mode === "dark" ? "text-gray-400" : "text-gray-600"
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
          className={`flex flex-wrap items-center gap-4 text-sm mb-4 ${
            mode === "dark" ? "text-gray-400" : "text-gray-600"
          } ${isRestricted ? "text-gray-400 dark:text-gray-500" : ""}`}
        >
          {/* Location */}
          <div className="flex items-center space-x-1.5">
            <Icon icon="mdi:map-marker" className="text-base text-blue-500" />
            <span className="truncate">{opportunity.location}</span>
          </div>

          {/* Deadline */}
          <div
            className={`flex items-center space-x-1.5 ${
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
              className={`text-base ${
                isUrgent
                  ? "text-orange-500"
                  : isExpired
                  ? "text-red-500"
                  : "text-green-500"
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

          {/* Salary/Compensation */}
          {opportunity.salary && (
            <div className="flex items-center space-x-1.5">
              <Icon icon="mdi:cash" className="text-base text-green-500" />
              <span className="font-semibold text-green-600 dark:text-green-400">
                {opportunity.salary}
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
          {opportunity.applicant_count && (
            <div className="flex items-center space-x-1.5 text-xs text-gray-500 dark:text-gray-400">
              <Icon icon="mdi:account-group" className="text-sm" />
              <span>{opportunity.applicant_count} applicants</span>
            </div>
          )}

          {showExpressInterestButton ? (
            <button
              onClick={handleExpressInterest}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                isRestricted
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-600 dark:text-gray-400"
                  : "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
              }`}
              disabled={isRestricted}
              aria-label={`Express interest in ${opportunity.title}`}
            >
              Express Interest
            </button>
          ) : (
            <div
              className={`flex items-center space-x-2 text-sm font-medium transition-all duration-200 ${
                isRestricted
                  ? "text-gray-400"
                  : mode === "dark"
                  ? "text-blue-400 group-hover:text-blue-300"
                  : "text-blue-600 group-hover:text-blue-700"
              } ${isHovered ? "transform translate-x-1" : ""}`}
            >
              <span>
                {opportunity.application_link ? "Apply Now" : "View Details"}
              </span>
              <Icon
                icon={
                  opportunity.application_link
                    ? "mdi:open-in-new"
                    : "mdi:arrow-right"
                }
                className={`text-base transition-transform duration-200 ${
                  isHovered ? "transform translate-x-1" : ""
                }`}
              />
            </div>
          )}
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
