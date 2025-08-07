import { Icon } from "@iconify/react";
import { TierBadge, JobTypeBadge, normalizeTier } from "../Badge";
import { formatDateWithOrdinal, formatRelativeTime } from "../../utils/dateUtils";

export default function ProfileHeader({ 
  user, 
  mode, 
  isEditing, 
  setIsEditing, 
  handleSave, 
  handleCancel, 
  saving,
  profileData 
}) {
  // Format the display name with agency
  const getDisplayName = () => {
    const userName = user.name || "User";
    const agencyName = profileData?.agencyName;
    
    if (agencyName && agencyName.trim()) {
      return `${userName} - ${agencyName}`;
    }
    return userName;
  };

  return (
    <div className="relative mb-8 overflow-hidden">
      <div
        className={`relative rounded-2xl p-8 ${
          mode === "dark" ? "bg-paan-blue" : "bg-paan-dark-blue"
        } shadow-2xl`}
      >
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-0 left-20 w-40 h-40 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
        </div>

        <div className="relative flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-6 mb-6 md:mb-0">
            {/* Enhanced Avatar */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-white to-gray-100 flex items-center justify-center text-3xl font-bold text-gray-700 shadow-lg ring-4 ring-white/20">
                {user.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                <Icon icon="mdi:check" className="w-4 h-4 text-white" />
              </div>
            </div>

            <div className="text-white">
              <h1 className="text-3xl font-bold mb-2">{getDisplayName()}</h1>
              <p className="text-paan-yellow/90 mb-3">{user.email}</p>
              <div className="flex flex-wrap">
                {user?.job_type?.toLowerCase() === "admin" ? (
                  <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-sm">
                    <JobTypeBadge jobType={user?.job_type} mode="dark" />
                  </div>
                ) : (
                  <>
                    <div className="backdrop-blur-sm rounded-full px-2 py-1 text-sm hover:-translate-y-1 transition-all duration-500 ease-in-out">
                      <TierBadge
                        tier={normalizeTier(user?.selected_tier)}
                        mode="dark"
                      />
                    </div>
                    <div className="backdrop-blur-sm rounded-full px-2 py-1 text-sm hover:-translate-y-1 transition-all duration-500 ease-in-out">
                      <JobTypeBadge jobType={user?.job_type} mode="dark" />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col items-end space-y-3">
            {!isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="group flex items-center space-x-2 px-6 py-3 bg-paan-red backdrop-blur-sm hover:bg-paan-red/90 text-white rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg border border-paan-yellow/30"
                >
                  <Icon
                    icon="mdi:pencil"
                    className="w-5 h-5 group-hover:rotate-12 transition-transform"
                  />
                  <span className="font-medium">Edit Profile</span>
                </button>
                <div className="text-right space-y-1">
                  <p className="text-white/70 text-sm">
                    Last Updated:{" "}
                    <span className="text-white/90 font-medium">
                      {formatRelativeTime(profileData?.updated_at)}
                    </span>
                  </p>
                  <p className="text-white/70 text-sm">
                    Member Since:{" "}
                    <span className="text-white/90 font-medium">
                      {formatDateWithOrdinal(user?.created_at)}
                    </span>
                  </p>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCancel}
                  className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-300"
                >
                  <Icon icon="mdi:close" className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center space-x-2 px-6 py-2 bg-paan-yellow hover:bg-paan-yellow/90 text-paan-dark-blue font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 hover:scale-105"
                >
                  {saving ? (
                    <Icon icon="mdi:loading" className="w-4 h-4 animate-spin" />
                  ) : (
                    <Icon icon="mdi:check" className="w-4 h-4" />
                  )}
                  <span>{saving ? "Saving..." : "Save Changes"}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}