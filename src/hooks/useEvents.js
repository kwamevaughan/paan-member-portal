import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { normalizeTier, hasTierAccess } from "@/utils/tierUtils";
import toast from "react-hot-toast";

// Helper function to find user in either candidates or hr_users table
const findUserInTables = async (authUserId) => {
  try {
    // First, try to find user in candidates table
    const { data: candidateData, error: candidateError } = await supabase
      .from("candidates")
      .select("id")
      .eq("auth_user_id", authUserId)
      .single();

    if (candidateData && !candidateError) {
      return {
        id: candidateData.id,
        userType: 'candidate'
      };
    }

    // If not found in candidates, try hr_users table
    const { data: hrUserData, error: hrUserError } = await supabase
      .from("hr_users")
      .select("id")
      .eq("id", authUserId)
      .single();

    if (hrUserData && !hrUserError) {
      return {
        id: hrUserData.id,
        userType: 'hr_user'
      };
    }

    // User not found in either table
    return null;
  } catch (error) {
    console.error("Error finding user in tables:", error);
    return null;
  }
};

const useEvents = (
  filters = { eventType: "", tier: "" },
  user = { selected_tier: "Free Member" }
) => {
  const [events, setEvents] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [filterOptions, setFilterOptions] = useState({
    eventTypes: [],
    tiers: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [eventsLoading, setEventsLoading] = useState([]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from("events")
        .select(
          "id, title, description, start_date, end_date, location, event_type, tier_restriction, updated_at, is_virtual, registration_link, banner_image"
        )
        .gte("start_date", new Date().toISOString())
        .order("start_date", { ascending: true });

      if (filters.eventType) {
        query = query.eq("event_type", filters.eventType);
      }

      const { data: eventsData, error: eventsError } = await query;
      if (eventsError) {
        console.error("[useEvents] Error fetching events:", eventsError);
        throw new Error("Failed to fetch events");
      }

      const filteredEvents = (eventsData || []).filter((event) => {
        if (!filters.tier) return true;
        const eventTier = event.tier_restriction || "Free Member";
        return hasTierAccess(eventTier, { selected_tier: filters.tier });
      });

      const transformedEvents = filteredEvents.map((event) => ({
        ...event,
        tier_restriction: normalizeTier(event.tier_restriction) || "Free Member",
        isAccessible: hasTierAccess(
          event.tier_restriction || "Free Member",
          user
        ),
        date: event.start_date,
      }));

      const { data: allEvents, error: allEventsError } = await supabase
        .from("events")
        .select("event_type, tier_restriction");
      if (allEventsError) {
        console.error(
          "[useEvents] Error fetching filter options:",
          allEventsError
        );
        throw new Error("Failed to fetch filter options");
      }

      const eventTypes = [
        ...new Set(allEvents.map((e) => e.event_type)),
      ].sort();
      const tiers = [
        ...new Set(
          allEvents
            .filter((e) =>
              hasTierAccess(e.tier_restriction || "Free Member", user)
            )
            .map((e) => normalizeTier(e.tier_restriction || "Free Member"))
        ),
      ].sort();

      setEvents(transformedEvents);
      setFilterOptions({ eventTypes, tiers });
    } catch (err) {
      console.error("[useEvents] Error:", err);
      setError(err.message);
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  const fetchRegisteredEvents = async () => {
    try {
      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError || !authUser) {
        console.warn(
          "[useEvents] No authenticated user, skipping registered events"
        );
        setRegisteredEvents([]);
        return;
      }

      const userData = await findUserInTables(authUser.id);

      if (!userData) {
        console.warn("[useEvents] User not found in either table, skipping registered events");
        setRegisteredEvents([]);
        return;
      }

      const { data: registrations, error: regError } = await supabase
        .from("event_registrations")
        .select(
          `
          id,
          event_id,
          user_id,
          registered_at,
          status,
          events (
            id,
            title,
            start_date,
            end_date,
            location,
            description,
            event_type,
            is_virtual,
            tier_restriction
          )
        `
        )
        .eq("user_id", userData.id)
        .order("registered_at", { ascending: false });

      if (regError) {
        console.error("[useEvents] Registration fetch error:", regError);
        throw regError;
      }

      const registeredEventsData = registrations.map((reg) => ({
        ...reg.events,
        registration_id: reg.id,
        status: reg.status,
        registered_at: reg.registered_at,
        tier_restriction: normalizeTier(reg.events.tier_restriction) || "Free Member",
        date: reg.events.start_date,
      }));

      setRegisteredEvents(registeredEventsData || []);
    } catch (err) {
      console.error("[useEvents] Error fetching registered events:", err);
      toast.error("Failed to load registered events");
      setRegisteredEvents([]);
    }
  };

  const handleEventRegistration = async (eventId) => {
    try {
      setEventsLoading((prev) => [...prev, eventId]);
      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError || !authUser) {
        throw new Error("User not authenticated");
      }

      const userData = await findUserInTables(authUser.id);

      if (!userData) {
        throw new Error("User not found for this account");
      }

      const userId = userData.id;

      const { data: existingRegistrations, error: checkError } = await supabase
        .from("event_registrations")
        .select("id")
        .eq("event_id", eventId)
        .eq("user_id", userId);

      if (checkError) {
        throw checkError;
      }

      if (existingRegistrations && existingRegistrations.length > 0) {
        toast.error("You are already registered for this event");
        return;
      }

      const { error: insertError } = await supabase
        .from("event_registrations")
        .insert({
          event_id: eventId,
          user_id: userId,
          registered_at: new Date().toISOString(),
          status: "pending",
        });

      if (insertError) {
        throw insertError;
      }

      const event = events.find((e) => e.id === eventId);
      toast.success(`Registered for ${event?.title || "event"}!`);

      await fetchRegisteredEvents();
    } catch (error) {
      console.error("[useEvents] Error registering for event:", error);
      toast.error(`Failed to register: ${error.message}`);
    } finally {
      setEventsLoading((prev) => prev.filter((id) => id !== eventId));
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchRegisteredEvents();
  }, [filters.eventType, filters.tier]);

  return {
    events,
    registeredEvents,
    filterOptions,
    loading,
    error,
    eventsLoading,
    handleEventRegistration,
  };
};

export default useEvents;