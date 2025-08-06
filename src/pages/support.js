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
import { motion, AnimatePresence } from "framer-motion";

export default function SupportPage({ mode = "light", toggleMode }) {
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

  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [isContentLoading, setIsContentLoading] = useState(true);

  const title = "PAAN Support Center";
  const description =
    "Get help with your PAAN membership, technical issues, or general inquiries. Our support team is here to assist you.";

  // Simulate content loading for skeleton effect
  useEffect(() => {
    if (!userLoading) {
      const timer = setTimeout(() => setIsContentLoading(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [userLoading]);

  const handleContactClick = (subject = "") => {
    setSelectedSubject(subject);
    setIsContactModalOpen(true);
  };

  const toggleFAQ = (index) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  const supportCategories = [
    {
      icon: "mdi:account-question",
      title: "Account & Membership",
      description:
        "Questions about your membership, profile, or account settings",
      topics: [
        "Profile updates",
        "Membership tiers",
        "Account verification",
        "Login issues",
      ],
    },
    {
      icon: "mdi:cog",
      title: "Technical Support",
      description:
        "Help with technical issues, bugs, or platform functionality",
      topics: [
        "Website errors",
        "Download issues",
        "Browser compatibility",
        "Mobile app support",
      ],
    },
    {
      icon: "mdi:briefcase",
      title: "Business Opportunities",
      description:
        "Support for job postings, applications, and business connections",
      topics: [
        "Job applications",
        "Posting opportunities",
        "Freelancer matching",
        "Project management",
      ],
    },
    {
      icon: "mdi:shield-check",
      title: "Privacy & Security",
      description:
        "Data protection, privacy concerns, and security-related questions",
      topics: [
        "Data privacy",
        "Account security",
        "Password reset",
        "Two-factor authentication",
      ],
    },
    {
      icon: "mdi:file-document",
      title: "Resources & Downloads",
      description:
        "Help with accessing member resources, badges, and brand assets",
      topics: [
        "Badge downloads",
        "Brand assets",
        "Templates",
        "Member resources",
      ],
    },
    {
      icon: "mdi:help-circle",
      title: "General Inquiries",
      description:
        "Other questions or feedback about PAAN services and community",
      topics: [
        "Partnership inquiries",
        "Event information",
        "Community guidelines",
        "Feedback",
      ],
    },
  ];

  const faqs = [
    {
      question: "How do I download my member badge?",
      answer:
        "Navigate to your profile dropdown in the header, select 'Download Member Badge,' or visit the Member Resources page.",
    },
    {
      question: "How do I update my profile information?",
      answer:
        "Contact our support team with your updated details via the contact form or email us directly.",
    },
    {
      question: "What are the different membership tiers?",
      answer:
        "PAAN offers Free, Associate, Full, and Gold tiers, each with unique benefits and access levels.",
    },
    {
      question: "How do I reset my password?",
      answer:
        "Use the 'Forgot Password' link on the login page or contact support for assistance.",
    },
    {
      question: "Can I access PAAN resources offline?",
      answer:
        "Yes, download brand assets, badges, and templates from the Member Resources page in multiple formats.",
    },
    {
      question: "How do I report a technical issue?",
      answer:
        "Use the contact form, select 'Technical Support,' and provide details for quick resolution.",
    },
  ];

  if (userLoading) return LoadingComponent;
  if (!user) {
    router.push("/");
    return null;
  }

  const SkeletonLoader = ({ type }) => (
    <div
      className={`rounded-xl p-6 ${
        mode === "dark" ? "bg-gray-800/50" : "bg-white/50"
      } animate-pulse`}
    >
      {type === "category" ? (
        <div className="flex flex-col space-y-4">
          <div className="flex items-center">
            <div
              className={`p-3 rounded-lg ${
                mode === "dark" ? "bg-gray-700" : "bg-gray-200"
              } mr-4`}
            >
              <div
                className={`w-6 h-6 ${
                  mode === "dark" ? "bg-gray-600" : "bg-gray-100"
                } rounded`}
              ></div>
            </div>
            <div
              className={`h-6 w-1/2 ${
                mode === "dark" ? "bg-gray-600" : "bg-gray-100"
              } rounded`}
            ></div>
          </div>
          <div
            className={`h-4 w-3/4 ${
              mode === "dark" ? "bg-gray-600" : "bg-gray-100"
            } rounded`}
          ></div>
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center">
                <div
                  className={`w-4 h-4 ${
                    mode === "dark" ? "bg-gray-600" : "bg-gray-100"
                  } rounded-full mr-2`}
                ></div>
                <div
                  className={`h-4 w-1/3 ${
                    mode === "dark" ? "bg-gray-600" : "bg-gray-100"
                  } rounded`}
                ></div>
              </div>
            ))}
          </div>
          <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
            <div
              className={`h-4 w-1/4 ${
                mode === "dark" ? "bg-gray-600" : "bg-gray-100"
              } rounded`}
            ></div>
            <div
              className={`w-4 h-4 ${
                mode === "dark" ? "bg-gray-600" : "bg-gray-100"
              } rounded`}
            ></div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between items-center">
            <div
              className={`h-6 w-3/4 ${
                mode === "dark" ? "bg-gray-600" : "bg-gray-100"
              } rounded`}
            ></div>
            <div
              className={`w-5 h-5 ${
                mode === "dark" ? "bg-gray-600" : "bg-gray-100"
              } rounded`}
            ></div>
          </div>
          <div
            className={`h-4 w-full ${
              mode === "dark" ? "bg-gray-600" : "bg-gray-100"
            } rounded`}
          ></div>
        </div>
      )}
    </div>
  );

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${
        mode === "dark"
          ? "bg-gradient-to-br from-gray-900 to-gray-800 text-white"
          : "bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900"
      }`}
    >
      <Toaster position="top-right" />
      <HrHeader
        toggleSidebar={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
        sidebarState={sidebarState}
        user={user}
        mode={mode}
        toggleMode={toggleMode}
        onLogout={handleLogout}
      />
      <div className="flex flex-1 overflow-hidden">
        <HrSidebar
          isOpen={isSidebarOpen}
          user={user}
          mode={mode}
          toggleSidebar={toggleSidebar}
          onLogout={handleLogout}
          setDragOffset={updateDragOffset}
          toggleMode={toggleMode}
        />
        <main
          className={`flex-1 p-4 sm:p-6 lg:p-8 xl:p-12 transition-all duration-300 ${
            isSidebarOpen && !isMobile ? "ml-64" : "ml-0"
          }`}
        >
          <div className="max-w-7xl mx-auto space-y-8">
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
              hideLastUpdated
            />

            {/* Quick Contact Section */}
            <section
              className={`rounded-xl p-6 shadow-lg backdrop-blur-sm transition-all duration-300 ${
                mode === "dark" ? "bg-paan-dark-blue" : "bg-paan-blue"
              }`}
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-left">
                  <h2 className="text-2xl font-semibold tracking-tight text-white">
                    Need Immediate Help?
                  </h2>
                  <p className="mt-2 text-sm text-white">
                    Contact our support team directly, and we’ll respond
                    promptly.
                  </p>
                </div>
                <button
                  onClick={() => handleContactClick()}
                  className="px-6 py-3 bg-paan-yellow text-paan-dark-blue rounded-full font-semibold hover:bg-paan-yellow/80 hover:scale-105 transition-all duration-200 flex items-center gap-2 shadow-sm"
                  aria-label="Open contact form"
                >
                  <Icon icon="mdi:email-outline" className="w-5 h-5" />
                  Start Conversation
                </button>
              </div>
            </section>

            {/* Support Categories Grid */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {isContentLoading
                ? [...Array(6)].map((_, index) => (
                    <SkeletonLoader key={index} type="category" />
                  ))
                : supportCategories.map((category, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      onClick={() => handleContactClick(category.title)}
                      className={`p-6 rounded-xl border shadow-sm cursor-pointer transition-all duration-300 hover:shadow-md hover:-translate-y-1 backdrop-blur-sm ${
                        mode === "dark"
                          ? "bg-gray-800/80 border-gray-700 hover:border-paan-blue"
                          : "bg-white/80 border-gray-200 hover:border-paan-blue"
                      }`}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleContactClick(category.title)
                      }
                    >
                      <div className="flex items-center mb-4">
                        <div
                          className={`p-3 rounded-lg mr-4 transition-colors ${
                            mode === "dark"
                              ? "bg-paan-blue/20"
                              : "bg-paan-blue/10"
                          } group-hover:bg-paan-blue/30`}
                        >
                          <Icon
                            icon={category.icon}
                            className="w-6 h-6 text-paan-blue"
                          />
                        </div>
                        <h3 className="text-lg font-semibold tracking-tight">
                          {category.title}
                        </h3>
                      </div>
                      <p
                        className={`text-sm mb-4 ${
                          mode === "dark" ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        {category.description}
                      </p>
                      <ul className="space-y-2 mb-4">
                        {category.topics.map((topic, topicIndex) => (
                          <li key={topicIndex} className="flex items-center">
                            <Icon
                              icon="mdi:check-circle"
                              className="w-4 h-4 text-paan-yellow mr-2"
                            />
                            <span
                              className={`text-sm ${
                                mode === "dark"
                                  ? "text-gray-400"
                                  : "text-gray-500"
                              }`}
                            >
                              {topic}
                            </span>
                          </li>
                        ))}
                      </ul>
                      <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                        <span
                          className={`text-sm font-medium ${
                            mode === "dark" ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          Get help now
                        </span>
                        <Icon
                          icon="mdi:arrow-right"
                          className="w-5 h-5 text-paan-blue group-hover:translate-x-1 transition-transform"
                        />
                      </div>
                    </motion.div>
                  ))}
            </section>

            {/* FAQ Section */}
            <section
              className={`rounded-xl p-6 shadow-sm backdrop-blur-sm ${
                mode === "dark" ? "bg-gray-800/80" : "bg-white/80"
              }`}
            >
              <h2 className="text-2xl font-semibold tracking-tight mb-6">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {isContentLoading
                  ? [...Array(6)].map((_, index) => (
                      <SkeletonLoader key={index} type="faq" />
                    ))
                  : faqs.map((faq, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className={`border rounded-xl overflow-hidden transition-all duration-200 ${
                          mode === "dark"
                            ? "border-gray-700"
                            : "border-gray-200"
                        }`}
                      >
                        <button
                          onClick={() => toggleFAQ(index)}
                          className={`w-full px-4 py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                            expandedFAQ === index
                              ? "bg-gray-50 dark:bg-gray-700"
                              : ""
                          }`}
                          aria-expanded={expandedFAQ === index}
                          aria-controls={`faq-${index}`}
                        >
                          <h3 className="font-normal tracking-tight">
                            {faq.question}
                          </h3>
                          <Icon
                            icon={
                              expandedFAQ === index
                                ? "mdi:chevron-up"
                                : "mdi:chevron-down"
                            }
                            className={`w-5 h-5 transition-transform ${
                              mode === "dark"
                                ? "text-gray-400"
                                : "text-gray-500"
                            }`}
                          />
                        </button>
                        <AnimatePresence>
                          {expandedFAQ === index && (
                            <motion.div
                              id={`faq-${index}`}
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: "easeInOut" }}
                              className={`px-4 pb-4 border-t ${
                                mode === "dark"
                                  ? "border-gray-700"
                                  : "border-gray-200"
                              }`}
                            >
                              <p
                                className={`text-sm pt-3 ${
                                  mode === "dark"
                                    ? "text-gray-300"
                                    : "text-gray-600"
                                }`}
                              >
                                {faq.answer}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
              </div>
            </section>

            {/* Contact Information */}
            <section
              className={`rounded-xl p-6 shadow-sm backdrop-blur-sm ${
                mode === "dark" ? "bg-gray-800/80" : "bg-white/80"
              }`}
            >
              <h2 className="text-2xl font-semibold tracking-tight mb-6">
                Get in Touch
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  {
                    icon: "mdi:email-outline",
                    title: "Email Support",
                    value: "support@paan.africa",
                  },
                  {
                    icon: "mdi:clock-outline",
                    title: "Response Time",
                    value: "Within 24-48 hours",
                  },
                  {
                    icon: "mdi:web",
                    title: "Website",
                    value: "www.paan.africa",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="text-center"
                  >
                    <div
                      className={`inline-flex p-4 rounded-full mb-4 ${
                        mode === "dark" ? "bg-paan-blue/20" : "bg-paan-blue/10"
                      }`}
                    >
                      <Icon
                        icon={item.icon}
                        className="w-8 h-8 text-paan-blue"
                      />
                    </div>
                    <h3 className="font-semibold tracking-tight mb-2">
                      {item.title}
                    </h3>
                    {item.title === "Email Support" ? (
                      <a
                        href="mailto:support@paan.africa"
                        className={`text-sm hover:underline transition-colors ${
                          mode === "dark"
                            ? "text-paan-blue hover:text-paan-blue/80"
                            : "text-paan-blue hover:text-paan-blue/80"
                        }`}
                      >
                        {item.value}
                      </a>
                    ) : item.title === "Website" ? (
                      <Link
                        href="https://www.paan.africa"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-sm hover:underline transition-colors ${
                          mode === "dark"
                            ? "text-paan-blue hover:text-paan-blue/80"
                            : "text-paan-blue hover:text-paan-blue/80"
                        }`}
                      >
                        {item.value}
                      </Link>
                    ) : (
                      <p
                        className={`text-sm ${
                          mode === "dark" ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        {item.value}
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>
            </section>
          </div>
          <SimpleFooter mode={mode} isSidebarOpen={isSidebarOpen} />
        </main>
      </div>

      <ContactFormModal
        isOpen={isContactModalOpen}
        onClose={() => {
          setIsContactModalOpen(false);
          setSelectedSubject("");
        }}
        mode={mode}
        title="Contact PAAN Support"
        user={user}
        description="Have a question or need assistance? Send us a message, and we’ll respond promptly."
        initialSubject={selectedSubject}
      />
    </div>
  );
}
