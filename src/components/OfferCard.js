import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { normalizeTier } from "@/components/Badge";

export default function OfferCard({ offer, userTier, onClick, mode }) {
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

  const cardVariants = {
    hover: { scale: 1.05, boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)" },
  };

  const handleClick = () => {
    if (!canAccess) {
      toast.error(
        `This offer is available to ${normalizedOfferTier} only. Upgrade your membership to unlock this offer.`,
        { duration: 5000 }
      );
      return;
    }
    onClick(offer);
  };

  return (
    <motion.div
      variants={cardVariants}
      whileHover="hover"
      className={`rounded-2xl ${
        isDark ? "bg-gray-900/30" : "bg-white/30"
      } backdrop-blur-lg p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50 flex flex-col h-full`}
    >
      {offer.icon_url && (
        <img
          src={offer.icon_url}
          alt={offer.title}
          className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-indigo-500/50"
        />
      )}
      <h3
        className={`text-xl font-semibold ${
          isDark ? "text-white" : "text-gray-900"
        } mb-2 text-center`}
      >
        {offer.title}
      </h3>
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
          tierColors[normalizedOfferTier] || tierColors["All"]
        } mb-4 mx-auto`}
      >
        {normalizedOfferTier === "All" ? "All Members" : normalizedOfferTier}
      </span>
      <p
        className={`text-sm ${
          isDark ? "text-gray-300" : "text-gray-700"
        } mb-4 flex-grow text-center line-clamp-3`}
      >
        {offer.description || "No description available"}
      </p>
      <div className="flex items-center gap-2 mb-4 mx-auto">
        {[1, 2, 3, 4, 5].map((star) => (
          <Icon
            key={star}
            icon="heroicons:star-solid"
            className={`w-4 h-4 ${
              star <= offer.averageRating
                ? "text-yellow-400"
                : "text-gray-300 dark:text-gray-600"
            }`}
          />
        ))}
        <span className="text-xs text-gray-600 dark:text-gray-400">
          {offer.averageRating.toFixed(1)} ({offer.feedbackCount} reviews)
        </span>
      </div>
      {canAccess ? (
        <motion.a
          href={offer.url}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }}
          className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all animate-pulse"
          onClick={() => onClick(offer)}
        >
          <Icon icon="heroicons:external-link" className="w-4 h-4 mr-2" />
          Claim Offer
        </motion.a>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-4 p-3 rounded-lg ${
            isDark ? "bg-gray-800/50" : "bg-gray-100/50"
          } flex items-center justify-center`}
        >
          <Icon
            icon="heroicons:lock-closed"
            className="w-4 h-4 text-gray-500 mr-2"
          />
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Requires {normalizedOfferTier}.{" "}
            <a
              href="/membership"
              className="text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Upgrade Now
            </a>
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
