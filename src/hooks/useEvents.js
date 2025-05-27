import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabase";
import { canAccessTier } from "@/utils/tierUtils";

const useEvents = (
  filters = { eventType: "", tier: "" },
  userTier = "Free Member"
) => {
  const [events, setEvents] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [filterOptions, setFilterOptions] = useState({
    eventTypes: [],
    tiers: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from("events")
        .select("*")
        .gte("date", new Date().toISOString())
        .order("date", { ascending: true });

      if (filters.eventType) {
        query = query.eq("event_type", filters.eventType);
      }
      if (filters.tier) {
        query = query.eq("tier_restriction", filters.tier);
      }

      const { data: eventsData, error: eventsError } = await query;
      if (eventsError) throw eventsError;

      // Transform events to include isAccessible
      const transformedEvents = (eventsData || []).map((event) => ({
        ...event,
        tier_restriction: event.tier_restriction || "Free Member",
        isAccessible: canAccessTier(event.tier_restriction, userTier),
      }));

      // Fetch filter options
      const { data: allEvents, error: allEventsError } = await supabase
        .from("events")
        .select("event_type, tier_restriction");
      if (allEventsError) throw allEventsError;

      const eventTypes = [
        ...new Set(allEvents.map((e) => e.event_type)),
      ].sort();
      const tiers = [
        ...new Set(allEvents.map((e) => e.tier_restriction || "Free Member")),
      ].sort();

      console.log(
        "[useEvents] User tier:",
        userTier,
        "Fetched events:",
        transformedEvents.map((e) => ({
          id: e.id,
          title: e.title,
          tier: e.tier_restriction,
          isAccessible: e.isAccessible,
        }))
      );

      setEvents(transformedEvents);
      setFilterOptions({ eventTypes, tiers });
    } catch (err) {
      console.error("[useEvents] Error fetching events:", err);
      setError(err.message);
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  const fetchRegisteredEvents = async () => {
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError || !user) {
        console.warn(
          "[useEvents] No authenticated user, skipping registered events"
        );
        setRegisteredEvents([]);
        return;
      }

      const { data: candidate, error: candidateError } = await supabase
        .from("candidates")
        .select("id")
        .eq("auth_user_id", user.id)
        .single();

      if (candidateError || !candidate) {
        console.error("[useEvents] Candidate not found for user:", user.id);
        throw new Error("Candidate not found for this user");
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
            date,
            location,
            description,
            event_type,
            is_virtual,
            tier_restriction
          )
        `
        )
        .eq("user_id", candidate.id)
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
        tier_restriction: reg.events.tier_restriction || "Free Member",
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
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError || !user) {
        throw new Error("User not authenticated");
      }

      const { data: candidate, error: candidateError } = await supabase
        .from("candidates")
        .select("id")
        .eq("auth_user_id", user.id)
        .single();

      if (candidateError || !candidate) {
        throw new Error("Candidate not found for this user");
      }

      const candidateId = candidate.id;

      const { data: existingRegistration, error: checkError } = await supabase
        .from("event_registrations")
        .select("id")
        .eq("event_id", eventId)
        .eq("user_id", candidateId)
        .single();

      if (checkError && !checkError.message.includes("0 rows")) {
        throw checkError;
      }

      if (existingRegistration) {
        toast.error("You are already registered for this event");
        return;
      }

      const { error: insertError } = await supabase
        .from("event_registrations")
        .insert({
          event_id: eventId,
          user_id: candidateId,
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
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchRegisteredEvents();
  }, [filters.eventType, filters.tier, userTier]);

  return {
    events,
    registeredEvents,
    filterOptions,
    loading,
    error,
    handleEventRegistration,
  };
};

export default useEvents;
