import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { canAccessTier } from "@/utils/tierUtils";
import { normalizeTier } from "@/components/Badge";

export const useLatestUpdate = (userTier = "Free Member") => {
  const [latestItem, setLatestItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLatestUpdate = async () => {
      setLoading(true);
      setError(null);
      try {
        const userTierNormalized = normalizeTier(userTier);

        // Define tables and their display names
        const tables = [
          { name: "business_opportunities", section: "Business Opportunities" },
          { name: "events", section: "Events" },
          { name: "resources", section: "Resources" },
          { name: "market_intel", section: "Market Intel" },
          { name: "offers", section: "Offers" },
          { name: "updates", section: "Updates" },
        ];

        // Fetch latest item from each table
        const promises = tables.map(async ({ name, section }) => {
          const { data, error } = await supabase
            .from(name)
            .select("id, title, tier_restriction, created_at, updated_at")
            .order("updated_at", { ascending: false })
            .order("created_at", { ascending: false })
            .limit(1);

          if (error) {
            console.error(
              `[useLatestUpdate] Error fetching from ${name}:`,
              error
            );
            return null;
          }

          if (data && data.length > 0) {
            const item = data[0];
            const itemTier =
              normalizeTier(item.tier_restriction) || "Free Member";
            const isAccessible = canAccessTier(itemTier, userTierNormalized);
            if (isAccessible) {
              return {
                title: item.title,
                section,
                timestamp: item.updated_at || item.created_at,
              };
            }
          }
          return null;
        });

        const results = await Promise.all(promises);
        const validItems = results.filter((item) => item !== null);

        if (validItems.length === 0) {
          setLatestItem(null);
          setLoading(false);
          return;
        }

        // Find the most recent item
        const latest = validItems.reduce((latest, current) => {
          const latestTime = new Date(latest.timestamp);
          const currentTime = new Date(current.timestamp);
          return currentTime > latestTime ? current : latest;
        });

        setLatestItem(latest);
      } catch (err) {
        console.error("[useLatestUpdate] Unexpected error:", err);
        setError("Failed to fetch latest update.");
      } finally {
        setLoading(false);
      }
    };

    fetchLatestUpdate();
  }, [userTier]);

  return { latestItem, loading, error };
};
