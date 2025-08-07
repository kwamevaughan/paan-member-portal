import { Icon } from "@iconify/react";
import FormField from "./FormField";

export default function PersonalInfoTab({ 
  profileData, 
  formData, 
  handleInputChange, 
  isEditing, 
  mode 
}) {
  return (
    <div
      className={`rounded-2xl p-8 shadow-xl transition-all duration-500 ${
        mode === "dark"
          ? "bg-gray-800 border border-gray-700"
          : "bg-white border border-gray-100"
      }`}
    >
      <div className="flex items-center space-x-3 mb-8">
        <div className={`p-3 rounded-xl ${mode === "dark" ? "bg-paan-blue/20" : "bg-paan-blue/30"}`}>
          <Icon icon="mdi:account" className={`w-6 h-6 ${mode === "dark" ? "text-paan-blue" : "text-paan-dark-blue"}`} />
        </div>
        <h3 className={`text-2xl font-bold ${mode === "dark" ? "text-white" : "text-gray-900"}`}>
          Personal Information
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <FormField
          label="Full Name"
          value={isEditing ? formData.primaryContactName : profileData?.primaryContactName}
          onChange={(value) => handleInputChange("primaryContactName", value)}
          isEditing={isEditing}
          placeholder="Enter your full name"
          icon="mdi:account"
          borderColor="paan-blue"
          mode={mode}
        />

        <FormField
          label="Email Address"
          value={profileData?.primaryContactEmail}
          isReadOnly={true}
          readOnlyMessage="Contact support to change email"
          mode={mode}
        />

        <FormField
          label="Phone Number"
          value={isEditing ? formData.primaryContactPhone : profileData?.primaryContactPhone}
          onChange={(value) => handleInputChange("primaryContactPhone", value)}
          isEditing={isEditing}
          type="tel"
          placeholder="+1 (555) 123-4567"
          icon="mdi:phone"
          borderColor="green-500"
          mode={mode}
        />

        <FormField
          label="Role / Position"
          value={isEditing ? formData.primaryContactRole : profileData?.primaryContactRole}
          onChange={(value) => handleInputChange("primaryContactRole", value)}
          isEditing={isEditing}
          placeholder="e.g., CEO, Founder, Manager"
          icon="mdi:briefcase"
          borderColor="purple-500"
          mode={mode}
        />
      </div>
    </div>
  );
}