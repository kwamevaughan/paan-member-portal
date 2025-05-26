// utils/tierUtils.js
export const canAccessTier = (requiredTier, userTier) => {
  if (!requiredTier || !userTier) return false;
  // Exact match: userTier must equal requiredTier
  return requiredTier === userTier;
};
