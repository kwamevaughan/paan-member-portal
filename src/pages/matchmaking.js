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

export default function Matchmaking({ mode = "light", toggleMode }) {
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

  // M&A services modal state
  const [isMaServicesModalOpen, setIsMaServicesModalOpen] = useState(false);
  const [maServicesData, setMaServicesData] = useState(null);

  const title = "Matchmaking";
  const description =
    "PAAN’s matchmaking service connects agencies with aligned partners, helping them scale, diversify, or enter new markets. Our expert-led process ensures strategic, transparent growth aligned with Africa’s evolving creative landscape.";

  const handleCloseModal = () => {
    setIsUnifiedModalOpen(false);
    setModalData(null);
  };

  const handleContactClick = (formType = "general") => {
    setContactFormType(formType);
    setIsContactModalOpen(true);
  };

  const handleMaServicesClick = (type, title, description) => {
    setMaServicesData({ type, title, description });
    setIsMaServicesModalOpen(true);
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
                  CO-BIDDING
                </div>
                <h3 className="text-lg font-normal text-white mt-2 mb-4">
                  Join forces with another agency on a strategic pitch
                </h3>
                <div className="flex flex-col gap-2 mb-4">
                  <p className="flex text-white mt-2 gap-2 items-center text-md">
                    <Icon
                      icon="mdi:check-circle"
                      className="w-6 h-6 text-paan-yellow mr-2"
                    />{" "}
                    <span>Expand your capacity for high-value projects</span>
                  </p>
                  <p className="flex text-white mt-2 gap-2 items-center text-md">
                    <Icon
                      icon="mdi:check-circle"
                      className="w-6 h-6 text-paan-yellow mr-2"
                    />{" "}
                    <span>Combine services to strengthen proposals</span>
                  </p>
                  <p className="flex text-white mt-2 gap-2 items-center text-md">
                    <Icon
                      icon="mdi:check-circle"
                      className="w-6 h-6 text-paan-yellow mr-2"
                    />{" "}
                    <span>Collaborate on PAAN-led tenders</span>
                  </p>
                </div>
                <button
                  onClick={() => handleContactClick("co-bidding")}
                  className="mt-6 px-10 py-2 bg-paan-yellow hover:bg-paan-yellow/80 text-paan-dark-blue rounded-full transition-all duration-300 flex items-center justify-center w-full"
                >
                  Start Co-Bid Matchmaking
                </button>
              </div>
              <div className="flex flex-col bg-paan-dark-blue px-6 py-8 rounded-lg shadow-sm hover:translate-y-[-5px] transition-all duration-200 h-full">
                <div className="bg-white text-md font-semibold text-paan-dark-blue rounded-full px-6 py-2 w-fit my-4">
                  Outsource to Another Agency
                </div>
                <h3 className="text-lg font-normal text-white mt-2 mb-4">
                  Need help delivering part of a brief?
                </h3>
                <div className="flex flex-col gap-2 mb-4">
                  <p className="flex text-white mt-2 gap-2 items-center text-md">
                    <Icon
                      icon="mdi:check-circle"
                      className="w-6 h-6 text-paan-yellow mr-2"
                    />{" "}
                    <span>
                      Find vetted PAAN agencies with niche capabilities
                    </span>
                  </p>
                  <p className="flex text-white mt-2 gap-2 items-center text-md">
                    <Icon
                      icon="mdi:check-circle"
                      className="w-6 h-6 text-paan-yellow mr-2"
                    />{" "}
                    <span>
                      Offload deliverables securely with white-label options
                    </span>
                  </p>
                  <p className="flex text-white mt-2 gap-2 items-center text-md">
                    <Icon
                      icon="mdi:check-circle"
                      className="w-6 h-6 text-paan-yellow mr-2"
                    />{" "}
                    <span>Scale output without compromising quality</span>
                  </p>
                </div>
                <button
                  onClick={() => handleContactClick("outsource")}
                  className="mt-6 px-10 py-2 bg-paan-yellow hover:bg-paan-yellow/80 text-paan-dark-blue rounded-full transition-all duration-300 flex items-center justify-center w-full"
                >
                  Outsource to Agency
                </button>
              </div>
              <div className="flex flex-col bg-paan-dark-blue px-6 py-8 rounded-lg shadow-sm hover:translate-y-[-5px] transition-all duration-200 h-full">
                <div className="bg-white text-md font-semibold text-paan-dark-blue rounded-full px-6 py-2 w-fit my-4">
                  Hire a Freelancer
                </div>
                <h3 className="text-lg font-normal text-white mt-2 mb-4">
                  Need fast, focused execution?
                </h3>
                <div className="flex flex-col gap-2 mb-4">
                  <p className="flex text-white mt-2 gap-2 items-center text-md">
                    <Icon
                      icon="mdi:check-circle"
                      className="w-6 h-6 text-paan-yellow mr-2"
                    />{" "}
                    <span>Tap into PAAN-certified freelance talent</span>
                  </p>
                  <p className="flex text-white mt-2 gap-2 items-center text-md">
                    <Icon
                      icon="mdi:check-circle"
                      className="w-6 h-6 text-paan-yellow mr-2"
                    />{" "}
                    <span>Choose by skill, location, and availability</span>
                  </p>
                  <p className="flex text-white mt-2 gap-2 items-center text-md">
                    <Icon
                      icon="mdi:check-circle"
                      className="w-6 h-6 text-paan-yellow mr-2"
                    />{" "}
                    <span>Managed through the PAAN platform</span>
                  </p>
                </div>
                <Link href="/hire-freelancer">
                  <button
                    className="mt-6 px-10 py-2 bg-paan-yellow hover:bg-paan-yellow/80 text-paan-dark-blue rounded-full transition-all duration-300 flex items-center justify-center w-full"
                  >
                    Find a Freelancer
                  </button>
                </Link>
              </div>
            </div>

            {/* Call to Action */}

            <div className="mt-6 p-4 md:p-6 bg-paan-dark-blue text-white rounded-lg flex flex-col md:flex-row items-center justify-between gap-4 transition-all duration-300">
              <span className="text-xl md:text-2xl">
                Not sure where to start?
                <br />
                <span className="text-sm">
                  Speak with a PAAN M&A advisor to explore your options and
                  build a plan that aligns with your agency’s goals.
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

      {/* M&A Services Modal */}
      <SimpleModal
        isOpen={isMaServicesModalOpen}
        onClose={() => setIsMaServicesModalOpen(false)}
        title={maServicesData?.title || "M&A Services"}
        mode={mode}
        width="max-w-2xl"
      >
        <div className="space-y-6">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-paan-yellow/10 rounded-full flex items-center justify-center mb-4">
              <Icon icon="mdi:briefcase" className="w-8 h-8 text-paan-yellow" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Coming Soon!
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              We're currently preparing our{" "}
              {maServicesData?.title?.toLowerCase()} service for launch. Our M&A
              team is working hard to make these services available to all PAAN
              members.
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
              What's included:
            </h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              {maServicesData?.type === "buy" && (
                <>
                  <li className="flex items-center">
                    <Icon
                      icon="mdi:check-circle"
                      className="w-4 h-4 text-green-500 mr-2"
                    />
                    Vetted African agencies ready for acquisition
                  </li>
                  <li className="flex items-center">
                    <Icon
                      icon="mdi:check-circle"
                      className="w-4 h-4 text-green-500 mr-2"
                    />
                    Detailed financial and operational insights
                  </li>
                  <li className="flex items-center">
                    <Icon
                      icon="mdi:check-circle"
                      className="w-4 h-4 text-green-500 mr-2"
                    />
                    Expert guidance through the acquisition process
                  </li>
                </>
              )}
              {maServicesData?.type === "sell" && (
                <>
                  <li className="flex items-center">
                    <Icon
                      icon="mdi:check-circle"
                      className="w-4 h-4 text-green-500 mr-2"
                    />
                    Confidential agency listing platform
                  </li>
                  <li className="flex items-center">
                    <Icon
                      icon="mdi:check-circle"
                      className="w-4 h-4 text-green-500 mr-2"
                    />
                    Access to serious buyers across PAAN network
                  </li>
                  <li className="flex items-center">
                    <Icon
                      icon="mdi:check-circle"
                      className="w-4 h-4 text-green-500 mr-2"
                    />
                    Professional valuation and marketing support
                  </li>
                </>
              )}
              {maServicesData?.type === "merge" && (
                <>
                  <li className="flex items-center">
                    <Icon
                      icon="mdi:check-circle"
                      className="w-4 h-4 text-green-500 mr-2"
                    />
                    Strategic partnership matching
                  </li>
                  <li className="flex items-center">
                    <Icon
                      icon="mdi:check-circle"
                      className="w-4 h-4 text-green-500 mr-2"
                    />
                    Merger structure and negotiation support
                  </li>
                  <li className="flex items-center">
                    <Icon
                      icon="mdi:check-circle"
                      className="w-4 h-4 text-green-500 mr-2"
                    />
                    Post-merger integration guidance
                  </li>
                </>
              )}
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setIsMaServicesModalOpen(false)}
              className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-medium transition-colors"
            >
              Got it
            </button>
            <button
              onClick={() => {
                setIsMaServicesModalOpen(false);
                setIsContactModalOpen(true);
              }}
              className="flex-1 px-6 py-3 bg-paan-yellow hover:bg-paan-yellow/80 text-paan-dark-blue rounded-lg font-medium transition-colors"
            >
              Book a Strategy Call
            </button>
          </div>
        </div>
      </SimpleModal>
    </div>
  );
}
