import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabase";

const useResources = (
  filters = { resource_type: "", tier_restriction: "" }
) => {
  const [resources, setResources] = useState([]);
  const [filterOptions, setFilterOptions] = useState({
    resource_types: [],
    tier_restrictions: [
      "Free Member",
      "Associate Member",
      "Full Member",
      "Gold Member",
    ],
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
      setResources(resourcesData || []);

      // Update filter options based on actual data
      if (resourcesData && resourcesData.length > 0) {
        const uniqueTypes = [...new Set(resourcesData.map(r => r.resource_type).filter(Boolean))];
        setFilterOptions(prev => ({
          ...prev,
          resource_types: uniqueTypes
        }));
      }
    } catch (err) {
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
