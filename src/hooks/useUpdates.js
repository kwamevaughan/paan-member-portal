import { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabase";

const useUpdates = (filters = { tags: "All" }, user = null) => {
  console.log("[useUpdates] Mount");
  console.log("[useUpdates] Render with filters:", filters, "User:", user);
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
  const [loading, setLoading] = useState(false); // Start with false to avoid initial flicker
  const [error, setError] = useState(null);

  // Debounce function to limit fetch calls
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
      "User:",
      user
    );
    try {
      // Log Supabase session
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

      const { data: updatesData, error: updatesError } = await query;

      if (updatesError) {
        console.error(
          "[useUpdates] Error fetching updates:",
          updatesError.message
        );
        throw new Error(`Failed to fetch updates: ${updatesError.message}`);
      }

      console.log("[useUpdates] Fetched updates:", updatesData);
      setUpdates(updatesData || []);
    } catch (err) {
      console.error("[useUpdates] Error:", err.message);
      setError(err.message);
      toast.error("Failed to load updates");
    } finally {
      setLoading(false);
    }
  };

  // Debounced fetch
  const debouncedFetchUpdates = debounce(fetchUpdates, 500);

  useEffect(() => {
    console.log(
      "[useUpdates] Effect triggered with filters.tags:",
      filters.tags
    );
    debouncedFetchUpdates();
  }, [filters.tags]);

  // Log state changes
  useEffect(() => {
    console.log("[useUpdates] Updates state:", updates);
  }, [updates]);

  useEffect(() => {
    console.log("[useUpdates] Loading state:", loading);
  }, [loading]);

  useEffect(() => {
    console.log("[useUpdates] Error state:", error);
  }, [error]);

  // Memoize returned values
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
