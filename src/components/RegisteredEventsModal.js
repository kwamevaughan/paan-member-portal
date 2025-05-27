import React from "react";
import PropTypes from "prop-types";
import { Icon } from "@iconify/react";
import {
  TierBadge,
  RegistrationStatusBadge,
  normalizeTier,
} from "@/components/Badge";

const RegisteredEventsModal = ({
  isOpen,
  onClose,
  registeredEvents = [],
  mode,
  formatDate,
  getDaysRemaining,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`rounded-2xl max-w-2xl w-full mx-4 p-6 ${
          mode === "dark" ? "bg-gray-800" : "bg-white"
        } shadow-xl max-h-[80vh] overflow-y-auto`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            My Registered Events
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            <Icon icon="heroicons:x-mark" className="w-6 h-6" />
          </button>
        </div>
        {registeredEvents && registeredEvents.length > 0 ? (
          <div className="space-y-4">
            {registeredEvents.map((event) => {
              const displayTier = normalizeTier(event.tier_restriction);
              const daysLeft = getDaysRemaining(event.date);

              return (
                <div
                  key={event.registration_id}
                  className={`p-4 rounded-lg border ${
                    mode === "dark" ? "bg-gray-700/50" : "bg-gray-50"
                  } animate-fade-in`}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {event.title}
                    </h3>
                    <TierBadge tier={event.tier_restriction} mode={mode} />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    {event.location || "Virtual"} • {formatDate(event.date)}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <RegistrationStatusBadge
                      status={event.status}
                      mode={mode}
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Registered on {formatDate(event.registered_at)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-300 text-center">
            You haven't registered for any events yet.
          </p>
        )}
      </div>
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

RegisteredEventsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  registeredEvents: PropTypes.arrayOf(
    PropTypes.shape({
      registration_id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      location: PropTypes.string,
      status: PropTypes.string.isRequired,
      registered_at: PropTypes.string.isRequired,
      tier_restriction: PropTypes.string,
    })
  ),
  mode: PropTypes.oneOf(["light", "dark"]).isRequired,
  formatDate: PropTypes.func.isRequired,
  getDaysRemaining: PropTypes.func.isRequired,
};

RegisteredEventsModal.defaultProps = {
  registeredEvents: [],
};

export default RegisteredEventsModal;
