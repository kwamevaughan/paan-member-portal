// HireFreelancer Component
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
import FreelancerForm from "@/components/FreelancerForm";
import TestimonialQuote from "@/components/testimonialQuote";
import AgencyLogosGrid from "@/components/AgencyLogosGrid";

export default function HireFreelancer({ mode = "light", toggleMode }) {
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

  const [error, setError] = useState(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [projectType, setProjectType] = useState(""); // Lifted state

  const title = "Hire a Freelancer";
  const description = "Vetted talent. African excellence. PAAN verified.";

  const projectTypes = [
  "Web Development",
  "Graphic Design",
  "Mobile App Development",
  "UI/UX Design",
  "Event Management",
  "Social Media Management",
  "Research Services",
  "Other",
];

  const handleFreelancerClick = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const projectType = formData.get("projectType");
    const customProjectType = formData.get("customProjectType");

    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      companyName: formData.get("companyName"),
      projectType: projectType === "Other" ? customProjectType : projectType,
      budgetRange: formData.get("budgetRange"),
      timeline: formData.get("timeline"),
      skillsNeeded: formData.get("skillsNeeded"),
      message: formData.get("message"),
      subject: `Hiring Request - ${projectType === "Other" ? customProjectType : projectType}`,
      terms: formData.get("terms"),
    };

    if (!data.name || !data.email || !data.projectType || !data.budgetRange || !data.timeline || !data.message) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (projectType === "Other" && !customProjectType) {
      toast.error("Please specify your project type");
      return;
    }

    if (!data.terms) {
      toast.error("You must accept the terms & conditions and privacy policy");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    submitHiringRequest(data);
  };

  const submitHiringRequest = async (data) => {
    try {
      const response = await fetch("/api/hiring", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success("Hiring request submitted successfully! We'll connect you with the perfect freelancer soon.");
        const form = document.querySelector("form");
        if (form) {
          form.reset();
          setProjectType(""); // Reset projectType after form submission
        }
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to submit request. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting hiring request:", error);
      toast.error("Network error. Please check your connection and try again.");
    }
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 relative top-6 mt-8 hover:shadow-lg transition-all duration-300 rounded-lg overflow-hidden">
              <div className="bg-paan-yellow/20 flex flex-col h-full relative p-8">
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-800 mt-4">
                    Get Started with PAAN
                  </h2>
                  <p className="text-gray-600 mt-2">
                    It will only take two minutes to sign up. Then we can
                    connect you with the perfect freelancer(s) to help your
                    business.
                  </p>
                </div>

                <FreelancerForm
                  user={user}
                  handleFreelancerClick={handleFreelancerClick}
                  projectTypes={projectTypes}
                  projectType={projectType}
                  setProjectType={setProjectType}
                />
              </div>

              <div className="bg-paan-yellow/80 p-8 flex flex-col h-full relative">
                <h3 className="text-2xl font-semibold text-gray-800 mt-4">
                  Experts that will fit into your team seamlessly
                </h3>
                <p className="text-gray-600 mt-2">
                  We've vetted the best freelancers in Africa. They're ready to
                  help your business grow.
                </p>

                <div className="flex flex-wrap gap-4 mt-6">
                  {projectTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => setProjectType(type)} // Update projectType on click
                      className="flex items-center justify-center border border-gray-100/50 hover:border-none text-gray-600 px-4 py-3 rounded-md hover:bg-paan-blue hover:border-paan-blue hover:text-white transition-all duration-300 group overflow-hidden"
                    >
                      <span className="whitespace-nowrap">{type}</span>
                      <Icon
                        icon="mdi:arrow-right"
                        className="w-0 h-5 opacity-0 group-hover:opacity-100 group-hover:w-5 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300 ml-0 group-hover:ml-2"
                      />
                    </button>
                  ))}
                </div>

                <TestimonialQuote />
              </div>
            </div>

            <AgencyLogosGrid />

            <div className="relative top-6  mt-6 mb-20 p-4 md:p-6 bg-paan-blue rounded-lg flex flex-col md:flex-row items-center justify-between gap-4 transition-all duration-300">
              <span className="text-xl md:text-2xl">
                Can't find who you're looking for?{" "}
                <span
                  className="font-semibold cursor-pointer underline"
                  onClick={handleFreelancerClick}
                >
                  Contact PAAN
                </span>{" "}
                and we'll recommend top talent for your project.
              </span>
            </div>

            <div className="pt-2">
              <SimpleFooter mode={mode} isSidebarOpen={isSidebarOpen} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}