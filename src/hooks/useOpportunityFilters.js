// hooks/useOpportunityFilters.js
import { useState } from "react";

const useOpportunityFilters = () => {
  const [filters, setFilters] = useState({
    country: undefined,
    tier_restriction: undefined,
  });

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value || undefined }));
  };

  return { filters, handleFilterChange };
};

export default useOpportunityFilters;
