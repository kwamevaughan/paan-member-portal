import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { canAccessTier } from "@/utils/tierUtils";
import { normalizeTier } from "@/components/Badge";

export const useLatestUpdate = (userTier = "Free Member") => {
  const [latestItems, setLatestItems] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLatestUpdates = async () => {
      setLoading(true);
      setError(null);
      try {
        const userTierNormalized = normalizeTier(userTier);
        console.log(
          "[useLatestUpdate] User tier normalized:",
          userTierNormalized
        );

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
            return { section, item: null };
          }

          console.log(`[useLatestUpdate] Data from ${name}:`, data);

          if (data && data.length > 0) {
            const item = data[0];
            const itemTier =
              normalizeTier(item.tier_restriction) || "Free Member";
            console.log(
              `[useLatestUpdate] ${name} item tier normalized:`,
              itemTier
            );
            // const isAccessible = canAccessTier(itemTier, userTierNormalized);
            // console.log(`[useLatestUpdate] ${name} isAccessible:`, isAccessible);
            // if (isAccessible) {
            return {
              section,
              item: {
                title: item.title,
                timestamp: item.updated_at || item.created_at,
              },
            };
            // }
          }
          return { section, item: null };
        });

        const results = await Promise.all(promises);

        // Create an object mapping sections to their latest items
        const latestItemsMap = results.reduce((acc, { section, item }) => {
          acc[section] = item;
          return acc;
        }, {});

        console.log("[useLatestUpdate] Latest items map:", latestItemsMap);

        setLatestItems(latestItemsMap);
      } catch (err) {
        console.error("[useLatestUpdate] Unexpected error:", err);
        setError("Failed to fetch latest updates.");
      } finally {
        setLoading(false);
      }
    };

    fetchLatestUpdates();
  }, [userTier]);

  return { latestItems, loading, error };
};
