import { useUser } from "@/hooks/useUser";
import useLogout from "@/hooks/useLogout";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react";

const Dashboard = () => {
  const { user, loading } = useUser();
  const logout = useLogout();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#D1D3D4]">
        <p className="text-paan-blue text-xl">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null; // Redirect handled by useUser
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
