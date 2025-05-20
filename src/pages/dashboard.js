import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import { useUser } from "@/hooks/useUser";
import useLogout from "@/hooks/useLogout";
import HrHeader from "@/layouts/hrHeader";
import HrSidebar from "@/layouts/hrSidebar";
import SimpleFooter from "@/layouts/simpleFooter";
import useSidebar from "@/hooks/useSidebar";
import toast, { Toaster } from "react-hot-toast";

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
          className={`content-container flex-1 p-10 pt-4 transition-all duration-300 overflow-hidden ${
            isSidebarOpen ? "sidebar-open" : ""
          } ${sidebarState.hidden ? "sidebar-hidden" : ""}`}
          style={{
            marginLeft: sidebarState.hidden
              ? "0px"
              : `${84 + (isSidebarOpen ? 120 : 0) + sidebarState.offset}px`,
          }}
        >
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h1 className="text-3xl text-paan-blue font-bold mb-2">
                Welcome, {user.name}!
              </h1>
              <p className="text-paan-blue">
                You are logged in as{" "}
                <span className="font-semibold">{user.job_type}</span>.
                <br />
                Your agency name is{" "}
                <span className="font-semibold">{user.agencyName}</span>.
              </p>
            </div>
          </div>
          <SimpleFooter mode={mode} isSidebarOpen={isSidebarOpen} />
        </div>
      </div>
    </div>
  );
}
