import { useState, useEffect, useMemo, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import debounce from "lodash.debounce";
import { hasTierAccess, normalizeTier } from "@/utils/tierUtils";
import { getDatabaseTier } from "@/components/Badge";

export const useBusinessOpportunities = (
  filters = {
    country: null,
    serviceType: null,
    industry: null,
    projectType: null,
    tier_restriction: null,
  },
  user = null
) => {
  const [opportunities, setOpportunities] = useState([]);
  const [filterOptions, setFilterOptions] = useState({
    countries: [],
    serviceTypes: [],
    industries: [],
    projectTypes: [],
    tiers: ["Associate Member", "Full Member", "Gold Member", "Free Member"],
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState(null);
  const [isInitialFetch, setIsInitialFetch] = useState(true);

  const jobType = user?.job_type?.toLowerCase();
  const isFreelancer = jobType === "freelancer";
  const isAgency = jobType === "agency";

  // Memoize the job type filter to prevent unnecessary re-renders
  const jobTypeFilter = useMemo(() => {
    if (isFreelancer) return "Freelancer";
    if (isAgency) return "Agency";
    return "Agency"; // Default to Agency
  }, [isFreelancer, isAgency]);

  // Fetch filter options only when user job type changes
  useEffect(() => {
    const fetchFilterOptions = async () => {
      if (!user?.job_type) {
        
        return;
      }

      setLoading(true);
      try {
        let query = supabase
          .from("business_opportunities")
          .select(
            "location, service_type, industry, project_type, tier_restriction, job_type"
          )
          .ilike("job_type", jobTypeFilter);

        const { data, error } = await query;
        

        if (error) {
          console.error("[Supabase] Filter options error:", error);
          throw new Error(`Failed to fetch filter options: ${error.message}`);
        }

        const newFilterOptions = {
          countries: [
            ...new Set(data?.map((item) => item.location?.trim()) || []),
            ...(isFreelancer ? ["Remote"] : []),
          ].filter(Boolean),
          serviceTypes: [
            ...new Set(data?.map((item) => item.service_type?.trim()) || []),
          ].filter(Boolean),
          industries: [
            ...new Set(data?.map((item) => item.industry?.trim()) || []),
          ].filter(Boolean),
          projectTypes: [
            ...new Set(data?.map((item) => item.project_type?.trim()) || []),
            ...(isFreelancer ? ["Graphic Design Project"] : []),
          ].filter(Boolean),
          tiers: [
            ...new Set(
              data?.map((item) =>
                normalizeTier(item.tier_restriction?.trim())
              ) || []
            ),
            "Free Member",
          ].filter(Boolean),
        };

        
        setFilterOptions(newFilterOptions);
      } catch (err) {
        console.error(
          "[useBusinessOpportunities] Error fetching filter options:",
          err
        );
        setError("Failed to fetch filter options: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFilterOptions();
  }, [jobTypeFilter, user?.job_type]); // Only depend on jobTypeFilter and user.job_type

  // Stable debounced fetch function
  const fetchOpportunities = useCallback(
    debounce(
      async (currentFilters, currentJobTypeFilter, isInitial = false) => {
        if (fetching || !currentJobTypeFilter) return;

        setFetching(true);
        if (isInitial) setLoading(true);

        try {
          setError(null);
          

          let query = supabase
            .from("business_opportunities")
            .select(
              "id, title, description, tier_restriction, location, application_link, deadline, created_at, updated_at, service_type, industry, project_type, job_type, skills_required, estimated_duration, budget_range, remote_work"
            )
            .gte("deadline", new Date().toISOString().split("T")[0])
            .ilike("job_type", currentJobTypeFilter);

          // Apply filters only if explicitly set
          if (currentFilters.country) {
            query = query.eq("location", currentFilters.country);
          }
          if (currentFilters.serviceType) {
            query = query.eq("service_type", currentFilters.serviceType);
          }
          if (currentFilters.industry) {
            query = query.eq("industry", currentFilters.industry);
          }
          if (currentFilters.projectType) {
            query = query.eq("project_type", currentFilters.projectType);
          }
          if (currentFilters.tier_restriction) {
            const normalizedFilter = normalizeTier(
              currentFilters.tier_restriction
            );
            const dbFilter = getDatabaseTier(normalizedFilter);
            query = query.eq("tier_restriction", dbFilter);
          }

          const { data, error } = await query;
          

          if (error) {
            console.error("[Supabase] Fetch opportunities error:", error);
            throw new Error(`Failed to fetch opportunities: ${error.message}`);
          }

          const userTierNormalized = normalizeTier(
            user?.selected_tier || "Free Member"
          );
          const tierHierarchy = [
            "Gold Member",
            "Full Member",
            "Associate Member",
            "Free Member",
          ];

          const transformedData = (data || []).map((opp) => {
            const tierRestriction =
              normalizeTier(opp.tier_restriction) || "Free Member";
            const isAccessible = hasTierAccess(tierRestriction, user);
            return {
              ...opp,
              tier_restriction: tierRestriction,
              isAccessible,
              job_type: opp.job_type || "Uncategorized",
            };
          });

          const sortedData = transformedData.sort((a, b) => {
            const aTier = normalizeTier(a.tier_restriction);
            const bTier = normalizeTier(b.tier_restriction);
            const aIndex = tierHierarchy.indexOf(aTier);
            const bIndex = tierHierarchy.indexOf(bTier);
            const userIndex = tierHierarchy.indexOf(userTierNormalized);

            if (a.isAccessible && b.isAccessible) {
              const aIsExact = aIndex === userIndex;
              const bIsExact = bIndex === userIndex;
              if (aIsExact !== bIsExact) {
                return aIsExact ? -1 : 1;
              }
              return new Date(b.created_at) - new Date(a.created_at);
            }

            if (a.isAccessible !== b.isAccessible) {
              return a.isAccessible ? -1 : 1;
            }

            return new Date(b.created_at) - new Date(a.created_at);
          });

          
          setOpportunities(sortedData);
        } catch (err) {
          console.error("[useBusinessOpportunities] Unexpected error:", err);
          setError("An unexpected error occurred: " + err.message);
        } finally {
          setFetching(false);
          setLoading(false);
          if (isInitial) setIsInitialFetch(false);
        }
      },
      300
    ),
    [user] // Only depend on user object
  );

  // Fetch opportunities when filters or job type change
  useEffect(() => {
    if (!jobTypeFilter || !user?.job_type) {
      console.log(
        "[useBusinessOpportunities] Skipping fetch - no job type filter or user"
      );
      return;
    }

    

    fetchOpportunities(filters, jobTypeFilter, isInitialFetch);

    // Cleanup function
    return () => {
      fetchOpportunities.cancel();
    };
  }, [
    filters.country,
    filters.serviceType,
    filters.industry,
    filters.projectType,
    filters.tier_restriction,
    jobTypeFilter,
    fetchOpportunities,
    isInitialFetch,
  ]);

  return {
    opportunities,
    filterOptions,
    loading,
    error,
  };
};
