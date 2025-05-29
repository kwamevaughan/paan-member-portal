import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabase";
import { hasTierAccess, normalizeTier } from "@/utils/tierUtils";

const useOffers = (
  filters = { tier_restriction: "" },
  user = { selected_tier: "Free Member" }
) => {
  const [offers, setOffers] = useState([]);
  const [filterOptions, setFilterOptions] = useState({
    tier_restrictions: [
      "Free Member",
      "Associate Member",
      "Full Member",
      "Gold Member",
    ],
    offer_types: ["Discount", "Service", "Workshop"], // Static types
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from("offers")
        .select(
          "id, title, description, tier_restriction, url, icon_url, created_at, updated_at"
        )
        .order("updated_at", { ascending: false })
        .order("created_at", { ascending: false });

      if (filters.tier_restriction && filters.tier_restriction !== "All") {
        const normalizedFilter = normalizeTier(filters.tier_restriction);
        query = query.eq("tier_restriction", normalizedFilter);
      }

      const { data: offersData, error: offersError } = await query;

      if (offersError) {
        console.error("[useOffers] Supabase error:", offersError);
        throw new Error(`Failed to fetch offers: ${offersError.message}`);
      }

      // Fetch distinct tier_restrictions
      const { data: tierData, error: tierError } = await supabase
        .from("offers")
        .select("tier_restriction")
        .neq("tier_restriction", null);

      if (tierError) {
        console.error("[useOffers] Tier error:", tierError);
        throw new Error("Failed to fetch tier restrictions");
      }

      const tier_restrictions = [
        ...new Set(
          tierData.map((item) => normalizeTier(item.tier_restriction))
        ),
      ].filter(Boolean);

      setFilterOptions({
        tier_restrictions: tier_restrictions.length
          ? tier_restrictions
          : ["Free Member", "Associate Member", "Full Member", "Gold Member"],
        offer_types: ["Discount", "Service", "Workshop"],
      });

      // Fetch feedback
      const { data: feedbackData, error: feedbackError } = await supabase
        .from("offer_feedback")
        .select("offer_id, rating");

      if (feedbackError) {
        console.error("[useOffers] Feedback error:", feedbackError);
        throw new Error(`Failed to fetch feedback: ${feedbackError.message}`);
      }

      const feedbackByOffer = feedbackData.reduce((acc, fb) => {
        acc[fb.offer_id] = acc[fb.offer_id] || [];
        acc[fb.offer_id].push(fb.rating);
        return acc;
      }, {});

      // Enrich offers
      const enrichedOffers = offersData.map((offer) => {
        const ratings = feedbackByOffer[offer.id] || [];
        const averageRating =
          ratings.length > 0
            ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
            : 0;
        const tierRestriction =
          normalizeTier(offer.tier_restriction) || "Free Member";
        const isAccessible = hasTierAccess(tierRestriction, user);

        return {
          ...offer,
          tier_restriction: tierRestriction,
          averageRating,
          feedbackCount: ratings.length,
          isAccessible,
        };
      });

      setOffers(enrichedOffers);
      console.log("[useOffers] Filter options:", filterOptions);
    } catch (err) {
      console.error("[useOffers] Detailed error:", err);
      setError(err.message);
      toast.error("Failed to load offers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, [filters.tier_restriction, user.selected_tier]);

  return {
    offers,
    filterOptions,
    loading,
    error,
  };
};

export default useOffers;
