import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabase";

const useOffers = (filters = { tier_restriction: "" }) => {
  const [offers, setOffers] = useState([]);
  const [filterOptions, setFilterOptions] = useState({
    tier_restrictions: [
      "all",
      "Associate Members",
      "Full Members",
      "Founding Members",
    ],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Normalize tier names
  const normalizeTier = (tier) => {
    if (!tier) return "Associate Members";
    if (tier.includes("Associate Member")) return "Associate Members";
    if (tier.includes("Full Member")) return "Full Members";
    if (tier.includes("Founding Member")) return "Founding Members";
    return tier;
  };

  const fetchOffers = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("[useOffers] Fetching with filters:", filters);

      let query = supabase
        .from("offers")
        .select(
          "id, title, description, tier_restriction, url, icon_url, created_at, updated_at"
        )
        .order("created_at", { ascending: false });

      if (filters.tier_restriction && filters.tier_restriction !== "all") {
        query = query.eq(
          "tier_restriction",
          normalizeTier(filters.tier_restriction)
        );
      }

      const { data: offersData, error: offersError } = await query;

      if (offersError) {
        console.error(
          "[useOffers] Error fetching offers:",
          offersError.message
        );
        throw new Error(`Failed to fetch offers: ${offersError.message}`);
      }

      console.log("[useOffers] Raw offers data:", offersData);

      // Fetch feedback to compute average ratings
      const { data: feedbackData, error: feedbackError } = await supabase
        .from("offer_feedback")
        .select("offer_id, rating");

      if (feedbackError) {
        console.error(
          "[useOffers] Error fetching feedback:",
          feedbackError.message
        );
        throw new Error(`Failed to fetch feedback: ${feedbackError.message}`);
      }

      console.log("[useOffers] Feedback data:", feedbackData);

      // Compute average ratings
      const feedbackByOffer = feedbackData.reduce((acc, fb) => {
        acc[fb.offer_id] = acc[fb.offer_id] || [];
        acc[fb.offer_id].push(fb.rating);
        return acc;
      }, {});

      const enrichedOffers = offersData.map((offer) => {
        const ratings = feedbackByOffer[offer.id] || [];
        const averageRating =
          ratings.length > 0
            ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
            : 0;
        return {
          ...offer,
          tier_restriction: normalizeTier(offer.tier_restriction),
          averageRating,
          feedbackCount: ratings.length,
        };
      });

      console.log("[useOffers] Enriched offers:", enrichedOffers);
      setOffers(enrichedOffers);
    } catch (err) {
      console.error("[useOffers] Error:", err.message);
      setError(err.message);
      toast.error("Failed to load offers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, [filters.tier_restriction]);

  return {
    offers,
    filterOptions,
    loading,
    error,
  };
};

export default useOffers;
