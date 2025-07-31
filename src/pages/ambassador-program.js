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

export default function AmbassadorProgram({ mode = "light", toggleMode }) {
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

  // M&A services modal state
  const [isMaServicesModalOpen, setIsMaServicesModalOpen] = useState(false);
  const [maServicesData, setMaServicesData] = useState(null);

  const title = "The PAAN Ambassador Program";
  const description =
    "Powering Africa's Creative Future — One Leader at a Time.";

  const handleCloseModal = () => {
    setIsUnifiedModalOpen(false);
    setModalData(null);
  };

  const handleContactClick = () => {
    setIsContactModalOpen(true);
  };

  const handleMaServicesClick = (type, title, description) => {
    setMaServicesData({ type, title, description });
    setIsMaServicesModalOpen(true);
  };

  const benefits = [
    {
      icon: "mdi:spotlight-beam",
      title: "Recognition & Visibility",
      description:
        "Featured across PAAN digital channels, magazine, and events",
    },
    {
      icon: "mdi:crown",
      title: "VIP Access",
      description: "Exclusive access to PAAN Summits and ecosystem gatherings",
    },
    {
      icon: "mdi:microphone",
      title: "Thought Leadership",
      description: "Speaking, publishing, and panel opportunities",
    },
    {
      icon: "mdi:currency-usd",
      title: "Financial Benefits",
      description: "Exclusive financial rewards based on your impact",
    },
    {
      icon: "mdi:account-group",
      title: "Dedicated Support",
      description: "Personal success team to support your journey",
    },
    {
      icon: "mdi:toolbox",
      title: "Ambassador Toolkit",
      description: "Private access to exclusive training and resources",
    },
  ];

  const responsibilities = [
    "Refer exceptional agencies and clients to join PAAN",
    "Engage with communities, events, and industry forums",
    "Share trends, barriers, and opportunities from their country",
    "Join internal PAAN conversations, strategy calls, and regional activations",
  ];

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

            {/* Hero Section */}
            <section className="relative overflow-hidden rounded-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-purple-900 opacity-90 rounded-2xl"></div>
              <div className="relative px-8 py-16 text-center text-white">
                <div className="mb-6">
                  <Icon
                    icon="mdi:crown"
                    className="w-16 h-16 mx-auto mb-4 text-yellow-400"
                  />
                </div>
                <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  A Seat at the Table of Influence
                </h2>
                <p className="text-lg md:text-xl mb-8 text-gray-200 max-w-4xl mx-auto">
                  The PAAN Ambassador Program is not open to everyone. It is a
                  carefully curated initiative for a select group of
                  professionals across Africa who stand at the intersection of
                  leadership, connection, and continental growth.
                </p>
                <div className="inline-flex items-center px-6 py-3 bg-red-600 rounded-full text-lg font-semibold">
                  <Icon icon="mdi:lock" className="w-5 h-5 mr-2" />
                  Invitation Only
                </div>
              </div>
            </section>

            {/* What is PAAN Section */}
            <section
              className={`p-8 rounded-2xl ${
                mode === "dark" ? "bg-gray-800" : "bg-white"
              } shadow-lg`}
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">What is PAAN?</h2>
                <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-6"></div>
              </div>

              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <p className="text-lg leading-relaxed mb-6">
                    The <strong>Pan-African Agency Network (PAAN)</strong>{" "}
                    brings together the most forward-thinking, vetted creative,
                    digital, communication, advertising, research, and marketing
                    agencies across the continent.
                  </p>
                  <p className="text-lg leading-relaxed">
                    It's more than a network — it's a movement toward collective
                    growth, cross-border collaboration, and global-level
                    opportunity for African agencies.
                  </p>
                </div>
                <div className="relative">
                  <div
                    className={`p-6 rounded-xl ${
                      mode === "dark"
                        ? "bg-gradient-to-br from-blue-900 to-purple-900"
                        : "bg-gradient-to-br from-blue-50 to-purple-50"
                    } border border-blue-200`}
                  >
                    <Icon
                      icon="mdi:network"
                      className="w-12 h-12 mb-4 text-blue-600"
                    />
                    <h3 className="text-xl font-bold mb-3">
                      Pan-African Network
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      A united force building the strongest agency ecosystem
                      Africa has ever seen.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Why You Were Chosen */}
            <section
              className={`p-8 rounded-2xl ${
                mode === "dark" ? "bg-gray-800" : "bg-white"
              } shadow-lg`}
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">
                  Why This Matters — And Why You Were Chosen
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  Africa's creative economy is on the rise, but fragmented. PAAN
                  bridges that gap — and you are a key part of that bridge.
                </p>
              </div>

              <div className="mb-8">
                <p className="text-lg leading-relaxed mb-4">
                  As a PAAN Ambassador, you:
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    icon: "mdi:door-open",
                    title: "Open Doors",
                    description:
                      "For local agencies to access opportunities across Africa",
                  },
                  {
                    icon: "mdi:shield-check",
                    title: "Represent Trust",
                    description:
                      "A trusted brand committed to collaboration, quality, and integrity",
                  },
                  {
                    icon: "mdi:lightbulb",
                    title: "Gather Insights",
                    description:
                      "Shape how we grow continent-wide with your expertise",
                  },
                  {
                    icon: "mdi:trophy",
                    title: "Champion Excellence",
                    description:
                      "Your local ecosystem, while being part of a larger vision",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className={`p-6 rounded-xl ${
                      mode === "dark"
                        ? "bg-gray-700 border-gray-600"
                        : "bg-gray-50 border-gray-200"
                    } border hover:shadow-lg transition-all duration-300`}
                  >
                    <Icon
                      icon={item.icon}
                      className="w-10 h-10 mb-4 text-blue-600"
                    />
                    <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 text-center">
                <p className="text-lg font-semibold">
                  This is more than a role. It's a platform for leaders. And
                  that leader is you.
                </p>
              </div>
            </section>

            {/* Your Influence Section */}
            <section
              className={`p-8 rounded-2xl ${
                mode === "dark" ? "bg-gray-800" : "bg-white"
              } shadow-lg`}
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">
                  Your Influence, Defined
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  PAAN Ambassadors are active professionals who:
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {responsibilities.map((responsibility, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 mt-1">
                      <Icon
                        icon="mdi:check-circle"
                        className="w-6 h-6 text-green-500"
                      />
                    </div>
                    <p className="text-lg">{responsibility}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Benefits Section */}
            <section className="relative overflow-hidden rounded-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 opacity-95 rounded-2xl"></div>
              <div className="relative p-8 text-white">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-4">What You Gain</h2>
                  <p className="text-lg opacity-90 max-w-3xl mx-auto">
                    With great responsibility comes{" "}
                    <strong>exclusive benefits</strong> designed to reward your
                    effort and elevate your profile
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {benefits.map((benefit, index) => (
                    <div
                      key={index}
                      className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300"
                    >
                      <Icon
                        icon={benefit.icon}
                        className="w-10 h-10 mb-4 text-yellow-400"
                      />
                      <h3 className="text-lg font-semibold mb-3">
                        {benefit.title}
                      </h3>
                      <p className="opacity-90 text-sm">
                        {benefit.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Getting Started */}
            <section
              className={`p-8 rounded-2xl ${
                mode === "dark" ? "bg-gray-800" : "bg-white"
              } shadow-lg text-center`}
            >
              <h2 className="text-3xl font-bold mb-4">
                You're Not Just Joining a Network. You're Shaping It.
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                The PAAN Ambassador Program is your invitation to be part of
                something bigger — a united force building the strongest agency
                ecosystem Africa has ever seen.
              </p>

              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-6">Ready to Begin?</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    {
                      step: "Step 1",
                      title: "Share Your Details",
                      description: "Contact us at secretariat@paan.africa",
                    },
                    {
                      step: "Step 2",
                      title: "Welcome Kit",
                      description: "Receive your kit & attend onboarding call",
                    },
                    {
                      step: "Step 3",
                      title: "Start Activating",
                      description: "Begin building with PAAN HQ behind you",
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className={`p-6 rounded-xl ${
                        mode === "dark" ? "bg-gray-700" : "bg-gray-50"
                      }`}
                    >
                      <div className="text-2xl font-bold text-blue-600 mb-3">
                        {item.step}
                      </div>
                      <h4 className="text-lg font-semibold mb-2">
                        {item.title}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-red-600">
                  Africa is Rising. And So Are You.
                </h3>
                <p className="text-lg mb-6">
                  Join the circle of those shaping the future.
                </p>
                <a
                  href="mailto:secretariat@paan.africa"
                  className="inline-flex items-center px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-full text-lg font-semibold transition-all duration-300"
                >
                  <Icon icon="mdi:email" className="w-5 h-5 mr-2" />
                  secretariat@paan.africa
                </a>
              </div>
            </section>

            {/* Call to Action */}
            <div className="mt-6 p-4 md:p-6 bg-paan-dark-blue text-white rounded-lg flex flex-col md:flex-row items-center justify-between gap-4 transition-all duration-300">
              <span className="text-xl md:text-2xl">
                Not sure where to start?
                <br />
                <span className="text-sm">
                  Speak with a PAAN Ambassador to explore your options and build
                  a plan that aligns with your agency's goals.
                </span>
              </span>
              <button
                onClick={handleContactClick}
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
        title={modalData?.title || "Ambassador Program"}
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
        title="Book a Free Strategy Call"
        user={user}
        description="Ready to explore the PAAN Ambassador Program? Book a free strategy call with our team to discuss your options and create a personalized growth plan for your agency."
      />
    </div>
  );
}
