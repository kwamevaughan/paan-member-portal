import { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabase";
import { canAccessTier } from "@/utils/tierUtils";

const useUpdates = (filters = { tags: "All" }, userTier = "Free Member") => {
  
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
    
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

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
        
        return {
          ...update,
          tier_restriction: tierRestriction,
          isAccessible,
        };
      });

      
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
    
    debouncedFetchUpdates();
  }, [filters.tags, userTier]);

  

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
