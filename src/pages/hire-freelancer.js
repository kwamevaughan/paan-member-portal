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

  const [activeTab, setActiveTab] = useState("Legal Docs");
  const [error, setError] = useState(null);

  // Unified modal state
  const [modalData, setModalData] = useState(null);
  const [isUnifiedModalOpen, setIsUnifiedModalOpen] = useState(false);

  // Download modal state
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [downloadModalData, setDownloadModalData] = useState(null);

  // Contact form modal state
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const title = "Hire a Freelancer";
  const description =
    "Vetted talent. African excellence. PAAN verified.";

  const handleCloseModal = () => {
    setIsUnifiedModalOpen(false);
    setModalData(null);
  };

  const handleCloseDownloadModal = () => {
    setIsDownloadModalOpen(false);
    setDownloadModalData(null);
  };

  const handleDownloadClick = (type, title) => {
    setDownloadModalData({ type, title });
    setIsDownloadModalOpen(true);
  };

  const handleContactClick = (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(e.target);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      companyName: formData.get('companyName'),
      projectType: formData.get('projectType'),
      budgetRange: formData.get('budgetRange'),
      timeline: formData.get('timeline'),
      skillsNeeded: formData.get('skillsNeeded'),
      message: formData.get('message'),
      subject: `Hiring Request - ${formData.get('projectType')}`
    };

    // Basic validation
    if (!data.name || !data.email || !data.projectType || !data.budgetRange || !data.timeline || !data.message) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Submit the form
    submitHiringRequest(data);
  };

  const submitHiringRequest = async (data) => {
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success("Hiring request submitted successfully! We'll connect you with the perfect freelancer soon.");
        // Reset form by finding the form element
        const form = document.querySelector('form');
        if (form) {
          form.reset();
        }
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to submit request. Please try again.");
      }
    } catch (error) {
      console.error('Error submitting hiring request:', error);
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

            {/* New Layout Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 relative">
              {/* Blur overlay and disabled state */}
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto w-16 h-16 bg-paan-blue/10 rounded-full flex items-center justify-center mb-4">
                    <Icon
                      icon="mdi:account-group"
                      className="w-8 h-8 text-paan-blue"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    Request for Freelancer Services
                  </h3>
                  <p className="text-gray-600 max-w-md">
                    We're currently building our freelancer directory. Soon you'll
                    be able to browse and hire from our verified talent pool.
                  </p>
                  <div className="flex items-center justify-center">
                    <button className="mt-6 px-6 py-2 bg-paan-red hover:bg-paan-red/80 text-white rounded-full transition-all duration-300 flex items-center justify-center w-fit">
                      Request for Freelancer Services
                    </button>
                  </div>
                </div>
              </div>
              <div className="bg-white px-8 py-12 rounded-lg shadow-sm transition-all duration-200 flex flex-col h-full relative opacity-50 pointer-events-none">
                <div className="absolute top-4 right-4">
                  <Image
                    src="/assets/images/paan-member-badge.png"
                    alt="Paan Member Badge"
                    width={60}
                    height={60}
                    draggable={false}
                  />
                </div>

                <div className="flex flex-col items-center justify-center gap-1">
                  <div className="flex items-center justify-center mb-2">
                    <Image
                      src="/assets/images/african-lady.png"
                      alt="Paan Logo"
                      width={140}
                      height={140}
                      draggable={false}
                      className="rounded-full"
                    />
                  </div>

                  <h3 className="text-2xl font-semibold text-gray-800">
                    Janet Mwangi
                  </h3>
                  <p className="text-gray-600 mt-2">
                    Brand Designer • Illustrator
                  </p>
                  <p className="text-gray-600 font-bold">Nairobi, Kenya</p>
                </div>
              </div>
              <div className="bg-white px-8 py-12 rounded-lg shadow-sm transition-all duration-200 flex flex-col h-full relative opacity-50 pointer-events-none">
                <div className="absolute top-4 right-4">
                  <Image
                    src="/assets/images/paan-member-badge.png"
                    alt="Paan Member Badge"
                    width={60}
                    height={60}
                    draggable={false}
                  />
                </div>

                <div className="flex flex-col items-center justify-center gap-1">
                  <div className="flex items-center justify-center mb-2">
                    <Image
                      src="/assets/images/african-lady.png"
                      alt="Paan Logo"
                      width={140}
                      height={140}
                      draggable={false}
                      className="rounded-full"
                    />
                  </div>

                  <h3 className="text-2xl font-semibold text-gray-800">
                    Janet Mwangi
                  </h3>
                  <p className="text-gray-600 mt-2">
                    Brand Designer • Illustrator
                  </p>
                  <p className="text-gray-600 font-bold">Nairobi, Kenya</p>
                </div>
              </div>
              <div className="bg-white px-8 py-12 rounded-lg shadow-sm transition-all duration-200 flex flex-col h-full relative opacity-50 pointer-events-none">
                <div className="absolute top-4 right-4">
                  <Image
                    src="/assets/images/paan-member-badge.png"
                    alt="Paan Member Badge"
                    width={60}
                    height={60}
                    draggable={false}
                  />
                </div>

                <div className="flex flex-col items-center justify-center gap-1">
                  <div className="flex items-center justify-center mb-2">
                    <Image
                      src="/assets/images/african-lady.png"
                      alt="Paan Logo"
                      width={140}
                      height={140}
                      draggable={false}
                      className="rounded-full"
                    />
                  </div>

                  <h3 className="text-2xl font-semibold text-gray-800">
                    Janet Mwangi
                  </h3>
                  <p className="text-gray-600 mt-2">
                    Brand Designer • Illustrator
                  </p>
                  <p className="text-gray-600 font-bold">Nairobi, Kenya</p>
                </div>
              </div>
            </div>

            {/* Direct Contact Form */}
            <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
              <div className="text-center mb-6">
                <div className="mx-auto w-16 h-16 bg-paan-blue/10 rounded-full flex items-center justify-center mb-4">
                  <Icon
                    icon="mdi:account-group"
                    className="w-8 h-8 text-paan-blue"
                  />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  Hire a Freelancer
                </h3>
                <p className="text-gray-600">
                  Looking for specific talent or can't find the right
                  freelancer? Let us know your project requirements and we'll
                  connect you with the perfect PAAN-verified freelancer for your
                  needs.
                </p>
              </div>

              <form onSubmit={handleContactClick} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      defaultValue={user?.full_name || user?.name || ""}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-paan-blue focus:border-transparent"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div className="relative">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      defaultValue={user?.email || ""}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-paan-blue focus:border-transparent bg-gray-50"
                      placeholder="Enter your email address"
                      required
                      readOnly={!!user?.email}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="companyName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Company Name
                    </label>
                    <input
                      type="text"
                      id="companyName"
                      name="companyName"
                      defaultValue={user?.agencyName || ""}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-paan-blue focus:border-transparent"
                      placeholder="Your company name"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="projectType"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Project Type *
                    </label>
                    <select
                      id="projectType"
                      name="projectType"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-paan-blue focus:border-transparent"
                      required
                    >
                      <option value="">Select project type</option>
                      <option value="Web Development">Web Development</option>
                      <option value="Mobile App Development">
                        Mobile App Development
                      </option>
                      <option value="UI/UX Design">UI/UX Design</option>
                      <option value="Graphic Design">Graphic Design</option>
                      <option value="Content Writing">Content Writing</option>
                      <option value="Digital Marketing">
                        Digital Marketing
                      </option>
                      <option value="Data Analysis">Data Analysis</option>
                      <option value="Video Production">Video Production</option>
                      <option value="Translation">Translation</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="budgetRange"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Budget Range *
                    </label>
                    <select
                      id="budgetRange"
                      name="budgetRange"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-paan-blue focus:border-transparent"
                      required
                    >
                      <option value="">Select budget range</option>
                      <option value="$500 - $1,000">$500 - $1,000</option>
                      <option value="$1,000 - $2,500">$1,000 - $2,500</option>
                      <option value="$2,500 - $5,000">$2,500 - $5,000</option>
                      <option value="$5,000 - $10,000">$5,000 - $10,000</option>
                      <option value="$10,000 - $25,000">
                        $10,000 - $25,000
                      </option>
                      <option value="$25,000+">$25,000+</option>
                      <option value="To be discussed">To be discussed</option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="timeline"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Timeline *
                    </label>
                    <select
                      id="timeline"
                      name="timeline"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-paan-blue focus:border-transparent"
                      required
                    >
                      <option value="">Select timeline</option>
                      <option value="1-2 weeks">1-2 weeks</option>
                      <option value="2-4 weeks">2-4 weeks</option>
                      <option value="1-2 months">1-2 months</option>
                      <option value="2-3 months">2-3 months</option>
                      <option value="3+ months">3+ months</option>
                      <option value="Ongoing">Ongoing</option>
                      <option value="Flexible">Flexible</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="skillsNeeded"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Specific Skills Needed
                  </label>
                  <textarea
                    id="skillsNeeded"
                    name="skillsNeeded"
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-paan-blue focus:border-transparent resize-none"
                    placeholder="e.g., React, Figma, SEO, Content Writing, etc."
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Project Description *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-paan-blue focus:border-transparent resize-none"
                    placeholder="Tell us more about your project requirements, goals, and any specific details..."
                    required
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-paan-red hover:bg-paan-red/80 text-white rounded-lg font-medium transition-colors flex items-center justify-center"
                  >
                    <Icon icon="mdi:send" className="w-4 h-4 mr-2" />
                    Submit Hiring Request
                  </button>
                </div>
              </form>
            </div>

            {/* Call to Action */}

            <div className="mt-6 p-4 md:p-6 bg-paan-blue rounded-lg flex flex-col md:flex-row items-center justify-between gap-4 transition-all duration-300">
              <span className="text-xl md:text-2xl">
                Can't find who you're looking for?{" "}
                <span
                  className="font-semibold cursor-pointer underline"
                  onClick={handleContactClick}
                >
                  Contact PAAN
                </span>{" "}
                and we'll recommend top talent for your project.
              </span>
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

      {/* Download Modal */}
      <SimpleModal
        isOpen={isDownloadModalOpen}
        onClose={handleCloseDownloadModal}
        title={downloadModalData?.title || "Download Assets"}
        mode={mode}
        width="max-w-2xl"
      >
        <div className="space-y-6">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-paan-blue/10 rounded-full flex items-center justify-center mb-4">
              <Icon icon="mdi:download" className="w-8 h-8 text-paan-blue" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Request for Freelancer Services
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              We're currently preparing the request for freelancer services. Our
              team is working hard to make these assets available to all PAAN
              members.
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
              What's included:
            </h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              {downloadModalData?.type === "brand-pack" && (
                <>
                  <li className="flex items-center">
                    <Icon
                      icon="mdi:check-circle"
                      className="w-4 h-4 text-green-500 mr-2"
                    />
                    High-resolution PAAN logos (PNG, SVG, PDF)
                  </li>
                  <li className="flex items-center">
                    <Icon
                      icon="mdi:check-circle"
                      className="w-4 h-4 text-green-500 mr-2"
                    />
                    Brand guidelines and color palettes
                  </li>
                  <li className="flex items-center">
                    <Icon
                      icon="mdi:check-circle"
                      className="w-4 h-4 text-green-500 mr-2"
                    />
                    Typography and spacing guidelines
                  </li>
                </>
              )}
              {downloadModalData?.type === "badges" && (
                <>
                  <li className="flex items-center">
                    <Icon
                      icon="mdi:check-circle"
                      className="w-4 h-4 text-green-500 mr-2"
                    />
                    Verified member badge graphics
                  </li>
                  <li className="flex items-center">
                    <Icon
                      icon="mdi:check-circle"
                      className="w-4 h-4 text-green-500 mr-2"
                    />
                    Digital certificates and credentials
                  </li>
                  <li className="flex items-center">
                    <Icon
                      icon="mdi:check-circle"
                      className="w-4 h-4 text-green-500 mr-2"
                    />
                    Social media profile badges
                  </li>
                </>
              )}
              {downloadModalData?.type === "templates" && (
                <>
                  <li className="flex items-center">
                    <Icon
                      icon="mdi:check-circle"
                      className="w-4 h-4 text-green-500 mr-2"
                    />
                    Print-ready shirt designs
                  </li>
                  <li className="flex items-center">
                    <Icon
                      icon="mdi:check-circle"
                      className="w-4 h-4 text-green-500 mr-2"
                    />
                    Cap and tote bag templates
                  </li>
                  <li className="flex items-center">
                    <Icon
                      icon="mdi:check-circle"
                      className="w-4 h-4 text-green-500 mr-2"
                    />
                    Event merchandise layouts
                  </li>
                </>
              )}
              {downloadModalData?.type === "social-media" && (
                <>
                  <li className="flex items-center">
                    <Icon
                      icon="mdi:check-circle"
                      className="w-4 h-4 text-green-500 mr-2"
                    />
                    Editable social post templates
                  </li>
                  <li className="flex items-center">
                    <Icon
                      icon="mdi:check-circle"
                      className="w-4 h-4 text-green-500 mr-2"
                    />
                    Project launch announcements
                  </li>
                  <li className="flex items-center">
                    <Icon
                      icon="mdi:check-circle"
                      className="w-4 h-4 text-green-500 mr-2"
                    />
                    Team introduction graphics
                  </li>
                </>
              )}
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleCloseDownloadModal}
              className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-medium transition-colors"
            >
              Got it
            </button>
            <button
              onClick={() => {
                handleCloseDownloadModal();
                // You can add navigation to contact page here
                toast.success("We'll notify you when assets are ready!");
              }}
              className="flex-1 px-6 py-3 bg-paan-red hover:bg-paan-red/80 text-white rounded-lg font-medium transition-colors"
            >
              Notify me when ready
            </button>
          </div>
        </div>
      </SimpleModal>

      {/* Contact Form Modal */}
      <ContactFormModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        mode={mode}
        title="Hire a Freelancer"
        user={user}
        showHireFields={true}
        description="Looking for specific talent or can't find the right freelancer? Let us know your project requirements and we'll connect you with the perfect PAAN-verified freelancer for your needs."
      />
    </div>
  );
}
