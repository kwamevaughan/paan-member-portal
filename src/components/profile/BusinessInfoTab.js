import { Icon } from "@iconify/react";
import FormField from "./FormField";

export default function BusinessInfoTab({ 
  profileData, 
  formData, 
  handleInputChange, 
  isEditing, 
  mode, 
  user 
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
        <div className={`p-3 rounded-xl ${mode === "dark" ? "bg-paan-red/20" : "bg-paan-red/30"}`}>
          <Icon icon="mdi:domain" className={`w-6 h-6 ${mode === "dark" ? "text-paan-red" : "text-paan-dark-blue"}`} />
        </div>
        <h3 className={`text-2xl font-bold ${mode === "dark" ? "text-white" : "text-gray-900"}`}>
          Business Information
        </h3>
      </div>

      <div className="space-y-8">
        <FormField
          label={user?.job_type?.toLowerCase() === "freelancer" ? "Business Name" : "Agency Name"}
          value={profileData?.agencyName}
          isReadOnly={true}
          readOnlyMessage="Contact support to change business name"
          mode={mode}
        />

        <FormField
          label="Headquarters Location"
          value={isEditing ? formData.headquartersLocation : profileData?.headquartersLocation}
          onChange={(value) => handleInputChange("headquartersLocation", value)}
          isEditing={isEditing}
          placeholder="e.g., Lagos, Nigeria"
          icon="mdi:map-marker"
          borderColor="orange-500"
          mode={mode}
        />

        <FormField
          label="Year Established"
          value={profileData?.yearEstablished}
          isReadOnly={true}
          mode={mode}
        />

        <FormField
          label="Website"
          value={isEditing ? formData.websiteUrl : profileData?.websiteUrl}
          onChange={(value) => handleInputChange("websiteUrl", value)}
          isEditing={isEditing}
          type="url"
          placeholder="https://example.com"
          icon="mdi:web"
          borderColor="blue-500"
          mode={mode}
          isLink={!isEditing}
        />

        <FormField
          label="LinkedIn Profile"
          value={isEditing ? formData.primaryContactLinkedin : profileData?.primaryContactLinkedin}
          onChange={(value) => handleInputChange("primaryContactLinkedin", value)}
          isEditing={isEditing}
          type="url"
          placeholder="https://linkedin.com/in/yourprofile"
          icon="mdi:linkedin"
          borderColor="blue-600"
          mode={mode}
          isLink={!isEditing}
          linkText="View LinkedIn Profile"
        />

        <FormField
          label="Registered Office Address"
          value={profileData?.registeredOfficeAddress}
          isReadOnly={true}
          mode={mode}
        />
      </div>
    </div>
  );
}