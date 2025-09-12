import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Icon } from "@iconify/react";
import { useUser } from "@/hooks/useUser";
import useOffers from "@/hooks/useOffers";
import useLogout from "@/hooks/useLogout";
import HrHeader from "@/layouts/hrHeader";
import HrSidebar from "@/layouts/hrSidebar";
import SimpleFooter from "@/layouts/simpleFooter";
import useSidebar from "@/hooks/useSidebar";
import toast, { Toaster } from "react-hot-toast";
import TitleCard from "@/components/TitleCard";
import {
  getTierBadgeStyles,
  TierBadge,
  JobTypeBadge,
  normalizeTier,
} from "@/components/Badge";
import Link from "next/link";
import { hasTierAccess } from "@/utils/tierUtils";
import { supabase } from "@/lib/supabase";
import TabsSelector from "@/components/TabsSelector";
import OfferCard from "@/components/OfferCard";
import UnifiedModalContent from "@/components/UnifiedModalContent";
import SimpleModal from "@/components/SimpleModal";
import AccessCoverageCard from "@/components/AccessCoverageCard";

export default function Offers({ mode = "light", toggleMode }) {
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
  const [filters, setFilters] = useState({
    offer_type: "",
    tier_restriction: "",
  });
  const [activeTab, setActiveTab] = useState("all");
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const {
    offers,
    filterOptions,
    loading: offersLoading,
    error,
  } = useOffers(filters, user);
  const [modalData, setModalData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const title = "Exclusive Offers";
  const description =
    "Discover premium opportunities, discounts, and partnerships tailored for your membership tier.";

  // Get latest offer date
  const latestOfferDate =
    offers.length > 0
      ? new Date(
          Math.max(...offers.map((offer) => new Date(offer.updated_at)))
        ).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "No offers available";

  useEffect(() => {
    const handleError = (event) => {
      console.error("[Offers] Global error:", event.error);
    };
    window.addEventListener("error", handleError);
    return () => window.removeEventListener("error", handleError);
  }, []);

  const handleResetFilters = (e) => {
    e.preventDefault();
    setFilters({
      offer_type: "",
      tier_restriction: "",
    });
    setActiveTab("all");
    setShowFilterPanel(false);
  };

  const handleOfferClick = (offer) => {
    setModalData({ ...offer, type: 'offer' });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalData(null);
  };

  const handleOfferAccess = async (offer) => {
    if (!hasTierAccess(offer.tier_restriction, user)) {
      toast.error(
        `This offer is available to ${normalizeTier(
          offer.tier_restriction
        )} only. Consider upgrading your membership to access this offer.`,
        { duration: 5000 }
      );
      return;
    }
    try {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();
      if (authUser) {
        await supabase
          .from("offer_clicks")
          .insert([{ offer_id: offer.id, user_id: authUser.id }]);
        window.open(offer.url, "_blank", "noopener,noreferrer");
      }
    } catch (err) {
      console.error("[Offers] Error tracking click:", err.message);
      toast.error("Failed to track offer click");
    }
  };

  const filteredOffers =
    activeTab === "all"
      ? offers
      : offers.filter((offer) => hasTierAccess(offer.tier_restriction, user));

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

  // Define tabs for the top-level filter
  const mainTabs = [
    { id: "all", label: "All Offers", icon: "mdi:view-grid" },
    { id: "accessible", label: "For Your Tier", icon: "mdi:accessibility" },
  ];

  // Define tabs for offer types and tiers
  const offerTypeTabs = [
    { id: "", label: "All Types", icon: "mdi:tag" },
    ...(filterOptions.offer_types?.map((type) => ({
      id: type,
      label: type,
      icon: "mdi:tag",
    })) || []),
  ];

  const tierTabs = [
    { id: "", label: "All Tiers", icon: "mdi:crown-outline" },
    ...(filterOptions.tier_restrictions?.map((tier) => ({
      id: tier,
      label: tier,
      icon: "mdi:crown-outline",
    })) || []),
  ];

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
          className={`flex-1 p-4 md:p-6 lg:p-8 transition-all ${
            isSidebarOpen && !isMobile ? "ml-60" : "ml-60"
          }`}
        >
          <div className="max-w-7xl mx-auto space-y-6">
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
              pageTable="offers"
              lastUpdated={latestOfferDate}
            />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <TabsSelector
                tabs={mainTabs}
                selectedTab={activeTab}
                onSelect={setActiveTab}
                mode={mode}
                icon="mdi:view-grid"
              />
              <button
                onClick={() => setShowFilterPanel(!showFilterPanel)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition ${
                  mode === "dark"
                    ? "bg-gray-800 hover:bg-gray-700"
                    : "bg-white hover:bg-gray-100"
                } ${showFilterPanel ? "ring-2 ring-blue-500" : ""} shadow-sm`}
              >
                <Icon icon="mdi:filter-variant" />
                <span>Filters</span>
                {Object.values(filters).some((val) => val !== "") && (
                  <span className="flex items-center justify-center w-5 h-5 text-xs font-medium rounded-full bg-blue-600 text-white">
                    {Object.values(filters).filter((val) => val !== "").length}
                  </span>
                )}
              </button>
            </div>

            {showFilterPanel && (
              <div
                className={`rounded-2xl shadow-lg overflow-hidden transition-all ${
                  mode === "dark"
                    ? "bg-gray-800 border border-gray-700"
                    : "bg-white"
                }`}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-lg font-semibold">
                      <Icon
                        icon="mdi:filter-variant"
                        className="text-blue-500"
                      />
                      <span>Refine Your Search</span>
                    </div>
                    <button
                      onClick={handleResetFilters}
                      className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500 transition"
                    >
                      <Icon icon="mdi:restart" />
                      Reset All
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center gap-1.5">
                        <Icon icon="mdi:tag" />
                        Offer Type
                      </label>
                      <TabsSelector
                        tabs={offerTypeTabs}
                        selectedTab={filters.offer_type}
                        onSelect={(value) =>
                          setFilters((prev) => ({ ...prev, offer_type: value }))
                        }
                        mode={mode}
                        icon="mdi:tag"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center gap-1.5">
                        <Icon icon="mdi:crown-outline" />
                        Tier
                      </label>
                      <TabsSelector
                        tabs={tierTabs}
                        selectedTab={filters.tier_restriction}
                        onSelect={(value) =>
                          setFilters((prev) => ({
                            ...prev,
                            tier_restriction: value,
                          }))
                        }
                        mode={mode}
                        icon="mdi:crown-outline"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center">
              <div
                className={`px-4 py-2 rounded-lg ${
                  mode === "dark" ? "bg-gray-800" : "bg-white"
                } shadow-sm`}
              >
                <span className="font-semibold">{filteredOffers.length}</span>
                <span className="text-gray-600 dark:text-gray-400">
                  {" "}
                  offers found
                </span>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Showing {Math.min(12, filteredOffers.length)} of{" "}
                {filteredOffers.length}
              </div>
            </div>

            <AccessCoverageCard
              mode={mode}
              userTier={user?.selected_tier}
              sectionLabel={"offers"}
              onUpgrade={() => window.open("https://paan.africa/#membership", "_blank", "noopener,noreferrer")}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {offersLoading && (
                <div className="col-span-full flex justify-center py-8">
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-paan-blue"></div>
                    <span>Loading offers...</span>
                  </div>
                </div>
              )}
              {!offersLoading && filteredOffers.map((offer) => (
                <OfferCard
                  key={offer.id}
                  offer={offer}
                  userTier={user.selected_tier}
                  mode={mode}
                  onAccess={handleOfferAccess}
                  isRestricted={!hasTierAccess(offer.tier_restriction, user)}
                  onRestrictedClick={() => {
                    toast.error(
                      `This offer is available to ${normalizeTier(
                        offer.tier_restriction
                      )} only. Consider upgrading your membership to access this offer.`,
                      { duration: 5000 }
                    );
                  }}
                  onClick={handleOfferClick}
                  Icon={Icon}
                />
              ))}
            </div>

            {filteredOffers.length === 0 && (
              <div
                className={`text-center py-12 rounded-2xl ${
                  mode === "dark" ? "bg-gray-800" : "bg-white"
                } shadow-sm border dark:border-gray-700`}
              >
                <Icon
                  icon="mdi:tag"
                  className="inline-block text-5xl text-gray-400 mb-4"
                />
                <h3 className="text-xl font-semibold mb-2">No Offers Found</h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                  No offers match your current filters. Try adjusting your
                  search criteria or check back later for new offers.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            )}

            {filteredOffers.length > 12 && (
              <div className="flex justify-center mt-8">
                <div className="flex items-center space-x-2">
                  <button
                    className={`w-10 h-10 flex items-center justify-center rounded-lg ${
                      mode === "dark"
                        ? "bg-gray-800 hover:bg-gray-700"
                        : "bg-white hover:bg-gray-100"
                    } border dark:border-gray-700 shadow-sm`}
                  >
                    <Icon icon="mdi:chevron-left" />
                  </button>
                  {[1, 2, 3].map((num) => (
                    <button
                      key={num}
                      className={`w-10 h-10 flex items-center justify-center rounded-lg font-medium ${
                        num === 1
                          ? "bg-blue-600 text-white"
                          : mode === "dark"
                          ? "bg-gray-800 hover:bg-gray-700"
                          : "bg-white hover:bg-gray-100"
                      } border dark:border-gray-700 shadow-sm`}
                    >
                      {num}
                    </button>
                  ))}
                  <button
                    className={`w-10 h-10 flex items-center justify-center rounded-lg ${
                      mode === "dark"
                        ? "bg-gray-800 hover:bg-gray-700"
                        : "bg-white hover:bg-gray-100"
                    } border dark:border-gray-700 shadow-sm`}
                  >
                    <Icon icon="mdi:chevron-right" />
                  </button>
                </div>
              </div>
            )}
          </div>
          <SimpleFooter mode={mode} isSidebarOpen={isSidebarOpen} />
        </div>
      </div>
      <SimpleModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={modalData?.title || "Offer Details"}
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
