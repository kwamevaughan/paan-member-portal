import { React, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useUser } from "@/hooks/useUser";
import useLogout from "@/hooks/useLogout";
import { useLatestUpdate } from "@/hooks/useLatestUpdate";
import { TierBadge, JobTypeBadge } from "@/components/Badge";
import HrHeader from "@/layouts/hrHeader";
import HrSidebar from "@/layouts/hrSidebar";
import SimpleFooter from "@/layouts/simpleFooter";
import useSidebar from "@/hooks/useSidebar";
import toast, { Toaster } from "react-hot-toast";
import TitleCard from "@/components/TitleCard"; // Import TitleCard
import { Icon } from "@iconify/react";
import Link from "next/link";

export default function RegionalHub({ mode = "light", toggleMode }) {
  const { isSidebarOpen, toggleSidebar, sidebarState, updateDragOffset } =
    useSidebar();
  const router = useRouter();
  const { user, loading: userLoading, LoadingComponent } = useUser();
  const { handleLogout } = useLogout();
  const {} = useLatestUpdate(
    user?.selected_tier?.replace(/\(.*?\)/g, "").trim() || "Free Member"
  );

  // Empty state
  if (userLoading && LoadingComponent) return LoadingComponent;
  if (!user) return null;

  const title = "Regional Expansion & Hubs"; // Dynamic title
  const description =
    "Access to Regional Hubs offices for bi, co-working or client meetings (Nairobi, Cairo, Johannesburg, Lagos). Local Ops support."; // Dynamic description

  return (
    <div
      className={`min-h-screen flex flex-col ${
        mode === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      <Toaster />
      <HrHeader
        toggleSidebar={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
        sidebarState={sidebarState}
        fullName={user?.name ?? "Member"}
        jobTitle={user.job_type}
        selectedTier={user.selected_tier}
        agencyName={user.agencyName}
        mode={mode}
        toggleMode={toggleMode}
        onLogout={handleLogout}
      />
      <div className="flex flex-1">
        <HrSidebar
          isOpen={isSidebarOpen}
          mode={mode}
          toggleSidebar={toggleSidebar}
          onLogout={handleLogout}
          setDragOffset={updateDragOffset}
          toggleMode={toggleMode}
        />
        <div
          className={`content-container flex-1 pt-4 transition-all duration-300 overflow-hidden ${
            isSidebarOpen ? "sidebar-open" : ""
          } ${sidebarState.hidden ? "sidebar-hidden" : ""}`}
          style={{
            marginLeft: sidebarState.hidden
              ? "0px"
              : `${84 + (isSidebarOpen ? 120 : 0) + sidebarState.offset}px`,
          }}
        >
          <div className="max-w-7xl mx-auto pb-10">
            <TitleCard
              title={title} // Pass title here
              description={description} // Pass description here
              mode={mode}
              user={user}
              Icon={Icon}
              Link={Link}
              TierBadge={TierBadge}
              JobTypeBadge={JobTypeBadge}
              useLatestUpdate={useLatestUpdate}
              toast={toast}
            />
          </div>
          <SimpleFooter mode={mode} isSidebarOpen={isSidebarOpen} />
        </div>
      </div>
    </div>
  );
}
