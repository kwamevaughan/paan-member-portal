// useFilters.js
import { useState } from "react";

const useFilters = () => {
  const [filters, setFilters] = useState({
    opportunities: {
      country: "",
      serviceType: "",
      industry: "",
      projectType: "",
      tier_restriction: "",
      skills: "",
      budgetRange: "",
      remoteWork: "",
      estimatedDuration: "",
    },
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

  const handleResetFilters = (section) => {
    setFilters((prev) => ({
      ...prev,
      [section]:
        section === "opportunities"
          ? {
              country: "",
              serviceType: "",
              industry: "",
              projectType: "",
              tier_restriction: "",
              skills: "",
              budgetRange: "",
              remoteWork: "",
              estimatedDuration: "",
            }
          : section === "events"
          ? { eventType: "", tier: "" }
          : section === "resources"
          ? { resource_type: "", tier_restriction: "" }
          : section === "marketIntel"
          ? { region: "", type: "" }
          : section === "offers"
          ? { tier_restriction: "" }
          : { tags: "" },
    }));
  };

  return { filters, handleFilterChange, handleResetFilters };
};

export default useFilters;
