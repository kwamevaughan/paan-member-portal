import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import toast from "react-hot-toast";

export const useProfile = (userId) => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch profile data
  const fetchProfile = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("candidates")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile data");
        return;
      }

      setProfileData(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  // Update profile data
  const updateProfile = async (updates) => {
    if (!userId) return false;
    
    try {
      setSaving(true);
      
      // Add updated_at timestamp to the updates
      const updatesWithTimestamp = {
        ...updates,
        updated_at: new Date().toISOString()
      };
      
      const { error } = await supabase
        .from("candidates")
        .update(updatesWithTimestamp)
        .eq("id", userId);

      if (error) {
        console.error("Error updating profile:", error);
        toast.error("Failed to update profile");
        return false;
      }

      // Update local state with the timestamp
      setProfileData(prev => ({ ...prev, ...updatesWithTimestamp }));
      toast.success("Profile updated successfully!");
      return true;
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
      return false;
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  return {
    profileData,
    loading,
    saving,
    updateProfile,
    refetchProfile: fetchProfile,
  };
};