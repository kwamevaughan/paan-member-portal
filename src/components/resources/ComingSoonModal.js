import React from "react";
import { Icon } from "@iconify/react";
import SimpleModal from "@/components/SimpleModal";
import toast from "react-hot-toast";

const ComingSoonModal = ({ isOpen, onClose, mode, title, type }) => {
  const getAssetDetails = (assetType) => {
    switch (assetType) {
      case "brand-pack":
        return [
          "High-resolution PAAN logos (PNG, SVG, PDF)",
          "Brand guidelines and color palettes",
          "Typography and spacing guidelines"
        ];
      case "badges":
        return [
          "Verified member badge graphics",
          "Digital certificates and credentials",
          "Social media profile badges"
        ];
      case "social-media":
        return [
          "Editable social post templates",
          "Project launch announcements",
          "Team introduction graphics"
        ];
      default:
        return [];
    }
  };

  const handleNotifyMe = () => {
    onClose();
    toast.success("We'll notify you when assets are ready!");
  };

  return (
    <SimpleModal
      isOpen={isOpen}
      onClose={onClose}
      title={title || "Download Assets"}
      mode={mode}
      width="max-w-2xl"
    >
      <div className="space-y-6">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-paan-blue/10 rounded-full flex items-center justify-center mb-4">
            <Icon icon="mdi:download" className="w-8 h-8 text-paan-blue" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Coming Soon!
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            We're currently preparing the{" "}
            <span className="capitalize">
              {title?.toLowerCase()}
            </span>{" "}
            for download. Our team is working hard to make these assets
            available to all PAAN members.
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">
            What's included:
          </h4>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            {getAssetDetails(type).map((item, index) => (
              <li key={index} className="flex items-center">
                <Icon
                  icon="mdi:check-circle"
                  className="w-4 h-4 text-green-500 mr-2"
                />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-medium transition-colors"
          >
            Got it
          </button>
          <button
            onClick={handleNotifyMe}
            className="flex-1 px-6 py-3 bg-paan-red hover:bg-paan-red/80 text-white rounded-lg font-medium transition-colors"
          >
            Notify me when ready
          </button>
        </div>
      </div>
    </SimpleModal>
  );
};

export default ComingSoonModal;