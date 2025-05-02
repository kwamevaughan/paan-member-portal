import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import jwt from "jsonwebtoken";
import supabase from "lib/supabaseClient";
import useLogout from "@/hooks/useLogout";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-toastify";
import { Icon } from "@iconify/react";
import Cookies from "js-cookie";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [agency, setAgency] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const logout = useLogout();

  useEffect(() => {
    const initializeDashboard = async () => {
      console.log("Dashboard: Initializing...");
      // Get token from storage or cookie
      const token =
        localStorage.getItem("token") ||
        sessionStorage.getItem("token") ||
        Cookies.get("token");

      if (!token) {
        console.log("Dashboard: No token found, redirecting to /");
        toast.error("Please log in to access the dashboard");
        router.push("/");
        return;
      }
      console.log("Dashboard: Token found:", token.substring(0, 20) + "...");

      try {
        const res = await fetch("/api/verify-token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok || !data.user) {
          throw new Error("Token verification failed");
        }

        const decoded = data.user;

        setUser({
          id: decoded.user_id,
          email: decoded.email,
          role: decoded.role,
        });

        // Fetch user details
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("full_name, role, agency_id")
          .eq("id", decoded.user_id)
          .single();

        if (userError) {
          throw new Error("Failed to fetch user data: " + userError.message);
        }

        setUser((prev) => ({
          ...prev,
          full_name: userData.full_name,
          agency_id: userData.agency_id,
        }));

        // Fetch agency details if applicable
        if (userData.agency_id) {
          const { data: agencyData, error: agencyError } = await supabase
            .from("agencies")
            .select("name, country, description, logo_url")
            .eq("id", userData.agency_id)
            .maybeSingle(); // <- replaces .single()

          if (agencyError) {
            throw new Error(
              "Failed to fetch agency data: " + agencyError.message
            );
          }

          setAgency(agencyData);
        }
      } catch (error) {
        console.error("Dashboard error:", error);
        toast.error("Session expired or invalid. Please log in again.");
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        Cookies.remove("token", { path: "/" });
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    initializeDashboard();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#D1D3D4]">
        <p className="text-paan-blue text-xl">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null; // Redirect handled in useEffect
  }

  return (
    <div className="min-h-screen bg-[#D1D3D4] flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-md p-4 flex justify-between items-center">
        <Link href="/dashboard">
          <Image
            src="/assets/images/logo.svg"
            alt="Pan-African Agency Network Logo"
            width={150}
            height={40}
            className="hover:scale-105 transition-transform duration-300"
            priority
          />
        </Link>
        <button
          onClick={logout}
          className="bg-paan-red text-white font-bold py-2 px-4 rounded-full hover:scale-105 transition-transform duration-300"
        >
          Logout
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl text-paan-blue font-bold mb-2">
            Welcome, {user.full_name}!
          </h1>
          <p className="text-paan-blue">
            You are logged in as{" "}
            <span className="font-semibold">{user.role.replace("_", " ")}</span>
            .
          </p>
        </div>

        {/* Role-Based Content */}
        {user.role === "admin" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl text-paan-blue font-semibold mb-2">
                User Management
              </h2>
              <p className="text-paan-blue mb-4">
                Manage all users, roles, and permissions across the platform.
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

        {user.role === "agency_member" && agency && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl text-paan-blue font-semibold mb-2">
              Your Agency: {agency.name}
            </h2>
            <div className="flex items-center mb-4">
              {agency.logo_url && (
                <Image
                  src={agency.logo_url}
                  alt={`${agency.name} Logo`}
                  width={80}
                  height={80}
                  className="mr-4 rounded-full"
                />
              )}
              <div>
                <p className="text-paan-blue">
                  <strong>Country:</strong> {agency.country}
                </p>
                <p className="text-paan-blue">
                  <strong>Description:</strong> {agency.description}
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
      </main>

      {/* Footer */}
      <footer className="bg-white p-4 text-center text-paan-blue">
        <p>
          © {new Date().getFullYear()} Pan-African Agency Network. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
};

export default Dashboard;
