import React, { useState } from "react";
import { useRouter } from "next/router";
import { Icon } from "@iconify/react";
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

  // Contact form modal state
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactFormType, setContactFormType] = useState("general");

  const title = "Mentorship";
  const description =
    "PAAN’s mentorship program connects agencies with aligned partners, helping them scale, diversify, or enter new markets. Our expert-led process ensures strategic, transparent growth aligned with Africa’s evolving creative landscape.";

  const handleCloseModal = () => {
    setIsUnifiedModalOpen(false);
    setModalData(null);
  };

  const handleContactClick = (formType = "general") => {
    setContactFormType(formType);
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="flex flex-col bg-paan-dark-blue px-6 py-8 rounded-lg shadow-sm hover:translate-y-[-5px] transition-all duration-200 h-full">
                <div className="bg-white text-md font-semibold text-paan-dark-blue rounded-full px-6 py-2 w-fit my-4">
                  Speak at a Webinar
                </div>
                <h3 className="text-lg font-normal text-white mt-2 mb-4">
                  Become a Featured Speaker
                </h3>
                <p className="text-white mt-2 mb-4">
                  Share your insights as a guest speaker during upcoming PAAN
                  webinars.
                </p>
                <div className="flex flex-col gap-2 mb-4">
                  <p className="flex text-white mt-2 gap-2 items-center text-md">
                    <Icon
                      icon="mdi:check-circle"
                      className="w-6 h-6 text-paan-yellow mr-2"
                    />{" "}
                    <span>Showcase your expertise</span>
                  </p>
                  <p className="flex text-white mt-2 gap-2 items-center text-md">
                    <Icon
                      icon="mdi:check-circle"
                      className="w-6 h-6 text-paan-yellow mr-2"
                    />{" "}
                    <span>Build reputation across the network</span>
                  </p>
                </div>
                <div className="mt-auto">
                  <button
                    onClick={() => handleContactClick("webinar-speaker")}
                    className="w-full px-10 py-2 bg-paan-yellow hover:bg-paan-yellow/80 text-paan-dark-blue rounded-full transition-all duration-300 flex items-center justify-center"
                  >
                    Express Interest to Speak
                  </button>
                </div>
              </div>
              <div className="flex flex-col bg-paan-dark-blue px-6 py-8 rounded-lg shadow-sm hover:translate-y-[-5px] transition-all duration-200 h-full">
                <div className="bg-white text-md font-semibold text-paan-dark-blue rounded-full px-6 py-2 w-fit my-4">
                  Mentor Another Agency
                </div>
                <h3 className="text-lg font-normal text-white mt-2 mb-4">
                  Offer Mentorship to Emerging Agencies
                </h3>
                <p className="text-white mt-2 mb-4">
                  Support the next wave of African creative leaders by mentoring
                  a growing agency.
                </p>
                <div className="flex flex-col gap-2 mb-4">
                  <p className="flex text-white mt-2 gap-2 items-center text-md">
                    <Icon
                      icon="mdi:check-circle"
                      className="w-6 h-6 text-paan-yellow mr-2"
                    />{" "}
                    <span>1:1 monthly check-ins</span>
                  </p>
                  <p className="flex text-white mt-2 gap-2 items-center text-md">
                    <Icon
                      icon="mdi:check-circle"
                      className="w-6 h-6 text-paan-yellow mr-2"
                    />{" "}
                    <span>Recognition in the PAAN network</span>
                  </p>
                </div>
                <div className="mt-auto">
                  <button
                    onClick={() => handleContactClick("mentor")}
                    className="w-full px-10 py-2 bg-paan-yellow hover:bg-paan-yellow/80 text-paan-dark-blue rounded-full transition-all duration-300 flex items-center justify-center"
                  >
                    Volunteer as a Mentor
                  </button>
                </div>
              </div>
              <div className="flex flex-col bg-paan-dark-blue px-6 py-8 rounded-lg shadow-sm hover:translate-y-[-5px] transition-all duration-200 h-full">
                <div className="bg-white text-md font-semibold text-paan-dark-blue rounded-full px-6 py-2 w-fit my-4">
                  Join a Peer Roundtable
                </div>
                <h3 className="text-lg font-normal text-white mt-2 mb-4">
                  Collaborate with Leaders Across Africa
                </h3>
                <p className="text-white mt-2 mb-4">
                  Join private virtual roundtables with other agency heads.
                </p>
                <div className="flex flex-col gap-2 mb-4">
                  <p className="flex text-white mt-2 gap-2 items-center text-md">
                    <Icon
                      icon="mdi:check-circle"
                      className="w-6 h-6 text-paan-yellow mr-2"
                    />{" "}
                    <span>Share strategies</span>
                  </p>
                  <p className="flex text-white mt-2 gap-2 items-center text-md">
                    <Icon
                      icon="mdi:check-circle"
                      className="w-6 h-6 text-paan-yellow mr-2"
                    />{" "}
                    <span>Solve real-time challenges</span>
                  </p>
                </div>
                <div className="mt-auto">
                  <button
                    onClick={() => handleContactClick("peer-roundtable")}
                    className="w-full px-10 py-2 bg-paan-yellow hover:bg-paan-yellow/80 text-paan-dark-blue rounded-full transition-all duration-300 flex items-center justify-center"
                  >
                    Join a Peer Roundtable
                  </button>
                </div>
              </div>
            </div>

            {/* Call to Action */}

            <div className="mt-6 p-4 md:p-6 bg-paan-dark-blue text-white rounded-lg flex flex-col md:flex-row items-center justify-between gap-4 transition-all duration-300">
              <span className="text-xl md:text-2xl">
                Not sure where to start?
                <br />
                <span className="text-sm">
                  Speak with a PAAN advisor to explore your options and build a
                  plan that aligns with your agency’s goals.
                </span>
              </span>
              <button
                onClick={() => handleContactClick("general")}
                className="px-6 py-2 bg-paan-red hover:bg-paan-red/80 text-white rounded-full w-full md:w-auto transition-all duration-300"
              >
                Book a Free Strategy Call
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

      {/* Contact Form Modal */}
      <ContactFormModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        mode={mode}
        formType={contactFormType}
        user={user}
      />
    </div>
  );
}
