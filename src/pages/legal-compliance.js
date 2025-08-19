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

export default function LegalCompliance({ mode = "light", toggleMode }) {
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

  const title = "Legal & Compliance";
  const description =
    "Running an agency in Africa comes with unique legal and regulatory considerations. This section gives you access to region-specific documents, best-practice templates, and expert advice — so you can focus on growth, not red tape.";

  const handleCloseModal = () => {
    setIsUnifiedModalOpen(false);
    setModalData(null);
  };

  const handleContactClick = () => {
    setIsContactModalOpen(true);
  };

  const handlePreviewClick = (doc) => {
    setModalData({
      title: doc.name,
      type: 'legal-doc',
      downloadUrl: doc.downloadUrl,
      previewUrl: `https://docs.google.com/viewer?url=${encodeURIComponent(doc.downloadUrl)}&embedded=true`
    });
    setIsUnifiedModalOpen(true);
  };

  // Get documents for current tab
  const getCurrentTabDocuments = () => {
    switch (activeTab) {
      case "Legal Docs":
        return legalDocs;
      case "IP Protection":
        return ipProtection;
      case "Data & Privacy":
        return dataPrivacy;
      case "Tax Compliance Toolkit":
        return taxComplianceToolkit;
      default:
        return [];
    }
  };

  // Reusable Document Item Component
  const DocumentItem = ({ doc, index }) => (
    <div
      key={index}
      className="flex flex-col md:flex-row items-center justify-between py-4 border-b last:border-b-0 hover:bg-paan-dark-blue/10 transition-all duration-300"
    >
      <div className="flex items-center mb-2 md:mb-0">
        <span className="mr-4">
          <Icon
            icon="flat-color-icons:folder"
            className="w-10 h-10"
          />
        </span>
        <span className="text-lg">{doc.name}</span>
      </div>
      <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 w-full md:w-auto">
        <Link href={doc.downloadUrl}>
          <button className="px-10 py-2 bg-paan-dark-blue hover:bg-paan-dark-blue/80 text-white rounded-full w-full md:w-auto transition-all duration-300">
            Download
          </button>
        </Link>
        <button
          className="px-10 py-2 bg-paan-dark-blue hover:bg-paan-dark-blue/80 text-white rounded-full w-full md:w-auto transition-all duration-300"
          onClick={() => handlePreviewClick(doc)}
        >
          Preview
        </button>
      </div>
    </div>
  );

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

  const tabs = [
    { name: "Legal Docs", image: "/assets/images/legal-docs.png" },
    { name: "IP Protection", image: "/assets/images/ip-protection.png" },
    { name: "Data & Privacy", image: "/assets/images/data-privacy.png" },
    { name: "Tax Compliance Toolkit", image: "/assets/images/tax-compliance.png" },
  ];

  const legalDocs = [
    { 
      name: "Influencer Collaboration Agreement",
      downloadUrl: "https://ik.imagekit.io/2crwrt8s6/LegalComplianceDocs/INFLUENCER%20COLLABORATION%20AGREEMENT.docx?updatedAt=1752989541750"
    },
    { 
      name: "Joint Venture or Collaboration Agreement",
      downloadUrl: "https://ik.imagekit.io/2crwrt8s6/LegalComplianceDocs/JOINT%20VENTURE%20or%20COLLABORATION%20AGREEMENT.docx?updatedAt=1752989541611"
    },
    { 
      name: "Memorandum of Understanding WECOMPLY LABS",
      downloadUrl: "https://ik.imagekit.io/2crwrt8s6/LegalComplianceDocs/MEMORANDUM%20OF%20UNDERSTANDING%20WECOMPLY%20LABS.docx?updatedAt=1752989541696"
    },
    { 
      name: "Non-Disclosure Agreement WECOMPLY LABS",
      downloadUrl: "https://ik.imagekit.io/2crwrt8s6/LegalComplianceDocs/NON-DISCLOSURE%20AGREEMENT%20WECOMPLY%20LABS.docx?updatedAt=1752989541646"
    },
    { 
      name: "Service Level Agreement WECOMPLY",
      downloadUrl: "https://ik.imagekit.io/2crwrt8s6/LegalComplianceDocs/SERVICE%20LEVEL%20AGREEMENT%20WECOMPLY.docx?updatedAt=1752989541574"
    },
    { 
      name: "Software As A Service Agreement",
      downloadUrl: "https://ik.imagekit.io/2crwrt8s6/LegalComplianceDocs/SOFTWARE%20AS%20A%20SERVICE%20AGREEMENT.docx?updatedAt=1752989541678"
    },
  ];

  const ipProtection = [
    {
      name: "Content Licensing Agreement WeComply Labs",
      downloadUrl:
        "https://ik.imagekit.io/2crwrt8s6/LegalComplianceDocs/CONTENT%20LICENSING%20AGREEMENT%20WECOMPLY%20LABS.docx",
    },
    {
      name: "Pitch Non-Disclosure Agreement",
      downloadUrl:
        "https://ik.imagekit.io/2crwrt8s6/LegalComplianceDocs/PITCH%20NON-DISCLOSURE%20AGREEMENT%20.docx",
    },
    {
      name: "Pitch Protection Application Form",
      downloadUrl:
        "https://ik.imagekit.io/2crwrt8s6/LegalComplianceDocs/PITCH%20PROTECTION%20APPLICATION%20FORM.docx",
    },
    {
      name: "Pitch Protection Protocol",
      downloadUrl:
        "https://ik.imagekit.io/2crwrt8s6/LegalComplianceDocs/PITCH%20PROTECTION%20PROTOCOL.docx",
    },
  ];

  const dataPrivacy = [
    {
      name: "Data Consent Form Template",
      downloadUrl:
        "https://ik.imagekit.io/2crwrt8s6/LegalComplianceDocs/DATA%20CONSENT%20FORM%20TEMPLATE.docx",
    },
    {
      name: "Website Privacy Policy Template",
      downloadUrl:
        "https://ik.imagekit.io/2crwrt8s6/LegalComplianceDocs/WEBSITE%20PRIVACY%20POLICY%20TEMPLATE.docx",
    },
  ];

  const taxComplianceToolkit = [
    {
      name: "Freelancer or Sole Trader Objection Letter Template",
      downloadUrl:
        "https://ik.imagekit.io/2crwrt8s6/LegalComplianceDocs/FREELANCER%20OR%20SOLE%20TRADER%20OBJECTION%20LETTER%20TEMPLATE.docx",
    },
    {
      name: "General Tax Objection Letter Template",
      downloadUrl:
        "https://ik.imagekit.io/2crwrt8s6/LegalComplianceDocs/GENERAL%20TAX%20OBJECTION%20LETTER%20TEMPLATE.docx",
    },
    {
      name: "Tax Compliance Calendar Kenya 2025 Edition",
      downloadUrl:
        "https://ik.imagekit.io/2crwrt8s6/LegalComplianceDocs/TAX%20COMPLIANCE%20CALENDAR%20KENYA%202025%20EDITION.docx",
    },
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

            {/* Tabs */}
            <div className="overflow-x-auto mb-6 bg-white p-2 py-6 rounded-lg shadow-md">
              <div className="flex w-full gap-4">
                {tabs.map((tab) => (
                  <button
                    key={tab.name}
                    className={`flex items-center px-2 py-1 pr-14 rounded-full text-base flex-1 transition-all duration-300 ${
                      activeTab === tab.name
                        ? "bg-paan-blue text-gray-800"
                        : "bg-transparent text-gray-700 border border-paan-dark-blue font-semibold hover:bg-paan-dark-blue/10"
                    } whitespace-nowrap`}
                    onClick={() => setActiveTab(tab.name)}
                  >
                    <span className="mr-2">
                      {tab.image ? (
                        <Image
                          src={tab.image}
                          alt={tab.name}
                          width={40}
                          height={40}
                          className="object-contain w-10 h-10 bg-white rounded-full p-1"
                        />
                      ) : tab.icon ? (
                        <Icon icon={tab.icon} className="w-4 h-4" />
                      ) : (
                        <span>📄</span>
                      )}
                    </span>
                    {tab.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Documents Section */}
            <div className="bg-white p-4 rounded-lg shadow-md transition-all duration-300">
              {getCurrentTabDocuments().map((doc, index) => (
                <DocumentItem doc={doc} index={index} />
              ))}
            </div>

            {/* Call to Action */}
            <div className="mt-6 p-4 md:p-6 bg-paan-dark-blue text-white rounded-lg flex flex-col md:flex-row items-center justify-between gap-4 transition-all duration-300">
              <span className="text-xl md:text-2xl">
                Need legal help in Africa?
              </span>
              <button 
                onClick={() => window.open("https://calendly.com/matagaro-sironga-wecomplylabs/30min?month=2025-08", "_blank")}
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
        title={modalData?.title || "Legal Docs"}
        mode={mode}
        width="max-w-4xl"
      >
        {modalData?.type === 'legal-doc' ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Icon icon="mdi:file-document" className="w-8 h-8 text-paan-blue" />
                <div>
                  <h3 className="text-xl font-semibold">{modalData.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Document Preview
                  </p>
                </div>
              </div>
              <Link href={modalData.downloadUrl} target="_blank">
                <button className="px-4 py-2 bg-paan-blue hover:bg-paan-blue/80 text-white rounded-lg transition-all duration-300 flex items-center gap-2">
                  <Icon icon="mdi:download" className="w-4 h-4" />
                  Download
                </button>
              </Link>
            </div>
            
            <div className="w-full h-[70vh] border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <iframe
                src={modalData.previewUrl}
                width="100%"
                height="100%"
                className="border-0"
                title={`Preview of ${modalData.title}`}
                allow="autoplay"
              />
            </div>
          </div>
        ) : (
          <UnifiedModalContent
            modalData={modalData}
            mode={mode}
            onClose={handleCloseModal}
          />
        )}
      </SimpleModal>

      {/* Contact Form Modal */}
      <ContactFormModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        mode={mode}
        title="Book a Free Strategy Call"
        user={user}
        showLegalSubjects={true}
        description="Need legal guidance for your agency in Africa? Book a free strategy call with our legal experts to discuss your specific compliance needs and get personalized advice."
      />
    </div>
  );
}
