import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import { useUser } from "@/hooks/useUser";
import useLogout from "@/hooks/useLogout";
import HrHeader from "@/layouts/hrHeader";
import HrSidebar from "@/layouts/hrSidebar";
import SimpleFooter from "@/layouts/simpleFooter";
import useSidebar from "@/hooks/useSidebar";
import toast, { Toaster } from "react-hot-toast";
import WelcomeCard from "@/components/WelcomeCard";

export default function Dashboard({ mode = "light", toggleMode }) {
  const { isSidebarOpen, toggleSidebar, sidebarState, updateDragOffset } =
    useSidebar();
  const router = useRouter();
  const { user, loading, LoadingComponent } = useUser();
  const { handleLogout } = useLogout(); // Using handleLogout from the hook

  // Early returns after all hooks
  if (loading && LoadingComponent) {
    return LoadingComponent;
  }
  if (!user) {
    return null; // Redirect handled by useUser
  }

  return (
    <div
      className={`min-h-screen flex flex-col ${
        mode === "dark" ? "bg-gradient-to-b from-gray-900 to-gray-800" : ""
      }`}
    >
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
        onLogout={handleLogout} // Pass handleLogout to HrHeader
      />
      <div className="flex flex-1">
        <HrSidebar
          isOpen={isSidebarOpen}
          mode={mode}
          toggleMode={toggleMode}
          onLogout={handleLogout} // Pass handleLogout to HrSidebar
          toggleSidebar={toggleSidebar}
          setDragOffset={updateDragOffset}
        />
        <div
          className={`content-container flex-1 p-4 md:p-6 lg:p-8 transition-all duration-300 overflow-hidden ${
            isSidebarOpen ? "sidebar-open" : ""
          } ${sidebarState.hidden ? "sidebar-hidden" : ""}`}
          style={{
            marginLeft: sidebarState.hidden
              ? "0px"
              : `${84 + (isSidebarOpen ? 120 : 0) + sidebarState.offset}px`,
          }}
        >
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Hero Section */}

            <WelcomeCard
              mode={mode}
              user={user}
              agencyName={user.agencyName}
              jobType={user.job_type}
              selectedTier={user.selected_tier}
            />



            
          </div>
          <SimpleFooter mode={mode} isSidebarOpen={isSidebarOpen} />
        </div>
      </div>
    </div>
  );
}
