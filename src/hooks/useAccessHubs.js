import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { hasTierAccess, normalizeTier } from "@/utils/tierUtils";
import toast from "react-hot-toast";

const useAccessHubs = (
  filters = { spaceType: "", tier_restriction: "", city: "", country: "", is_available: "", pricing_range: "" },
  user = { selected_tier: "Free Member" }
) => {
  const [accessHubs, setAccessHubs] = useState([]);
  const [registeredAccessHubs, setRegisteredAccessHubs] = useState([]);
  const [filterOptions, setFilterOptions] = useState({
    spaceTypes: [],
    tiers: [],
    cities: [],
    countries: [],
    availability: ["Available", "Unavailable"],
    pricingRanges: ["$0-50", "$51-100", "$101-200", "$201-500", "$500+"]
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [accessHubsLoading, setAccessHubsLoading] = useState([]);

  const fetchAccessHubs = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from("access_hubs")
        .select(
          "id, title, description, is_available, images, amenities, capacity, pricing_per_day,space_type, city, country, tier_restriction, updated_at"
        )
        .order("updated_at", { ascending: true });

      if (filters.spaceType) {
        query = query.eq("space_type", filters.spaceType);
      }

      if (filters.city) {
        query = query.eq("city", filters.city);
      }

      if (filters.country) {
        query = query.eq("country", filters.country);
      }

      if (filters.is_available !== "") {
        query = query.eq("is_available", filters.is_available === "Available");
      }

      const { data: accessHubsData, error: accessHubsError } = await query;
      if (accessHubsError) {
        console.error("[useAccessHubs] Error fetching access hubs:", accessHubsError);
        throw new Error("Failed to fetch access hubs");
      }

      let filteredAccessHubs = (accessHubsData || []).filter((accessHub) => {
        if (!filters.tier_restriction) return true;
        const accessHubTier = accessHub.tier_restriction || "Free Member";
        return hasTierAccess(accessHubTier, { selected_tier: filters.tier_restriction });
      });

      // Filter by pricing range
      if (filters.pricing_range) {
        filteredAccessHubs = filteredAccessHubs.filter((accessHub) => {
          const price = accessHub.pricing_per_day || 0;
          switch (filters.pricing_range) {
            case "$0-50":
              return price >= 0 && price <= 50;
            case "$51-100":
              return price >= 51 && price <= 100;
            case "$101-200":
              return price >= 101 && price <= 200;
            case "$201-500":
              return price >= 201 && price <= 500;
            case "$500+":
              return price >= 501;
            default:
              return true;
          }
        });
      }

      const transformedAccessHubs = filteredAccessHubs.map((accessHub) => ({
        ...accessHub,
        tier_restriction: normalizeTier(accessHub.tier_restriction) || "Free Member",
        isAccessible: hasTierAccess(
          accessHub.tier_restriction || "Free Member",
          user
        ),
        date: accessHub.start_date,
      }));

      const { data: allAccessHubs, error: allAccessHubsError } = await supabase
        .from("access_hubs")
        .select("space_type, tier_restriction, city, country, pricing_per_day");
      if (allAccessHubsError) {
        console.error(
          "[useAccessHubs] Error fetching filter options:",
          allAccessHubsError
        );
        throw new Error("Failed to fetch filter options");
      }

      const spaceTypes = [
        ...new Set(allAccessHubs.map((e) => e.space_type).filter(Boolean)),
      ].sort();
      const tiers = [
        ...new Set(
          allAccessHubs
            .filter((e) =>
              hasTierAccess(e.tier_restriction || "Free Member", user)
            )
            .map((e) => normalizeTier(e.tier_restriction || "Free Member"))
        ),
      ].sort();
      const cities = [
        ...new Set(allAccessHubs.map((e) => e.city).filter(Boolean)),
      ].sort();
      const countries = [
        ...new Set(allAccessHubs.map((e) => e.country).filter(Boolean)),
      ].sort();

      setAccessHubs(transformedAccessHubs);
      setFilterOptions({ 
        spaceTypes, 
        tiers, 
        cities, 
        countries,
        availability: ["Available", "Unavailable"],
        pricingRanges: ["$0-50", "$51-100", "$101-200", "$201-500", "$500+"]
      });
    } catch (err) {
      console.error("[useAccessHubs] Error:", err);
      setError(err.message);
      toast.error("Failed to load access hubs");
    } finally {
      setLoading(false);
    }
  };

  const fetchRegisteredAccessHubs = async () => {
    try {
      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError || !authUser) {
        console.warn(
          "[useAccessHubs] No authenticated user, skipping registered access hubs"
        );
        setRegisteredAccessHubs([]);
        return;
      }

      const { data: candidate, error: candidateError } = await supabase
        .from("candidates")
        .select("id")
        .eq("auth_user_id", authUser.id)
        .single();

      if (candidateError || !candidate) {
        console.error("[useAccessHubs] Candidate not found for user:", authUser.id);
        throw new Error("Candidate not found for this user");
      }

      const { data: registrations, error: regError } = await supabase
        .from("access_hub_registrations")
        .select(
          `
          id,
          access_hub_id,
          user_id,
          registered_at,
          status,
          access_hubs (
            id,
            title,
            description,
            space_type,
            city,
            country,
            tier_restriction
          )
        `
        )
        .eq("user_id", candidate.id)
        .order("registered_at", { ascending: false });

      if (regError) {
        console.error("[useAccessHubs] Registration fetch error:", regError);
        throw regError;
      }

      const registeredAccessHubsData = registrations.map((reg) => ({
        ...reg.access_hubs,
        access_hub_id: reg.access_hub_id,
        registration_id: reg.id,
        status: reg.status,
        registered_at: reg.registered_at,
        tier_restriction: normalizeTier(reg.access_hubs.tier_restriction) || "Free Member",
        date: reg.access_hubs.start_date,
      }));

      setRegisteredAccessHubs(registeredAccessHubsData || []);
    } catch (err) {
      console.error("[useAccessHubs] Error fetching registered access hubs:", err);
      toast.error("Failed to load registered access hubs");
      setRegisteredAccessHubs([]);
    }
  };

  const handleAccessHubRegistration = async (accessHubId) => {
    try {
      setAccessHubsLoading((prev) => [...prev, accessHubId]);
      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError || !authUser) {
        throw new Error("User not authenticated");
      }

      const { data: candidate, error: candidateError } = await supabase
        .from("candidates")
        .select("id")
        .eq("auth_user_id", authUser.id)
        .single();

      if (candidateError || !candidate) {
        throw new Error("Candidate not found for this user");
      }

      const candidateId = candidate.id;

      const { data: existingRegistrations, error: checkError } = await supabase
        .from("access_hub_registrations")
        .select("id")
        .eq("access_hub_id", accessHubId)
        .eq("user_id", candidateId);

      if (checkError) {
        throw checkError;
      }

      if (existingRegistrations && existingRegistrations.length > 0) {
        toast.error("You are already registered for this access hub");
        return;
      }

      const { error: insertError } = await supabase
        .from("access_hub_registrations")
        .insert({
          access_hub_id: accessHubId,
          user_id: candidateId,
          registered_at: new Date().toISOString(),
          status: "pending",
        });

      if (insertError) {
        throw insertError;
      }

      const accessHub = accessHubs.find((e) => e.id === accessHubId);
      toast.success("Your registration request has been sent to PAAN. We will contact you shortly.");
      await fetchRegisteredAccessHubs();
    } catch (error) {
      console.error("[useAccessHubs] Error registering for access hub:", error);
      toast.error(`Failed to register: ${error.message}`);
    } finally {
      setAccessHubsLoading((prev) => prev.filter((id) => id !== accessHubId));
    }
  };

  useEffect(() => {
    fetchAccessHubs();
    fetchRegisteredAccessHubs();
  }, [filters.spaceType, filters.tier_restriction, filters.city, filters.country, filters.is_available, filters.pricing_range]);

  return {
    accessHubs,
    registeredAccessHubs,
    filterOptions,
    loading,
    error,
    accessHubsLoading,
    handleAccessHubRegistration,
  };
};

export default useAccessHubs;