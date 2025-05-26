import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import debounce from "lodash.debounce";

export const useBusinessOpportunities = (filters = {}) => {
  const [opportunities, setOpportunities] = useState([]);
  const [filterOptions, setFilterOptions] = useState({
    countries: [],
    serviceTypes: [],
    industries: [],
    projectTypes: [],
    tiers: [],
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState(null);
  const [isInitialFetch, setIsInitialFetch] = useState(true);

  useEffect(() => {
    const fetchFilterOptions = async () => {
      setLoading(true);
      try {
        const [
          countriesRes,
          serviceTypesRes,
          industriesRes,
          projectTypesRes,
          tiersRes,
        ] = await Promise.all([
          supabase
            .from("business_opportunities")
            .select("location")
            .order("location"),
          supabase
            .from("business_opportunities")
            .select("service_type")
            .order("service_type"),
          supabase
            .from("business_opportunities")
            .select("industry")
            .order("industry"),
          supabase
            .from("business_opportunities")
            .select("project_type")
            .order("project_type"),
          supabase
            .from("business_opportunities")
            .select("tier_restriction")
            .order("tier_restriction"), // Updated to tier_restriction
        ]);

        const newFilterOptions = {
          countries: [
            ...new Set(
              countriesRes.data?.map((item) => item.location?.trim()) || []
            ),
          ]
            .filter(Boolean)
            .slice(0, 10),
          serviceTypes: [
            ...new Set(
              serviceTypesRes.data?.map((item) => item.service_type?.trim()) ||
                []
            ),
          ]
            .filter(Boolean)
            .slice(0, 10),
          industries: [
            ...new Set(
              industriesRes.data?.map((item) => item.industry?.trim()) || []
            ),
          ]
            .filter(Boolean)
            .slice(0, 10),
          projectTypes: [
            ...new Set(
              projectTypesRes.data?.map((item) => item.project_type?.trim()) ||
                []
            ),
          ]
            .filter(Boolean)
            .slice(0, 10),
          tiers: [
            ...new Set(
              tiersRes.data?.map((item) => item.tier_restriction?.trim()) || []
            ),
          ]
            .filter(Boolean)
            .slice(0, 10),
        };

        setFilterOptions(newFilterOptions);
      } catch (err) {
        console.error("Error fetching filter options:", err);
        setError("Failed to fetch filter options.");
      } finally {
        setLoading(false);
      }
    };

    fetchFilterOptions();
  }, []);

  const fetchOpportunities = useMemo(
    () =>
      debounce(async (currentFilters, isInitial = false) => {
        if (fetching) return;
        setFetching(true);
        if (isInitial) setLoading(true);
        try {
          setError(null);

          let query = supabase
            .from("business_opportunities")
            .select("*")
            .gte("deadline", new Date().toISOString().split("T")[0]);

          if (currentFilters.country)
            query = query.eq("location", currentFilters.country);
          if (currentFilters.serviceType)
            query = query.eq("service_type", currentFilters.serviceType);
          if (currentFilters.industry)
            query = query.eq("industry", currentFilters.industry);
          if (currentFilters.projectType)
            query = query.eq("project_type", currentFilters.projectType);
          if (currentFilters.tier)
            query = query.eq("tier_restriction", currentFilters.tier); // Updated to tier_restriction

          const { data, error } = await query;

          if (error) {
            console.error("Error fetching opportunities:", error.message);
            setError(`Failed to fetch opportunities: ${error.message}`);
            setFetching(false);
            if (isInitial) setLoading(false);
            return;
          }

          setOpportunities(data || []);
        } catch (err) {
          console.error("Unexpected error:", err);
          setError(
            "An unexpected error occurred while fetching opportunities."
          );
        } finally {
          setFetching(false);
          if (isInitial) setLoading(false);
          if (isInitial) setIsInitialFetch(false);
        }
      }, 300),
    []
  );

  useEffect(() => {
    fetchOpportunities(filters, isInitialFetch);
  }, [
    filters.country,
    filters.serviceType,
    filters.industry,
    filters.projectType,
    filters.tier,
    fetchOpportunities,
  ]);

  return { opportunities, filterOptions, loading, error };
};
