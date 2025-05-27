import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabase";
import { normalizeTier } from "@/components/Badge";
import { canAccessTier } from "@/utils/tierUtils";

const useOffers = (
  filters = { tier_restriction: "" },
  userTier = "Free Member"
) => {
  const [offers, setOffers] = useState([]);
  const [filterOptions, setFilterOptions] = useState({
    tier_restrictions: [
      "Associate Member",
      "Full Member",
      "Gold Member",
      "Free Member",
    ],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log(
        "[useOffers] Fetching with filters:",
        filters,
        "User tier:",
        userTier
      );

      let query = supabase
        .from("offers")
        .select(
          "id, title, description, tier_restriction, url, icon_url, created_at, updated_at"
        )
        .order("created_at", { ascending: false });

      if (filters.tier_restriction && filters.tier_restriction !== "") {
        const normalizedFilter = normalizeTier(filters.tier_restriction);
        console.log(
          "[useOffers] Applying filter: tier_restriction =",
          normalizedFilter
        );
        query = query.eq("tier_restriction", normalizedFilter);
      } else {
        console.log("[useOffers] No tier filter applied (showing all offers)");
      }

      console.log("[useOffers] Query:", JSON.stringify(query));

      const { data: offersData, error: offersError } = await query;

      if (offersError) {
        console.error("[useOffers] Supabase error:", offersError);
        throw new Error(`Failed to fetch offers: ${offersError.message}`);
      }

      console.log("[useOffers] Raw offers data:", offersData);

      // Fetch feedback to compute average ratings
      const { data: feedbackData, error: feedbackError } = await supabase
        .from("offer_feedback")
        .select("offer_id, rating");

      if (feedbackError) {
        console.error("[useOffers] Feedback error:", feedbackError);
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
        const tierRestriction =
          normalizeTier(offer.tier_restriction) || "Free Member";
        const isAccessible = canAccessTier(tierRestriction, userTier);
        console.log(
          `[useOffers] Offer: ${offer.title}, tier_restriction: ${tierRestriction}, userTier: ${userTier}, isAccessible: ${isAccessible}`
        );
        return {
          ...offer,
          tier_restriction: tierRestriction,
          averageRating,
          feedbackCount: ratings.length,
          isAccessible,
        };
      });

      console.log(
        "[useOffers] Enriched offers:",
        enrichedOffers.map((o) => ({
          id: o.id,
          title: o.title,
          tier: o.tier_restriction,
          created_at: o.created_at,
          isAccessible: o.isAccessible,
        }))
      );
      setOffers(enrichedOffers);
    } catch (err) {
      console.error("[useOffers] Detailed error:", err);
      setError(err.message);
      toast.error("Failed to load offers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log(
      "[useOffers] Effect triggered with filters.tier_restriction:",
      filters.tier_restriction,
      "User tier:",
      userTier
    );
    fetchOffers();
  }, [filters.tier_restriction, userTier]);

  return {
    offers,
    filterOptions,
    loading,
    error,
  };
};

export default useOffers;
