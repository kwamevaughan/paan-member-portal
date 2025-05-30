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
    import TitleCard from "@/components/TitleCard";
    import { Icon } from "@iconify/react";
    import Link from "next/link";

    export default function RegionalHub({ mode = "light", toggleMode }) {
    const {
      isSidebarOpen,
      toggleSidebar,
      sidebarState,
      updateDragOffset,
      isMobile,
    } = useSidebar();
    const router = useRouter();
    const { user, loading: userLoading, LoadingComponent } = useUser();
    const { handleLogout } = useLogout();
    


    // Empty state
    if (userLoading && LoadingComponent) return LoadingComponent;
    if (!user) return null;

    const title = "Regional Expansion & Hubs";
    const description =
        "Access to Regional Hubs offices for bi, co-working or client meetings <br /> (Nairobi, Cairo, Johannesburg, Lagos). Local Ops support.";
    
        return (
          <div
            className={`min-h-screen flex flex-col ${
              mode === "dark"
                ? "bg-gray-900 text-white"
                : "bg-white text-gray-900"
            }`}
          >
            <Toaster />
            <HrHeader
              toggleSidebar={toggleSidebar}
              isSidebarOpen={isSidebarOpen}
              sidebarState={sidebarState}
              user={user}
              mode={mode}
              toggleMode={toggleMode}
              onLogout={handleLogout}
            />
            <div className="flex flex-1">
              <HrSidebar
                isOpen={isSidebarOpen}
                user={user}
                mode={mode}
                toggleSidebar={toggleSidebar}
                onLogout={handleLogout}
                setDragOffset={updateDragOffset}
                toggleMode={toggleMode}
              />
              <div
                className={`content-container flex-1 p-4 md:p-6 lg:p-8 transition-all duration-300 overflow-hidden ${
                  isSidebarOpen && !isMobile ? "sidebar-open" : ""
                }`}
                style={{
                  marginLeft: isMobile
                    ? "0px"
                    : isSidebarOpen
                    ? "200px"
                    : "80px",
                }}
              >
                <div className="max-w-7xl mx-auto pb-10">
                  <TitleCard
                    title={title}
                    description={description}
                    mode={mode}
                    user={user}
                    Icon={Icon}
                    Link={Link}
                    TierBadge={TierBadge}
                    JobTypeBadge={JobTypeBadge}
                    toast={toast}
                    useLatestUpdate={useLatestUpdate}
                    pageTable="regional_hubs"
                  />

                  <div>
                    <h2 className="text-2xl text-center font-semibold mb-4">
                      Coming Soon...
                    </h2>
                  </div>
                </div>

                <SimpleFooter mode={mode} isSidebarOpen={isSidebarOpen} />
              </div>
            </div>
          </div>
        );
    }
