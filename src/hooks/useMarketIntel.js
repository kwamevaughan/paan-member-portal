import { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabase";

const useMarketIntel = (
  filters = { tier_restriction: "all", region: "all", type: "all" },
  searchTerm = "",
  initialMarketIntel = [],
  userTier = "Associate Members"
) => {
  const [marketIntel, setMarketIntel] = useState(initialMarketIntel);
  const [filterOptions, setFilterOptions] = useState({
    tier_restrictions: [
      "all",
      "Associate Members",
      "Full Members",
      "Founding Members",
    ],
    regions: ["all"],
    types: ["all"],
  });
  const [loading, setLoading] = useState(!initialMarketIntel.length);
  const [error, setError] = useState(null);

  const normalizeTier = (tier) => {
    if (!tier) return "Associate Members";
    if (tier.includes("Associate Member")) return "Associate Members";
    if (tier.includes("Full Member")) return "Full Members";
    if (tier.includes("Founding Member")) return "Founding Members";
    return tier;
  };

  const getAccessibleTiers = (userTier) => {
    const normalizedUserTier = normalizeTier(userTier);
    const tierHierarchy = [
      "Associate Members",
      "Full Members",
      "Founding Members",
    ];
    const userTierIndex = tierHierarchy.indexOf(normalizedUserTier);
    return ["All", ...tierHierarchy.slice(0, userTierIndex + 1)];
  };

  const fetchMarketIntel = async () => {
    try {
      setLoading(true);
      setError(null);

      const accessibleTiers = getAccessibleTiers(userTier);
      console.log(
        "[useMarketIntel] User tier:",
        userTier,
        "Accessible tiers:",
        accessibleTiers
      );

      let query = supabase
        .from("market_intel")
        .select(
          "id, title, description, tier_restriction, url, icon_url, region, type, downloadable, created_at, chart_data"
        )
        .order("created_at", { ascending: false });

      if (filters.tier_restriction && filters.tier_restriction !== "all") {
        query = query.eq(
          "tier_restriction",
          normalizeTier(filters.tier_restriction)
        );
      }
      if (filters.region && filters.region !== "all") {
        query = query.eq("region", filters.region);
      }
      if (filters.type && filters.type !== "all") {
        query = query.eq("type", filters.type);
      }
      if (searchTerm) {
        query = query.ilike("title", `%${searchTerm}%`);
      }

      const { data: intelData, error: intelError } = await query;
      if (intelError) throw new Error(intelError.message);

      const { data: feedbackData, error: feedbackError } = await supabase
        .from("market_intel_feedback")
        .select("market_intel_id, user_id, rating, comment, created_at");
      if (feedbackError) throw new Error(feedbackError.message);

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
        return {
          ...intel,
          averageRating: Number(averageRating) || 0,
          feedbackCount: feedback.length,
          feedback,
          isAccessible: accessibleTiers.includes(
            normalizeTier(intel.tier_restriction)
          ),
        };
      });

      const sortedIntel = enrichedIntel.sort((a, b) => {
        if (a.isAccessible === b.isAccessible) {
          return new Date(b.created_at) - new Date(a.created_at);
        }
        return a.isAccessible ? -1 : 1;
      });

      console.log("[useMarketIntel] Sorted intel:", sortedIntel);

      setMarketIntel(sortedIntel);

      const regions = [
        "all",
        ...new Set(sortedIntel.map((item) => item.region)),
      ];
      const types = ["all", ...new Set(sortedIntel.map((item) => item.type))];
      setFilterOptions((prev) => ({
        ...prev,
        regions,
        types,
        tier_restrictions: [
          "all",
          ...accessibleTiers.filter((t) => t !== "All"),
        ],
      }));
    } catch (err) {
      console.error("[useMarketIntel] Error:", err.message);
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
