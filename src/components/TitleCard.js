import React from "react";
import { TierBadge, JobTypeBadge } from "@/components/Badge";

const TitleCard = ({
  title,
  description,
  mode,
  user,
  Icon,
  Link,
  useLatestUpdate,
  toast,
  pageTable,
}) => {
  const { latestItems, loading, error } = useLatestUpdate(user?.selected_tier);

  // Map table names to section names used in latestItems
  const tableToSectionMap = {
    business_opportunities: "Business Opportunities",
    events: "Events",
    resources: "Resources",
    market_intel: "Market Intel",
    offers: "Offers",
    updates: "Updates",
  };

  // Get the section name for the current pageTable
  const section = tableToSectionMap[pageTable] || "Business Opportunities";

  // Format the timestamp to "24th May, 2020"
  const formatDate = (timestamp) => {
    if (!timestamp) return "No recent updates";
    const date = new Date(timestamp);
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "long" });
    const year = date.getFullYear();
    // Add ordinal suffix (e.g., "st", "nd", "rd", "th")
    const ordinal = (day) => {
      if (day > 3 && day < 21) return "th";
      switch (day % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };
    return `${day}${ordinal(day)} ${month}, ${year}`;
  };

  const lastUpdated = latestItems[section]?.timestamp;
  console.log("[TitleCard] Last updated for", section, ":", lastUpdated);

  const descriptionParts = description.split("<br />");

  return (
    <div className="relative mx-2 mb-10 group">
      {/* Glassmorphism background */}
      <div
        className={`absolute inset-0 rounded-3xl backdrop-blur-xl ${
          mode === "dark"
            ? "bg-gradient-to-br from-slate-800/60 via-slate-900/40 to-slate-800/60"
            : "bg-gradient-to-br from-white/80 via-white/20 to-white/80"
        } border ${
          mode === "dark" ? "border-white/10" : "border-white/20"
        } shadow-2xl group-hover:shadow-3xl transition-all duration-500`}
      ></div>

      <div className="relative p-8 flex items-start justify-between">
        <div className="flex items-start space-x-6 flex-1">
          {/* Text content */}
          <div className="flex-1 space-y-3">
            <h2
              className={`text-2xl font-bold tracking-tight ${
                mode === "dark" ? "text-white" : "text-slate-900"
              }`}
            >
              {title}
            </h2>
            {descriptionParts.map((part, index) => (
              <p key={index}>{part}</p>
            ))}

            <div className="flex items-center space-x-6 pt-2">
              <div
                className={`py-2 rounded-xl pr-4 text-sm ${
                  mode === "dark"
                    ? "bg-blue-500/20 border border-blue-400/30"
                    : "bg-blue-50 border border-blue-200"
                }`}
              >
                <span
                  className={`px-2 py-2 rounded-xl mr-2 ${
                    mode === "dark"
                      ? "bg-orange-500/20 border border-orange-400/30 text-orange-300"
                      : "bg-orange-50 border border-orange-200 text-gray-700"
                  }`}
                >
                  Last Updated:
                </span>
                {loading ? (
                  <span
                    className={
                      mode === "dark" ? "text-gray-400" : "text-gray-500"
                    }
                  >
                    Loading...
                  </span>
                ) : error ? (
                  <span
                    className={
                      mode === "dark" ? "text-red-400" : "text-red-500"
                    }
                  >
                    Error fetching update
                  </span>
                ) : (
                  <span
                    className={mode === "dark" ? "text-white" : "text-gray-900"}
                  >
                    {formatDate(lastUpdated)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* TierCard (membership info) */}
        <div className="ml-6">
          <div className="relative group/card">
            <div className="group-hover/card:opacity-40 transition duration-300"></div>

            {/* Main card */}
            <div
              className={`relative rounded-2xl p-6 backdrop-blur-sm shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 min-w-[280px] border ${
                mode === "dark" ? "border-blue-400/30" : "border-blue-200"
              }`}
            >
              <Link href="/profile/">
                <div className="space-y-3">
                  <div
                    className={`text-sm font-bold tracking-wide ${
                      mode === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Your Membership
                  </div>
                  <div className="flex flex-wrap gap-2 capitalize">
                    <TierBadge tier={user?.selected_tier} mode={mode} />
                    <JobTypeBadge jobType={user?.job_type} mode={mode} />
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Floating Gradient Circle */}
          <div className="absolute top-2 right-2 w-16 h-16 opacity-10">
            <div
              className={`w-full h-full rounded-full bg-gradient-to-br ${
                mode === "dark"
                  ? "from-violet-500 to-purple-600"
                  : "from-violet-400 to-purple-500"
              }`}
            ></div>
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

      {/* Floating elements */}
      <div className="absolute -top-2 -right-2 w-4 h-4 bg-[#85c2da] rounded-full opacity-60"></div>
      <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-[#f3584a] rounded-full opacity-40 animate-pulse delay-1000"></div>
    </div>
  );
};

export default TitleCard;
