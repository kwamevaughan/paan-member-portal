import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@/hooks/useUser";
import useOffers from "@/hooks/useOffers";
import useLogout from "@/hooks/useLogout";
import HrHeader from "@/layouts/hrHeader";
import HrSidebar from "@/layouts/hrSidebar";
import SimpleFooter from "@/layouts/simpleFooter";
import useSidebar from "@/hooks/useSidebar";
import toast, { Toaster } from "react-hot-toast";
import OfferCard from "@/components/OfferCard";
import OffersFilters from "@/components/OffersFilters";
import { supabase } from "@/lib/supabase";
import { tierBadgeStyles, normalizeTier } from "@/components/Badge";

export default function Offers({ mode = "light", toggleMode }) {
  const { isSidebarOpen, toggleSidebar, sidebarState, updateDragOffset } = useSidebar();
  const router = useRouter();
  const { user, loading: userLoading, LoadingComponent } = useUser();
  const handleLogout = useLogout();
  const [filters, setFilters] = useState({ tier_restriction: "all" });
  const [filterTerm, setFilterTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const { offers, filterOptions, loading: offersLoading, error } = useOffers(filters);

  useEffect(() => {
    console.log("[Offers] User:", user);
    console.log("[Offers] Offers:", offers);
    console.log("[Offers] Filters:", filters);
    console.log("[Offers] Filter Term:", filterTerm);
  }, [user, offers, filters, filterTerm]);

   

  const handleOfferClick = async (offer) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("offer_clicks").insert([{ offer_id: offer.id, user_id: user.id }]);
        console.log("[Offers] Click tracked for offer:", offer.title);
      }
    } catch (err) {
      console.error("[Offers] Error tracking click:", err.message);
    }
  };

  const filteredOffers = offers.filter((offer) => {
    const matchesTerm =
      offer.title.toLowerCase().includes(filterTerm.toLowerCase()) ||
      offer.description?.toLowerCase().includes(filterTerm.toLowerCase());
    return matchesTerm;
  });

  console.log("[Offers] Filtered Offers:", filteredOffers);

  if (userLoading || offersLoading) {
    return LoadingComponent;
  }

  if (!user) {
    router.push("/login");
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
      className={`min-h-screen flex flex-col bg-gradient-to-br ${mode === "dark" ? "from-gray-900 via-indigo-950 to-purple-950" : "from-indigo-100 via-purple-100 to-pink-100"}`}
    >
      <Toaster
        position="top-center"
        toastOptions={{
          className: `!${mode === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800"} font-medium`,
          style: {
            borderRadius: "10px",
            padding: "16px",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
          },
        }}
      />
      <HrHeader
        toggleSidebar={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
        sidebarState={sidebarState}
        fullName={user?.name ?? "Member"}
        jobTitle={user.job_type}
        selectedTier={normalizeTier(user?.selected_tier)}
        agencyName={user.agencyName}
        mode={mode}
        toggleMode={toggleMode}
        onLogout={handleLogout}
        pageName="Exclusive Offers"
        pageDescription="Unlock premium opportunities and discounts tailored for you."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Offers" }]}
      />
      <div className="flex flex-1">
        <HrSidebar
          isOpen={isSidebarOpen}
          mode={mode}
          toggleMode={toggleMode}
          onLogout={handleLogout}
          toggleSidebar={toggleSidebar}
          setDragOffset={updateDragOffset}
        />
        <div
          className={`flex-1 p-4 md:p-6 lg:p-8 transition-all duration-300 overflow-auto`}
          style={{
            marginLeft: sidebarState.hidden
              ? "0px"
              : `${84 + (isSidebarOpen ? 120 : 0) + sidebarState.offset}px`,
          }}
        >
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className={`relative overflow-hidden rounded-3xl ${mode === "dark" ? "bg-gray-800/50" : "bg-white/50"} backdrop-blur-lg shadow-2xl`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 opacity-50" />
              <div className="absolute top-0 right-0 -mt-12 -mr-12 w-48 h-48 bg-indigo-500 rounded-full opacity-20 blur-3xl" />
              <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-48 h-48 bg-purple-500 rounded-full opacity-20 blur-3xl" />
              <div className="relative p-8 md:p-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <h1 className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
                      Exclusive Offers
                    </h1>
                    <p className={`text-md ${mode === "dark" ? "text-gray-300" : "text-gray-600"} max-w-2xl`}>
                      Discover premium opportunities, discounts, and partnerships tailored for your membership tier.
                    </p>
                  </div>
                  <div className="md:self-end">
                    <div
                      className={`rounded-xl p-4 backdrop-blur-sm ${mode === "dark" ? "bg-gray-700/50" : "bg-gray-50/50"} border border-gray-200 dark:border-gray-700`}
                    >
                      <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                        Your Membership Tier
                      </div>
                      <div
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${tierBadgeStyles[normalizeTier(user?.selected_tier)]}`}
                      >
                        <Icon icon="mdi:crown" className="w-5 h-5" />
                        <span className="font-semibold">
                          {normalizeTier(user?.selected_tier)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Filters and Offers */}
            <div className="relative">
              <OffersFilters
                filterTerm={filterTerm}
                setFilterTerm={setFilterTerm}
                filterType={filters.tier_restriction}
                setFilterType={(value) => {
                  console.log("[Offers] Setting filter type:", value);
                  setFilters({ ...filters, tier_restriction: value });
                }}
                showFilters={showFilters}
                setShowFilters={setShowFilters}
                mode={mode}
              />
              {filteredOffers.length > 0 ? (
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ staggerChildren: 0.2 }}
                >
                  {filteredOffers.map((offer) => (
                    <OfferCard
                      key={offer.id}
                      offer={offer}
                      userTier={user?.selected_tier}
                      onClick={handleOfferClick}
                      mode={mode}
                    />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16"
                >
                  <Icon
                    icon="heroicons:tag"
                    className={`mx-auto h-24 w-24 ${mode === "dark" ? "text-indigo-400" : "text-indigo-500"}`}
                  />
                  <h3 className={`mt-4 text-2xl font-semibold ${mode === "dark" ? "text-white" : "text-gray-900"}`}>
                    No Offers Found
                  </h3>
                  <p className={`mt-2 text-sm ${mode === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                    {filterTerm || filters.tier_restriction !== "all"
                      ? "Try adjusting your filters."
                      : "No offers are available at the moment."}
                  </p>
                </motion.div>
              )}
            </div>
          </div>
          <SimpleFooter mode={mode} isSidebarOpen={isSidebarOpen} />
        </div>
      </div>
    </div>
  );
}