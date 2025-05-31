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
    console.log("[Offers] User:", user);
    console.log("[Offers] Offers:", offers);
    console.log("[Offers] Latest Offer Date:", latestOfferDate);
    console.log("[Offers] Filters:", filters);
    console.log("[Offers] FilterOptions:", filterOptions);
  }, [offers, user, latestOfferDate, filters, filterOptions]);

  useEffect(() => {
    const handleError = (event) => {
      console.error("[Offers] Global error:", event.error);
    };
    window.addEventListener("error", handleError);
    return () => window.removeEventListener("error", handleError);
  }, []);

  const handleFilterChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleResetFilters = (e) => {
    e.preventDefault();
    setFilters({
      offer_type: "",
      tier_restriction: "",
    });
    setActiveTab("all");
    setShowFilterPanel(false);
  };

  const handleOfferClick = async (offer) => {
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
        console.log("[Offers] Click tracked for offer:", offer.title);
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

  if (userLoading || offersLoading) {
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
          className={`content-container flex-1 p-4 md:p-6 lg:p-8 transition-all duration-300 ${
            isSidebarOpen && !isMobile ? "sidebar-open" : ""
          }`}
          style={{
            marginLeft: isMobile ? "0px" : isSidebarOpen ? "200px" : "80px",
          }}
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
              <div className="flex overflow-x-auto no-scrollbar gap-2 pb-2">
                {[
                  { id: "all", label: "All Offers", icon: "mdi:view-grid" },
                  {
                    id: "accessible",
                    label: "For Your Tier",
                    icon: "mdi:accessibility",
                  },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 rounded-full whitespace-nowrap flex items-center gap-2 transition-all ${
                      activeTab === tab.id
                        ? "bg-blue-600 text-white font-medium shadow-md"
                        : mode === "dark"
                        ? "bg-gray-800 hover:bg-gray-700"
                        : "bg-white hover:bg-gray-100"
                    } shadow-sm`}
                  >
                    <Icon icon={tab.icon} />
                    {tab.label}
                  </button>
                ))}
              </div>
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
                  <form
                    onSubmit={(e) => e.preventDefault()}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    {[
                      {
                        key: "offer_type",
                        icon: "mdi:tag",
                        label: "Offer Type",
                      },
                      {
                        key: "tier_restriction",
                        icon: "mdi:crown-outline",
                        label: "Tier",
                      },
                    ].map(({ key, icon, label }) => (
                      <div key={key} className="space-y-1">
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center gap-1.5">
                          <Icon icon={icon} />
                          {label}
                        </label>
                        <select
                          name={key}
                          value={filters[key]}
                          onChange={handleFilterChange}
                          className={`w-full p-2.5 rounded-lg border ${
                            mode === "dark"
                              ? "bg-gray-700 border-gray-600 text-white"
                              : "bg-white border-gray-200 text-gray-800"
                          } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                        >
                          <option value="">All {label}s</option>
                          {(filterOptions[`${key}s`] || []).map((val) => (
                            <option key={val} value={val}>
                              {val}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </form>
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOffers.map((offer) => (
                <div
                  key={offer.id}
                  onClick={() => handleOfferClick(offer)}
                  className={`group rounded-2xl overflow-hidden border shadow-sm hover:shadow-xl transition-all duration-300 ${
                    mode === "dark"
                      ? "bg-gray-800 border-gray-700 hover:border-gray-600"
                      : "bg-white border-gray-200 hover:border-gray-300"
                  } ${!offer.isAccessible ? "opacity-60" : ""}`}
                >
                  <div className="relative h-40 bg-gradient-to-r from-indigo-400 to-purple-600 overflow-hidden">
                    <div className="absolute inset-0 opacity-20 bg-pattern"></div>
                    <div className="absolute top-0 right-0 p-3">
                      <TierBadge
                        tier={offer.tier_restriction}
                        mode={mode}
                        variant="solid"
                      />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                      <div className="flex items-center gap-2 text-white font-semibold">
                        <Icon icon="mdi:tag" />
                        {offer.offer_type || "General"}
                      </div>
                    </div>
                  </div>

                  <div className="p-5 space-y-4">
                    <div>
                      <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {offer.title}
                      </h3>
                      <p
                        className={`text-sm ${
                          mode === "dark" ? "text-gray-300" : "text-gray-600"
                        } line-clamp-3`}
                      >
                        {offer.description || "No description available."}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div
                        className={`rounded-lg p-3 ${
                          mode === "dark" ? "bg-gray-700/60" : "bg-gray-50"
                        }`}
                      >
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          Type
                        </div>
                        <div className="font-medium truncate">
                          {offer.offer_type || "General"}
                        </div>
                      </div>
                      <div
                        className={`rounded-lg p-3 ${
                          mode === "dark" ? "bg-gray-700/60" : "bg-gray-50"
                        }`}
                      >
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          Rating
                        </div>
                        <div className="font-medium flex items-center gap-1.5">
                          <Icon icon="mdi:star" className="text-yellow-500" />
                          {offer.averageRating.toFixed(1)} (
                          {offer.feedbackCount})
                        </div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        className={`block w-full px-4 py-2 rounded-lg font-semibold text-center ${
                          offer.isAccessible
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-600 dark:text-gray-400"
                        } transition-colors`}
                        disabled={!offer.isAccessible}
                      >
                        {offer.isAccessible ? "Access Offer" : "Locked"}
                      </button>
                    </div>
                  </div>
                </div>
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
    </div>
  );
}
