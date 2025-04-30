import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import Select from "react-select";

// Custom styles for react-select
const customStyles = {
  control: (provided) => ({
    ...provided,
    backgroundColor: "#374151", // Matches bg-gray-700
    borderColor: "#4B5563", // Matches border-gray-600
    color: "white",
    minHeight: "38px", // Matches input height (py-1.5 + borders)
    height: "38px", // Fixed height for consistency
    padding: "0 8px", // Matches px-4 (16px total)
    "&:hover": {
      borderColor: "#3B82F6", // Matches focus:border-blue-500
    },
    boxShadow: "none",
    borderRadius: "0.5rem", // Matches rounded-lg
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "white", // Selected value text color
    margin: 0, // Remove default margin
    lineHeight: 1.2, // Tighten line height
    top: "50%", // Center vertically
    transform: "translateY(-50%)", // Center vertically
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: "#374151", // Matches bg-gray-700
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? "#4B5563" : "#374151", // Matches hover:bg-gray-600
    color: "white", // Dropdown option text
    "&:active": {
      backgroundColor: "#4B5563", // Consistent background on click
    },
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#9CA3AF", // Matches text-gray-400
    margin: 0, // Remove default margin
    lineHeight: 1.2, // Tighten line height
  }),
  input: (provided) => ({
    ...provided,
    color: "white", // Input text
    margin: 0, // Remove default margin
    padding: 0, // Remove default padding
    height: "100%", // Ensure input doesn't add extra height
    lineHeight: 1.2, // Tighten line height
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: "0", // Remove all padding to minimize space
    height: "100%", // Match control height
    display: "flex", // Ensure proper alignment
    alignItems: "center", // Center content vertically
  }),
};

const RegisterForm = () => {
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    phone: "",
    country: "KE",
    registrationCode: "",
  });
  const [countries, setCountries] = useState([]);

  // Load countries from JSON file
  useEffect(() => {
    fetch("/assets/misc/countries.json")
      .then((response) => response.json())
      .then((data) => {
        const countryOptions = data.map((country) => ({
          value: country.code,
          label: country.name,
          emoji: country.emoji,
        }));
        setCountries(countryOptions);
      })
      .catch((error) => console.error("Error loading countries:", error));
  }, []);

  const handleRegister = (e) => {
    e.preventDefault();
    console.log("Registering with:", registerData);
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCountryChange = (selectedOption) => {
    setRegisterData((prev) => ({
      ...prev,
      country: selectedOption ? selectedOption.value : "",
    }));
  };

  // Custom Option component to display flag and country name
  const CustomOption = ({ innerProps, label, data }) => (
    <div {...innerProps} className="flex items-center p-2 cursor-pointer hover:bg-gray-600 text-white">
      <span className="mr-2">{data.emoji}</span>
      <span>{label}</span>
    </div>
  );

  // Custom SingleValue component to display flag and country name
  const CustomSingleValue = ({ data }) => (
    <div className="flex items-center text-white m-0 leading-tight">
      <span className="mr-2">{data.emoji}</span>
      <span>{data.label}</span>
    </div>
  );

  return (
    <form onSubmit={handleRegister}>
      {/* Name Field */}
      <div className="mb-4">
        <label
          className="block text-gray-300 text-sm md:text-base mb-2"
          htmlFor="name"
        >
          Full Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="John Doe"
          value={registerData.name}
          onChange={handleRegisterChange}
          className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg py-1.5 md:py-2 px-4 focus:outline-none focus:border-blue-500"
          required
        />
      </div>

      {/* Email Field */}
      <div className="mb-4">
        <label
          className="block text-gray-300 text-sm md:text-base mb-2"
          htmlFor="registerEmail"
        >
          Email
        </label>
        <div className="relative">
          <input
            id="registerEmail"
            name="email"
            placeholder="john@paan.africa"
            type="email"
            value={registerData.email}
            onChange={handleRegisterChange}
            className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg py-1.5 md:py-2 px-4 focus:outline-none focus:border-blue-500"
            required
          />
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Icon icon="heroicons:envelope" className="w-5 h-5" />
          </span>
        </div>
      </div>

      {/* Phone Field */}
      <div className="mb-4">
        <label
          className="block text-gray-300 text-sm md:text-base mb-2"
          htmlFor="phone"
        >
          Phone Number
        </label>
        <input
          id="phone"
          name="phone"
          placeholder="+254712345678"
          type="tel"
          value={registerData.phone}
          onChange={handleRegisterChange}
          className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg py-1.5 md:py-2 px-4 focus:outline-none focus:border-blue-500"
          required
        />
      </div>

      {/* Country Field */}
      <div className="mb-4">
        <label
          className="block text-gray-300 text-sm md:text-base mb-2"
          htmlFor="country"
        >
          Country
        </label>
        <Select
          id="country"
          name="country"
          options={countries}
          value={countries.find((option) => option.value === registerData.country)}
          onChange={handleCountryChange}
          components={{ Option: CustomOption, SingleValue: CustomSingleValue }}
          placeholder="Select a country"
          isClearable
          isSearchable
          required
          styles={customStyles} // Apply custom styles
        />
      </div>

      {/* Registration Code Field */}
      <div className="mb-4">
        <label
          className="block text-gray-300 text-sm md:text-base mb-2"
          htmlFor="registrationCode"
        >
          Registration Code
        </label>
        <input
          id="registrationCode"
          name="registrationCode"
          type="text"
          value={registerData.registrationCode}
          onChange={handleRegisterChange}
          className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg py-1.5 md:py-2 px-4 focus:outline-none focus:border-blue-500"
          required
        />
      </div>

      {/* Register Button */}
      <button
        type="submit"
        className="w-full bg-sky-500 text-white font-bold py-3 rounded-lg transform transition-transform duration-700 ease-in-out hover:scale-105"
      >
        Create Account
      </button>
    </form>
  );
};

export default RegisterForm;