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

export default function PaanSummit({ mode = "light", toggleMode }) {
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

  const title = "PAAN Summit";
  const description =
    "The PAAN Summit is a platform for agencies to connect, learn, and grow. It is a platform for agencies to connect, learn, and grow.";

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
    <div className={`min-h-screen`}>
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
            <div
              className="mt-10 flex flex-col gap-4 text-white p-16 rounded-lg relative overflow-hidden  bg-cover bg-center bg-no-repeat bg-fixed"
              style={{
                backgroundImage: "url('/assets/images/paan-summit-bg.png')",
              }}
            >
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-paan-dark-blue/80"></div>

              {/* Content */}
              <div className="relative flex flex-col gap-4 items-center justify-center h-full">
                <h2 className="text-4xl font-semibold">
                  Where Africa’s Creative Future Gathers
                </h2>
                <p className="text-gray-300">
                  The PAAN Summit brings together bold minds, visionary
                  campaigns, and the best of African innovation.
                </p>
                <Link href="https://paan.africa/summit" target="_blank">
                  <button className="mt-4 px-6 py-3 bg-paan-red hover:bg-paan-red/80 text-white rounded-full w-full md:w-auto transition-all duration-300">
                    Join the 2025 PAAN Summit
                  </button>
                </Link>
              </div>
            </div>

            {/* New Layout Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-sm hover:translate-y-[-5px] transition-all duration-200 flex flex-col h-full">
                <h3 className="text-3xl font-semibold text-gray-800 my-4">
                  Upcoming Summit
                </h3>
                <p className="text-gray-600 mt-6">
                  <span className="font-bold">EVENT:</span> PAAN Summit Nairobi
                  2026
                </p>
                <p className="text-gray-600 mt-2">
                  <span className="font-bold">THEME:</span> “Ideas Without
                  Borders”
                </p>
                <p className="flex items-center gap-2 text-gray-600 mt-6">
                  <Icon icon="fe:calendar" className="w-12 h-12" />
                  <span className="font-semibold text-2xl">
                    Oct 17–19, 2026
                  </span>
                </p>

                <Link href="https://paan.africa/summit#tickets" target="_blank">
                  <button className="mt-6 px-10 py-3 bg-paan-red hover:bg-paan-red/80 text-white rounded-full transition-all duration-300 flex items-center justify-center w-fit">
                    Register Now
                  </button>
                </Link>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-sm hover:translate-y-[-5px] transition-all duration-200 flex flex-col h-full">
                <Icon
                  icon="material-symbols:trophy"
                  className="w-12 h-12 text-paan-yellow"
                />
                <h3 className="text-3xl font-semibold text-gray-800 my-4">
                  PAAN African Awards 2025
                </h3>

                <p className="text-gray-600 mt-6">
                  Celebrating the best agencies, freelancers, and campaigns
                  shaping Africa’s creative future.
                </p>
                <div className="flex gap-4 mt-6">
                  <button 
                    onClick={() => {
                      setModalData({
                        title: "PAAN African Awards 2025 - Award Categories",
                        type: "awardCategories",
                        content: "Coming Soon! Award categories will be announced soon. Stay tuned for updates on the different categories and criteria for the PAAN African Awards 2025."
                      });
                      setIsUnifiedModalOpen(true);
                    }}
                    className="mt-auto px-6 py-3 bg-paan-dark-blue hover:bg-paan-dark-blue/80 text-white rounded-full transition-all duration-300 flex items-center justify-center w-fit"
                  >
                    View Award Categories
                  </button>
                  <button 
                    onClick={() => {
                      setModalData({
                        title: "Nominate a Campaign - PAAN African Awards 2025",
                        type: "nominateCampaign",
                        content: "Coming Soon! The nomination portal for the PAAN African Awards 2025 will be available soon. You'll be able to submit your campaigns and nominations through our dedicated platform."
                      });
                      setIsUnifiedModalOpen(true);
                    }}
                    className="mt-6 px-6 py-3 bg-paan-yellow hover:bg-paan-yellow/80 text-white rounded-full transition-all duration-300 flex items-center justify-center w-fit"
                  >
                    Nominate a Campaign
                  </button>
                </div>
              </div>
            </div>

            {/* Call to Action */}

            <div className="mt-6 p-8 md:py-8 bg-paan-blue rounded-lg flex flex-col md:flex-row items-center justify-between gap-4 transition-all duration-300">
              <span className="text-xl md:text-2xl">
                Want to be part of Africa’s most inspiring creative movement?
              </span>
              <Link href="https://paan.africa/summit" target="_blank">
                <button className="px-8 py-3 bg-paan-red hover:bg-paan-red/80 text-white rounded-full w-full md:w-auto transition-all duration-300">
                  Join the PAAN Summit
                </button>
              </Link>
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
