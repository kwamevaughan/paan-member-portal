import { Icon } from "@iconify/react";
import { normalizeTier } from "../Badge";

export default function AccountTab({ user, mode, formatDate }) {
  return (
    <div
      className={`rounded-2xl p-8 shadow-xl transition-all duration-500 ${
        mode === "dark"
          ? "bg-gray-800 border border-gray-700"
          : "bg-white border border-gray-100"
      }`}
    >
      <div className="flex items-center space-x-3 mb-8">
        <div className={`p-3 rounded-xl ${mode === "dark" ? "bg-purple-600/20" : "bg-purple-100"}`}>
          <Icon icon="mdi:cog" className={`w-6 h-6 ${mode === "dark" ? "text-purple-400" : "text-purple-600"}`} />
        </div>
        <h3 className={`text-2xl font-bold ${mode === "dark" ? "text-white" : "text-gray-900"}`}>
          Account Settings
        </h3>
      </div>

      {/* Account Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className={`p-6 rounded-xl text-center ${mode === "dark" ? "bg-green-600/20" : "bg-green-50"} border border-green-200`}>
          <Icon icon="mdi:check-circle" className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <div className="text-2xl font-bold text-green-600 mb-1">Active</div>
          <div className={`text-sm ${mode === "dark" ? "text-gray-400" : "text-gray-500"}`}>Account Status</div>
        </div>

        <div className={`p-6 rounded-xl text-center ${mode === "dark" ? "bg-blue-600/20" : "bg-blue-50"} border border-blue-200`}>
          <Icon icon="mdi:star" className="w-12 h-12 text-blue-500 mx-auto mb-3" />
          <div className="text-2xl font-bold text-blue-600 mb-1">{normalizeTier(user?.selected_tier)}</div>
          <div className={`text-sm ${mode === "dark" ? "text-gray-400" : "text-gray-500"}`}>Membership Tier</div>
        </div>

        <div className={`p-6 rounded-xl text-center ${mode === "dark" ? "bg-purple-600/20" : "bg-purple-50"} border border-purple-200`}>
          <Icon icon="mdi:account-group" className="w-12 h-12 text-purple-500 mx-auto mb-3" />
          <div className="text-2xl font-bold text-purple-600 mb-1 capitalize">{user?.job_type || "Member"}</div>
          <div className={`text-sm ${mode === "dark" ? "text-gray-400" : "text-gray-500"}`}>Account Type</div>
        </div>
      </div>

      {/* Member Since */}
      <div className={`p-6 rounded-xl ${mode === "dark" ? "bg-gray-700/50" : "bg-gray-50"} border-l-4 border-indigo-500`}>
        <div className="flex items-center space-x-3">
          <Icon icon="mdi:calendar" className="w-6 h-6 text-indigo-500" />
          <div>
            <p className={`font-semibold ${mode === "dark" ? "text-white" : "text-gray-900"}`}>
              Member Since
            </p>
            <p className={`text-lg font-bold text-indigo-600`}>
              {formatDate(user?.created_at)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}