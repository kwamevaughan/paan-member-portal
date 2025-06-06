import React, { useEffect, useRef } from "react";
import { Icon } from "@iconify/react";

const SimpleModal = ({ isOpen, onClose, title, children, mode = "light" }) => {
  const modalRef = useRef(null);

  // Handle ESC key press to close modal
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      tabIndex={-1}
      ref={modalRef}
      onClick={onClose} // Close on backdrop click
    >
      <div
        className={`relative w-full max-w-2xl mx-4 rounded-3xl border ${
          mode === "dark"
            ? "bg-white/10 backdrop-blur-lg border-white/20 text-white"
            : "bg-white/80 backdrop-blur-lg border-gray-200 text-gray-900"
        } shadow-2xl transform transition-all duration-300 p-6 max-h-[90vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 id="modal-title" className="text-xl font-semibold">
            {title}
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-full transition-colors ${
              mode === "dark"
                ? "hover:bg-white/10 text-white"
                : "hover:bg-gray-200 text-gray-600"
            }`}
            aria-label="Close modal"
          >
            <Icon icon="mdi:close" className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div>{children}</div>
      </div>
    </div>
  );
};

export default SimpleModal;
