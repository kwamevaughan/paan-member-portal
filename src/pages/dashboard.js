import React, { useEffect, useState, useCallback } from "react"; // Added useState, useCallback
import { useRouter } from "next/router";
import { useUser } from "@/hooks/useUser";
import useLogout from "@/hooks/useLogout";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react";
import HrHeader from "@/layouts/hrHeader";
import HrSidebar from "@/layouts/hrSidebar";
import useSidebar from "@/hooks/useSidebar";
import toast, { Toaster } from "react-hot-toast";


export default function Dashboard({ mode = "light", toggleMode }) {
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const router = useRouter();
  const { user, loading, LoadingComponent } = useUser();
  const logout = useLogout();

  // Define sidebarState and setSidebarState
  const [sidebarState, setSidebarState] = useState({
    hidden: false,
    offset: 0,
  });

  // All hooks are now at the top level
  useEffect(() => {
    console.log(
      "Dashboard: Mounted, user:",
      user,
      "loading:",
      loading,
      "route:",
      router.pathname
    );
  }, [user, loading, router.pathname]);

  useEffect(() => {
    const handleSidebarChange = (e) => {
      const newHidden = e.detail.hidden;
      setSidebarState((prev) => {
        if (prev.hidden === newHidden) return prev;
        return { ...prev, hidden: newHidden };
      });
    };
    document.addEventListener("sidebarVisibilityChange", handleSidebarChange);
    return () =>
      document.removeEventListener(
        "sidebarVisibilityChange",
        handleSidebarChange
      );
  }, []);

  const updateDragOffset = useCallback((offset) => {
    setSidebarState((prev) => {
      if (prev.offset === offset) return prev;
      return { ...prev, offset };
    });
  }, []);

  // Early returns after all hooks
  if (loading && LoadingComponent) {
    console.log("Dashboard: Rendering LoadingComponent");
    return LoadingComponent;
  }
  if (!user) {
    console.log("Dashboard: No user, returning null");
    return null; // Redirect handled by useUser
  }

    const handleLogout = () => {
      localStorage.removeItem("paan_member_session");
      document.cookie = "paan_member_session=; path=/; max-age=0";
      toast.success("Logged out successfully!");
      setTimeout(() => router.push("/"), 1000);
    };

  return (
    <div
      className={`min-h-screen flex flex-col ${
        mode === "dark" ? "bg-gradient-to-b from-gray-900 to-gray-800" : ""
      }`}
    >
      <Toaster />
      <HrHeader
        toggleSidebar={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
        sidebarState={sidebarState}
        mode={mode}
        toggleMode={toggleMode}
        onLogout={handleLogout}
        pageName=""
        pageDescription="."
      />
      <div className="flex flex-1">
        <HrSidebar
          isOpen={isSidebarOpen}
          isSidebarOpen={isSidebarOpen}
          mode={mode}
          toggleMode={toggleMode}
          onLogout={handleLogout}
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
                Welcome, {user.primaryContactName}!
              </h1>
              <p className="text-paan-blue">
                You are logged in as{" "}
                <span className="font-semibold">
                  {user.role.replace("_", " ")}
                </span>
                .
              </p>
            </div>

            {user.role === "admin" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl text-paan-blue font-semibold mb-2">
                    User Management
                  </h2>
                  <p className="text-paan-blue mb-4">
                    Manage all users, roles, and permissions across the
                    platform.
                  </p>
                  <Link href="/admin/users">
                    <span className="bg-paan-red text-white py-2 px-4 rounded-full hover:scale-105 transition-transform duration-300 inline-block">
                      Go to User Management
                    </span>
                  </Link>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl text-paan-blue font-semibold mb-2">
                    Agency Management
                  </h2>
                  <p className="text-paan-blue mb-4">
                    Approve or edit agency profiles and details.
                  </p>
                  <Link href="/admin/agencies">
                    <span className="bg-paan-red text-white py-2 px-4 rounded-full hover:scale-105 transition-transform duration-300 inline-block">
                      Go to Agency Management
                    </span>
                  </Link>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl text-paan-blue font-semibold mb-2">
                    Analytics
                  </h2>
                  <p className="text-paan-blue mb-4">
                    View platform usage and performance metrics.
                  </p>
                  <Link href="/admin/analytics">
                    <span className="bg-paan-red text-white py-2 px-4 rounded-full hover:scale-105 transition-transform duration-300 inline-block">
                      View Analytics
                    </span>
                  </Link>
                </div>
              </div>
            )}

            {user.role === "agency_member" && user.agency && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl text-paan-blue font-semibold mb-2">
                  Your Agency: {user.agency.name}
                </h2>
                <div className="flex items-center mb-4">
                  {user.agency.logo_url && (
                    <Image
                      src={user.agency.logo_url}
                      alt={`${user.agency.name} Logo`}
                      width={80}
                      height={80}
                      className="mr-4 rounded-full"
                    />
                  )}
                  <div>
                    <p className="text-paan-blue">
                      <strong>Country:</strong> {user.agency.country}
                    </p>
                    <p className="text-paan-blue">
                      <strong>Description:</strong> {user.agency.description}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link href="/resources">
                    <span className="bg-paan-red text-white py-2 px-4 rounded-full hover:scale-105 transition-transform duration-300 inline-block">
                      Access Resources & Templates
                    </span>
                  </Link>
                  <Link href="/opportunities">
                    <span className="bg-paan-red text-white py-2 px-4 rounded-full hover:scale-105 transition-transform duration-300 inline-block">
                      View Co-Bidding Opportunities
                    </span>
                  </Link>
                </div>
              </div>
            )}

            {user.role === "partner" && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl text-paan-blue font-semibold mb-2">
                  Partner Dashboard
                </h2>
                <p className="text-paan-blue mb-4">
                  Connect with agencies and explore collaboration opportunities.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link href="/collaborations">
                    <span className="bg-paan-red text-white py-2 px-4 rounded-full hover:scale-105 transition-transform duration-300 inline-block">
                      Explore Collaborations
                    </span>
                  </Link>
                  <Link href="/market-trends">
                    <span className="bg-paan-red text-white py-2 px-4 rounded-full hover:scale-105 transition-transform duration-300 inline-block">
                      View Market Trends
                    </span>
                  </Link>
                </div>
              </div>
            )}
          </div>
          <footer className="bg-white p-4 text-center text-paan-blue">
            <p>
              © {new Date().getFullYear()} Pan-African Agency Network. All
              rights reserved.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { req } = context;

  if (!req.cookies.hr_session) {
    console.log("No paan_member_session cookie, redirecting to login");
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  try {
    // Add logic for when the cookie is found, if necessary.
    return {
      props: {}, // Return empty props or any necessary props here.
    };
  } catch (error) {
    console.error("Error in getServerSideProps:", error);
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
}
