import React, { useState } from "react";
import { TierBadge } from "./Badge";
import { Icon } from "@iconify/react";
import Image from "next/image";

const EventCard = ({
  event,
  mode,
  onRegister,
  isRegistered,
  isRestricted,
  onRestrictedClick,
  Icon,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (isRestricted) {
      onRestrictedClick?.();
      return;
    }
    
    // If there's an external registration link, open it in a new tab
    if (event.registration_link) {
      window.open(event.registration_link, '_blank', 'noopener,noreferrer');
      return;
    }
    
    // Otherwise, use the internal registration system
    onRegister?.(event.id);
  };

  const daysUntilEvent = Math.ceil(
    (new Date(event.date) - new Date()) / (1000 * 60 * 60 * 24)
  );
  const isUpcoming = daysUntilEvent > 0;
  const isPast = daysUntilEvent < 0;

  return (
    <div
      className={`group relative overflow-hidden rounded-lg border backdrop-blur-lg transition-all duration-300 transform h-full flex flex-col ${
        mode === "dark"
          ? "bg-[#172840] border-gray-700/60 hover:border-gray-600/80"
          : "bg-[#172840] border-gray-200/70 hover:border-gray-300/80"
      } ${
        isRestricted
          ? "opacity-50 cursor-not-allowed"
          : "hover:shadow-2xl cursor-pointer hover:scale-[1.02] hover:-translate-y-2"
      }`}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-disabled={isRestricted}
      role="button"
      tabIndex={isRestricted ? -1 : 0}
      aria-label={
        isRestricted
          ? `Restricted event: ${event.title}`
          : event.registration_link
          ? `Register online for event: ${event.title}`
          : `Register for event: ${event.title}`
      }
    >
      {/* Background Gradient Overlay */}
      <div
        className={`absolute inset-0 bg-[#172840] opacity-5 transition-opacity duration-300 ${
          isHovered ? "opacity-10" : "opacity-5"
        } ${isRestricted ? "bg-[#172840]" : ""}`}
      ></div>

      {/* Animated Border */}
      {!isRestricted && (
        <div
          className={`absolute inset-0 rounded-2xl bg-[#172840] opacity-0 transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        ></div>
      )}

      <div className="relative p-6 flex-1 flex flex-col">
        {/* Banner Image */}
        {event.banner_image && (
          <div className="relative w-full h-[150px] mb-4 rounded-lg overflow-hidden">
            <Image
              src={event.banner_image}
              width={1000}
              height={0}
              alt={`Banner for ${event.title}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            
          </div>
        )}

        {/* Header */}
        <div className="mb-4">
          {/* First Row: Icon and Title */}
          <div className="flex items-start space-x-3 mb-3">
            {/* Type Icon */}
            <div
              className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                mode === "dark"
                  ? "bg-gray-700/50 text-paan-blue"
                  : "bg-white text-paan-yellow"
              } ${isHovered ? "scale-95 rotate-12" : ""}`}
            >
              <Icon icon="mdi:calendar-star" className="text-3xl" />
            </div>

            <div className="flex-1 min-w-0">
              <h3
                className={`font-normal text-lg leading-tight mb-1 transition-colors duration-200 ${
                  mode === "dark" ? "text-white" : "text-white"
                } ${isRestricted ? "text-gray-500 dark:text-gray-400" : ""} ${
                  isHovered ? "text-paan-blue dark:text-paan-blue" : ""
                }`}
              >
                {event.title}
              </h3>
            </div>
          </div>

          {/* Second Row: Tier Badge, Event Type and Status Badge */}
          <div className="flex items-center justify-between">
            <div className="[&>span]:!bg-white [&>span]:!text-gray-900 [&>span]:!border-gray-200 [&>span>svg]:!text-[#f25749]">
              <TierBadge
                tier={event.tier_restriction || "Free Member"}
                mode={mode}
              />
            </div>

            {event.event_type && (
              <p
                className={`text-sm font-medium flex bg-gray-100/50 text-gray-100 px-2 py-1 rounded-full w-fit ${
                  isRestricted ? "text-gray-400 dark:text-gray-500" : ""
                }`}
              >
                {event.event_type}
              </p>
            )}

            {/* Status Badges */}
            <div className="flex gap-2">
              {/* Restricted Badge */}
              {isRestricted && (
                <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">
                  <Icon icon="mdi:lock" className="text-sm mr-1" />
                  Restricted
                </div>
              )}

              {/* Upcoming Badge */}
              {isUpcoming && !isRestricted && (
                <div className="bg-paan-blue text-white text-xs font-semibold px-2 py-1 rounded-full">
                  Upcoming
                </div>
              )}

              {/* Past Badge */}
              {isPast && !isRestricted && (
                <div className="bg-gradient-to-r from-gray-500 to-gray-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                  Past
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        {event.description && (
          <p
            className={`text-sm mb-4 line-clamp-3 leading-relaxed ${
              mode === "dark" ? "text-gray-400" : "text-white"
            } ${isRestricted ? "text-gray-400 dark:text-gray-500" : ""}`}
          >
            {event.description}
          </p>
        )}

        {/* Details Row */}
        <div
          className={`flex flex-wrap items-center gap-6 text-sm mb-4 ${
            mode === "dark" ? "text-gray-400" : "text-gray-600"
          } ${isRestricted ? "text-gray-400 dark:text-gray-500" : ""}`}
        >
          {/* Date */}
          <div className="flex items-center space-x-1.5 hover:scale-105 transition-transform duration-200 text-white">
            <Icon
              icon={isUpcoming ? "mdi:calendar" : "mdi:calendar-check"}
              className={`text-lg ${
                isUpcoming ? "text-paan-red" : "text-paan-yellow"
              }`}
            />
            <span>
              {new Date(event.date).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>

          {/* Location */}
          {event.location && (
            <div className="flex items-center space-x-1.5 hover:scale-105 transition-transform duration-200 text-white">
              <Icon
                icon="mdi:map-marker"
                className="text-lg text-paan-yellow"
              />
              <span>{event.location}</span>
            </div>
          )}

          {/* Registration Status */}
          {isRegistered && (
            <div className="flex items-center space-x-1.5 hover:scale-105 transition-transform duration-200 text-white">
              <Icon
                icon="mdi:check-circle"
                className="text-lg text-paan-yellow"
              />
              <span>Registered</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 mt-auto">
          {!event.registration_link && (
            <div className="flex items-center space-x-1.5 text-xs text-gray-500 dark:text-gray-400">
              <Icon icon="mdi:account-group" className="text-sm" />
              <span>{event.attendee_count || 0} attendees</span>
            </div>
          )}
          <button
            onClick={handleClick}
            className={`px-4 py-2 rounded-full font-normal text-xs transition-colors ${
              isRestricted
                ? "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-600 dark:text-gray-400"
                : isRegistered
                ? "bg-paan-yellow hover:bg-paan-yellow/80 dark:bg-paan-yellow dark:hover:bg-paan-yellow/80"
                : "bg-paan-yellow hover:bg-paan-yellow/80 dark:bg-paan-yellow dark:hover:bg-paan-yellow/80"
            }`}
            disabled={isRestricted}
            aria-label={
              isRestricted
                ? `Restricted event: ${event.title}`
                : event.registration_link
                ? `Register online for ${event.title}`
                : `${isRegistered ? "Unregister" : "Register"} for ${event.title}`
            }
          >
            {isRestricted
              ? "Restricted"
              : isRegistered
              ? "Registered"
              : event.registration_link
              ? "Register Online"
              : "Register Now"}
          </button>
        </div>

        {/* Hover Glow Effect */}
        {!isRestricted && (
          <div
            className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-paan-blue/5 via-paan-blue/5 to-paan-red/5 opacity-0 transition-opacity duration-500 pointer-events-none ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          ></div>
        )}
      </div>
    </div>
  );
};

export default EventCard;
