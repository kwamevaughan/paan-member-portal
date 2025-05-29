const normalizeTier = (tier) => {
  if (!tier || typeof tier !== "string") return "Free Member";
  const tierMap = {
    "gold member (tier 3)": "Gold Member",
    "full member (tier 2)": "Full Member",
    "associate member (tier 1)": "Associate Member",
    "free member (tier 0)": "Free Member",
    "associate agency (tier 1)": "Associate Member",
    "gold member": "Gold Member",
    "full member": "Full Member",
    "associate member": "Associate Member",
    "free member": "Free Member",
  };
  const cleanTier = tier.trim().toLowerCase();
  return tierMap[cleanTier] || "Free Member";
};

const hasTierAccess = (entityTier, user) => {
  const tiers = [
    "Gold Member", // Index 0 (highest tier)
    "Full Member", // Index 1
    "Associate Member", // Index 2
    "Free Member", // Index 3 (lowest tier)
  ];
  const userTier = normalizeTier(user?.selected_tier) || "Free Member";
  const normalizedTier = normalizeTier(entityTier) || "Free Member";
  const userTierIndex = tiers.indexOf(userTier);
  const entityTierIndex = tiers.indexOf(normalizedTier);
  if (userTierIndex === -1 || entityTierIndex === -1) return false;
  return userTierIndex <= entityTierIndex;
};

export { hasTierAccess, normalizeTier };
