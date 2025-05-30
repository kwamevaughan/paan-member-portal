import { useState, useEffect } from "react";
import { useRouter } from "next/router";

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

  const getSectionRoute = (section) => {
    const routes = {
      "Business Opportunities": "business-opportunities",
      Events: "events",
      Resources: "resources",
      "Market Intel": "market-intel",
      Offers: "offers",
      Updates: "updates",
    };
    return routes[section] || "dashboard"; // fallback if section is missing
  };

  // Format created_at to a readable date
  const formatJoinDate = (createdAt) => {
    if (!createdAt) return "N/A";
    return new Date(createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (windowWidth === null) return null;

  const isMobile = windowWidth < 640;

  return (
    <div className="relative mt-6 mb-10 group">
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

      <div
        className={`relative p-4 sm:p-6 md:p-8 flex ${
          isMobile ? "flex-col" : "flex-row"
        } items-start justify-between gap-4`}
      >
        <div className="flex items-start space-x-4 sm:space-x-6 flex-1">
          {/* Animated icon container */}
          <div className="relative">
            <div
              className={`absolute inset-0 rounded-2xl blur-md ${
                mode === "dark" ? "bg-amber-400/30" : "bg-amber-500/30"
              } animate-pulse`}
            ></div>
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
          <div className="flex-1 space-y-2 sm:space-y-3">
            <h2
              className={`text-xl sm:text-2xl font-bold tracking-tight ${
                mode === "dark" ? "text-white" : "text-slate-900"
              }`}
            >
              Welcome back, {user.name}! 👋
            </h2>
            <p
              className={`text-sm sm:text-md leading-relaxed ${
                mode === "dark" ? "text-slate-300" : "text-slate-600"
              }`}
            >
              Here's your dashboard overview at a glance.
            </p>

            {/* Recently Added Section */}
            <div className="pt-2 flex">
              {isMobile ? (
                <div
                  className={`py-2 px-3 rounded-xl text-xs sm:text-sm ${
                    mode === "dark"
                      ? "bg-blue-500/20 border border-blue-400/30"
                      : "bg-blue-50 border border-blue-200"
                  }`}
                >
                  <div className="flex flex-col space-y-2 ">
                    <span
                      className={`block px-2 py-1 rounded-xl bg-orange-500/20 border border-orange-400/30 text-gray-900`}
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
                                : "text-gray-600 hover:underline"
                            }
                            aria-label={`View ${latestItem.section} section`}
                          >
                            Posted under {latestItem.section}
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
              ) : (
                <div
                  className={`py-2 rounded-xl pr-4 text-xs sm:text-sm ${
                    mode === "dark"
                      ? "bg-blue-500/20 border border-blue-400/30"
                      : "bg-blue-50 border border-blue-200"
                  }`}
                >
                  <span
                    className={`px-2 py-1 sm:py-2 rounded-xl mr-2 ${
                      mode === "dark"
                        ? "bg-orange-500/20 border border-orange-400/30 text-orange-300"
                        : "bg-orange-50 border border-orange-200 text-gray-700"
                    }`}
                  >
                    Recently Added:
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
                            : "text-gray-600 hover:underline"
                        }
                        aria-label={`View ${latestItem.section} section`}
                      >
                        Posted under {latestItem.section}
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
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Action Card */}
        <div className={isMobile ? "w-full" : "ml-6 w-auto"}>
          <div className="relative group/card">
            <div
              className={`group-hover/card:opacity-40 transition duration-300`}
            ></div>

            {/* Main card */}
            <div
              className={`relative rounded-2xl p-4 sm:p-6 backdrop-blur-sm shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 w-full sm:min-w-[280px] 
              border ${
                mode === "dark" ? "border-blue-400/30" : "border-blue-200"
              }`}
            >
              {/* Membership info */}
              <Link href="/profile/">
                <div className="space-y-2 sm:space-y-3 mb-4">
                  <div
                    className={`text-xs sm:text-sm font-bold tracking-wide ${
                      mode === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Your Membership
                  </div>
                  <div className="flex flex-wrap gap-2 pb-2 capitalize">
                    <TierBadge tier={user?.selected_tier} mode={mode} />
                    <JobTypeBadge jobType={user?.job_type} mode={mode} />
                  </div>
                  <div className="text-xs sm:text-sm">
                    <span
                      className={`font-medium ${
                        mode === "dark" ? "text-gray-200" : "text-gray-700"
                      }`}
                    >
                      Member since:
                    </span>{" "}
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                        mode === "dark"
                          ? "bg-blue-800 text-blue-100"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {formatJoinDate(user?.created_at)}
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          </div>
          <div
            className={`absolute top-2 right-2 w-12 sm:w-16 h-12 sm:h-16 opacity-10`}
          >
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
      <div
        className={`absolute -top-1 sm:-top-2 -right-1 sm:-right-2 w-3 sm:w-4 h-3 sm:h-4 bg-[#85c2da] rounded-full opacity-60`}
      ></div>
      <div
        className={`absolute -bottom-1 -left-1 w-2 sm:w-3 h-2 sm:h-3 bg-[#f3584a] rounded-full opacity-40 animate-pulse delay-1000`}
      ></div>
    </div>
  );
}
