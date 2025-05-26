// hooks/useFilters.js
import { useState } from "react";

const useFilters = () => {
  const [filters, setFilters] = useState({
    opportunities: { country: undefined, tier_restriction: undefined },
    events: { eventType: undefined, tier: undefined },
    resources: { resource_type: undefined, tier_restriction: undefined },
    marketIntel: { region: undefined, type: undefined },
    offers: { tier_restriction: undefined },
    updates: { tags: undefined },
  });

  const handleFilterChange = (section, key, value) => {
    setFilters((prev) => ({
      ...prev,
      [section]: { ...prev[section], [key]: value || undefined },
    }));
  };

  return { filters, handleFilterChange };
};

export default useFilters;
