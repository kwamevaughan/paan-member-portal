import React from "react";

const ResourceCard = ({
  title,
  description,
  buttonText,
  onClick,
  badgeText,
  badgeColor = "bg-paan-blue",
  icon
}) => {
  return (
    <div className="bg-white px-8 py-20 rounded-lg shadow-sm hover:translate-y-[-5px] transition-all duration-200 flex flex-col h-full relative">
      <div className="absolute top-4 right-4">
        <span className={`inline-flex items-center px-6 py-1 rounded-full text-sm font-normal ${badgeColor}`}>
          {badgeText}
        </span>
      </div>

      <h3 className="text-2xl font-semibold text-gray-800 mt-4">
        {title}
      </h3>
      <p className="text-gray-600 mt-2">
        {description}
      </p>
      <button
        onClick={onClick}
        className="mt-6 px-6 py-2 bg-paan-red hover:bg-paan-red/80 text-white rounded-full transition-all duration-300 flex items-center justify-center w-fit"
      >
        {buttonText}
      </button>
    </div>
  );
};

export default ResourceCard;