import React, { useState, useEffect } from "react";
import { TierBadge, JobTypeBadge, normalizeTier } from "@/components/Badge";
import Image from "next/image";

const TitleCard = ({
  title,
  description,
  mode,
  user,
  Icon,
  Link,
  toast,
  pageTable,
  lastUpdated,
  hideLastUpdated = false,
}) => {
  const [windowWidth, setWindowWidth] = useState(null);

  // Detect window width for responsive design
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const formatDate = (timestamp) => {
    if (!timestamp) return "No recent updates";
    if (typeof timestamp === "string" && !timestamp.includes("T")) {
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

  // Format created_at to a readable date
  const formatJoinDate = (createdAt) => {
    if (!createdAt) return "N/A";
    return new Date(createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const descriptionParts = description.split("<br />");
  const isFreelancer = user?.job_type?.toLowerCase() === "freelancer";

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
      />

      <div
        className={`relative p-4 sm:p-6 md:p-8 flex items-center ${
          isMobile ? "flex-col" : "flex-row"
        } items-start justify-between gap-4`}
      >
        <div className="space-y-2 sm:space-y-3">
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
            <div className="flex-1 max-w-xl min-w-[220px]">
              <h2
                className={`text-xl sm:text-2xl font-medium tracking-tight ${
                  mode === "dark" ? "text-white" : "text-slate-900"
                }`}
              >
                {title}
              </h2>
              {descriptionParts.map((part, index) => (
                <p
                  key={index}
                  className={`text-sm sm:text-md leading-relaxed ${
                    mode === "dark" ? "text-slate-300" : "text-slate-600"
                  }`}
                >
                  {part}
                </p>
              ))}
              {/* Last Updated Section moved here */}
              {!hideLastUpdated && (
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
                      Last Updated:
                    </span>
                    <div className="px-2">
                      <span
                        className={mode === "dark" ? "text-white" : "text-gray-900"}
                      >
                        {formatDate(lastUpdated)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Last Updated Section */}
          {/* This section is now moved inside the description container */}
        </div>

        <div className="flex-shrink-0">
          <Image
            src="/assets/images/paan-member-badge.png"
            alt="Paan Member Badge"
            width={100}
            height={100}
            draggable={false}
          />
        </div>

        {/* Enhanced Action Card (Membership Info) */}
        <div className={isMobile ? "w-full" : "ml-6 w-auto flex-shrink-0"}>
          <div className="relative group/card">
            <div
              className={`group-hover/card:opacity-40 transition duration-300`}
            ></div>

            {/* Main card */}
            <div
              className={`relative rounded-lg p-8 sm:p-6 backdrop-blur-sm shadow-xl hover:shadow-none transition-all duration-300 w-full sm:min-w-[280px] 
              border ${
                mode === "dark"
                  ? "border-paan-blue/30"
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
                    <div className="[&>span]:!bg-paan-yellow/30 [&>span]:!text-gray-900 [&>span]:!border-paan-blue [&>span>svg]:!text-paan-blue dark:[&>span]:!bg-paan-yellow/30 dark:[&>span]:!text-paan-blue dark:[&>span]:!border-paan-blue">
                      <JobTypeBadge jobType={user?.job_type} mode={mode} />
                    </div>
                  ) : !isFreelancer ? (
                    <div className="[&>span]:!bg-amber-100 [&>span]:!text-gray-900 [&>span]:!border-amber-200 [&>span>svg]:!text-[#F25849] dark:[&>span]:!bg-amber-500/30 dark:[&>span]:!text-amber-100 dark:[&>span]:!border-amber-400">
                      <TierBadge tier={normalizeTier(user?.selected_tier)} mode={mode} />
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
                      {formatJoinDate(user?.created_at)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className={`absolute top-4 right-4 w-8 sm:w-10 h-8 sm:h-10`}>
            <div
              className={`w-full h-full rounded-full bg- ${
                mode === "dark" ? "from-paan-blue to-paan-red" : "bg-paan-red"
              }`}
            ></div>
          </div>
        </div>
      </div>

      {/* Floating elements */}
      <div
        className={`absolute -top-1 sm:-top-2 -right-1 sm:-right-2 w-3 sm:w-4 h-3 sm:h-4 bg-paan-yellow rounded-full opacity-60`}
      ></div>
    </div>
  );
};

export default TitleCard;
