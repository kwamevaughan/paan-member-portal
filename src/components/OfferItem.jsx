import React from "react";

const OfferItem = ({ offer, mode, isRestricted, onRestrictedClick }) => {
  const handleClick = () => {
    if (isRestricted) {
      onRestrictedClick(`Access restricted: ${offer.tier_restriction} tier required for "${offer.title}"`);
    }
  };

  return (
    <div
      className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 hover:shadow-sm cursor-pointer ${
        mode === "dark"
          ? "bg-gray-700/30 border-gray-600 hover:bg-gray-700/50"
          : "bg-gray-50 border-gray-200 hover:bg-gray-100"
      } ${isRestricted ? "opacity-50 pointer-events-auto cursor-not-allowed" : ""}`}
      onClick={handleClick}
    >
      <div className="flex items-center space-x-3">
        <div className="p-2 rounded bg-gradient-to-r from-orange-500 to-red-600">
          <iconify-icon
            icon="mdi:gift"
            className="text-white text-sm"
          ></iconify-icon>
        </div>
        <div>
          <h4
            className={`font-medium ${mode === "dark" ? "text-white" : "text-gray-900"}`}
          >
            {offer.title}
          </h4>
          <p
            className={`text-sm ${mode === "dark" ? "text-gray-400" : "text-gray-600"}`}
          >
            Tier: {offer.tier_restriction}
          </p>
        </div>
      </div>
      <iconify-icon
        icon="mdi:chevron-right"
        className={`${mode === "dark" ? "text-gray-400" : "text-gray-600"}`}
      ></iconify-icon>
    </div>
  );
};

export default OfferItem;
