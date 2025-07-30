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
import ContactFormModal from "@/components/ContactFormModal";

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

  // Download modal state
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [downloadModalData, setDownloadModalData] = useState(null);

  // Contact form modal state
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const title = "Member Resources";
  const description =
    "Show off your PAAN membership with branding assets, badges, and creative merch templates.";

  const handleCloseModal = () => {
    setIsUnifiedModalOpen(false);
    setModalData(null);
  };

  const handleCloseDownloadModal = () => {
    setIsDownloadModalOpen(false);
    setDownloadModalData(null);
  };

  const handleDownloadClick = (type, title) => {
    setDownloadModalData({ type, title });
    setIsDownloadModalOpen(true);
  };

  const handleContactClick = () => {
    setIsContactModalOpen(true);
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
          className={`flex-1 p-4 md:p-6 lg:p-12 transition-all mt-10 ${
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
                <button 
                  onClick={() => handleDownloadClick('brand-pack', 'PAAN Logos & Brand Assets')}
                  className="mt-6 px-6 py-2 bg-paan-red hover:bg-paan-red/80 text-white rounded-full transition-all duration-300 flex items-center justify-center w-fit"
                >
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
                <button 
                  onClick={() => handleDownloadClick('badges', 'Verified Member Badges')}
                  className="mt-6 px-6 py-2 bg-paan-red hover:bg-paan-red/80 text-white rounded-full transition-all duration-300 flex items-center justify-center w-fit"
                >
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
                <button 
                  onClick={() => handleDownloadClick('templates', 'Merch Print Templates')}
                  className="mt-6 px-6 py-2 bg-paan-red hover:bg-paan-red/80 text-white rounded-full transition-all duration-300 flex items-center justify-center w-fit"
                >
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
                <button 
                  onClick={() => handleDownloadClick('social-media', 'Social Media Templates')}
                  className="mt-6 px-6 py-2 bg-paan-red hover:bg-paan-red/80 text-white rounded-full transition-all duration-300 flex items-center justify-center w-fit"
                >
                  Download social media kit
                </button>
              </div>
            </div>

            {/* Call to Action */}

            <div className="mt-6 p-4 md:p-6 bg-paan-yellow text-paan-dark-blue rounded-lg flex flex-col md:flex-row items-center justify-between gap-4 transition-all duration-300">
              <span className="text-xl md:text-2xl">
                Need help applying the assets? <span className="font-semibold">Message the PAAN Team</span>
              </span>
              <button 
                onClick={handleContactClick}
                className="px-6 py-2 bg-paan-red hover:bg-paan-red/80 text-white rounded-full w-full md:w-auto transition-all duration-300"
              >
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

      {/* Download Modal */}
      <SimpleModal
        isOpen={isDownloadModalOpen}
        onClose={handleCloseDownloadModal}
        title={downloadModalData?.title || "Download Assets"}
        mode={mode}
        width="max-w-2xl"
      >
        <div className="space-y-6">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-paan-blue/10 rounded-full flex items-center justify-center mb-4">
              <Icon icon="mdi:download" className="w-8 h-8 text-paan-blue" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Coming Soon!
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              We're currently preparing the <span className="capitalize">{downloadModalData?.title?.toLowerCase()}</span> for download. 
              Our team is working hard to make these assets available to all PAAN members.
            </p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
              What's included:
            </h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              {downloadModalData?.type === 'brand-pack' && (
                <>
                  <li className="flex items-center">
                    <Icon icon="mdi:check-circle" className="w-4 h-4 text-green-500 mr-2" />
                    High-resolution PAAN logos (PNG, SVG, PDF)
                  </li>
                  <li className="flex items-center">
                    <Icon icon="mdi:check-circle" className="w-4 h-4 text-green-500 mr-2" />
                    Brand guidelines and color palettes
                  </li>
                  <li className="flex items-center">
                    <Icon icon="mdi:check-circle" className="w-4 h-4 text-green-500 mr-2" />
                    Typography and spacing guidelines
                  </li>
                </>
              )}
              {downloadModalData?.type === 'badges' && (
                <>
                  <li className="flex items-center">
                    <Icon icon="mdi:check-circle" className="w-4 h-4 text-green-500 mr-2" />
                    Verified member badge graphics
                  </li>
                  <li className="flex items-center">
                    <Icon icon="mdi:check-circle" className="w-4 h-4 text-green-500 mr-2" />
                    Digital certificates and credentials
                  </li>
                  <li className="flex items-center">
                    <Icon icon="mdi:check-circle" className="w-4 h-4 text-green-500 mr-2" />
                    Social media profile badges
                  </li>
                </>
              )}
              {downloadModalData?.type === 'templates' && (
                <>
                  <li className="flex items-center">
                    <Icon icon="mdi:check-circle" className="w-4 h-4 text-green-500 mr-2" />
                    Print-ready shirt designs
                  </li>
                  <li className="flex items-center">
                    <Icon icon="mdi:check-circle" className="w-4 h-4 text-green-500 mr-2" />
                    Cap and tote bag templates
                  </li>
                  <li className="flex items-center">
                    <Icon icon="mdi:check-circle" className="w-4 h-4 text-green-500 mr-2" />
                    Event merchandise layouts
                  </li>
                </>
              )}
              {downloadModalData?.type === 'social-media' && (
                <>
                  <li className="flex items-center">
                    <Icon icon="mdi:check-circle" className="w-4 h-4 text-green-500 mr-2" />
                    Editable social post templates
                  </li>
                  <li className="flex items-center">
                    <Icon icon="mdi:check-circle" className="w-4 h-4 text-green-500 mr-2" />
                    Project launch announcements
                  </li>
                  <li className="flex items-center">
                    <Icon icon="mdi:check-circle" className="w-4 h-4 text-green-500 mr-2" />
                    Team introduction graphics
                  </li>
                </>
              )}
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleCloseDownloadModal}
              className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-medium transition-colors"
            >
              Got it
            </button>
            <button
              onClick={() => {
                handleCloseDownloadModal();
                // You can add navigation to contact page here
                toast.success("We'll notify you when assets are ready!");
              }}
              className="flex-1 px-6 py-3 bg-paan-red hover:bg-paan-red/80 text-white rounded-lg font-medium transition-colors"
            >
              Notify me when ready
            </button>
          </div>
        </div>
      </SimpleModal>

      {/* Contact Form Modal */}
      <ContactFormModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        mode={mode}
        title="Contact PAAN Support"
        user={user}
        description="Need help with PAAN branding assets, badges, or templates? Our team is here to assist you with any questions about using and applying our member resources."
      />
    </div>
  );
}
