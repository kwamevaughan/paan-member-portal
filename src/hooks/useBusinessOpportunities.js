import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import debounce from "lodash.debounce";
import { canAccessTier } from "@/utils/tierUtils";
import { normalizeTier, getDatabaseTier } from "@/components/Badge";

export const useBusinessOpportunities = (
  filters = {
    country: "",
    serviceType: "",
    industry: "",
    projectType: "",
    tier_restriction: "",
  },
  userTier = "Free Member"
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
            .order("tier_restriction"),
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
              tiersRes.data?.map((item) =>
                normalizeTier(item.tier_restriction?.trim())
              ) || []
            ),
          ]
            .filter(Boolean)
            .slice(0, 10),
        };

        console.log(
          "[useBusinessOpportunities] Filter options:",
          newFilterOptions
        );
        setFilterOptions(newFilterOptions);
      } catch (err) {
        console.error(
          "[useBusinessOpportunities] Error fetching filter options:",
          err
        );
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

          console.log(
            "[useBusinessOpportunities] Fetching with filters:",
            currentFilters,
            "User tier:",
            userTier
          );

          let query = supabase
            .from("business_opportunities")
            .select(
              "id, title, description, tier_restriction, location, application_link, deadline, created_at, service_type, industry, project_type"
            )
            .gte("deadline", new Date().toISOString().split("T")[0]);

          if (currentFilters.country) {
            console.log(
              "[useBusinessOpportunities] Applying filter: country =",
              currentFilters.country
            );
            query = query.eq("location", currentFilters.country);
          }
          if (currentFilters.serviceType) {
            console.log(
              "[useBusinessOpportunities] Applying filter: service_type =",
              currentFilters.serviceType
            );
            query = query.eq("service_type", currentFilters.serviceType);
          }
          if (currentFilters.industry) {
            console.log(
              "[useBusinessOpportunities] Applying filter: industry =",
              currentFilters.industry
            );
            query = query.eq("industry", currentFilters.industry);
          }
          if (currentFilters.projectType) {
            console.log(
              "[useBusinessOpportunities] Applying filter: project_type =",
              currentFilters.projectType
            );
            query = query.eq("project_type", currentFilters.projectType);
          }
          if (
            currentFilters.tier_restriction &&
            currentFilters.tier_restriction !== ""
          ) {
            const normalizedFilter = normalizeTier(
              currentFilters.tier_restriction
            );
            const dbFilter = getDatabaseTier(normalizedFilter);
            console.log(
              "[useBusinessOpportunities] Applying filter: tier_restriction =",
              dbFilter,
              "(normalized:",
              normalizedFilter,
              ")"
            );
            query = query.eq("tier_restriction", dbFilter);
          }

          console.log(
            "[useBusinessOpportunities] Query:",
            JSON.stringify(query)
          );

          const { data, error } = await query;

          if (error) {
            console.error("[useBusinessOpportunities] Supabase error:", error);
            throw new Error(`Failed to fetch opportunities: ${error.message}`);
          }

          console.log(
            "[useBusinessOpportunities] Raw opportunities data:",
            data
          );

          // Transform and sort data
          const userTierNormalized = normalizeTier(userTier);
          const tierHierarchy = [
            "Gold Member",
            "Full Member",
            "Associate Member",
            "Free Member",
          ];
          const transformedData = (data || []).map((opp) => {
            const tierRestriction =
              normalizeTier(opp.tier_restriction) || "Free Member";
            const isAccessible = canAccessTier(tierRestriction, userTier);
            console.log(
              `[useBusinessOpportunities] Opportunity: ${opp.title}, tier_restriction: ${tierRestriction}, userTier: ${userTier}, isAccessible: ${isAccessible}`
            );
            return {
              ...opp,
              tier_restriction: tierRestriction,
              isAccessible,
            };
          });

          // Sort: exact tier match first, then other accessible, then restricted
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
                console.log(
                  `[useBusinessOpportunities] Comparing ${
                    a.title
                  } (exact: ${aIsExact}) vs ${
                    b.title
                  } (exact: ${bIsExact}) -> ${aIsExact ? "a first" : "b first"}`
                );
                return aIsExact ? -1 : 1;
              }
              // Both same precedence, sort by created_at
              console.log(
                `[useBusinessOpportunities] Both accessible, same precedence: ${a.title} vs ${b.title}, sorting by created_at`
              );
              return new Date(b.created_at) - new Date(a.created_at);
            }

            if (a.isAccessible !== b.isAccessible) {
              console.log(
                `[useBusinessOpportunities] Comparing ${a.title} (access: ${
                  a.isAccessible
                }) vs ${b.title} (access: ${b.isAccessible}) -> ${
                  a.isAccessible ? "a first" : "b first"
                }`
              );
              return a.isAccessible ? -1 : 1;
            }

            // Both restricted, sort by created_at
            console.log(
              `[useBusinessOpportunities] Both restricted: ${a.title} vs ${b.title}, sorting by created_at`
            );
            return new Date(b.created_at) - new Date(a.created_at);
          });

          console.log(
            "[useBusinessOpportunities] Sorted opportunities:",
            sortedData.map((o) => ({
              id: o.id,
              title: o.title,
              tier: o.tier_restriction,
              country: o.location,
              isAccessible: o.isAccessible,
            }))
          );

          setOpportunities(sortedData);
        } catch (err) {
          console.error("[useBusinessOpportunities] Unexpected error:", err);
          setError(
            "An unexpected error occurred while fetching opportunities."
          );
        } finally {
          setFetching(false);
          if (isInitial) setLoading(false);
          if (isInitial) setIsInitialFetch(false);
        }
      }, 300),
    [userTier]
  );

  useEffect(() => {
    console.log(
      "[useBusinessOpportunities] Effect triggered - Filters:",
      filters,
      "UserTier:",
      userTier
    );
    fetchOpportunities(filters, isInitialFetch);
  }, [
    filters.country,
    filters.serviceType,
    filters.industry,
    filters.projectType,
    filters.tier_restriction,
    fetchOpportunities,
  ]);

  return { opportunities, filterOptions, loading, error };
};
