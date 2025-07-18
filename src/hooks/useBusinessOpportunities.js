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
    skills: null,
    budgetRange: null,
    remoteWork: null,
    estimatedDuration: null,
    tenderType: null,
  },
  user = null,
  fetchMode = "active" // 'all', 'expired', or 'active'
) => {
  const [opportunities, setOpportunities] = useState([]);
  const [filterOptions, setFilterOptions] = useState({
    countries: [],
    serviceTypes: [],
    industries: [],
    projectTypes: [],
    tiers: ["Associate Member", "Full Member", "Gold Member", "Free Member"],
    skills: [],
    budgetRanges: [],
    remoteWorkOptions: ["true", "false"],
    durations: [],
    tenderTypes: ["Regular", "Tender"],
    tenderCategories: [],
    tenderOrganizations: [],
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState(null);
  const [isInitialFetch, setIsInitialFetch] = useState(true);

  const jobType = user?.job_type?.toLowerCase();
  const isFreelancer = jobType === "freelancer";
  const isAgency = jobType === "agency";

  const jobTypeFilter = useMemo(() => {
    if (isFreelancer) return "Freelancer";
    if (isAgency) return "Agency";
    return "Agency"; // Default to Agency
  }, [isFreelancer, isAgency]);

  // Memoize the user job type to prevent unnecessary effect triggers
  const userJobType = useMemo(() => user?.job_type, [user?.job_type]);

  useEffect(() => {
    const fetchFilterOptions = async () => {
      if (!userJobType) {
       
        return;
      }

      setLoading(true);
      try {
        let query = supabase
          .from("business_opportunities")
          .select(
            "location, service_type, industry, project_type, tier_restriction, job_type, skills_required, budget_range, remote_work, estimated_duration, is_tender, tender_category, tender_organization"
          )
          .ilike("job_type", `%${jobTypeFilter}%`);

        const { data, error } = await query;

        if (error) {
          console.error("[Supabase] Filter options error:", error);
          throw new Error(`Failed to fetch filter options: ${error.message}`);
        }


        // Process filter options, handling null/undefined values
        const newFilterOptions = {
          countries: [
            ...new Set(
              data
                ?.map((item) =>
                  typeof item.location === "string" ? item.location.trim() : null
                )
                .filter(Boolean)
            ),
          ].sort(),
          serviceTypes: [
            ...new Set(
              data
                ?.map((item) =>
                  typeof item.service_type === "string"
                    ? item.service_type.trim()
                    : null
                )
                .filter(Boolean)
            ),
          ].sort(),
          industries: [
            ...new Set(
              data
                ?.map((item) =>
                  typeof item.industry === "string" ? item.industry.trim() : null
                )
                .filter(Boolean)
            ),
          ].sort(),
          projectTypes: [
            ...new Set(
              data
                ?.map((item) =>
                  typeof item.project_type === "string"
                    ? item.project_type.trim()
                    : null
                )
                .filter(Boolean)
            ),
          ].sort(),
          tiers: [
            ...new Set(
              data
                ?.map((item) =>
                  typeof item.tier_restriction === "string"
                    ? normalizeTier(item.tier_restriction.trim())
                    : null
                )
                .filter(Boolean)
            ),
            "Free Member",
          ].sort(),
          skills: [
            ...new Set(
              data
                ?.flatMap((item) =>
                  Array.isArray(item.skills_required)
                    ? item.skills_required.filter(Boolean)
                    : []
                )
                .filter(Boolean)
            ),
          ].sort(),
          budgetRanges: [
            ...new Set(
              data
                ?.map((item) =>
                  typeof item.budget_range === "string"
                    ? item.budget_range.trim()
                    : null
                )
                .filter(Boolean)
            ),
          ].sort(),
          remoteWorkOptions: ["true", "false"],
          durations: [
            ...new Set(
              data
                ?.map((item) =>
                  typeof item.estimated_duration === "string"
                    ? item.estimated_duration.trim()
                    : null
                )
                .filter(Boolean)
            ),
          ].sort(),
          tenderTypes: ["Regular", "Tender"],
          tenderCategories: [
            ...new Set(
              data
                ?.map((item) =>
                  typeof item.tender_category === "string"
                    ? item.tender_category.trim()
                    : null
                )
                .filter(Boolean)
            ),
          ].sort(),
          tenderOrganizations: [
            ...new Set(
              data
                ?.map((item) =>
                  typeof item.tender_organization === "string"
                    ? item.tender_organization.trim()
                    : null
                )
                .filter(Boolean)
            ),
          ].sort(),
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
  }, [jobTypeFilter, userJobType]);

  const fetchOpportunities = useCallback(
    debounce(
      async (currentFilters, currentJobTypeFilter, isInitial = false) => {
        if (fetching || !currentJobTypeFilter) return;

        setFetching(true);
        setLoading(true);
        const fetchStart = Date.now();
        console.log('[useBusinessOpportunities] Fetch started. Loading set to true.');
        console.log('[useBusinessOpportunities] Query params:', {
          filters: currentFilters,
          fetchMode,
          jobTypeFilter: currentJobTypeFilter,
        });

        try {
          setError(null);

          let query = supabase
            .from("business_opportunities")
            .select(
              "id, organization_name, gig_title, tender_title, description, tier_restriction, location, application_link, deadline, created_at, updated_at, service_type, industry, project_type, job_type, skills_required, estimated_duration, budget_range, remote_work, is_tender, tender_organization, tender_category, tender_issued, tender_closing, tender_access_link"
            );
          const today = new Date().toISOString().split("T")[0];
          if (fetchMode === "expired") {
            query = query.lt("deadline", today);
          } else if (fetchMode === "active") {
            query = query.gte("deadline", today);
          } // fetchMode === 'all' does not filter by deadline
          query = query.ilike("job_type", `%${currentJobTypeFilter}%`);

          // Apply filters
          if (currentFilters.country) {
            query = query.eq("location", currentFilters.country);
          }
          if (currentFilters.serviceType) {
            query = query.eq("service_type", currentFilters.serviceType);
          }
          if (currentFilters.industry) {
            query = query.eq("industry", currentFilters.industry);
          }
          if (currentFilters.projectType && isFreelancer) {
            // Only apply projectType filter for freelancers
            query = query.eq("project_type", currentFilters.projectType);
          }
          if (currentFilters.tier_restriction) {
            const normalizedFilter = normalizeTier(currentFilters.tier_restriction);
            const dbFilter = getDatabaseTier(normalizedFilter);
            query = query.eq("tier_restriction", dbFilter);
          }
          if (currentFilters.skills && isFreelancer) {
            query = query.contains("skills_required", [currentFilters.skills]);
          }
          if (currentFilters.budgetRange && isFreelancer) {
            query = query.eq("budget_range", currentFilters.budgetRange);
          }
          if (currentFilters.remoteWork && isFreelancer) {
            query = query.eq("remote_work", currentFilters.remoteWork === "true");
          }
          if (currentFilters.estimatedDuration && isFreelancer) {
            query = query.eq("estimated_duration", currentFilters.estimatedDuration);
          }
          if (currentFilters.tenderType) {
            if (currentFilters.tenderType === "Tender") {
              query = query.eq("is_tender", true);
            } else if (currentFilters.tenderType === "Regular") {
              query = query.eq("is_tender", false);
            }
          }

          const { data, error } = await query;

          if (error) {
            console.error("[Supabase] Fetch opportunities error:", error);
            throw new Error(`Failed to fetch opportunities: ${error.message}`);
          }

          console.log('[useBusinessOpportunities] Data received:', data);

          const userTierNormalized = normalizeTier(user?.selected_tier || "Free Member");
          const tierHierarchy = [
            "Gold Member",
            "Full Member",
            "Associate Member",
            "Free Member",
          ];

          const transformedData = (data || []).map((opp) => {
            const tierRestriction = normalizeTier(opp.tier_restriction) || "Free Member";
            const isAccessible = hasTierAccess(tierRestriction, user);
            return {
              ...opp,
              tier_restriction: tierRestriction,
              isAccessible,
              job_type: opp.job_type || "Uncategorized",
            };
          });

          let sortedData;
          if (fetchMode === "all") {
            const todayStr = new Date().toISOString().split("T")[0];
            const active = transformedData.filter(opp => opp.deadline >= todayStr);
            const expired = transformedData.filter(opp => opp.deadline < todayStr);
            // Sort each group by created_at descending
            active.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            expired.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            sortedData = [...active, ...expired];
          } else {
            sortedData = transformedData.sort((a, b) => {
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
          }

          setOpportunities(sortedData);
          console.log('[useBusinessOpportunities] Opportunities set:', sortedData.length);
        } catch (err) {
          console.error("[useBusinessOpportunities] Unexpected error:", err);
          setError("An unexpected error occurred: " + err.message);
        } finally {
          setFetching(false);
          setLoading(false);
          const fetchEnd = Date.now();
          console.log('[useBusinessOpportunities] Fetch finished. Loading set to false. Time taken:', fetchEnd - fetchStart, 'ms');
          if (isInitial) setIsInitialFetch(false);
        }
      },
      300
    ),
    [user, fetchMode]
  );

  useEffect(() => {
    if (!jobTypeFilter || !user?.job_type) {
      return;
    }

    fetchOpportunities(filters, jobTypeFilter, isInitialFetch);

    return () => {
      fetchOpportunities.cancel();
    };
  }, [
    filters.country,
    filters.serviceType,
    filters.industry,
    filters.projectType,
    filters.tier_restriction,
    filters.skills,
    filters.budgetRange,
    filters.remoteWork,
    filters.estimatedDuration,
    filters.tenderType,
    jobTypeFilter,
    fetchOpportunities,
    isInitialFetch,
    fetchMode,
  ]);

  return {
    opportunities,
    filterOptions,
    loading,
    error,
  };
};