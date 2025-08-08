import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
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
      return { id: candidateData.id, userType: 'candidate' };
    }

    // If not found in candidates, try hr_users table
    const { data: hrUserData, error: hrUserError } = await supabase
      .from("hr_users")
      .select("id")
      .eq("id", authUserId)
      .single();

    if (hrUserData && !hrUserError) {
      return { id: hrUserData.id, userType: 'hr_user' };
    }

    return null;
  } catch (error) {
    console.error("Error finding user in tables:", error);
    return null;
  }
};

export default function useBookings(user) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookings = async () => {
    if (!user?.id) {
      setBookings([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Get user data from database
      const userData = await findUserInTables(user.id);
      
      if (!userData) {
        console.warn("[useBookings] User not found in either table, skipping bookings");
        setBookings([]);
        setLoading(false);
        return;
      }

      const { data: userBookings, error: bookingsError } = await supabase
        .from("access_hub_bookings")
        .select(`
          id,
          access_hub_id,
          access_hub_title,
          name,
          email,
          company,
          phone,
          space_type,
          booking_date,
          start_time,
          end_time,
          duration,
          attendees,
          purpose,
          budget_range,
          requirements,
          is_recurring,
          recurring_type,
          recurring_end_date,
          status,
          created_at,
          updated_at
        `)
        .eq("user_id", userData.id)
        .order("created_at", { ascending: false });

      if (bookingsError) {
        console.error("[useBookings] Bookings fetch error:", bookingsError);
        throw bookingsError;
      }

      setBookings(userBookings || []);
    } catch (err) {
      console.error("[useBookings] Error fetching bookings:", err);
      setError(err.message);
      toast.error("Failed to load your bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [user?.id]);

  const cancelBooking = async (bookingId) => {
    try {
      const { error: updateError } = await supabase
        .from("access_hub_bookings")
        .update({ status: 'cancelled', updated_at: new Date().toISOString() })
        .eq("id", bookingId);

      if (updateError) {
        throw updateError;
      }

      toast.success("Booking cancelled successfully");
      await fetchBookings(); // Refresh the list
    } catch (err) {
      console.error("[useBookings] Error cancelling booking:", err);
      toast.error("Failed to cancel booking");
    }
  };

  return {
    bookings,
    loading,
    error,
    refetch: fetchBookings,
    cancelBooking
  };
}