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

export default function Mentorship({ mode = "light", toggleMode }) {
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

  const title = "Mentorship";
  const description =
    "The Mentorship is a platform for agencies to connect, learn, and grow. It is a platform for agencies to connect, learn, and grow.";

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
          : "bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900"
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
            <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mt-6">
              <div className="bg-white p-6 rounded-lg shadow-sm hover:translate-y-[-5px] transition-all duration-200 flex flex-col h-full items-center justify-center">
                
                <h3 className="text-4xl font-semibold text-gray-800 mt-4 text-center">
                  Coming Soon
                </h3>
                <p className="text-gray-600 mt-2">
                  We are working on this feature. Please check back soon.
                </p>

                
              </div>
              
              
            </div>

            
            
          </div>
          <SimpleFooter mode={mode} isSidebarOpen={isSidebarOpen} />
        </div>
      </div>

      {/* Unified Modal */}
      <SimpleModal
        isOpen={isUnifiedModalOpen}
        onClose={handleCloseModal}
        title={modalData?.title || "Mentorship"}
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
