export const canAccessTier = (requiredTier, userTier) => {
  const normalize = (tier) => {
    if (!tier) return "free member";
    // Map legacy formats and normalize to lowercase
    const tierMap = {
      "gold member (tier 3)": "gold member",
      "full member (tier 2)": "full member",
      "associate member (tier 1)": "associate member",
      "free member (tier 4)": "free member",
      "associate agency (tier 1)": "associate member", // Handle any old formats
    };
    const cleanTier = tier
      .replace(/\(.*?\)/g, "")
      .trim()
      .toLowerCase();
    return tierMap[cleanTier] || cleanTier;
  };

  const normalizedRequired = normalize(requiredTier);
  const normalizedUser = normalize(userTier);

  // Define tier hierarchy (highest to lowest)
  const tierHierarchy = [
    "gold member",
    "full member",
    "associate member",
    "free member",
  ];

  // If no required tier, all users can access
  if (!normalizedRequired) {
    return true;
  }

  // If no user tier, deny access
  if (!normalizedUser) {
    return false;
  }

  const requiredIndex = tierHierarchy.indexOf(normalizedRequired);
  const userIndex = tierHierarchy.indexOf(normalizedUser);

  // If either tier is not in hierarchy, deny access
  if (requiredIndex === -1 || userIndex === -1) {
    return false;
  }

  // User can access if their tier is equal or higher (lower index)
  return userIndex <= requiredIndex;
};
