const normalizeTier = (tier) => {
  if (!tier || typeof tier !== "string") return "Free Member";
  
  const cleanTier = tier.trim().toLowerCase();
  
  // Check for tier patterns in the string
  if (cleanTier.includes("gold member") || cleanTier.includes("tier 3")) {
    return "Gold Member";
  }
  if (cleanTier.includes("full member") || cleanTier.includes("tier 2")) {
    return "Full Member";
  }
  if (cleanTier.includes("associate member") || cleanTier.includes("associate agency") || cleanTier.includes("tier 1")) {
    return "Associate Member";
  }
  if (cleanTier.includes("free member") || cleanTier.includes("tier 0")) {
    return "Free Member";
  }
  if (cleanTier.includes("admin")) {
    return "Admin";
  }
  
  // Fallback to exact match for backward compatibility
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
    "admin": "Admin",
  };
  
  return tierMap[cleanTier] || "Free Member";
};

const hasTierAccess = (entityTier, user) => {
  // Admin users have full access to all resources
  if (user?.selected_tier === "Admin" || user?.job_type === "admin") {
    return true;
  }
  
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
