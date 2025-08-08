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

export default function PaanAcademy({ mode = "light", toggleMode }) {
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

  const title = "PAAN Academy";
  const description =
    "The PAAN Academy is a platform for agencies to connect, learn, and grow. It is a platform for agencies to connect, learn, and grow.";

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
            {/* New Layout Section */}
            <div className="bg-paan-dark-blue pt-6 rounded-lg grid grid-cols-1 md:grid-cols-[60%_40%] lg:grid-cols-[65%_35%] mt-20">
              <div className="p-6 rounded-lg flex flex-col h-full">
                <Image
                  src="assets/images/paan-academy-logo.svg"
                  alt="PAAN Academy Logo"
                  width={200}
                  height={200}
                  className="mb-6"
                />
                <h3 className="text-3xl font-semibold text-white my-2">
                  Share What You Know
                </h3>
                <h4 className="text-2xl font-normal text-white">
                  Create a Course for PAAN Academy
                </h4>
                <p className="text-white mt-2">
                  You're already leading great work — now it's time to teach it.
                  PAAN Academy is inviting agency leaders to design short,
                  practical courses that help grow Africa’s creative industry.
                </p>
                <div className="flex flex-col gap-2 mb-4 mt-6">
                  <p className="flex text-white mt-2 gap-2 items-center text-md">
                    <Icon
                      icon="mdi:check-circle"
                      className="w-6 h-6 text-paan-yellow mr-2"
                    />{" "}
                    <span>
                      Design short, practical courses based on your strengths
                    </span>
                  </p>
                  <p className="flex text-white mt-2 gap-2 items-center text-md">
                    <Icon
                      icon="mdi:check-circle"
                      className="w-6 h-6 text-paan-yellow mr-2"
                    />{" "}
                    <span>Train creatives and teams across Africa</span>
                  </p>
                  <p className="flex text-white mt-2 gap-2 items-center text-md">
                    <Icon
                      icon="mdi:check-circle"
                      className="w-6 h-6 text-paan-yellow mr-2"
                    />{" "}
                    <span>
                      Get featured as an expert and build your thought
                      leadership
                    </span>
                  </p>
                  <p className="flex text-white mt-2 gap-2 items-center text-md">
                    <Icon
                      icon="mdi:check-circle"
                      className="w-6 h-6 text-paan-yellow mr-2"
                    />{" "}
                    <span>
                      Create recurring revenue for your agency from courses sold
                      on PAAN academy
                    </span>
                  </p>
                </div>
                <h4 className="text-2xl font-normal text-white mt-4">
                  Have a training idea or course to teach?
                </h4>
                <p className="text-white mt-2">
                  Let’s help you bring it to life — from structure to delivery.
                </p>

                <div className="flex gap-4 mt-6">
                  <Link
                    href="https://paan.africa/academy#formats"
                    target="_blank"
                  >
                    <button className="mt-6 px-10 py-3 bg-paan-red hover:bg-paan-red/80 text-white rounded-full transition-all duration-300 flex items-center justify-center w-fit">
                      Submit Your Course Idea
                    </button>
                  </Link>
                  <Link href="https://paan.africa/academy" target="_blank">
                    <button className="mt-6 px-10 py-3 bg-paan-yellow hover:bg-paan-yellow/80 text-black rounded-full transition-all duration-300 flex items-center justify-center w-fit">
                      Learn more about PAAN Academy
                    </button>
                  </Link>
                </div>
              </div>
              <div className="rounded-lg flex flex-col h-full">
                <Image
                  src="/assets/images/paan-man.png"
                  alt="PAAN Academy Logo"
                  width={200}
                  height={200}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Call to Action */}

            <div className="mt-6 p-8 md:py-8 bg-paan-blue rounded-lg flex flex-col md:flex-row items-center justify-between gap-4 transition-all duration-300">
              <span className="text-xl md:text-2xl">
                Ready to empower your team with Africa-specific,
                industry-relevant skills?
              </span>
              <Link
                href="https://calendly.com/njue-duncan-growthpad/paan-partners-introduction"
                target="_blank"
              >
                <button className="px-8 py-3 bg-paan-red hover:bg-paan-red/80 text-white rounded-full w-full md:w-auto transition-all duration-300">
                  Schedule a Free Training Consultation
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
