import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabase";
import { hasTierAccess, normalizeTier } from "@/utils/tierUtils";

const useOffers = (
  filters = { offer_type: "", tier_restriction: "" },
  user = { selected_tier: "Free Member" }
) => {
  const [offers, setOffers] = useState([]);
  const [filterOptions, setFilterOptions] = useState({
    offer_types: [],
    tier_restrictions: [],
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
          "id, title, description, offer_type, tier_restriction, url, icon_url, created_at, updated_at"
        )
        .order("updated_at", { ascending: false })
        .order("created_at", { ascending: false });

      if (filters.offer_type) {
        query = query.eq("offer_type", filters.offer_type);
      }
      if (filters.tier_restriction && filters.tier_restriction !== "") {
        query = query.eq(
          "tier_restriction",
          normalizeTier(filters.tier_restriction)
        );
      }

      const { data: offersData, error: offersError } = await query;
      if (offersError) {
        console.error("[useOffers] Error fetching offers:", offersError);
        throw new Error(`Failed to fetch offers: ${offersError.message}`);
      }

      const { data: allOffers, error: allOffersError } = await supabase
        .from("offers")
        .select("offer_type, tier_restriction");
      if (allOffersError) {
        console.error(
          "[useOffers] Error fetching filter options:",
          allOffersError
        );
        throw new Error("Failed to fetch filter options");
      }

      const offer_types = [...new Set(allOffers.map((o) => o.offer_type))]
        .filter(Boolean)
        .sort();
      const tier_restrictions = [
        ...new Set(
          allOffers.map((o) =>
            normalizeTier(o.tier_restriction || "Free Member")
          )
        ),
      ].sort();

      const { data: feedbackData, error: feedbackError } = await supabase
        .from("offer_feedback")
        .select("offer_id, rating");
      if (feedbackError) {
        console.error("[useOffers] Error fetching feedback:", feedbackError);
        throw new Error(`Failed to fetch feedback: ${feedbackError.message}`);
      }

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
        const tierRestriction =
          normalizeTier(offer.tier_restriction) || "Free Member";
        const isAccessible = hasTierAccess(tierRestriction, user);

        return {
          ...offer,
          offer_type: offer.offer_type || "General",
          tier_restriction: tierRestriction,
          averageRating,
          feedbackCount: ratings.length,
          isAccessible,
        };
      });

      setOffers(enrichedOffers);
      setFilterOptions({ offer_types, tier_restrictions });
    } catch (err) {
      console.error("[useOffers] Error:", err);
      setError(err.message);
      toast.error("Failed to load offers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, [filters.offer_type, filters.tier_restriction, user?.selected_tier]);

  return {
    offers,
    filterOptions,
    loading,
    error,
  };
};

export default useOffers;
