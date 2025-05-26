import React from "react";

const EventCard = ({ event, mode, onRegister, isRegistered }) => (
  <div
    className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md cursor-pointer ${
      mode === "dark"
        ? "bg-gray-700/50 border-gray-600 hover:bg-gray-700/70"
        : "bg-gray-50 border-gray-200 hover:bg-gray-100"
    }`}
  >
    <div className="flex items-start justify-between mb-2">
      <h3
        className={`font-medium ${
          mode === "dark" ? "text-white" : "text-gray-900"
        }`}
      >
        {event.title}
      </h3>
      <span
        className={`px-2 py-1 text-xs rounded-full ${
          event.is_virtual
            ? "bg-green-100 text-green-800"
            : "bg-blue-100 text-blue-800"
        }`}
      >
        {event.is_virtual ? "Virtual" : "In-Person"}
      </span>
    </div>
    <div
      className={`flex items-center space-x-4 text-sm ${
        mode === "dark" ? "text-gray-400" : "text-gray-600"
      }`}
    >
      <div className="flex items-center space-x-1">
        <iconify-icon icon="mdi:calendar" className="text-sm"></iconify-icon>
        <span>{new Date(event.date).toLocaleDateString()}</span>
      </div>
      <div className="flex items-center space-x-1">
        <iconify-icon icon="mdi:map-marker" className="text-sm"></iconify-icon>
        <span>{event.location}</span>
      </div>
    </div>
    <div className="mt-3">
      <button
        onClick={() => onRegister(event.id)}
        disabled={isRegistered}
        className={`text-sm px-3 py-1 rounded-md transition-colors ${
          isRegistered
            ? "bg-gray-400 text-gray-700 cursor-not-allowed"
            : mode === "dark"
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "bg-blue-500 text-white hover:bg-blue-600"
        }`}
      >
        {isRegistered ? "Registered" : "Register"}
      </button>
    </div>
  </div>
);

export default EventCard;
