import { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabase";
import { canAccessTier } from "@/utils/tierUtils";

const useUpdates = (filters = { tags: "All" }, userTier = "Free Member") => {
  console.log(
    "[useUpdates] Mount with filters:",
    filters,
    "User tier:",
    userTier
  );
  const [updates, setUpdates] = useState([]);
  const [filterOptions] = useState({
    tags: [
      "All",
      "Governance",
      "Member Spotlights",
      "Global Partnerships",
      "Regional Growth",
    ],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  const fetchUpdates = async () => {
    console.log(
      "[useUpdates] Fetching updates with filters:",
      filters,
      "User tier:",
      userTier
    );
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      console.log("[useUpdates] Supabase session:", session);

      setLoading(true);
      setError(null);

      let query = supabase
        .from("updates")
        .select(
          "id, title, description, category, cta_text, cta_url, tier_restriction, tags, created_at, updated_at"
        )
        .order("created_at", { ascending: false });

      if (filters.tags && filters.tags !== "All") {
        query = query.contains("tags", [filters.tags]);
      }

      console.log("[useUpdates] Query:", JSON.stringify(query));

      const { data: updatesData, error: updatesError } = await query;

      if (updatesError) {
        console.error(
          "[useUpdates] Error fetching updates:",
          updatesError.message
        );
        throw new Error(`Failed to fetch updates: ${updatesError.message}`);
      }

      const transformedUpdates = (updatesData || []).map((update) => {
        const tierRestriction = update.tier_restriction || "Free Member";
        const isAccessible = canAccessTier(tierRestriction, userTier);
        console.log(
          `[useUpdates] Update: ${update.title}, tier_restriction: ${tierRestriction}, userTier: ${userTier}, isAccessible: ${isAccessible}`
        );
        return {
          ...update,
          tier_restriction: tierRestriction,
          isAccessible,
        };
      });

      console.log(
        "[useUpdates] Fetched updates:",
        transformedUpdates.map((u) => ({
          id: u.id,
          title: u.title,
          tier: u.tier_restriction,
          created_at: u.created_at,
          isAccessible: u.isAccessible,
        }))
      );
      setUpdates(transformedUpdates);
    } catch (err) {
      console.error("[useUpdates] Error:", err.message);
      setError(err.message);
      toast.error("Failed to load updates");
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchUpdates = debounce(fetchUpdates, 500);

  useEffect(() => {
    console.log(
      "[useUpdates] Effect triggered with filters.tags:",
      filters.tags,
      "User tier:",
      userTier
    );
    debouncedFetchUpdates();
  }, [filters.tags, userTier]);

  useEffect(() => {
    console.log("[useUpdates] Updates state:", updates);
  }, [updates]);

  useEffect(() => {
    console.log("[useUpdates] Loading state:", loading);
  }, [loading]);

  useEffect(() => {
    console.log("[useUpdates] Error state:", error);
  }, [error]);

  return useMemo(
    () => ({
      updates,
      filterOptions,
      loading,
      error,
    }),
    [updates, filterOptions, loading, error]
  );
};

export default useUpdates;
