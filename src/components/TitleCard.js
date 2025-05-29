import React from "react";
import { TierBadge, JobTypeBadge } from "@/components/Badge";

const TitleCard = ({
  title,
  description,
  mode,
  user,
  Icon,
  Link,
  toast,
  pageTable,
  lastUpdated, // Use this prop for the date
}) => {
  // Format the timestamp to "26th May, 2025"
  const formatDate = (timestamp) => {
    if (!timestamp) return "No recent updates";
    // Handle pre-formatted string (e.g., "May 26, 2025")
    if (typeof timestamp === "string" && !timestamp.includes("T")) {
      // Convert "May 26, 2025" to "26th May, 2025"
      const match = timestamp.match(/^(\w+)\s(\d+),\s(\d+)$/);
      if (match) {
        const [, month, day, year] = match;
        const ordinal = (d) => {
          const n = parseInt(d, 10);
          if (n > 3 && n < 21) return "th";
          switch (n % 10) {
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
      }
    }
    // Handle ISO timestamp
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return "Invalid date";
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "long" });
    const year = date.getFullYear();
    const ordinal = (d) => {
      if (d > 3 && d < 21) return "th";
      switch (d % 10) {
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

  console.log("[TitleCard] Page table:", pageTable);
  console.log("[TitleCard] Last updated:", lastUpdated);

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
              <p
                key={index}
                className={mode === "dark" ? "text-gray-300" : "text-gray-600"}
              >
                {part}
              </p>
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
                <span
                  className={mode === "dark" ? "text-white" : "text-gray-900"}
                >
                  {formatDate(lastUpdated)}
                </span>
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
              <Link href="/profile">
                <div className="space-y-1">
                  <div
                    className={`text-sm font-semibold tracking-wide ${
                      mode === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Your Membership
                  </div>
                  <div className="flex flex-wrap gap-2 capitalize">
                    <TierBadge
                      tier={user?.selected_tier || "Free Member"}
                      mode={mode}
                    />
                    <JobTypeBadge
                      jobType={user?.job_type || "N/A"}
                      mode={mode}
                    />
                  </div>
                </div>
              </Link>
            </div>

            <div className="absolute top-0 right-0 w-16 h-16 rounded-full bg-gradient-to-br from-blue-500/30 to-purple-500/30 opacity-10"></div>
          </div>
        </div>
      </div>

      {/* Bottom gradient accent */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-1 rounded-b-3xl ${
          mode === "dark"
            ? "bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800"
            : "bg-gradient-to-r from-blue-200 to-purple-400"
        }`}
      />

      {/* Floating decorative elements */}
      <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-200 rounded-full opacity-60"></div>
      <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-purple-300 rounded-full opacity-40 animate-pulse"></div>
    </div>
  );
};

export default TitleCard;
