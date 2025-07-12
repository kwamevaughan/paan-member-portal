import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { normalizeTier } from "@/utils/tierUtils";

export const useLatestUpdate = (user = { selected_tier: "Free Member" }) => {
  const [latestItems, setLatestItems] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLatestUpdates = async () => {
      setLoading(true);
      setError(null);
      try {
        const userTierNormalized = normalizeTier(user?.selected_tier);
        

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
          let selectFields = "id, title, tier_restriction, created_at, updated_at";
          
          // Special handling for business_opportunities table
          if (name === "business_opportunities") {
            selectFields = "id, gig_title, tender_title, organization_name, tier_restriction, created_at, updated_at";
          }
          
          const { data, error } = await supabase
            .from(name)
            .select(selectFields)
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

          if (data && data.length > 0) {
            const item = data[0];
            const itemTier = normalizeTier(
              item.tier_restriction || "Free Member"
            );
            
            // Determine title based on table type
            let title = item.title;
            if (name === "business_opportunities") {
              title = item.tender_title || item.gig_title || item.organization_name || "Business Opportunity";
            }
            
            return {
              section,
              item: {
                title: title,
                timestamp: item.updated_at || item.created_at,
              },
            };
          }
          return { section, item: null };
        });

        const results = await Promise.all(promises);

        // Create an object mapping sections to their latest items
        const latestItemsMap = results.reduce((acc, { section, item }) => {
          acc[section] = item;
          return acc;
        }, {});


        setLatestItems(latestItemsMap);
      } catch (err) {
        console.error("[useLatestUpdate] Unexpected error:", err);
        setError("Failed to fetch latest updates.");
      } finally {
        setLoading(false);
      }
    };

    fetchLatestUpdates();
  }, [user?.selected_tier]);

  return { latestItems, loading, error };
};
