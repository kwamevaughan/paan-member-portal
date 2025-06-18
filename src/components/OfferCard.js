import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { normalizeTier } from "@/components/Badge";
import { useState } from "react";

export default function OfferCard({ offer, userTier, onClick, mode }) {
  const [isHovered, setIsHovered] = useState(false);
  const isDark = mode === "dark";
  const tierColors = {
    "Associate Member": isDark
      ? "bg-yellow-900/30 text-yellow-400 border-yellow-700/50"
      : "bg-yellow-100 text-yellow-800 border-yellow-200",
    "Full Member": isDark
      ? "bg-blue-900/30 text-blue-400 border-blue-700/50"
      : "bg-blue-100 text-blue-800 border-blue-200",
    "Gold Member": isDark
      ? "bg-green-900/30 text-green-400 border-green-700/50"
      : "bg-green-100 text-green-800 border-green-200",
    "Free Member": isDark
      ? "bg-red-900/30 text-red-400 border-red-700/50"
      : "bg-red-100 text-red-800 border-red-200",
    All: isDark
      ? "bg-purple-900/30 text-purple-400 border-purple-700/50"
      : "bg-purple-100 text-purple-800 border-purple-200",
  };

  const tiers = ["Associate Member", "Full Member", "Gold Member", "Free Member"];
  const normalizedUserTier = normalizeTier(userTier);
  const normalizedOfferTier = normalizeTier(offer.tier_restriction);
  const userTierIndex = normalizedUserTier
    ? tiers.indexOf(normalizedUserTier)
    : -1;
  const offerTierIndex =
    normalizedOfferTier === "All" ? -1 : tiers.indexOf(normalizedOfferTier);
  const canAccess = userTierIndex >= offerTierIndex;

  console.log(
    `[OfferCard] Offer: ${offer.title}, User Tier: ${normalizedUserTier}, Offer Tier: ${normalizedOfferTier}, Can Access: ${canAccess}`
  );

  const handleClick = () => {
    if (!canAccess) {
      toast.error(
        `This offer requires ${normalizedOfferTier} membership. Upgrade your membership to access it.`,
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
    onClick(offer);
  };

  const handleViewMoreInfo = (e) => {
    e.stopPropagation(); // Prevent card click
    if (!canAccess) {
      toast.error(
        `This offer requires ${normalizedOfferTier} membership. Upgrade your membership to access it.`,
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
    onClick(offer);
  };

  const getOfferIcon = (type) => {
    const iconMap = {
      Discount: "mdi:percent-outline",
      Voucher: "mdi:ticket-outline",
      Coupon: "mdi:coupon-outline",
      Deal: "mdi:tag-outline",
      Promotion: "mdi:megaphone-outline",
    };
    return iconMap[type] || "mdi:gift-outline";
  };

  return (
    <motion.div
      className={`group relative overflow-hidden rounded-lg border backdrop-blur-lg transition-all duration-300 transform h-full flex flex-col ${
        mode === "dark"
          ? "bg-[#172840] border-gray-700/60 hover:border-gray-600/80"
          : "bg-[#172840] border-gray-200/70 hover:border-gray-300/80"
      } ${
        !canAccess
          ? "opacity-50 cursor-not-allowed"
          : "hover:shadow-2xl cursor-pointer hover:scale-[1.02] hover:-translate-y-2"
      }`}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-disabled={!canAccess}
      role="button"
      tabIndex={!canAccess ? -1 : 0}
      aria-label={
        !canAccess
          ? `Restricted offer: ${offer.title}`
          : `View offer: ${offer.title}`
      }
    >
      {/* Background Gradient Overlay */}
      <div
        className={`absolute inset-0 bg-[#172840] opacity-5 transition-opacity duration-300 ${
          isHovered ? "opacity-10" : "opacity-5"
        } ${!canAccess ? "bg-[#172840]" : ""}`}
      ></div>

      {/* Animated Border */}
      {canAccess && (
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
              <Icon icon={getOfferIcon(offer.type)} className="text-3xl" />
            </div>

            <div className="flex-1 min-w-0">
              <h3
                className={`font-normal text-lg leading-tight mb-1 transition-colors duration-200 ${
                  mode === "dark" ? "text-white" : "text-white"
                } ${!canAccess ? "text-gray-500 dark:text-gray-400" : ""} ${
                  isHovered ? "text-blue-600 dark:text-blue-400" : ""
                }`}
              >
                {offer.title}
                {!canAccess && (
                  <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">
                    <Icon icon="mdi:lock" className="text-sm mr-1" />
                    Restricted
                  </span>
                )}
              </h3>

              {/* Offer Type */}
              {offer.type && (
                <p
                  className={`text-sm font-medium ${
                    mode === "dark" ? "text-gray-300" : "text-gray-700"
                  } ${!canAccess ? "text-gray-400 dark:text-gray-500" : ""}`}
                >
                  {offer.type}
                </p>
              )}
            </div>
          </div>

          <div className="[&>span]:!bg-white [&>span]:!text-gray-900 [&>span]:!border-gray-200 [&>span>svg]:!text-[#f25749]">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                tierColors[normalizedOfferTier] || tierColors["All"]
              }`}
            >
              {normalizedOfferTier === "All" ? "All Members" : normalizedOfferTier}
            </span>
          </div>
        </div>

        {/* Description */}
        {offer.description && (
          <p
            className={`text-sm mb-4 line-clamp-3 leading-relaxed ${
              mode === "dark" ? "text-gray-400" : "text-white"
            } ${!canAccess ? "text-gray-400 dark:text-gray-500" : ""}`}
          >
            {offer.description}
          </p>
        )}

        {/* Tags */}
        {offer.tags && offer.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {offer.tags.slice(0, 3).map((tag, index) => (
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
            {offer.tags.length > 3 && (
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                  mode === "dark"
                    ? "bg-gray-700/60 text-gray-400"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                +{offer.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Details Row */}
        <div
          className={`flex flex-wrap items-center gap-6 text-sm mb-4 ${
            mode === "dark" ? "text-gray-400" : "text-gray-600"
          } ${!canAccess ? "text-gray-400 dark:text-gray-500" : ""}`}
        >
          {/* Rating */}
          {offer.averageRating > 0 && (
            <div className="flex items-center space-x-1.5 hover:scale-105 transition-transform duration-200">
              <Icon icon="mdi:star" className="text-lg text-amber-400" />
              <span className="font-semibold text-amber-600 dark:text-amber-400">
                {offer.averageRating.toFixed(1)}
              </span>
            </div>
          )}

          {/* Created Date */}
          {offer.created_at && (
            <div className="flex items-center space-x-1.5 hover:scale-105 transition-transform duration-200 text-white">
              <Icon icon="mdi:calendar" className="text-lg text-[#f25749]" />
              <span>
                {new Date(offer.created_at).toLocaleDateString()}
              </span>
            </div>
          )}

          {/* Feedback Count */}
          {offer.feedbackCount > 0 && (
            <div className="flex items-center space-x-1.5 hover:scale-105 transition-transform duration-200">
              <Icon icon="mdi:comment" className="text-lg text-green-500" />
              <span className="font-semibold text-green-600 dark:text-green-400">
                {offer.feedbackCount} reviews
              </span>
            </div>
          )}

          {/* Offer Type */}
          {offer.offer_type && (
            <div className="flex items-center space-x-1.5 hover:scale-105 transition-transform duration-200 text-white">
              <Icon icon="mdi:gift" className="text-lg text-[#85c1da]" />
              <span>{offer.offer_type}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 mt-auto">
          {offer.url && (
            <div className="flex items-center space-x-1.5 text-xs text-gray-500 dark:text-gray-400">
              <Icon icon="mdi:link" className="text-sm" />
              <span>External link</span>
            </div>
          )}
          <button
            onClick={handleViewMoreInfo}
            className={`px-4 py-2 rounded-full font-normal text-xs transition-colors ${
              !canAccess
                ? "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-600 dark:text-gray-400"
                : "bg-amber-400  hover:bg-amber-500 dark:bg-amber-400 dark:hover:bg-amber-500"
            }`}
            disabled={!canAccess}
            aria-label={`View details for ${offer.title}`}
          >
            View Details
          </button>
        </div>

        {/* Hover Glow Effect */}
        {canAccess && (
          <div
            className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 transition-opacity duration-500 pointer-events-none ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          ></div>
        )}
      </div>

      {/* NEW Badge */}
      {offer.is_new && canAccess && (
        <div className="absolute top-4 left-4">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
            NEW
          </div>
        </div>
      )}
    </motion.div>
  );
}
