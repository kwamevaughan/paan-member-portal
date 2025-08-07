import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useUser } from "../hooks/useUser";
import { useProfile } from "../hooks/useProfile";
import useLogout from "../hooks/useLogout";
import HrHeader from "../layouts/hrHeader";
import HrSidebar from "../layouts/hrSidebar";
import SimpleFooter from "../layouts/simpleFooter";
import useSidebar from "../hooks/useSidebar";
import { Icon } from "@iconify/react";
import { formatDateWithOrdinal } from "../utils/dateUtils";

// Profile Components
import ProfileHeader from "../components/profile/ProfileHeader";
import TabNavigation from "../components/profile/TabNavigation";
import PersonalInfoTab from "../components/profile/PersonalInfoTab";
import BusinessInfoTab from "../components/profile/BusinessInfoTab";
import SecurityTab from "../components/profile/SecurityTab";
import ProfileSidebar from "../components/profile/ProfileSidebar";

export default function Profile({ mode = "light", toggleMode }) {
  const { isSidebarOpen, toggleSidebar, isMobile, windowWidth } = useSidebar();
  const router = useRouter();
  const { user, loading: userLoading } = useUser();
  const { handleLogout } = useLogout();
  const { profileData, loading, saving, updateProfile } = useProfile(user?.id);

  // Profile state
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [formData, setFormData] = useState({
    primaryContactName: "",
    primaryContactPhone: "",
    headquartersLocation: "",
    primaryContactRole: "",
    websiteUrl: "",
    primaryContactLinkedin: "",
  });

  // Update form data when profile data changes
  useEffect(() => {
    if (profileData) {
      setFormData({
        primaryContactName: profileData.primaryContactName || "",
        primaryContactPhone: profileData.primaryContactPhone || "",
        headquartersLocation: profileData.headquartersLocation || "",
        primaryContactRole: profileData.primaryContactRole || "",
        websiteUrl: profileData.websiteUrl || "",
        primaryContactLinkedin: profileData.primaryContactLinkedin || "",
      });
    }
  }, [profileData]);

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Save profile changes
  const handleSave = async () => {
    const success = await updateProfile(formData);
    if (success) {
      setIsEditing(false);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    if (profileData) {
      setFormData({
        primaryContactName: profileData.primaryContactName || "",
        primaryContactPhone: profileData.primaryContactPhone || "",
        headquartersLocation: profileData.headquartersLocation || "",
        primaryContactRole: profileData.primaryContactRole || "",
        websiteUrl: profileData.websiteUrl || "",
        primaryContactLinkedin: profileData.primaryContactLinkedin || "",
      });
    }
    setIsEditing(false);
  };

  // Import and use the centralized date utility
  // (formatDate function removed - now using formatDateWithOrdinal from utils)

  // Handle loading and redirect states
  if (userLoading || windowWidth === null) {
    return null;
  }

  if (!user) {
    if (typeof window !== "undefined") {
      router.push("/");
    }
    return null;
  }

  // Render tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case "personal":
        return (
          <PersonalInfoTab
            profileData={profileData}
            formData={formData}
            handleInputChange={handleInputChange}
            isEditing={isEditing}
            mode={mode}
          />
        );
      case "business":
        return (
          <BusinessInfoTab
            profileData={profileData}
            formData={formData}
            handleInputChange={handleInputChange}
            isEditing={isEditing}
            mode={mode}
            user={user}
          />
        );
      case "security":
        return (
          <SecurityTab
            user={user}
            mode={mode}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col ${
        mode === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <HrHeader
        toggleSidebar={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
        user={user}
        mode={mode}
        toggleMode={toggleMode}
        onLogout={handleLogout}
      />
      <div className="flex flex-1">
        <HrSidebar
          isOpen={isSidebarOpen}
          user={user}
          mode={mode}
          toggleSidebar={toggleSidebar}
          onLogout={handleLogout}
          toggleMode={toggleMode}
        />
        <div
          className={`flex-1 p-4 md:p-6 lg:p-8 transition-all mt-20 ${
            isSidebarOpen && !isMobile ? "ml-60" : "ml-60"
          }`}
        >
          <div className="max-w-6xl mx-auto">
            <ProfileHeader
              user={user}
              mode={mode}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              handleSave={handleSave}
              handleCancel={handleCancel}
              saving={saving}
              profileData={profileData}
            />

            <TabNavigation
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              mode={mode}
            />

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="flex items-center space-x-3">
                  <Icon
                    icon="mdi:loading"
                    className="w-8 h-8 animate-spin text-blue-500"
                  />
                  <span
                    className={
                      mode === "dark" ? "text-gray-300" : "text-gray-600"
                    }
                  >
                    Loading profile...
                  </span>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                  {/* Main Content */}
                  <div className="lg:col-span-2">{renderTabContent()}</div>

                  {/* Sidebar */}
                  <ProfileSidebar user={user} mode={mode} />
                </div>

                {/* Quick Actions Row */}
                <div
                  className={`rounded-2xl p-6 shadow-xl ${
                    mode === "dark"
                      ? "bg-gray-800 border border-gray-700"
                      : "bg-white border border-gray-100"
                  }`}
                >
                  <h4
                    className={`text-lg font-bold mb-6 ${
                      mode === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Quick Actions
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      {
                        icon: "mdi:briefcase-outline",
                        label: "Member Resources",
                        desc: "Access exclusive resources",
                        href: "/member-resources",
                      },
                      {
                        icon: "mdi:headset",
                        label: "Support Center",
                        desc: "Get help and support",
                        href: "/support",
                      },
                      {
                        icon: "material-symbols:home-outline",
                        label: "Dashboard",
                        desc: "Return to dashboard",
                        href: "/dashboard",
                      },
                      {
                        icon: "charm:lightbulb",
                        label:
                          user?.job_type?.toLowerCase() === "freelancer"
                            ? "Gigs"
                            : "Opportunities",
                        desc: "Browse opportunities",
                        href: "/business-opportunities",
                      },
                    ].map((action, index) => (
                      <button
                        key={index}
                        onClick={() => router.push(action.href)}
                        className={`flex flex-col items-center space-y-3 p-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                          mode === "dark"
                            ? "bg-gray-700/50 hover:bg-gray-700 text-white"
                            : "bg-gray-50 hover:bg-gray-100 text-gray-900"
                        }`}
                      >
                        <div
                          className={`p-4 rounded-xl ${
                            mode === "dark" ? "bg-blue-600/20" : "bg-paan-blue/20"
                          }`}
                        >
                          <Icon
                            icon={action.icon}
                            className={`w-8 h-8 ${
                              mode === "dark"
                                ? "text-blue-400"
                                : "text-paan-blue"
                            }`}
                          />
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-lg mb-1">
                            {action.label}
                          </div>
                          <div
                            className={`text-sm ${
                              mode === "dark"
                                ? "text-gray-400"
                                : "text-gray-500"
                            }`}
                          >
                            {action.desc}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
          <SimpleFooter mode={mode} isSidebarOpen={isSidebarOpen} />
        </div>
      </div>
    </div>
  );
}
