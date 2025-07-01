import React, { useState } from "react";
import { TierBadge } from "./Badge";
import { Icon } from "@iconify/react";
import Image from "next/image";

const AccessHubCard = ({
  accessHub,
  mode,
  onRegister,
  isRegistered,
  isRestricted,
  onRestrictedClick,
  onClick,
  Icon,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (isRestricted) {
      onRestrictedClick?.();
      return;
    }
    onClick?.(accessHub);
  };

  const handleRegisterClick = (e) => {
    e.stopPropagation(); // Prevent modal from opening
    
    if (isRestricted) {
      onRestrictedClick?.();
      return;
    }
    
    // If there's an external registration link, open it in a new tab
    if (accessHub.registration_link) {
      window.open(accessHub.registration_link, '_blank', 'noopener,noreferrer');
      return;
    }
    
    // Otherwise, use the internal registration system
    onRegister?.(accessHub.id);
  };

  // Utility to strip HTML tags
  const stripHtml = (html) => html ? html.replace(/<[^>]+>/g, '') : '';

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
          ? `Restricted access hub: ${accessHub.title}`
          : `View details for access hub: ${accessHub.title}`
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
        {accessHub.images && accessHub.images.length > 0 && (
          <div className="relative w-full h-[150px] mb-4 rounded-lg overflow-hidden">
            <Image
              src={accessHub.images[0]}
              width={1000}
              height={0}
              alt={`Banner for ${accessHub.title}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
            {/* Availability Status - Top Right Corner */}
            <div className={`absolute top-2 right-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium shadow-lg ${
              accessHub.is_available 
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}>
              <Icon 
                icon={accessHub.is_available ? "mdi:check-circle" : "mdi:close-circle"} 
                className="text-sm mr-1" 
              />
              {accessHub.is_available ? "Available" : "Unavailable"}
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-4">
          <div className="flex items-start space-x-3 mb-3">
            <div
              className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                mode === "dark"
                  ? "bg-gray-700/50 text-paan-blue"
                  : "bg-white text-paan-yellow"
              } ${isHovered ? "scale-95 rotate-12" : ""}`}
            >
              <Icon icon="hugeicons:office" className="text-3xl" />
            </div>
            <div className="flex-1 min-w-0">
              <h3
                className={`font-normal text-lg leading-tight mb-1 transition-colors duration-200 ${
                  mode === "dark" ? "text-white" : "text-white"
                } ${isRestricted ? "text-gray-500 dark:text-gray-400" : ""} ${
                  isHovered ? "text-paan-blue dark:text-paan-blue" : ""
                }`}
              >
                {accessHub.title}
              </h3>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="[&>span]:!bg-white [&>span]:!text-gray-900 [&>span]:!border-gray-200 [&>span>svg]:!text-[#f25749]">
              <TierBadge
                tier={accessHub.tier_restriction || "Free Member"}
                mode={mode}
              />
            </div>
            <div className="flex items-center gap-2">
              {accessHub.space_type && (
                <p
                  className={`text-sm font-medium flex bg-gray-100/50 text-gray-100 px-2 py-1 rounded-full w-fit ${
                    isRestricted ? "text-gray-400 dark:text-gray-500" : ""
                  }`}
                >
                  {accessHub.space_type}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              {isRestricted && (
                <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">
                  <Icon icon="mdi:lock" className="text-sm mr-1" />
                  Restricted
                </div>
              )}
              {isRegistered && (
                <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                  <Icon icon="mdi:check-circle" className="text-sm mr-1" />
                  Registered
                </div>
              )}
            </div>
          </div>
        </div>
        {accessHub.description && (
          <p
            className={`text-sm mb-4 line-clamp-3 leading-relaxed ${
              mode === "dark" ? "text-gray-400" : "text-white"
            } ${isRestricted ? "text-gray-400 dark:text-gray-500" : ""}`}
          >
            {stripHtml(accessHub.description)}
          </p>
        )}
        <div
          className={`flex flex-wrap items-center gap-6 text-sm mb-4 ${
            mode === "dark" ? "text-gray-400" : "text-gray-600"
          } ${isRestricted ? "text-gray-400 dark:text-gray-500" : ""}`}
        >
          
          {/* Capacity */}
          {accessHub.capacity && (
            <div
              className={`flex items-center space-x-1.5 ${
                mode === "dark" ? "text-gray-400" : "text-gray-100"
              }`}
            >
              <Icon
                icon="mdi:account-group"
                className="text-lg text-paan-yellow"
              />
              <span>Capacity: {accessHub.capacity}</span>
            </div>
          )}
          {/* Pricing */}
          {accessHub.pricing_per_day && (
            <div
              className={`flex items-center space-x-1.5 ${
                mode === "dark" ? "text-gray-400" : "text-gray-100"
              }`}
            >
              <Icon
                icon="mdi:currency-usd"
                className="text-lg text-paan-yellow"
              />
              <span>${accessHub.pricing_per_day}/day</span>
            </div>
          )}
          {/* Amenities */}
          {accessHub.amenities && accessHub.amenities.length > 0 && (
            <div
              className={`flex items-center space-x-1.5 ${
                mode === "dark" ? "text-gray-400" : "text-gray-100"
              }`}
            >
              <Icon icon="mdi:star" className="text-lg text-paan-yellow" />
              <span>Amenities: {accessHub.amenities.join(", ")}</span>
            </div>
          )}
        </div>
        {/* Footer: Location and View Details Button */}
        <div className="flex items-center justify-between pt-4 mt-auto">
          {accessHub.city && accessHub.country && (
            <div
              className={`flex items-center space-x-1.5 ${
                mode === "dark" ? "text-gray-400" : "text-gray-100"
              }`}
            >
              <Icon
                icon="mdi:map-marker"
                className="text-lg text-paan-yellow"
              />
              <span>
                {accessHub.city}, {accessHub.country}
              </span>
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
                ? `Restricted access hub: ${accessHub.title}`
                : `${isRegistered ? "Unregister" : "Register"} for ${
                    accessHub.title
                  }`
            }
          >
            {isRestricted
              ? "Restricted"
              : isRegistered
              ? "Registered"
              : "View Details"}
          </button>
        </div>
        {!isRestricted && (
          <div
            className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-paan-blue/5 via-paan-blue/5 to-paan-yellow/5 opacity-0 transition-opacity duration-500 pointer-events-none ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          ></div>
        )}
      </div>
    </div>
  );
};

export default AccessHubCard;
