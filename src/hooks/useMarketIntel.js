import { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabase";
import { normalizeTier } from "@/components/Badge";

const useMarketIntel = (
  filters = { tier_restriction: "", region: "", type: "" },
  searchTerm = "",
  initialMarketIntel = [],
  userTier = "Free Member"
) => {
  const [marketIntel, setMarketIntel] = useState(initialMarketIntel);
  const [filterOptions, setFilterOptions] = useState({
    tier_restrictions: [
      "Associate Member",
      "Full Member",
      "Gold Member",
      "Free Member",
    ],
    regions: [],
    types: [],
  });
  const [loading, setLoading] = useState(!initialMarketIntel.length);
  const [error, setError] = useState(null);

  const getAccessibleTiers = (userTier) => {
    const normalizedUserTier = normalizeTier(userTier);
    const tierHierarchy = [
      "Free Member",
      "Associate Member",
      "Full Member",
      "Gold Member",
    ];
    const userTierIndex = tierHierarchy.indexOf(normalizedUserTier);
    if (userTierIndex === -1) {
      console.warn("[useMarketIntel] Invalid user tier:", normalizedUserTier);
      return ["Free Member"];
    }
    return tierHierarchy.slice(0, userTierIndex + 1);
  };

  const fetchMarketIntel = async () => {
    try {
      setLoading(true);
      setError(null);

      const accessibleTiers = getAccessibleTiers(userTier);
      console.log(
        "[useMarketIntel] User tier:",
        userTier,
        "Normalized user tier:",
        normalizeTier(userTier),
        "Accessible tiers:",
        accessibleTiers
      );

      let query = supabase
        .from("market_intel")
        .select(
          "id, title, description, tier_restriction, url, icon_url, region, type, downloadable, created_at, chart_data"
        )
        .order("created_at", { ascending: false });

      if (filters.tier_restriction && filters.tier_restriction !== "") {
        const normalizedFilter = normalizeTier(filters.tier_restriction);
        console.log(
          "[useMarketIntel] Applying tier filter: tier_restriction =",
          normalizedFilter
        );
        query = query.eq("tier_restriction", normalizedFilter);
      }
      if (filters.region && filters.region !== "") {
        console.log("[useMarketIntel] Applying region filter:", filters.region);
        query = query.eq("region", filters.region);
      }
      if (filters.type && filters.type !== "") {
        console.log("[useMarketIntel] Applying type filter:", filters.type);
        query = query.eq("type", filters.type);
      }
      if (searchTerm) {
        console.log("[useMarketIntel] Applying search term:", searchTerm);
        query = query.ilike("title", `%${searchTerm}%`);
      }

      console.log("[useMarketIntel] Query:", JSON.stringify(query));

      const { data: intelData, error: intelError } = await query;
      if (intelError) {
        console.error("[useMarketIntel] Supabase error:", intelError);
        throw new Error(intelError.message);
      }

      console.log("[useMarketIntel] Raw intel data:", intelData);

      const { data: feedbackData, error: feedbackError } = await supabase
        .from("market_intel_feedback")
        .select("market_intel_id, user_id, rating, comment, created_at");
      if (feedbackError) {
        console.error("[useMarketIntel] Feedback error:", feedbackError);
        throw new Error(feedbackError.message);
      }

      console.log("[useMarketIntel] Feedback data:", feedbackData);

      const feedbackByIntel = feedbackData.reduce((acc, fb) => {
        acc[fb.market_intel_id] = acc[fb.market_intel_id] || [];
        acc[fb.market_intel_id].push(fb);
        return acc;
      }, {});

      const enrichedIntel = intelData.map((intel) => {
        const feedback = feedbackByIntel[intel.id] || [];
        const averageRating =
          feedback.length > 0
            ? feedback.reduce((sum, fb) => sum + (fb.rating || 0), 0) /
              feedback.length
            : 0;
        const tierRestriction =
          normalizeTier(intel.tier_restriction) || "Free Member";
        const isAccessible = accessibleTiers.includes(tierRestriction);
        console.log(
          `[useMarketIntel] Intel: ${intel.title}, tier_restriction: ${tierRestriction}, userTier: ${userTier}, isAccessible: ${isAccessible}`
        );
        return {
          ...intel,
          tier_restriction: tierRestriction,
          averageRating: Number(averageRating) || 0,
          feedbackCount: feedback.length,
          feedback,
          isAccessible,
        };
      });

      // Sort: exact tier match first, then other accessible, then restricted
      const userTierNormalized = normalizeTier(userTier);
      const tierHierarchy = [
        "Gold Member",
        "Full Member",
        "Associate Member",
        "Free Member",
      ];
      const sortedIntel = enrichedIntel.sort((a, b) => {
        const aTier = normalizeTier(a.tier_restriction);
        const bTier = normalizeTier(b.tier_restriction);
        const aIndex = tierHierarchy.indexOf(aTier);
        const bIndex = tierHierarchy.indexOf(bTier);
        const userIndex = tierHierarchy.indexOf(userTierNormalized);

        if (a.isAccessible && b.isAccessible) {
          const aIsExact = aIndex === userIndex;
          const bIsExact = bIndex === userIndex;
          if (aIsExact !== bIsExact) {
            console.log(
              `[useMarketIntel] Comparing ${a.title} (exact: ${aIsExact}) vs ${
                b.title
              } (exact: ${bIsExact}) -> ${aIsExact ? "a first" : "b first"}`
            );
            return aIsExact ? -1 : 1;
          }
          // Both same precedence, sort by created_at
          console.log(
            `[useMarketIntel] Both accessible, same precedence: ${a.title} vs ${b.title}, sorting by created_at`
          );
          return new Date(b.created_at) - new Date(a.created_at);
        }

        if (a.isAccessible !== b.isAccessible) {
          console.log(
            `[useMarketIntel] Comparing ${a.title} (access: ${
              a.isAccessible
            }) vs ${b.title} (access: ${b.isAccessible}) -> ${
              a.isAccessible ? "a first" : "b first"
            }`
          );
          return a.isAccessible ? -1 : 1;
        }

        // Both restricted, sort by created_at
        console.log(
          `[useMarketIntel] Both restricted: ${a.title} vs ${b.title}, sorting by created_at`
        );
        return new Date(b.created_at) - new Date(a.created_at);
      });

      console.log(
        "[useMarketIntel] Sorted intel:",
        sortedIntel.map((i) => ({
          id: i.id,
          title: i.title,
          tier: i.tier_restriction,
          region: i.region,
          type: i.type,
          isAccessible: i.isAccessible,
        }))
      );

      setMarketIntel(sortedIntel);

      const regions = [
        ...new Set(sortedIntel.map((item) => item.region)),
      ].filter((r) => r);
      const types = [...new Set(sortedIntel.map((item) => item.type))].filter(
        (t) => t
      );
      setFilterOptions({
        tier_restrictions: [
          "Associate Member",
          "Full Member",
          "Gold Member",
          "Free Member",
        ],
        regions: ["", ...regions],
        types: ["", ...types],
      });
    } catch (err) {
      console.error("[useMarketIntel] Detailed error:", err);
      setError(err.message);
      toast.error("Failed to load market intel");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log(
      "[useMarketIntel] Effect triggered - Filters:",
      filters,
      "SearchTerm:",
      searchTerm,
      "UserTier:",
      userTier
    );
    fetchMarketIntel();
  }, [
    filters.tier_restriction,
    filters.region,
    filters.type,
    searchTerm,
    userTier,
  ]);

  const memoizedFilterOptions = useMemo(
    () => filterOptions,
    [
      filterOptions.regions,
      filterOptions.types,
      filterOptions.tier_restrictions,
    ]
  );

  return {
    marketIntel,
    filterOptions: memoizedFilterOptions,
    loading,
    error,
  };
};

export default useMarketIntel;
