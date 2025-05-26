// components/FilterDropdown.jsx
import React from "react";

const FilterDropdown = ({
  value,
  onChange,
  options,
  mode,
  ariaLabel,
  optionClassName = () => "",
}) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className={`px-3 py-1 text-sm rounded-md ${
      mode === "dark"
        ? "bg-gray-700 text-gray-300"
        : "bg-gray-100 text-gray-700"
    }`}
    aria-label={ariaLabel}
  >
    {options.map((option) => (
      <option
        key={option.value}
        value={option.value}
        disabled={option.disabled || false}
        className={optionClassName(option)}
      >
        {option.label}
      </option>
    ))}
  </select>
);

export default FilterDropdown;
