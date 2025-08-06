import React from "react";
import { Icon } from "@iconify/react";
import SimpleModal from "@/components/SimpleModal";

const OnboardingKitModal = ({ isOpen, onClose, mode }) => {
  return (
    <SimpleModal
      isOpen={isOpen}
      onClose={onClose}
      title="PAAN Onboarding Kit"
      mode={mode}
      width="max-w-6xl"
    >
      <div className="space-y-8">
        <div className="relative w-full h-[600px] bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden">
          <iframe
            src="https://ik.imagekit.io/2crwrt8s6/General/PAAN%20Onboarding%20KIT%202025.pdf?updatedAt=1753975546701"
            className="w-full h-full border-0"
            title="PAAN Onboarding Kit 2025"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-medium transition-colors"
          >
            Close
          </button>
          <a
            href="https://ik.imagekit.io/2crwrt8s6/General/PAAN%20Onboarding%20KIT%202025.pdf?updatedAt=1753975546701"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 px-6 py-3 bg-paan-red hover:bg-paan-red/80 text-white rounded-lg font-medium transition-colors text-center"
          >
            <Icon icon="mdi:download" className="w-4 h-4 inline mr-2" />
            Download PDF
          </a>
        </div>
      </div>
    </SimpleModal>
  );
};

export default OnboardingKitModal;