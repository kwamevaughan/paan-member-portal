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

export default function MergersAcquisitions({ mode = "light", toggleMode }) {
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

  const title = "Mergers & Acquisitions";
  const description =
    "Whether you're looking to buy, sell, or merge, PAAN makes agency growth strategic, transparent, and aligned with Africa’s evolving creative landscape. Our expert-led process helps agencies transition smoothly — with guidance every step of the way.";

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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="bg-gray-200 p-6 rounded-lg shadow-sm hover:translate-y-[-5px] transition-all duration-200 flex flex-col h-full">
                <Image
                  src="/assets/images/buy-agency.png"
                  alt="Buy an Agency"
                  width={100}
                  height={100}
                />
                <h3 className="text-lg font-semibold text-gray-800 mt-4">
                  Buy an Agency
                </h3>
                <p className="text-gray-600 mt-2">
                  Discover vetted African agencies ready for acquisition — with
                  insights to help you choose the right fit.
                </p>
                <button className="mt-6 px-10 py-2 bg-paan-yellow hover:bg-paan-yellow/80 text-paan-dark-blue rounded-full transition-all duration-300 flex items-center justify-center w-fit">
                  Explore Agencies
                </button>
              </div>
              <div className="bg-gray-200 p-6 rounded-lg shadow-sm hover:translate-y-[-5px] transition-all duration-200 flex flex-col h-full">
                <Image
                  src="/assets/images/sell-agency.png"
                  alt="Sell Your Agency"
                  width={100}
                  height={100}
                />
                <h3 className="text-lg font-semibold text-gray-800 mt-4">
                  Sell Your Agency
                </h3>
                <p className="text-gray-600 mt-2">
                  List your agency confidentially and connect with serious
                  buyers across the PAAN network.
                </p>
                <button className="mt-auto px-10 py-2 bg-paan-yellow hover:bg-paan-yellow/80 text-paan-dark-blue rounded-full transition-all duration-300 flex items-center justify-center w-fit">
                  List for Sale
                </button>
              </div>
              <div className="bg-gray-200 p-6 rounded-lg shadow-sm hover:translate-y-[-5px] transition-all duration-200 flex flex-col h-full">
                <Image
                  src="/assets/images/merge-agency.png"
                  alt="Merge with Another Agency"
                  width={100}
                  height={100}
                />
                <h3 className="text-lg font-semibold text-gray-800 mt-4">
                  Merge with Another Agency
                </h3>
                <p className="text-gray-600 mt-2">
                  Join forces with aligned partners to scale, diversify, or
                  enter new markets.
                </p>
                <button className="mt-auto px-10 py-2 bg-paan-yellow hover:bg-paan-yellow/80 text-paan-dark-blue rounded-full transition-all duration-300 flex items-center justify-center w-fit">
                  Explore Mergers
                </button>
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
              <button className="px-6 py-2 bg-paan-red hover:bg-paan-red/80 text-white rounded-full w-full md:w-auto transition-all duration-300">
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
    </div>
  );
}
