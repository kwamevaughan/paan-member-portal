import React, { useEffect, useRef } from "react";
import { Icon } from "@iconify/react";

const SimpleModal = ({ isOpen, onClose, title, children, mode }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      modalRef.current?.focus();
      const handleEscape = (e) => {
        if (e.key === "Escape") onClose();
      };
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0"
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      tabIndex={-1}
      ref={modalRef}
    >
      <div
        className={`relative w-full max-w-2xl mx-4 rounded-2xl shadow-xl transform transition-all duration-300 ${
          mode === "dark"
            ? "bg-gray-800 border-gray-700 text-white"
            : "bg-white border-gray-200 text-gray-900"
        } max-h-[90vh] overflow-y-auto`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200/50 dark:border-gray-700/50">
          <h2 id="modal-title" className="text-xl font-semibold">
            {title}
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-full ${
              mode === "dark"
                ? "text-gray-400 hover:bg-gray-700"
                : "text-gray-500 hover:bg-gray-100"
            }`}
            aria-label="Close modal"
          >
            <Icon icon="mdi:close" className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default SimpleModal;
