import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-hot-toast";
import { useProfile } from "../hooks/useProfile";

export default function BookingForm({ user, onClose, mode, accessHub }) {
  const { profileData } = useProfile(user?.id);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: user?.full_name || user?.name || "",
    email: user?.email || "",
    company: user?.agencyName || "",
    phone: "",
    spaceType: accessHub?.space_type || "meeting-room",
    date: new Date(),
    startTime: "09:00",
    endTime: "10:00",
    attendees: 1,
    requirements: "",
    purpose: "",
    duration: 1,

    budget: "",
    recurring: false,
    recurringType: "weekly",
    recurringEnd: null,
  });

  // Update phone number when profile data is loaded
  useEffect(() => {
    if (profileData?.primaryContactPhone) {
      setFormData((prev) => ({
        ...prev,
        phone: profileData.primaryContactPhone,
      }));
    }
  }, [profileData]);

  const spaceTypes = [
    { value: "meeting-room", label: "Meeting Room", icon: "mdi:account-group" },
    { value: "boardroom", label: "Boardroom", icon: "mdi:office-building" },
    { value: "coworking", label: "Co-working Space", icon: "mdi:laptop" },
    { value: "event-space", label: "Event Space", icon: "mdi:calendar-star" },
    { value: "private-office", label: "Private Office", icon: "mdi:door" },
    {
      value: "conference-room",
      label: "Conference Room",
      icon: "mdi:presentation",
    },
    { value: "workshop-space", label: "Workshop Space", icon: "mdi:tools" },
  ];

  const timeSlots = [
    "07:00",
    "07:30",
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
  ];

  const purposeOptions = [
    "Business Meeting",
    "Client Presentation",
    "Team Workshop",
    "Training Session",
    "Interview",
    "Networking Event",
    "Product Launch",
    "Conference Call",
    "Other",
  ];

  const budgetRanges = [
    { value: "under-100", label: "Under $100" },
    { value: "100-250", label: "$100 - $250" },
    { value: "250-500", label: "$250 - $500" },
    { value: "500-1000", label: "$500 - $1,000" },
    { value: "over-1000", label: "Over $1,000" },
    { value: "flexible", label: "Flexible" },
  ];

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.startTime) newErrors.startTime = "Start time is required";
    if (!formData.endTime) newErrors.endTime = "End time is required";
    if (formData.startTime >= formData.endTime)
      newErrors.endTime = "End time must be after start time";
    if (formData.attendees < 1)
      newErrors.attendees = "At least 1 attendee is required";
    if (formData.attendees > 100)
      newErrors.attendees = "Maximum 100 attendees allowed";
    if (formData.date && formData.date < new Date().setHours(0, 0, 0, 0)) {
      newErrors.date = "Date cannot be in the past";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({
      ...prev,
      date: date,
    }));

    if (errors.date) {
      setErrors((prev) => ({
        ...prev,
        date: "",
      }));
    }
  };

  const handleRecurringEndChange = (date) => {
    setFormData((prev) => ({
      ...prev,
      recurringEnd: date,
    }));
  };

  // Calculate duration automatically
  useEffect(() => {
    if (formData.startTime && formData.endTime) {
      const start = new Date(`2000-01-01 ${formData.startTime}`);
      const end = new Date(`2000-01-01 ${formData.endTime}`);
      const diffHours = (end - start) / (1000 * 60 * 60);
      if (diffHours > 0) {
        setFormData((prev) => ({
          ...prev,
          duration: diffHours,
        }));
      }
    }
  }, [formData.startTime, formData.endTime]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors below");
      return;
    }

    setIsSubmitting(true);

    try {
      const spaceTypeLabel =
        spaceTypes.find((type) => type.value === formData.spaceType)?.label ||
        formData.spaceType;
      const budgetLabel =
        budgetRanges.find((range) => range.value === formData.budget)?.label ||
        "Not specified";

      const bookingMessage = `
🏢 SPACE BOOKING REQUEST

👤 Contact Information:
Name: ${formData.name}
Email: ${formData.email}
Company: ${formData.company || "Not specified"}
Phone: ${formData.phone}

📅 Booking Details:
Space Type: ${spaceTypeLabel}
Date: ${formData.date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })}
Time: ${formData.startTime} - ${formData.endTime} (${formData.duration} hours)
Number of Attendees: ${formData.attendees}
Purpose: ${formData.purpose || "Not specified"}

Budget Range: ${budgetLabel}

${
  formData.recurring
    ? `🔄 Recurring Booking:
Frequency: ${formData.recurringType}
End Date: ${
        formData.recurringEnd
          ? formData.recurringEnd.toLocaleDateString()
          : "Not specified"
      }
`
    : ""
}

📝 Additional Requirements:
${formData.requirements || "None specified"}

${accessHub ? `\n🏢 Access Hub: ${accessHub.title}` : ""}
      `.trim();

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject: `Space Booking Request - ${spaceTypeLabel} (${formData.date.toLocaleDateString()})`,
          message: bookingMessage,
          email: formData.email,
          name: formData.name,
          bookingData: {
            ...formData,
            accessHub: accessHub
          },
        }),
      });

      if (response.ok) {
        toast.success(
          "Booking request submitted successfully! We'll be in touch within 24 hours to confirm your booking."
        );
        if (onClose) onClose();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit booking");
      }
    } catch (error) {
      console.error("Error submitting booking:", error);
      toast.error(
        error.message || "Failed to submit booking. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`max-w-4xl mx-auto ${
        mode === "dark" ? "text-white" : "text-gray-800"
      }`}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contact Information Section */}
        <div
          className={`p-4 rounded-lg ${
            mode === "dark" ? "bg-gray-800/50" : "bg-gray-50"
          }`}
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Icon icon="mdi:account" className="mr-2 text-paan-blue" />
            Contact Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                  errors.name
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-paan-blue"
                } focus:ring-2 focus:border-transparent ${
                  mode === "dark" ? "bg-gray-700 text-white" : "bg-white"
                }`}
                required
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                readOnly
                className={`w-full px-4 py-2 rounded-lg border transition-colors cursor-not-allowed ${
                  mode === "dark"
                    ? "bg-gray-800 border-gray-600 text-gray-300"
                    : "bg-gray-100 border-gray-300 text-gray-600"
                }`}
                required
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Company */}
            <div>
              <label
                htmlFor="company"
                className="block text-sm font-medium mb-1"
              >
                Agency Name
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-paan-blue focus:border-transparent ${
                  mode === "dark" ? "bg-gray-700 text-white" : "bg-white"
                }`}
                placeholder="Your company name"
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                  errors.phone
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-paan-blue"
                } focus:ring-2 focus:border-transparent ${
                  mode === "dark" ? "bg-gray-700 text-white" : "bg-white"
                }`}
                placeholder="+1 (555) 123-4567"
                required
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
              )}
            </div>
          </div>
        </div>

        {/* Booking Details Section */}
        <div
          className={`p-4 rounded-lg ${
            mode === "dark" ? "bg-gray-800/50" : "bg-gray-50"
          }`}
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Icon icon="mdi:calendar-clock" className="mr-2 text-paan-blue" />
            Booking Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Space Type */}
            <div className="md:col-span-2 lg:col-span-1">
              <label
                htmlFor="spaceType"
                className="block text-sm font-medium mb-1"
              >
                Space Type *
              </label>
              <select
                id="spaceType"
                name="spaceType"
                value={formData.spaceType}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-paan-blue focus:border-transparent ${
                  mode === "dark" ? "bg-gray-700 text-white" : "bg-white"
                }`}
                required
              >
                {spaceTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Picker */}
            <div>
              <label className="block text-sm font-medium mb-1">Date *</label>
              <DatePicker
                selected={formData.date}
                onChange={handleDateChange}
                minDate={new Date()}
                dateFormat="MMMM d, yyyy"
                className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                  errors.date
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-paan-blue"
                } focus:ring-2 focus:border-transparent ${
                  mode === "dark" ? "bg-gray-700 text-white" : "bg-white"
                }`}
                required
              />
              {errors.date && (
                <p className="text-red-500 text-xs mt-1">{errors.date}</p>
              )}
            </div>

            {/* Number of Attendees */}
            <div>
              <label
                htmlFor="attendees"
                className="block text-sm font-medium mb-1"
              >
                Attendees *
              </label>
              <input
                type="number"
                id="attendees"
                name="attendees"
                min="1"
                max="100"
                value={formData.attendees}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                  errors.attendees
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-paan-blue"
                } focus:ring-2 focus:border-transparent ${
                  mode === "dark" ? "bg-gray-700 text-white" : "bg-white"
                }`}
                required
              />
              {errors.attendees && (
                <p className="text-red-500 text-xs mt-1">{errors.attendees}</p>
              )}
            </div>

            {/* Start Time */}
            <div>
              <label
                htmlFor="startTime"
                className="block text-sm font-medium mb-1"
              >
                Start Time *
              </label>
              <select
                id="startTime"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                  errors.startTime
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-paan-blue"
                } focus:ring-2 focus:border-transparent ${
                  mode === "dark" ? "bg-gray-700 text-white" : "bg-white"
                }`}
                required
              >
                {timeSlots.map((time) => (
                  <option key={`start-${time}`} value={time}>
                    {time}
                  </option>
                ))}
              </select>
              {errors.startTime && (
                <p className="text-red-500 text-xs mt-1">{errors.startTime}</p>
              )}
            </div>

            {/* End Time */}
            <div>
              <label
                htmlFor="endTime"
                className="block text-sm font-medium mb-1"
              >
                End Time *
              </label>
              <select
                id="endTime"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg border transition-colors ${
                  errors.endTime
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-paan-blue"
                } focus:ring-2 focus:border-transparent ${
                  mode === "dark" ? "bg-gray-700 text-white" : "bg-white"
                }`}
                required
              >
                {timeSlots.map((time) => (
                  <option key={`end-${time}`} value={time}>
                    {time}
                  </option>
                ))}
              </select>
              {errors.endTime && (
                <p className="text-red-500 text-xs mt-1">{errors.endTime}</p>
              )}
            </div>

            {/* Duration Display */}
            <div>
              <label className="block text-sm font-medium mb-1">Duration</label>
              <div
                className={`px-4 py-2 rounded-lg border border-gray-300 ${
                  mode === "dark"
                    ? "bg-gray-700 text-gray-300"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {formData.duration} hour{formData.duration !== 1 ? "s" : ""}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Details Section */}
        <div
          className={`p-4 rounded-lg ${
            mode === "dark" ? "bg-gray-800/50" : "bg-gray-50"
          }`}
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Icon icon="mdi:information" className="mr-2 text-paan-blue" />
            Additional Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Purpose */}
            <div>
              <label
                htmlFor="purpose"
                className="block text-sm font-medium mb-1"
              >
                Purpose of Meeting
              </label>
              <select
                id="purpose"
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-paan-blue focus:border-transparent ${
                  mode === "dark" ? "bg-gray-700 text-white" : "bg-white"
                }`}
              >
                <option value="">Select purpose...</option>
                {purposeOptions.map((purpose) => (
                  <option key={purpose} value={purpose}>
                    {purpose}
                  </option>
                ))}
              </select>
            </div>

            {/* Budget Range */}
            <div>
              <label
                htmlFor="budget"
                className="block text-sm font-medium mb-1"
              >
                Budget Range
              </label>
              <select
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-paan-blue focus:border-transparent ${
                  mode === "dark" ? "bg-gray-700 text-white" : "bg-white"
                }`}
              >
                <option value="">Select budget range...</option>
                {budgetRanges.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Recurring Booking */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="recurring"
                name="recurring"
                checked={formData.recurring}
                onChange={handleChange}
                className="w-4 h-4 text-paan-blue bg-gray-100 border-gray-300 rounded focus:ring-paan-blue focus:ring-2"
              />
              <label htmlFor="recurring" className="text-sm font-medium">
                This is a recurring booking
              </label>
            </div>
          </div>

          {/* Recurring Options */}
          {formData.recurring && (
            <div className="mt-4 p-3 border rounded-lg border-gray-200 dark:border-gray-600">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="recurringType"
                    className="block text-sm font-medium mb-1"
                  >
                    Frequency
                  </label>
                  <select
                    id="recurringType"
                    name="recurringType"
                    value={formData.recurringType}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-paan-blue focus:border-transparent ${
                      mode === "dark" ? "bg-gray-700 text-white" : "bg-white"
                    }`}
                  >
                    <option value="weekly">Weekly</option>
                    <option value="biweekly">Bi-weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    End Date
                  </label>
                  <DatePicker
                    selected={formData.recurringEnd}
                    onChange={handleRecurringEndChange}
                    minDate={formData.date}
                    dateFormat="MMMM d, yyyy"
                    placeholderText="Select end date"
                    className={`w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-paan-blue focus:border-transparent ${
                      mode === "dark" ? "bg-gray-700 text-white" : "bg-white"
                    }`}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Requirements Section */}
        <div
          className={`p-4 rounded-lg ${
            mode === "dark" ? "bg-gray-800/50" : "bg-gray-50"
          }`}
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Icon icon="mdi:clipboard-list" className="mr-2 text-paan-blue" />
            Special Requirements
          </h3>
          <textarea
            id="requirements"
            name="requirements"
            rows="4"
            value={formData.requirements}
            onChange={handleChange}
            placeholder="Please specify any special requirements such as:
• AV equipment (projector, microphone, speakers)
• Catering preferences
• Accessibility needs
• Parking requirements
• Security considerations
• Any other special arrangements"
            className={`w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-paan-blue focus:border-transparent resize-none ${
              mode === "dark"
                ? "bg-gray-700 text-white placeholder-gray-400"
                : "bg-white placeholder-gray-500"
            }`}
          />
          <p
            className={`text-xs mt-2 ${
              mode === "dark" ? "text-gray-400" : "text-gray-500"
            }`}
          >
            The more details you provide, the better we can accommodate your
            needs.
          </p>
        </div>

        {/* Summary & Submit Section */}
        <div
          className={`p-4 rounded-lg border-2 border-dashed ${
            mode === "dark"
              ? "border-gray-600 bg-gray-800/30"
              : "border-gray-300 bg-blue-50/50"
          }`}
        >
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <Icon icon="mdi:clipboard-check" className="mr-2 text-paan-blue" />
            Booking Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
            <div>
              <span className="font-medium">Space:</span>{" "}
              {
                spaceTypes.find((type) => type.value === formData.spaceType)
                  ?.label
              }
            </div>
            <div>
              <span className="font-medium">Date:</span>{" "}
              {formData.date.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </div>
            <div>
              <span className="font-medium">Time:</span> {formData.startTime} -{" "}
              {formData.endTime} ({formData.duration}h)
            </div>
            <div>
              <span className="font-medium">Attendees:</span>{" "}
              {formData.attendees} people
            </div>
            {formData.purpose && (
              <div>
                <span className="font-medium">Purpose:</span> {formData.purpose}
              </div>
            )}
            {formData.recurring && (
              <div>
                <span className="font-medium">Recurring:</span>{" "}
                {formData.recurringType}
                {formData.recurringEnd &&
                  ` until ${formData.recurringEnd.toLocaleDateString()}`}
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-4 border-t border-gray-200 dark:border-gray-600">
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className={`px-6 py-3 border rounded-lg font-medium transition-all duration-200  hover:paan-blue/60 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-paan-blue ${
                  mode === "dark"
                    ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
                disabled={isSubmitting}
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 border border-transparent rounded-lg font-medium text-white bg-paan-blue hover:bg-paan-blue/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-paan-blue flex items-center justify-center transition-all duration-200  hover:paan-blue/60 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Submitting Request...
                </>
              ) : (
                <>
                  <Icon icon="mdi:send" className="w-5 h-5 mr-2" />
                  Submit Booking Request
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
