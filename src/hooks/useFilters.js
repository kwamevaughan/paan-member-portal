import { useState } from "react";

const useFilters = () => {
  const [filters, setFilters] = useState({
    opportunities: { country: "", tier_restriction: "" },
    events: { eventType: "", tier: "" },
    resources: { resource_type: "", tier_restriction: "" },
    marketIntel: { region: "", type: "" },
    offers: { tier_restriction: "" },
    updates: { tags: "" },
  });

  const handleFilterChange = (section, key, value) => {
    
    setFilters((prev) => ({
      ...prev,
      [section]: { ...prev[section], [key]: value || "" },
    }));
  };

  return { filters, handleFilterChange };
};

export default useFilters;
