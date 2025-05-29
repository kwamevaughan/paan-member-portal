import { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabase";
import { normalizeTier } from "@/utils/tierUtils"; // Use tierUtils

const useMarketIntel = (
  filters = { tier_restriction: "", region: "", type: "" },
  searchTerm = "",
  initialMarketIntel = [],
  userTier = "Free Member"
) => {
  const [marketIntel, setMarketIntel] = useState(initialMarketIntel);
  const [filterOptions, setFilterOptions] = useState({
    tier_restrictions: [
      "",
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

      let query = supabase
        .from("market_intel")
        .select(
          "id, title, description, tier_restriction, url, icon_url, region, type, downloadable, created_at, updated_at, chart_data"
        )
        .order("updated_at", { ascending: false }); // Order by updated_at

      if (filters.tier_restriction && filters.tier_restriction !== "") {
        const normalizedFilter = normalizeTier(filters.tier_restriction);
        query = query.eq("tier_restriction", normalizedFilter);
      }
      if (filters.region && filters.region !== "") {
        query = query.eq("region", filters.region);
      }
      if (filters.type && filters.type !== "") {
        query = query.eq("type", filters.type);
      }
      if (searchTerm) {
        query = query.ilike("title", `%${searchTerm}%`);
      }

      const { data: intelData, error: intelError } = await query;
      if (intelError) {
        console.error("[useMarketIntel] Supabase error:", intelError);
        throw new Error(intelError.message);
      }

      const { data: feedbackData, error: feedbackError } = await supabase
        .from("market_intel_feedback")
        .select("market_intel_id, user_id, rating, comment, created_at");
      if (feedbackError) {
        console.error("[useMarketIntel] Feedback error:", feedbackError);
        throw new Error(feedbackError.message);
      }

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
        return {
          ...intel,
          tier_restriction: tierRestriction,
          averageRating: Number(averageRating) || 0,
          feedbackCount: feedback.length,
          feedback,
          isAccessible,
        };
      });

      setMarketIntel(enrichedIntel);

      const regions = [
        ...new Set(enrichedIntel.map((item) => item.region)),
      ].filter((r) => r);
      const types = [...new Set(enrichedIntel.map((item) => item.type))].filter(
        (t) => t
      );
      setFilterOptions({
        tier_restrictions: [
          "",
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
