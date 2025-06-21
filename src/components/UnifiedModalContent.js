import { Icon } from "@iconify/react";
import Image from "next/image";

const UnifiedModalContent = ({ 
  modalData, 
  mode, 
  registeredEvents, 
  handleEventRegistration, 
  onClose 
}) => {
  if (!modalData) return null;

  if (modalData.type === 'intelligence') {
    return (
      <div className="space-y-6">
        {/* Intelligence Header */}
        <div className="flex items-start space-x-4">
          <div
            className={`flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center ${
              mode === "dark"
                ? "bg-gray-700/50 text-paan-blue"
                : "bg-white text-paan-yellow"
            }`}
          >
            <Icon icon="mdi:chart-line" className="text-3xl" />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold mb-2">
              {modalData.title}
            </h3>
            {modalData.type && (
              <p
                className={`text-sm font-medium ${
                  mode === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {modalData.type}
              </p>
            )}
          </div>
          <div className="flex-shrink-0">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                mode === "dark"
                  ? "bg-blue-900/30 text-blue-400 border border-blue-700/50"
                  : "bg-blue-100 text-blue-800 border border-blue-200"
              }`}
            >
              {modalData.tier_restriction || "All Members"}
            </span>
          </div>
        </div>

        {/* Description */}
        {modalData.description && (
          <div>
            <h4
              className={`text-lg font-semibold mb-2 ${
                mode === "dark" ? "text-gray-200" : "text-gray-800"
              }`}
            >
              Description
            </h4>
            <p
              className={`text-sm leading-relaxed ${
                mode === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {modalData.description}
            </p>
          </div>
        )}

        {/* Tags */}
        {modalData.tags && modalData.tags.length > 0 && (
          <div>
            <h4
              className={`text-lg font-semibold mb-3 ${
                mode === "dark" ? "text-gray-200" : "text-gray-800"
              }`}
            >
              Tags
            </h4>
            <div className="flex flex-wrap gap-2">
              {modalData.tags.map((tag, index) => (
                <span
                  key={index}
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    mode === "dark"
                      ? "bg-gray-700/60 text-gray-300"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  <Icon
                    icon="mdi:tag"
                    className="text-paan-yellow text-sm mr-1"
                  />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Region */}
          {modalData.region && (
            <div
              className={`p-4 rounded-lg ${
                mode === "dark" ? "bg-gray-800/50" : "bg-gray-50"
              }`}
            >
              <div className="flex items-center space-x-2 mb-2">
                <Icon
                  icon="mdi:map-marker"
                  className="text-lg text-paan-yellow"
                />
                <span
                  className={`font-semibold ${
                    mode === "dark" ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  {modalData.region}
                </span>
              </div>
              <p
                className={`text-sm ${
                  mode === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Region
              </p>
            </div>
          )}

          {/* Created Date */}
          {modalData.created_at && (
            <div
              className={`p-4 rounded-lg ${
                mode === "dark" ? "bg-gray-800/50" : "bg-gray-50"
              }`}
            >
              <div className="flex items-center space-x-2 mb-2">
                <Icon
                  icon="mdi:calendar"
                  className="text-lg text-paan-red"
                />
                <span
                  className={`font-semibold ${
                    mode === "dark" ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  {new Date(modalData.created_at).toLocaleDateString()}
                </span>
              </div>
              <p
                className={`text-sm ${
                  mode === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Created Date
              </p>
            </div>
          )}

          {/* Downloadable */}
          {modalData.downloadable && (
            <div
              className={`p-4 rounded-lg ${
                mode === "dark" ? "bg-gray-800/50" : "bg-gray-50"
              }`}
            >
              <div className="flex items-center space-x-2 mb-2">
                <Icon
                  icon="mdi:download"
                  className="text-lg text-paan-yellow"
                />
                <span
                  className={`font-semibold ${
                    mode === "dark"
                      ? "text-paan-yellow"
                      : "text-paan-yellow"
                  }`}
                >
                  Available
                </span>
              </div>
              <p
                className={`text-sm ${
                  mode === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Downloadable
              </p>
            </div>
          )}

          {/* Intel Type */}
          {modalData.intel_type && (
            <div
              className={`p-4 rounded-lg ${
                mode === "dark" ? "bg-gray-800/50" : "bg-gray-50"
              }`}
            >
              <div className="flex items-center space-x-2 mb-2">
                <Icon
                  icon="mdi:file-chart"
                  className="text-lg text-paan-blue"
                />
                <span
                  className={`font-semibold ${
                    mode === "dark" ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  {modalData.intel_type}
                </span>
              </div>
              <p
                className={`text-sm ${
                  mode === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Intelligence Type
              </p>
            </div>
          )}

          {/* View Count */}
          {modalData.view_count && (
            <div
              className={`p-4 rounded-lg ${
                mode === "dark" ? "bg-gray-800/50" : "bg-gray-50"
              }`}
            >
              <div className="flex items-center space-x-2 mb-2">
                <Icon icon="mdi:eye" className="text-lg text-green-500" />
                <span
                  className={`font-semibold ${
                    mode === "dark" ? "text-green-400" : "text-green-600"
                  }`}
                >
                  {modalData.view_count}
                </span>
              </div>
              <p
                className={`text-sm ${
                  mode === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Views
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className={`px-6 py-3 text-sm font-medium rounded-xl border transition-all duration-200 ${
              mode === "dark"
                ? "border-gray-600 text-gray-200 bg-gray-800 hover:bg-gray-700"
                : "border-gray-200 text-gray-700 bg-white hover:bg-gray-50"
            }`}
          >
            Close
          </button>
          {modalData.url && (
            <button
              onClick={() => window.open(modalData.url, "_blank")}
              className={`px-6 py-3 text-sm font-medium rounded-xl text-white bg-[#f25749] hover:bg-[#e04a3d] transition-all duration-200 ${
                mode === "dark" ? "shadow-white/10" : "shadow-gray-200"
              }`}
            >
              View Report
            </button>
          )}
          {modalData.downloadable && (
            <button
              className={`px-6 py-3 text-sm font-medium rounded-xl text-white bg-paan-blue hover:bg-paan-blue/80 transition-all duration-200 ${
                mode === "dark" ? "shadow-white/10" : "shadow-gray-200"
              }`}
            >
              Download
            </button>
          )}
        </div>
      </div>
    );
  }

  if (modalData.type === 'event') {
    return (
      <div className="space-y-6">
        {/* Event Header */}
        <div className="flex items-start space-x-4">
          <div
            className={`flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center ${
              mode === "dark"
                ? "bg-gray-700/50 text-paan-blue"
                : "bg-white text-paan-yellow"
            }`}
          >
            <Icon icon="mdi:calendar-star" className="text-3xl" />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold mb-2">
              {modalData.title}
            </h3>
            {modalData.event_type && (
              <p
                className={`text-sm font-medium ${
                  mode === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {modalData.event_type}
              </p>
            )}
          </div>
          <div className="flex-shrink-0">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                mode === "dark"
                  ? "bg-blue-900/30 text-blue-400 border border-blue-700/50"
                  : "bg-blue-100 text-blue-800 border border-blue-200"
              }`}
            >
              {modalData.tier_restriction || "All Members"}
            </span>
          </div>
        </div>

        {/* Banner Image in Modal */}
        {modalData.banner_image && (
          <div className="relative w-full h-full mb-4 rounded-lg overflow-hidden">
            <Image
              src={modalData.banner_image}
              width={1000}
              height={0}
              alt={`Banner for ${modalData.title}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </div>
        )}

        {/* Description */}
        {modalData.description && (
          <div>
            <h4
              className={`text-lg font-semibold mb-2 ${
                mode === "dark" ? "text-gray-200" : "text-gray-800"
              }`}
            >
              Description
            </h4>
            <p
              className={`text-sm leading-relaxed ${
                mode === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {modalData.description}
            </p>
          </div>
        )}

        {/* Event Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Date */}
          <div
            className={`p-4 rounded-lg ${
              mode === "dark" ? "bg-gray-800/50" : "bg-gray-50"
            }`}
          >
            <div className="flex items-center space-x-2 mb-2">
              <Icon icon="mdi:calendar" className="text-lg text-paan-red" />
              <span
                className={`font-semibold ${
                  mode === "dark" ? "text-gray-200" : "text-gray-800"
                }`}
              >
                {new Date(modalData.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            <p
              className={`text-sm ${
                mode === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Event Date & Time
            </p>
          </div>

          {/* Location */}
          {modalData.location && (
            <div
              className={`p-4 rounded-lg ${
                mode === "dark" ? "bg-gray-800/50" : "bg-gray-50"
              }`}
            >
              <div className="flex items-center space-x-2 mb-2">
                <Icon
                  icon="mdi:map-marker"
                  className="text-lg text-paan-yellow"
                />
                <span
                  className={`font-semibold ${
                    mode === "dark" ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  {modalData.location}
                </span>
              </div>
              <p
                className={`text-sm ${
                  mode === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Location
              </p>
            </div>
          )}

          {/* Virtual Event */}
          {modalData.is_virtual && (
            <div
              className={`p-4 rounded-lg ${
                mode === "dark" ? "bg-gray-800/50" : "bg-gray-50"
              }`}
            >
              <div className="flex items-center space-x-2 mb-2">
                <Icon icon="mdi:video" className="text-lg text-paan-blue" />
                <span
                  className={`font-semibold ${
                    mode === "dark" ? "text-paan-blue" : "text-paan-blue"
                  }`}
                >
                  Virtual Event
                </span>
              </div>
              <p
                className={`text-sm ${
                  mode === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Event Type
              </p>
            </div>
          )}

          {/* Registration Status */}
          <div
            className={`p-4 rounded-lg ${
              mode === "dark" ? "bg-gray-800/50" : "bg-gray-50"
            }`}
          >
            <div className="flex items-center space-x-2 mb-2">
              <Icon
                icon={
                  registeredEvents.some(
                    (reg) => reg.id === modalData.id
                  )
                    ? "mdi:check-circle"
                    : "mdi:account-plus"
                }
                className={`text-lg ${
                  registeredEvents.some(
                    (reg) => reg.id === modalData.id
                  )
                    ? "text-green-500"
                    : "text-paan-yellow"
                }`}
              />
              <span
                className={`font-semibold ${
                  mode === "dark"
                    ? registeredEvents.some(
                        (reg) => reg.id === modalData.id
                      )
                      ? "text-green-400"
                      : "text-gray-200"
                    : registeredEvents.some(
                        (reg) => reg.id === modalData.id
                      )
                    ? "text-green-600"
                    : "text-gray-800"
                }`}
              >
                {registeredEvents.some((reg) => reg.id === modalData.id)
                  ? "Registered"
                  : "Not Registered"}
              </span>
            </div>
            <p
              className={`text-sm ${
                mode === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Registration Status
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className={`px-6 py-3 text-sm font-medium rounded-xl border transition-all duration-200 ${
              mode === "dark"
                ? "border-gray-600 text-gray-200 bg-gray-800 hover:bg-gray-700"
                : "border-gray-200 text-gray-700 bg-white hover:bg-gray-50"
            }`}
          >
            Close
          </button>
          {!registeredEvents.some((reg) => reg.id === modalData.id) && (
            <button
              onClick={() => {
                if (modalData.registration_link) {
                  window.open(
                    modalData.registration_link,
                    "_blank",
                    "noopener,noreferrer"
                  );
                } else {
                  handleEventRegistration(modalData.id);
                }
              }}
              className={`px-6 py-3 text-sm font-medium rounded-xl text-white transition-all duration-200 ${
                modalData.registration_link
                  ? "bg-[#f25749] hover:bg-[#e04a3d]"
                  : "bg-paan-blue hover:bg-paan-blue/80"
              } ${mode === "dark" ? "shadow-white/10" : "shadow-gray-200"}`}
            >
              {modalData.registration_link
                ? "Register Online"
                : "Register Now"}
            </button>
          )}
        </div>
      </div>
    );
  }

  if (modalData.type === 'resource') {
    return (
      <div className="space-y-6">
        {/* Resource Header */}
        <div className="flex items-start space-x-4">
          <div
            className={`flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center ${
              mode === "dark"
                ? "bg-gray-700/50 text-paan-blue"
                : "bg-white text-paan-yellow"
            }`}
          >
            <Icon icon="mdi:book-open" className="text-3xl" />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold mb-2">
              {modalData.title}
            </h3>
            {modalData.resource_type && (
              <p
                className={`text-sm font-medium ${
                  mode === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {modalData.resource_type}
              </p>
            )}
          </div>
          <div className="flex-shrink-0">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                mode === "dark"
                  ? "bg-blue-900/30 text-blue-400 border border-blue-700/50"
                  : "bg-blue-100 text-blue-800 border border-blue-200"
              }`}
            >
              {modalData.tier_restriction || "All Members"}
            </span>
          </div>
        </div>

        {/* Description */}
        {modalData.description && (
          <div>
            <h4
              className={`text-lg font-semibold mb-2 ${
                mode === "dark" ? "text-gray-200" : "text-gray-800"
              }`}
            >
              Description
            </h4>
            <p
              className={`text-sm leading-relaxed ${
                mode === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {modalData.description}
            </p>
          </div>
        )}

        {/* Tags */}
        {modalData.tags && modalData.tags.length > 0 && (
          <div>
            <h4
              className={`text-lg font-semibold mb-3 ${
                mode === "dark" ? "text-gray-200" : "text-gray-800"
              }`}
            >
              Tags
            </h4>
            <div className="flex flex-wrap gap-2">
              {modalData.tags.map((tag, index) => (
                <span
                  key={index}
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    mode === "dark"
                      ? "bg-gray-700/60 text-gray-300"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  <Icon
                    icon="mdi:tag"
                    className="text-paan-yellow text-sm mr-1"
                  />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Resource Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Format */}
          {modalData.format && (
            <div
              className={`p-4 rounded-lg ${
                mode === "dark" ? "bg-gray-800/50" : "bg-gray-50"
              }`}
            >
              <div className="flex items-center space-x-2 mb-2">
                <Icon
                  icon="mdi:file-document"
                  className="text-lg text-amber-400"
                />
                <span
                  className={`font-semibold ${
                    mode === "dark" ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  {modalData.format}
                </span>
              </div>
              <p
                className={`text-sm ${
                  mode === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Format
              </p>
            </div>
          )}

          {/* Duration */}
          {modalData.duration && (
            <div
              className={`p-4 rounded-lg ${
                mode === "dark" ? "bg-gray-800/50" : "bg-gray-50"
              }`}
            >
              <div className="flex items-center space-x-2 mb-2">
                <Icon
                  icon="mdi:clock-outline"
                  className="text-lg text-[#f25749]"
                />
                <span
                  className={`font-semibold ${
                    mode === "dark" ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  {modalData.duration}
                </span>
              </div>
              <p
                className={`text-sm ${
                  mode === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Duration
              </p>
            </div>
          )}

          {/* Language */}
          {modalData.language && (
            <div
              className={`p-4 rounded-lg ${
                mode === "dark" ? "bg-gray-800/50" : "bg-gray-50"
              }`}
            >
              <div className="flex items-center space-x-2 mb-2">
                <Icon
                  icon="mdi:translate"
                  className="text-lg text-green-500"
                />
                <span
                  className={`font-semibold ${
                    mode === "dark" ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  {modalData.language}
                </span>
              </div>
              <p
                className={`text-sm ${
                  mode === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Language
              </p>
            </div>
          )}

          {/* File Size */}
          {modalData.file_size && (
            <div
              className={`p-4 rounded-lg ${
                mode === "dark" ? "bg-gray-800/50" : "bg-gray-50"
              }`}
            >
              <div className="flex items-center space-x-2 mb-2">
                <Icon
                  icon="mdi:file-size"
                  className="text-lg text-[#85c1da]"
                />
                <span
                  className={`font-semibold ${
                    mode === "dark" ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  {modalData.file_size}
                </span>
              </div>
              <p
                className={`text-sm ${
                  mode === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                File Size
              </p>
            </div>
          )}

          {/* Created Date */}
          {modalData.created_at && (
            <div
              className={`p-4 rounded-lg ${
                mode === "dark" ? "bg-gray-800/50" : "bg-gray-50"
              }`}
            >
              <div className="flex items-center space-x-2 mb-2">
                <Icon
                  icon="mdi:calendar"
                  className="text-lg text-[#f25749]"
                />
                <span
                  className={`font-semibold ${
                    mode === "dark" ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  {new Date(modalData.created_at).toLocaleDateString()}
                </span>
              </div>
              <p
                className={`text-sm ${
                  mode === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Created Date
              </p>
            </div>
          )}

          {/* Download Count */}
          <div
            className={`p-4 rounded-lg ${
              mode === "dark" ? "bg-gray-800/50" : "bg-gray-50"
            }`}
          >
            <div className="flex items-center space-x-2 mb-2">
              <Icon
                icon="mdi:download"
                className="text-lg text-paan-yellow"
              />
              <span
                className={`font-semibold ${
                  mode === "dark" ? "text-gray-200" : "text-gray-800"
                }`}
              >
                {modalData.download_count || 0}
              </span>
            </div>
            <p
              className={`text-sm ${
                mode === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Downloads
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className={`px-6 py-3 text-sm font-medium rounded-xl border transition-all duration-200 ${
              mode === "dark"
                ? "border-gray-600 text-gray-200 bg-gray-800 hover:bg-gray-700"
                : "border-gray-200 text-gray-700 bg-white hover:bg-gray-50"
            }`}
          >
            Close
          </button>
          {modalData.file_path && (
            <button
              onClick={() => {
                const url = modalData.file_path;
                window.open(url, "_blank", "noopener,noreferrer");
              }}
              className={`px-6 py-3 text-sm font-medium rounded-xl text-white bg-paan-blue hover:bg-paan-blue/80 transition-all duration-200 ${
                mode === "dark" ? "shadow-white/10" : "shadow-gray-200"
              }`}
            >
              Download Resource
            </button>
          )}
          {modalData.video_url && (
            <button
              onClick={() => {
                window.open(modalData.video_url, "_blank", "noopener,noreferrer");
              }}
              className={`px-6 py-3 text-sm font-medium rounded-xl text-white bg-paan-blue hover:bg-paan-blue/80 transition-all duration-200 ${
                mode === "dark" ? "shadow-white/10" : "shadow-gray-200"
              }`}
            >
              Watch Video
            </button>
          )}
          {modalData.url && !modalData.file_path && !modalData.video_url && (
            <button
              onClick={() => {
                window.open(modalData.url, "_blank", "noopener,noreferrer");
              }}
              className={`px-6 py-3 text-sm font-medium rounded-xl text-white bg-paan-blue hover:bg-paan-blue/80 transition-all duration-200 ${
                mode === "dark" ? "shadow-white/10" : "shadow-gray-200"
              }`}
            >
              Access Resource
            </button>
          )}
        </div>
      </div>
    );
  }

  if (modalData.type === 'offer') {
    return (
      <div className="space-y-6">
        {/* Offer Header */}
        <div className="flex items-start space-x-4">
          <div
            className={`flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center ${
              mode === "dark"
                ? "bg-gray-700/50 text-paan-blue"
                : "bg-white text-paan-yellow"
            }`}
          >
            <Icon icon="mdi:tag" className="text-3xl" />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold mb-2">
              {modalData.title}
            </h3>
            {modalData.offer_type && (
              <p
                className={`text-sm font-medium ${
                  mode === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {modalData.offer_type}
              </p>
            )}
          </div>
          <div className="flex-shrink-0">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                mode === "dark"
                  ? "bg-blue-900/30 text-blue-400 border border-blue-700/50"
                  : "bg-blue-100 text-blue-800 border border-blue-200"
              }`}
            >
              {modalData.tier_restriction || "All Members"}
            </span>
          </div>
        </div>

        {/* Description */}
        {modalData.description && (
          <div>
            <h4
              className={`text-lg font-semibold mb-2 ${
                mode === "dark" ? "text-gray-200" : "text-gray-800"
              }`}
            >
              Description
            </h4>
            <p
              className={`text-sm leading-relaxed ${
                mode === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {modalData.description}
            </p>
          </div>
        )}

        {/* Offer Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Rating */}
          <div
            className={`p-4 rounded-lg ${
              mode === "dark" ? "bg-gray-800/50" : "bg-gray-50"
            }`}
          >
            <div className="flex items-center space-x-2 mb-2">
              <Icon icon="mdi:star" className="text-lg text-yellow-500" />
              <span
                className={`font-semibold ${
                  mode === "dark" ? "text-gray-200" : "text-gray-800"
                }`}
              >
                {modalData.averageRating?.toFixed(1) || "N/A"}
              </span>
            </div>
            <p
              className={`text-sm ${
                mode === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Rating ({modalData.feedbackCount || 0} reviews)
            </p>
          </div>

          {/* Created Date */}
          {modalData.created_at && (
            <div
              className={`p-4 rounded-lg ${
                mode === "dark" ? "bg-gray-800/50" : "bg-gray-50"
              }`}
            >
              <div className="flex items-center space-x-2 mb-2">
                <Icon
                  icon="mdi:calendar"
                  className="text-lg text-paan-red"
                />
                <span
                  className={`font-semibold ${
                    mode === "dark" ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  {new Date(modalData.created_at).toLocaleDateString()}
                </span>
              </div>
              <p
                className={`text-sm ${
                  mode === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Created Date
              </p>
            </div>
          )}

          {/* Limited Time */}
          {modalData.limited_time && (
            <div
              className={`p-4 rounded-lg ${
                mode === "dark" ? "bg-gray-800/50" : "bg-gray-50"
              }`}
            >
              <div className="flex items-center space-x-2 mb-2">
                <Icon
                  icon="mdi:clock-alert"
                  className="text-lg text-red-500"
                />
                <span
                  className={`font-semibold ${
                    mode === "dark" ? "text-red-400" : "text-red-600"
                  }`}
                >
                  Limited Time
                </span>
              </div>
              <p
                className={`text-sm ${
                  mode === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Offer Type
              </p>
            </div>
          )}

          {/* Premium Offer */}
          {modalData.offer_type === "Premium" && (
            <div
              className={`p-4 rounded-lg ${
                mode === "dark" ? "bg-gray-800/50" : "bg-gray-50"
              }`}
            >
              <div className="flex items-center space-x-2 mb-2">
                <Icon
                  icon="mdi:crown"
                  className="text-lg text-yellow-500"
                />
                <span
                  className={`font-semibold ${
                    mode === "dark" ? "text-yellow-400" : "text-yellow-600"
                  }`}
                >
                  Premium Offer
                </span>
              </div>
              <p
                className={`text-sm ${
                  mode === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Offer Category
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className={`px-6 py-3 text-sm font-medium rounded-xl border transition-all duration-200 ${
              mode === "dark"
                ? "border-gray-600 text-gray-200 bg-gray-800 hover:bg-gray-700"
                : "border-gray-200 text-gray-700 bg-white hover:bg-gray-50"
            }`}
          >
            Close
          </button>
          {modalData.url && (
            <button
              onClick={() => window.open(modalData.url, "_blank", "noopener,noreferrer")}
              className={`px-6 py-3 text-sm font-medium rounded-xl text-white bg-paan-blue hover:bg-paan-blue/80 transition-all duration-200 ${
                mode === "dark" ? "shadow-white/10" : "shadow-gray-200"
              }`}
            >
              Access Offer
            </button>
          )}
        </div>
      </div>
    );
  }

  return null;
};

export default UnifiedModalContent; 