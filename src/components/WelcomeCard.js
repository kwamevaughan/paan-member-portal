import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { normalizeTier } from "@/components/Badge";
import { formatDateWithOrdinal } from "@/utils/dateUtils";

// Function to get day-based greeting
const getDayGreeting = () => {
  const day = new Date().getDay();
  const greetings = {
    0: "Welcome to a Productive Sunday", // Sunday
    1: "New Week, New Opportunities", // Monday
    2: "Tuesday's Looking Bright", // Tuesday
    3: "Midweek Momentum", // Wednesday
    4: "Thursday's Almost Friday", // Thursday
    5: "TGIF! Friday's Here", // Friday
    6: "Weekend Mode Activated", // Saturday
  };
  return greetings[day];
};

export default function WelcomeCard({
  user,
  mode,
  Icon,
  Link,
  TierBadge,
  JobTypeBadge,
  useLatestUpdate,
}) {
  const { latestItems, loading, error } = useLatestUpdate(user);
  const [windowWidth, setWindowWidth] = useState(null);
  const router = useRouter();

  // Detect window width for responsive design
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Debug user object to verify job_type
  useEffect(() => {}, [user]);

  // Find the most recent item across all sections
  const latestItem = Object.entries(latestItems).reduce(
    (latest, [section, item]) => {
      if (!item || !item.timestamp) return latest;
      if (!latest || new Date(item.timestamp) > new Date(latest.timestamp)) {
        return { section, title: item.title, timestamp: item.timestamp };
      }
      return latest;
    },
    null
  );

  // Case-insensitive check for Freelancer
  const isFreelancer =
    user?.job_type?.toLowerCase() === "freelancer" || !user?.job_type;

  const getSectionRoute = (section) => {
    const routes = {
      "Business Opportunities": isFreelancer
        ? "business-opportunities"
        : "business-opportunities",
      Events: "events",
      Resources: "resources",
      "Market Intel": "market-intel",
      Offers: "offers",
      Updates: "updates",
    };
    return routes[section] || "dashboard"; // fallback if section is missing
  };

  // Format created_at to a readable date - now using the utility function

  if (windowWidth === null) return null;

  const isMobile = windowWidth < 640;

  return (
    <div className="relative mt-6 mb-10 group">
      {/* Glassmorphism background */}
      <div
        className={`absolute inset-0 rounded-lg backdrop-blur-xl ${
          mode === "dark"
            ? "bg-gradient-to-br from-slate-800/60 via-slate-900/40 to-slate-800/60"
            : "bg-gradient-to-br from-white/80 via-white/20 to-white/80"
        } border ${
          mode === "dark" ? "border-white/10" : "border-white/20"
        } shadow-lg hover:shadow-3xl transition-all duration-500`}
      ></div>

      <div
        className={`relative p-4 sm:p-6 md:p-8 flex items-center ${
          isMobile ? "flex-col" : "flex-row"
        } items-start justify-between gap-4`}
      >
        <div className=" space-y-2 sm:space-y-3">
          <div className="flex items-start space-x-4 sm:space-x-6">
            {/* Animated icon container */}
            <div className="relative">
              <div
                className={`relative p-2 rounded-xl ${
                  mode === "dark"
                    ? "bg-gradient-to-br from-amber-400/20 to-orange-500/20 border border-amber-400/30"
                    : "bg-gradient-to-br from-amber-100 to-orange-100 border border-amber-200"
                }`}
              >
                <Icon
                  icon="mdi:bell-check"
                  width={isMobile ? 24 : 30}
                  height={isMobile ? 24 : 30}
                  className={`${
                    mode === "dark" ? "text-amber-400" : "text-[#f25749]"
                  } animate-bounce`}
                  style={{
                    animationDuration: "2s",
                    animationIterationCount: "infinite",
                  }}
                />
              </div>
            </div>

            {/* Text content */}
            <div className="flex-1">
              <h2
                className={`text-xl sm:text-2xl font-medium tracking-tight ${
                  mode === "dark" ? "text-white" : "text-slate-900"
                }`}
              >
                {getDayGreeting()}, {user.name}! 👋
              </h2>
              <p
                className={`text-sm sm:text-md leading-relaxed ${
                  mode === "dark" ? "text-slate-300" : "text-slate-600"
                }`}
              >
                Here's your dashboard overview at a glance.
              </p>
            </div>
          </div>

          {/* Recently Added Section */}
          <div
            className={`w-full sm:w-fit rounded-xl text-xs sm:text-sm ${
              mode === "dark" ? "bg-blue-500/20 border border-blue-400/30" : ""
            } sm:mt-2`}
          >
            <div
              className={`flex flex-row items-center space-x-2 ${
                isMobile ? "truncate max-w-[90%] overflow-hidden" : ""
              }`}
            >
              <span
                className={`px-2 py-1 sm:py-2 rounded-xl flex-shrink-0 ${
                  mode === "dark"
                    ? "bg-orange-500/20 border border-orange-400/30 text-orange-300"
                    : "bg-gradient-to-br from-amber-100 to-orange-100 border border-amber-200 text-gray-700"
                }`}
              >
                Recently Added:
              </span>
              <div className="px-2">
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
                ) : latestItem ? (
                  <>
                    <span
                      className={
                        mode === "dark" ? "text-white" : "text-gray-900"
                      }
                    >
                      "{latestItem.title}"
                    </span>{" "}
                    <Link
                      href={`/${getSectionRoute(latestItem.section)}`}
                      className={
                        mode === "dark"
                          ? "text-blue-400 hover:underline"
                          : "text-gray-600 hover:underline underline"
                      }
                      aria-label={`View ${latestItem.section} section`}
                    >
                      Posted under{" "}
                      {isFreelancer &&
                      latestItem.section === "Business Opportunities"
                        ? "Gigs"
                        : latestItem.section}
                    </Link>
                  </>
                ) : (
                  <span
                    className={
                      mode === "dark" ? "text-gray-400" : "text-gray-500"
                    }
                  >
                    No recent updates
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex-shrink-0">
          {(() => {
            // Get user's normalized tier
            const userTier =
              normalizeTier(user?.selected_tier) || "Free Member";

            // Map tiers to badge file names (including Admin -> Gold Member)
            const tierToBadgeMap = {
              "Free Member": "Free-Member",
              "Associate Member": "Associate-Member",
              "Full Member": "Full-Member",
              "Gold Member": "Gold-Member",
              Admin: "Gold-Member", // Admin users get Gold Member badge
            };

            const badgeFileName = tierToBadgeMap[userTier] || "Free-Member";
            const badgeUrl = `https://ik.imagekit.io/2crwrt8s6/MemberResources/PAAN%20Badge%20${badgeFileName}.webp`;

            return (
              <img
                src={badgeUrl}
                alt={`${userTier} Badge`}
                width={100}
                height={100}
                className="object-contain"
                draggable={false}
                onError={(e) => {
                  // Fallback to PNG if WebP fails
                  e.target.src = `https://ik.imagekit.io/2crwrt8s6/MemberResources/PAAN%20Badge%20${badgeFileName}.png`;
                }}
              />
            );
          })()}
        </div>

        {/* Enhanced Action Card (Membership Info) */}
        <div className={isMobile ? "w-full" : "ml-6 w-auto"}>
          <div className="relative group/card">
            <div
              className={`group-hover/card:opacity-40 transition duration-300`}
            ></div>

            {/* Main card */}
            <div
              className={`relative rounded-lg p-8 sm:p-6 backdrop-blur-sm shadow-xl hover:shadow-none transition-all duration-300 w-full sm:min-w-[300px] 
              border ${
                mode === "dark"
                  ? "border-blue-400/30"
                  : "border-sky-900 bg-[#d3e9f1]"
              }`}
            >
              {/* Membership info */}
              <div className="space-y-2 sm:space-y-3 mb-4">
                <div
                  className={`text-base font-semibold tracking-wide ${
                    mode === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Your Membership
                </div>
                <div className="flex flex-wrap gap-2 pb-2 capitalize">
                  {/* Show only one admin badge, or tier badge for non-freelancers, or job type badge for freelancers */}
                  {user?.job_type?.toLowerCase() === "admin" ? (
                    <div className="[&>span]:!bg-paan-blue/30 [&>span]:!text-gray-900 [&>span]:!border-paan-blue [&>span>svg]:!text-paan-blue dark:[&>span]:!bg-paan-blue/30 dark:[&>span]:!text-paan-blue dark:[&>span]:!border-paan-blue">
                      <JobTypeBadge jobType={user?.job_type} mode={mode} />
                    </div>
                  ) : !isFreelancer ? (
                    <div className="[&>span]:!bg-amber-100 [&>span]:!text-gray-900 [&>span]:!border-amber-200 [&>span>svg]:!text-[#F25849] dark:[&>span]:!bg-amber-500/30 dark:[&>span]:!text-amber-100 dark:[&>span]:!border-amber-400">
                      <TierBadge
                        tier={normalizeTier(user?.selected_tier)}
                        mode={mode}
                      />
                    </div>
                  ) : (
                    <div className="[&>span]:!bg-amber-100 [&>span]:!text-gray-900 [&>span]:!border-amber-200 [&>span>svg]:!text-[#F25849] dark:[&>span]:!bg-amber-500/30 dark:[&>span]:!text-amber-100 dark:[&>span]:!border-amber-400">
                      <JobTypeBadge jobType={user?.job_type} mode={mode} />
                    </div>
                  )}
                </div>
                {/* Only show member since for non-admin users */}
                {user?.job_type?.toLowerCase() !== "admin" && (
                  <div className="text-xs sm:text-sm">
                    <span
                      className={`font-semibold pr-2 ${
                        mode === "dark" ? "text-gray-200" : "text-gray-700"
                      }`}
                    >
                      Member since:
                    </span>{" "}
                    <span
                      className={`inline-block px-6 py-2 rounded-full text-xs font-normal ${
                        mode === "dark"
                          ? "bg-blue-800 text-blue-100"
                          : "bg-[#172840] text-white"
                      }`}
                    >
                      {formatDateWithOrdinal(user?.created_at)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className={`absolute top-4 right-4 w-8 sm:w-10 h-8 sm:h-10`}>
            <div
              className={`w-full h-full rounded-full bg-gradient-to-br ${
                mode === "dark"
                  ? "from-violet-500 to-purple-600"
                  : "bg-[#f25749]"
              }`}
            ></div>
          </div>
        </div>
      </div>

      {/* Floating elements */}
      <div
        className={`absolute -top-1 sm:-top-2 -right-1 sm:-right-2 w-3 sm:w-4 h-3 sm:h-4 bg-amber-400 rounded-full opacity-60`}
      ></div>
    </div>
  );
}
