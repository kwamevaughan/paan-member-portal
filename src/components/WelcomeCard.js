import { Icon } from "@iconify/react";
import Link from "next/link";
import { useLatestUpdate } from "@/hooks/useLatestUpdate";

export default function WelcomeCard({ user, mode, TierBadge }) {
  const { latestItem, loading, error } = useLatestUpdate(user?.selected_tier);

  return (
    <div className="relative mt-6 mb-10 group">
      {/* Glass morphism backdrop */}
      <div className="absolute inset-0 rounded-3xl backdrop-blur-xl bg-white/10 dark:bg-black/10"></div>

      {/* Main content container */}
      <div
        className={`relative overflow-hidden rounded-3xl border transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-2xl ${
          mode === "dark"
            ? "bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-slate-700/50 shadow-xl"
            : "bg-gradient-to-br from-white/90 to-slate-50/90 border-slate-200/50 shadow-lg"
        }`}
      >
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:20px_20px]"></div>
        </div>

        {/* Content */}
        <div className="relative p-8 flex items-start justify-between">
          {/* Left section with icon and text */}
          <div className="flex items-start space-x-6 flex-1">
            {/* Animated icon container */}
            <div className="relative">
              <div
                className={`absolute inset-0 rounded-2xl blur-md ${
                  mode === "dark" ? "bg-amber-400/30" : "bg-amber-500/30"
                } animate-pulse`}
              ></div>
              <div
                className={`relative p-2 rounded-2xl ${
                  mode === "dark"
                    ? "bg-gradient-to-br from-amber-400/20 to-orange-500/20 border border-amber-400/30"
                    : "bg-gradient-to-br from-amber-100 to-orange-100 border border-amber-200"
                }`}
              >
                <Icon
                  icon="mdi:bell-check"
                  width={30}
                  height={30}
                  className={`${
                    mode === "dark" ? "text-amber-400" : "text-amber-600"
                  } animate-bounce`}
                  style={{
                    animationDuration: "2s",
                    animationIterationCount: "infinite",
                  }}
                />
              </div>
            </div>

            {/* Text content */}
            <div className="flex-1 space-y-3">
              <h2
                className={`text-2xl font-bold tracking-tight ${
                  mode === "dark" ? "text-white" : "text-slate-900"
                }`}
              >
                Welcome back, {user.name}! 👋
              </h2>

              <p
                className={`text-md leading-relaxed ${
                  mode === "dark" ? "text-slate-300" : "text-slate-600"
                }`}
              >
                Here's your dashboard overview at a glance.
              </p>

              {/* Stats section */}
              <div className="flex items-center space-x-6 pt-2">
                <div
                  className={`py-2 rounded-xl pr-4 ${
                    mode === "dark"
                      ? "bg-blue-500/20 border border-blue-400/30"
                      : "bg-blue-50 border border-blue-200"
                  }`}
                >
                  <span
                    className={`px-2 py-2 rounded-xl mr-2 ${
                      mode === "dark"
                        ? "bg-orange-500/20 border border-orange-400/30"
                        : "bg-orange-50 border border-orange-200"
                    }`}
                  >
                    Recently Added:
                  </span>
                  {loading ? (
                    <span className="text-gray-500">Loading...</span>
                  ) : error ? (
                    <span className="text-red-500">Error fetching update</span>
                  ) : latestItem ? (
                    <>
                      {latestItem.title} ||{" "}
                      <span className="">
                        Posted under {latestItem.section}
                      </span>
                    </>
                  ) : (
                    <span className="text-gray-500">No recent updates</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action button */}
          <div className="ml-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="md:self-end">
                <div
                  className={`rounded-xl p-4 backdrop-blur-sm ${
                    mode === "dark" ? "bg-gray-700/50" : "bg-gray-50/50"
                  } border border-gray-200 dark:border-gray-700`}
                >
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    Your Membership Tier
                  </div>
                  {/* Tier Badge Component */}
                  <TierBadge tier={user?.selected_tier} mode={mode} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom gradient accent */}
        <div
          className={`absolute bottom-0 left-0 right-0 h-1 ${
            mode === "dark"
              ? "bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500"
              : "bg-gradient-to-r from-[#3c82f6] to-[#dbe9fe]"
          }`}
        ></div>
      </div>

      {/* Floating elements for visual interest */}
      <div className="absolute -top-2 -right-2 w-4 h-4 bg-[#85c2da] rounded-full opacity-60"></div>
      <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-[#f3584a] rounded-full opacity-40 animate-pulse delay-1000"></div>
    </div>
  );
}
