import React from "react";

const UpdateCard = ({ update, mode }) => (
  <div
    className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
      mode === "dark"
        ? "bg-gray-700/50 border-gray-600"
        : "bg-gray-50 border-gray-200"
    }`}
  >
    <div className="flex items-start justify-between mb-2">
      <h3
        className={`font-medium ${
          mode === "dark" ? "text-white" : "text-gray-900"
        }`}
      >
        {update.title}
      </h3>
      <span
        className={`px-2 py-1 text-xs rounded-full ${
          update.category === "Product"
            ? "bg-blue-100 text-blue-800"
            : update.category === "System"
            ? "bg-orange-100 text-orange-800"
            : "bg-purple-100 text-purple-800"
        }`}
      >
        {update.category}
      </span>
    </div>
    <div className="flex items-center justify-between">
      <div className="flex space-x-2">
        {update.tags.map((tag, index) => (
          <span
            key={index}
            className={`px-2 py-1 text-xs rounded ${
              mode === "dark"
                ? "bg-gray-600 text-gray-300"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            #{tag}
          </span>
        ))}
      </div>
      <button
        className={`text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors`}
      >
        {update.cta_text}
      </button>
    </div>
  </div>
);

export default UpdateCard;
