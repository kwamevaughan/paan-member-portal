import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import Select from "react-select";

// Custom styles for react-select
const customStyles = {
  control: (provided) => ({
    ...provided,
    backgroundColor: "",
    border: "none", // Remove full border
    borderBottom: "2px solid #4B5563", // Apply only bottom border
    padding: "0 8px",
    "&:hover": {
      borderColor: "#172840", // Optional, add hover effect for the bottom border
    },
    boxShadow: "none",
    borderRadius: "0",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#172840",
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: "#ddd",
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#172840",
  }),
  input: (provided) => ({
    ...provided,
    color: "#172840",
  }),
  valueContainer: (provided) => ({
    ...provided,
    display: "flex",
  }),
};

const RegisterForm = () => {
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    phone: "",
    country: "KE",
    agencyName: "",
    memberCode: "",
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
    <div
      {...innerProps}
      className="flex items-center p-2 cursor-pointer hover:bg-white/50 text-paan-blue"
    >
      <span className="mr-2">{data.emoji}</span>
      <span>{label}</span>
    </div>
  );

  // Custom SingleValue component to display flag and country name
  const CustomSingleValue = ({ data }) => (
    <div className="flex items-center text-paan-blue m-0 leading-tight">
      <span className="mr-2">{data.emoji}</span>
      <span>{data.label}</span>
    </div>
  );

  return (
    <form onSubmit={handleRegister}>
      {/* Name Field */}
      <div className="mb-6">
        <label className="hidden" htmlFor="name">
          Full Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="John Doe"
          value={registerData.name}
          onChange={handleRegisterChange}
          className="w-full bg-transparent text-paan-blue font-light border-b-2 border-gray-700 rounded-none py-2.5 md:py-3 px-2 focus:outline-none focus:border-blue-500 placeholder-paan-blue"
          required
        />
      </div>

      {/* Email Field */}
      <div className="mb-6">
        <label className="hidden" htmlFor="registerEmail">
          Email
        </label>
        <div className="relative">
          <input
            id="registerEmail"
            name="email"
            placeholder="johndoe@paan.africa"
            type="email"
            value={registerData.email}
            onChange={handleRegisterChange}
            className="w-full bg-transparent text-paan-blue font-light border-b-2 border-gray-700 rounded-none py-2.5 md:py-3 px-2 focus:outline-none focus:border-blue-500 placeholder-paan-blue"
            required
          />
        </div>
      </div>

      {/* Phone Field */}
      <div className="mb-6">
        <label className="hidden" htmlFor="phone">
          Phone Number
        </label>
        <input
          id="phone"
          name="phone"
          placeholder="+254712345678"
          type="tel"
          value={registerData.phone}
          onChange={handleRegisterChange}
          className="w-full bg-transparent text-paan-blue font-light border-b-2 border-gray-700 rounded-none py-2.5 md:py-3 px-2 focus:outline-none focus:border-blue-500 placeholder-paan-blue"
          required
        />
      </div>

      {/* Country Field */}
      <div className="mb-6">
        <label className="hidden" htmlFor="country">
          Country
        </label>
        <Select
          id="country"
          name="country"
          options={countries}
          value={countries.find(
            (option) => option.value === registerData.country
          )}
          onChange={handleCountryChange}
          components={{ Option: CustomOption, SingleValue: CustomSingleValue }}
          placeholder="Select a country"
          isClearable
          isSearchable
          required
          styles={customStyles} // Apply custom styles
        />
      </div>

      {/* Unique Member Code Field */}
      <div className="mb-6">
        <label className="hidden" htmlFor="memberCode">
          Unique Member Code
        </label>
        <input
          id="memberCode"
          name="memberCode"
          type="text"
          placeholder="Enter your unique member code"
          value={registerData.memberCode}
          onChange={handleRegisterChange}
          className="w-full bg-transparent text-paan-blue font-light border-b-2 border-gray-700 rounded-none py-2.5 md:py-3 px-2 focus:outline-none focus:border-blue-500 placeholder-paan-blue"
          required
        />
      </div>

      {/* Agency Name Field */}
      <div className="mb-6">
        <label className="hidden" htmlFor="agencyName">
          Agency Name
        </label>
        <input
          id="agencyName"
          name="agencyName"
          type="text"
          placeholder="Enter your agency name"
          value={registerData.agencyName}
          onChange={handleRegisterChange}
          className="w-full bg-transparent text-paan-blue font-light border-b-2 border-gray-700 rounded-none py-2.5 md:py-3 px-2 focus:outline-none focus:border-blue-500 placeholder-paan-blue"
          required
        />
      </div>

      {/* Register Button */}
      <button
        type="submit"
        className="w-full bg-paan-red text-white font-bold py-3 mt-6 rounded-full transform transition-transform duration-700 ease-in-out hover:scale-105"
      >
        Create Account
      </button>
    </form>
  );
};

export default RegisterForm;
