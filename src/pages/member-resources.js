import React, { useState } from "react";
import { useRouter } from "next/router";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { useUser } from "@/hooks/useUser";
import useLogout from "@/hooks/useLogout";
import HrHeader from "@/layouts/hrHeader";
import HrSidebar from "@/layouts/hrSidebar";
import SimpleFooter from "@/layouts/simpleFooter";
import useSidebar from "@/hooks/useSidebar";
import toast, { Toaster } from "react-hot-toast";
import TitleCard from "@/components/TitleCard";
import { TierBadge, JobTypeBadge } from "@/components/Badge";
import Link from "next/link";
import SimpleModal from "@/components/SimpleModal";
import UnifiedModalContent from "@/components/UnifiedModalContent";

export default function MemberResources({ mode = "light", toggleMode }) {
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

  const [activeTab, setActiveTab] = useState("Legal Docs");
  const [error, setError] = useState(null);

  // Unified modal state
  const [modalData, setModalData] = useState(null);
  const [isUnifiedModalOpen, setIsUnifiedModalOpen] = useState(false);

  const title = "Member Resources";
  const description =
    "Show off your PAAN membership with branding assets, badges, and creative merch templates.";

  const handleCloseModal = () => {
    setIsUnifiedModalOpen(false);
    setModalData(null);
  };

  if (userLoading) {
    return LoadingComponent;
  }

  if (!user) {
    router.push("/");
    return null;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen flex flex-col ${
        mode === "dark"
          ? "bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-white"
          : "bg-gradient-to-br from-gray-50 via-#f3f4f6 to-gray-100 text-gray-900"
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
          className={`flex-1 p-4 md:p-6 lg:p-8 transition-all mt-10 ${
            isSidebarOpen && !isMobile ? "ml-60" : "ml-60"
          }`}
        >
          <div className="max-w-7xl mx-auto space-y-10">
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
              pageTable=""
              hideLastUpdated={true}
            />

            {/* New Layout Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="bg-white px-8 py-20 rounded-lg shadow-sm hover:translate-y-[-5px] transition-all duration-200 flex flex-col h-full relative">
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center px-6 py-1 rounded-full text-sm font-normal bg-paan-blue">
                    Assets
                  </span>
                </div>

                <h3 className="text-2xl font-semibold text-gray-800 mt-4">
                  PAAN Logos & Brand Assets
                </h3>
                <p className="text-gray-600 mt-2">
                  Download official PAAN logos and brand guidelines in multiple
                  formats.
                </p>
                <button className="mt-6 px-6 py-2 bg-paan-red hover:bg-paan-red/80 text-white rounded-full transition-all duration-300 flex items-center justify-center w-fit">
                  Download Brand Pack
                </button>
              </div>
              <div className="bg-white px-8 py-20 rounded-lg shadow-sm hover:translate-y-[-5px] transition-all duration-200 flex flex-col h-full relative">
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center px-6 py-1 rounded-full text-sm font-normal bg-paan-blue">
                    Badges
                  </span>
                </div>

                <h3 className="text-2xl font-semibold text-gray-800 mt-4">
                  Verified Member Badges
                </h3>
                <p className="text-gray-600 mt-2">
                  Display your verified PAAN status with downloadable badge
                  graphics and certificates.
                </p>
                <button className="mt-6 px-6 py-2 bg-paan-red hover:bg-paan-red/80 text-white rounded-full transition-all duration-300 flex items-center justify-center w-fit">
                  Download Badges
                </button>
              </div>

              <div className="bg-white px-8 py-20 rounded-lg shadow-sm hover:translate-y-[-5px] transition-all duration-200 flex flex-col h-full relative">
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center px-6 py-1 rounded-full text-sm font-normal bg-paan-blue">
                    Assets
                  </span>
                </div>

                <h3 className="text-2xl font-semibold text-gray-800 mt-4">
                  Merch Print Templates
                </h3>
                <p className="text-gray-600 mt-2">
                  Print-ready designs for shirts, caps, and tote bags — ideal
                  for team swag or events.
                </p>
                <button className="mt-6 px-6 py-2 bg-paan-red hover:bg-paan-red/80 text-white rounded-full transition-all duration-300 flex items-center justify-center w-fit">
                  View Templates
                </button>
              </div>

              <div className="bg-white px-8 py-20 rounded-lg shadow-sm hover:translate-y-[-5px] transition-all duration-200 flex flex-col h-full relative">
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center px-6 py-1 rounded-full text-sm font-normal bg-paan-blue">
                    Badges
                  </span>
                </div>

                <h3 className="text-2xl font-semibold text-gray-800 mt-4">
                  Social Media Templates
                </h3>
                <p className="text-gray-600 mt-2">
                  Editable social post designs for project launches, team
                  intros, or brand promos.
                </p>
                <button className="mt-6 px-6 py-2 bg-paan-red hover:bg-paan-red/80 text-white rounded-full transition-all duration-300 flex items-center justify-center w-fit">
                  Download social media kit
                </button>
              </div>
            </div>

            {/* Call to Action */}

            <div className="mt-6 p-4 md:p-6 bg-paan-yellow text-paan-dark-blue rounded-lg flex flex-col md:flex-row items-center justify-between gap-4 transition-all duration-300">
              <span className="text-xl md:text-2xl">
                Need help applying the assets? <span className="font-semibold">Message the PAAN Team</span>
              </span>
              <button className="px-6 py-2 bg-paan-red hover:bg-paan-red/80 text-white rounded-full w-full md:w-auto transition-all duration-300">
                Contact Us
              </button>
            </div>
          </div>
          <SimpleFooter mode={mode} isSidebarOpen={isSidebarOpen} />
        </div>
      </div>

      {/* Unified Modal */}
      <SimpleModal
        isOpen={isUnifiedModalOpen}
        onClose={handleCloseModal}
        title={modalData?.title || "Mergers & Acquisitions"}
        mode={mode}
        width="max-w-4xl"
      >
        <UnifiedModalContent
          modalData={modalData}
          mode={mode}
          onClose={handleCloseModal}
        />
      </SimpleModal>
    </div>
  );
}
