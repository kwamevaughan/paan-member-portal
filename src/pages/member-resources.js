import React, { useState, useEffect } from "react";
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
import ContactFormModal from "@/components/ContactFormModal";
import ResourceCard from "@/components/ResourceCard";
import OnboardingKitModal from "@/components/resources/OnboardingKitModal";
import MerchTemplatesModal from "@/components/resources/MerchTemplatesModal";
import BrandAssetsModal from "@/components/resources/BrandAssetsModal";
import VerifiedMemberBadgesModal from "@/components/resources/VerifiedMemberBadgesModal";
import EmbedBadgeModal from "@/components/resources/EmbedBadgeModal";
import ComingSoonModal from "@/components/resources/ComingSoonModal";

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

  // Modal states
  const [isOnboardingKitModalOpen, setIsOnboardingKitModalOpen] =
    useState(false);
  const [isMerchTemplatesModalOpen, setIsMerchTemplatesModalOpen] =
    useState(false);
  const [isBrandAssetsModalOpen, setIsBrandAssetsModalOpen] = useState(false);
  const [isVerifiedBadgesModalOpen, setIsVerifiedBadgesModalOpen] =
    useState(false);
  const [isEmbedBadgeModalOpen, setIsEmbedBadgeModalOpen] = useState(false);
  const [isComingSoonModalOpen, setIsComingSoonModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [comingSoonData, setComingSoonData] = useState({ title: "", type: "" });

  const title = "Member Resources";
  const description =
    "Show off your PAAN membership with branding assets, badges, and creative merch templates.";

  // Handler functions
  const handleOnboardingKitClick = () => {
    setIsOnboardingKitModalOpen(true);
  };

  const handleMerchTemplatesClick = () => {
    setIsMerchTemplatesModalOpen(true);
  };

  const handleBrandAssetsClick = () => {
    setIsBrandAssetsModalOpen(true);
  };

  const handleVerifiedBadgesClick = () => {
    setIsVerifiedBadgesModalOpen(true);
  };

  const handleEmbedBadgeClick = () => {
    setIsEmbedBadgeModalOpen(true);
  };

  const handleComingSoonClick = (title, type) => {
    setComingSoonData({ title, type });
    setIsComingSoonModalOpen(true);
  };

  const handleContactClick = () => {
    setIsContactModalOpen(true);
  };

  // Check for query parameters to auto-open modals
  useEffect(() => {
    if (router.isReady && user) {
      const { openBadges } = router.query;
      
      if (openBadges === 'true') {
        setIsVerifiedBadgesModalOpen(true);
        // Clean up the URL by removing the query parameter
        router.replace('/member-resources', undefined, { shallow: true });
      }
    }
  }, [router.isReady, router.query, user]);

  // Resource cards data
  const resourceCards = [
    {
      title: "PAAN Onboarding Kit",
      description:
        "A comprehensive onboarding kit for new PAAN members, including a welcome letter, a member handbook, and a list of resources to help you get started.",
      buttonText: "View Onboarding Kit",
      onClick: handleOnboardingKitClick,
      badgeText: "Toolkit",
      badgeColor: "bg-paan-blue",
    },
    {
      title: "PAAN Logos & Brand Assets",
      description:
        "Download official PAAN logos and brand guidelines in multiple formats.",
      buttonText: "Download Brand Pack",
      onClick: handleBrandAssetsClick,
      badgeText: "Assets",
      badgeColor: "bg-paan-blue",
    },
    {
      title: "Verified Member Badges",
      description:
        "Display your verified PAAN status with downloadable badge graphics and certificates.",
      buttonText: "Download My Badge",
      onClick: handleVerifiedBadgesClick,
      badgeText: "Badges",
      badgeColor: "bg-paan-blue",
    },
    {
      title: "Merch Print Templates",
      description:
        "Print-ready designs for shirts, caps, and tote bags — ideal for team swag or events.",
      buttonText: "View Templates",
      onClick: handleMerchTemplatesClick,
      badgeText: "Assets",
      badgeColor: "bg-paan-blue",
    },
    {
      title: "Embed Badge Code",
      description:
        "Generate code in multiple formats (HTML, Markdown, React, Vue, BBCode) to embed your verified PAAN member badge anywhere.",
      buttonText: "Get Embed Code",
      onClick: handleEmbedBadgeClick,
      badgeText: "Code",
      badgeColor: "bg-paan-blue",
    },
    {
      title: "Social Media Templates",
      description:
        "Editable social post designs for project launches, team intros, or brand promos.",
      buttonText: "Download social media kit",
      onClick: () =>
        handleComingSoonClick("Social Media Templates", "social-media"),
      badgeText: "Badges",
      badgeColor: "bg-paan-blue",
    },
  ];

  if (userLoading) {
    return LoadingComponent;
  }

  if (!user) {
    router.push("/");
    return null;
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

            {/* Resource Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {resourceCards.map((card, index) => (
                <ResourceCard
                  key={index}
                  title={card.title}
                  description={card.description}
                  buttonText={card.buttonText}
                  onClick={card.onClick}
                  badgeText={card.badgeText}
                  badgeColor={card.badgeColor}
                />
              ))}
            </div>

            {/* Call to Action */}
            <div className="mt-6 p-4 md:p-6 bg-paan-yellow text-paan-dark-blue rounded-lg flex flex-col md:flex-row items-center justify-between gap-4 transition-all duration-300">
              <span className="text-xl md:text-2xl">
                Need help applying the assets?{" "}
                <span className="font-semibold">Message the PAAN Team</span>
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

      {/* Modals */}
      <OnboardingKitModal
        isOpen={isOnboardingKitModalOpen}
        onClose={() => setIsOnboardingKitModalOpen(false)}
        mode={mode}
      />

      <MerchTemplatesModal
        isOpen={isMerchTemplatesModalOpen}
        onClose={() => setIsMerchTemplatesModalOpen(false)}
        mode={mode}
      />

      <BrandAssetsModal
        isOpen={isBrandAssetsModalOpen}
        onClose={() => setIsBrandAssetsModalOpen(false)}
        mode={mode}
      />

      <VerifiedMemberBadgesModal
        isOpen={isVerifiedBadgesModalOpen}
        onClose={() => setIsVerifiedBadgesModalOpen(false)}
        mode={mode}
        user={user}
      />

      <EmbedBadgeModal
        isOpen={isEmbedBadgeModalOpen}
        onClose={() => setIsEmbedBadgeModalOpen(false)}
        mode={mode}
        user={user}
      />

      <ComingSoonModal
        isOpen={isComingSoonModalOpen}
        onClose={() => setIsComingSoonModalOpen(false)}
        mode={mode}
        title={comingSoonData.title}
        type={comingSoonData.type}
      />

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
