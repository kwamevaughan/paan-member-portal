import React from "react";

const FilterDropdown = ({
  value,
  onChange,
  options,
  mode,
  ariaLabel,
  optionClassName = () => "",
}) => {
  // Create a Set to track seen values
  const seenValues = new Set();

  // Filter out duplicate values or null/undefined ones
  const sanitizedOptions = options.filter((option) => {
    const val = option.value ?? "__undefined__";
    if (seenValues.has(val)) return false;
    seenValues.add(val);
    return true;
  });

  return (
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
      {sanitizedOptions.map((option) => (
        <option
          key={option.value || option.label} // fallback to label if value is empty
          value={option.value}
          disabled={option.disabled || false}
          className={optionClassName(option)}
        >
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default FilterDropdown;
