import { normalizeTier } from "@/components/Badge";

// Define tier hierarchy (higher number = more access)
const TIER_HIERARCHY = {
  "Free Member": 1,
  "Associate Member": 2,
  "Full Member": 3,
  "Gold Member": 4,
  "Admin": 5
};

// Define section access requirements - All sections are accessible to all users
// The prioritization happens within the content of each section, not at the tab level
const SECTION_ACCESS_REQUIREMENTS = {
  "opportunities": 1, // Free Member and above (everyone)
  "events": 1,        // Free Member and above (everyone)
  "resources": 1,     // Free Member and above (everyone)
  "marketIntel": 1,   // Free Member and above (everyone)
  "offers": 1,        // Free Member and above (everyone)
  "updates": 1        // Free Member and above (everyone)
};

/**
 * Get user's access level based on their tier
 * @param {string} userTier - User's tier (e.g., "Gold Member", "Free Member")
 * @returns {number} Access level (1-5)
 */
export const getUserAccessLevel = (userTier) => {
  const normalizedTier = normalizeTier(userTier) || "Free Member";
  return TIER_HIERARCHY[normalizedTier] || 1;
};

/**
 * Check if user has access to a specific section
 * @param {string} userTier - User's tier
 * @param {string} sectionId - Section identifier
 * @returns {boolean} Whether user has access
 */
export const hasAccessToSection = (userTier, sectionId) => {
  const userLevel = getUserAccessLevel(userTier);
  const requiredLevel = SECTION_ACCESS_REQUIREMENTS[sectionId] || 1;
  return userLevel >= requiredLevel;
};

/**
 * Get sections ordered by accessibility (accessible first, then restricted)
 * @param {Array} allSections - All available sections
 * @param {string} userTier - User's tier
 * @returns {Object} { accessible: [], restricted: [] }
 */
export const getOrderedSections = (allSections, userTier) => {
  const accessible = [];
  const restricted = [];

  allSections.forEach(section => {
    if (hasAccessToSection(userTier, section.id)) {
      accessible.push(section);
    } else {
      restricted.push({ ...section, isRestricted: true });
    }
  });

  return { accessible, restricted };
};

/**
 * Get restriction message for a section
 * @param {string} sectionId - Section identifier
 * @param {string} userTier - User's current tier
 * @returns {string} Restriction message
 */
export const getRestrictionMessage = (sectionId, userTier) => {
  const requiredLevel = SECTION_ACCESS_REQUIREMENTS[sectionId];
  const requiredTier = Object.keys(TIER_HIERARCHY).find(
    tier => TIER_HIERARCHY[tier] === requiredLevel
  );

  const sectionNames = {
    "events": "Events & Workshops",
    "resources": "Resources",
    "marketIntel": "Market Intelligence",
    "offers": "Offers"
  };

  const sectionName = sectionNames[sectionId] || sectionId;
  
  return `${sectionName} requires ${requiredTier} membership or higher. Upgrade your membership to access this content.`;
};

/**
 * Get tier upgrade suggestions
 * @param {string} currentTier - User's current tier
 * @returns {Array} Available upgrade options
 */
export const getUpgradeOptions = (currentTier) => {
  const currentLevel = getUserAccessLevel(currentTier);
  const upgrades = [];

  Object.entries(TIER_HIERARCHY).forEach(([tier, level]) => {
    if (level > currentLevel && tier !== "Admin") {
      upgrades.push(tier);
    }
  });

  return upgrades.sort((a, b) => TIER_HIERARCHY[a] - TIER_HIERARCHY[b]);
};