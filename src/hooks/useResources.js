import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabase";

const useResources = (
  filters = { resource_type: "", tier_restriction: "" }
) => {
  const [resources, setResources] = useState([]);
  const [filterOptions, setFilterOptions] = useState({
    resource_types: ["PDF", "Video", "Workshop"],
    tier_restrictions: ["All", "Associate", "Full", "Gold", "Free"],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchResources = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from("resources")
        .select(
          "id, title, description, resource_type, tier_restriction, url, file_path, video_url, created_at, updated_at"
        )
        .order("created_at", { ascending: false });

      // Apply filters
      if (filters.resource_type) {
        query = query.eq("resource_type", filters.resource_type);
      }
      if (filters.tier_restriction && filters.tier_restriction !== "All") {
        query = query.eq("tier_restriction", filters.tier_restriction);
      }

      const { data: resourcesData, error: resourcesError } = await query;
      if (resourcesError)
        throw new Error(`Failed to fetch resources: ${resourcesError.message}`);

      console.log("[useResources] Fetched resources:", resourcesData);
      setResources(resourcesData || []);
    } catch (err) {
      console.error("[useResources] Error fetching resources:", err);
      setError(err.message);
      toast.error("Failed to load resources");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [filters.resource_type, filters.tier_restriction]);

  return {
    resources,
    filterOptions,
    loading,
    error,
  };
};

export default useResources;
