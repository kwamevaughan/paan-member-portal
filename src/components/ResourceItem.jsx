import React from "react";

const ResourceItem = ({ resource, mode }) => (
  <div
    className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 hover:shadow-sm cursor-pointer ${
      mode === "dark"
        ? "bg-gray-700/30 border-gray-600 hover:bg-gray-700/50"
        : "bg-gray-50 border-gray-200 hover:bg-gray-100"
    }`}
  >
    <div className="flex items-center space-x-3">
      <div className="p-2 rounded bg-gradient-to-r from-green-500 to-teal-600">
        <iconify-icon
          icon={
            resource.resource_type === "Video"
              ? "mdi:play-circle"
              : resource.resource_type === "Document"
              ? "mdi:file-document"
              : "mdi:folder-multiple"
          }
          className="text-white text-sm"
        ></iconify-icon>
      </div>
      <div>
        <h4
          className={`font-medium ${
            mode === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          {resource.title}
        </h4>
        <p
          className={`text-sm ${
            mode === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {resource.resource_type}
        </p>
      </div>
    </div>
    <iconify-icon
      icon="mdi:chevron-right"
      className={`${mode === "dark" ? "text-gray-400" : "text-gray-600"}`}
    ></iconify-icon>
  </div>
);

export default ResourceItem;
