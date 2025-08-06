import React, { useState } from "react";
import { Icon } from "@iconify/react";
import SimpleModal from "./SimpleModal";
import toast from "react-hot-toast";

const ContactFormModal = ({ 
  isOpen, 
  onClose, 
  mode, 
  title = "Contact Us", 
  user = null, 
  showLegalSubjects = false, 
  showHireFields = false, 
  formType = "general", // New prop for form type
  description = "Have a question or need assistance? Send us a message and we'll respond as soon as possible.", 
  initialSubject = "" 
}) => {
  const [formData, setFormData] = useState({
    name: user?.full_name || user?.name || "",
    email: user?.email || "",
    subject: "",
    message: "",
    projectType: "",
    budgetRange: "",
    timeline: "",
    skillsNeeded: "",
    companyName: user?.agencyName || "",
    // Co-bidding specific fields
    partnerAgencyName: "",
    partnerAgencyContact: "",
    projectValue: "",
    servicesCombined: "",
    // Outsource specific fields
    outsourcingScope: "",
    customOutsourcingScope: "",
    whiteLabelRequired: false,
    deliveryTimeline: "",
    // Webinar speaker specific fields
    speakingTopic: "",
    customSpeakingTopic: "",
    availability: "",
    timezone: "",
    // Mentor specific fields
    mentorshipArea: "",
    customMentorshipArea: "",
    menteePreference: "",
    commitmentLevel: "",
    // Peer roundtable specific fields
    agencySize: "",
    roundtableTopics: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get form configuration based on type
  const getFormConfig = () => {
    switch (formType) {
      case "co-bidding":
        return {
          title: "Co-Bidding Matchmaking",
          description: "Tell us about your co-bidding partnership needs. We'll help you find the perfect agency partner.",
          fields: [
            { name: "name", label: "Your Name *", type: "text", required: true },
            { name: "email", label: "Email Address *", type: "email", required: true, groupWith: "companyName" },
            { name: "companyName", label: "Your Agency Name *", type: "text", required: true, groupWith: "email" },
            { name: "partnerAgencyName", label: "Partner Agency Name", type: "text", required: false, groupWith: "partnerAgencyContact" },
            { name: "partnerAgencyContact", label: "Partner Agency Contact", type: "text", required: false, groupWith: "partnerAgencyName" },
            { name: "projectValue", label: "Project Value Range *", type: "select", required: true, options: [
              "$10,000 - $25,000",
              "$25,000 - $50,000", 
              "$50,000 - $100,000",
              "$100,000 - $250,000",
              "$250,000+",
              "To be discussed"
            ]},
            { name: "servicesCombined", label: "Services to Combine *", type: "textarea", required: true, placeholder: "e.g., Your agency handles design, partner handles development" },
            { name: "message", label: "Project Details *", type: "textarea", required: true, placeholder: "Describe the project and why you need a co-bidding partner..." }
          ]
        };
      case "outsource":
        return {
          title: "Outsource to Agency",
          description: "Find vetted PAAN agencies to help deliver part of your brief.",
          fields: [
            { name: "name", label: "Your Name *", type: "text", required: true },
            { name: "email", label: "Email Address *", type: "email", required: true, groupWith: "companyName" },
            { name: "companyName", label: "Your Agency Name *", type: "text", required: true, groupWith: "email" },
            { name: "outsourcingScope", label: "What to Outsource *", type: "select", required: true, options: [
              "Design Services",
              "Development Services", 
              "Content Creation",
              "Digital Marketing",
              "Video Production",
              "Translation Services",
              "Data Analysis",
              "Other"
            ]},
            { name: "customOutsourcingScope", label: "Please specify what to outsource", type: "text", required: false, showWhen: "outsourcingScope", showWhenValue: "Other" },
            { name: "projectValue", label: "Project Budget *", type: "select", required: true, groupWith: "deliveryTimeline", options: [
              "$1,000 - $5,000",
              "$5,000 - $10,000",
              "$10,000 - $25,000", 
              "$25,000 - $50,000",
              "$50,000+",
              "To be discussed"
            ]},
            { name: "deliveryTimeline", label: "Delivery Timeline *", type: "select", required: true, groupWith: "projectValue", options: [
              "1-2 weeks",
              "2-4 weeks",
              "1-2 months",
              "2-3 months",
              "Flexible"
            ]},
            { name: "whiteLabelRequired", label: "White-label Required?", type: "checkbox", required: false },
            { name: "message", label: "Project Requirements *", type: "textarea", required: true, placeholder: "Describe what you need outsourced and any specific requirements..." }
          ]
        };
      case "webinar-speaker":
        return {
          title: "Speak at a Webinar",
          description: "Share your insights as a guest speaker during upcoming PAAN webinars.",
          fields: [
            { name: "name", label: "Your Name *", type: "text", required: true },
            { name: "email", label: "Email Address *", type: "email", required: true, groupWith: "companyName" },
            { name: "companyName", label: "Your Agency Name *", type: "text", required: true, groupWith: "email" },
            { name: "speakingTopic", label: "Preferred Speaking Topic *", type: "select", required: true, options: [
              "Agency Growth & Scaling",
              "Client Acquisition Strategies",
              "Team Management & Leadership",
              "Financial Management",
              "Digital Transformation",
              "Creative Process & Innovation",
              "International Expansion",
              "Other"
            ]},
            { name: "customSpeakingTopic", label: "Please specify your speaking topic", type: "text", required: false, showWhen: "speakingTopic", showWhenValue: "Other" },
            { name: "experienceLevel", label: "Years of Experience *", type: "select", required: true, options: [
              "1-3 years",
              "3-5 years",
              "5-10 years",
              "10+ years"
            ]},
            { name: "availability", label: "Preferred Time Slots *", type: "select", required: true, groupWith: "timezone", options: [
              "Weekday mornings (9AM-12PM)",
              "Weekday afternoons (12PM-3PM)",
              "Weekday evenings (3PM-6PM)",
              "Weekend mornings",
              "Flexible"
            ]},
            { name: "timezone", label: "Your Timezone *", type: "select", required: true, groupWith: "availability", options: [
              "WAT (West Africa)",
              "EAT (East Africa)",
              "CAT (Central Africa)",
              "SAST (Southern Africa)",
              "GMT/UTC",
              "Other"
            ]},
            { name: "message", label: "Why would you like to speak? *", type: "textarea", required: true, placeholder: "Tell us about your expertise and what value you can bring to the PAAN community..." }
          ]
        };
      case "mentor":
        return {
          title: "Mentor Another Agency",
          description: "Support the next wave of African creative leaders by mentoring a growing agency.",
          fields: [
            { name: "name", label: "Your Name *", type: "text", required: true },
            { name: "email", label: "Email Address *", type: "email", required: true, groupWith: "companyName" },
            { name: "companyName", label: "Your Agency Name *", type: "text", required: true, groupWith: "email" },
            { name: "mentorshipArea", label: "Mentorship Focus Area *", type: "select", required: true, options: [
              "Business Strategy",
              "Operations & Processes",
              "Client Management",
              "Team Building",
              "Financial Planning",
              "Marketing & Branding",
              "Technology & Digital",
              "Other"
            ]},
            { name: "customMentorshipArea", label: "Please specify your mentorship focus", type: "text", required: false, showWhen: "mentorshipArea", showWhenValue: "Other" },
            { name: "experienceLevel", label: "Years of Experience *", type: "select", required: true, groupWith: "menteePreference", options: [
              "3-5 years",
              "5-10 years",
              "10+ years"
            ]},
            { name: "menteePreference", label: "Preferred Mentee Type *", type: "select", required: true, groupWith: "experienceLevel", options: [
              "Startup agencies (0-2 years)",
              "Growing agencies (2-5 years)",
              "Established agencies (5+ years)",
              "No preference"
            ]},
            { name: "commitmentLevel", label: "Time Commitment *", type: "select", required: true, options: [
              "1 hour per month",
              "2 hours per month",
              "4 hours per month",
              "Flexible based on need"
            ]},
            { name: "message", label: "Why would you like to mentor? *", type: "textarea", required: true, placeholder: "Tell us about your experience and how you can help other agencies grow..." }
          ]
        };
      case "peer-roundtable":
        return {
          title: "Join a Peer Roundtable",
          description: "Join private virtual roundtables with other agency heads.",
          fields: [
            { name: "name", label: "Your Name *", type: "text", required: true },
            { name: "email", label: "Email Address *", type: "email", required: true, groupWith: "companyName" },
            { name: "companyName", label: "Your Agency Name *", type: "text", required: true, groupWith: "email" },
            { name: "agencySize", label: "Agency Size *", type: "select", required: true, groupWith: "experienceLevel", options: [
              "1-5 employees",
              "6-15 employees",
              "16-50 employees",
              "50+ employees"
            ]},
            { name: "experienceLevel", label: "Years in Business *", type: "select", required: true, groupWith: "agencySize", options: [
              "1-3 years",
              "3-5 years",
              "5-10 years",
              "10+ years"
            ]},
            { name: "roundtableTopics", label: "Topics of Interest *", type: "select", required: true, options: [
              "Growth & Scaling",
              "Client Acquisition",
              "Team Management",
              "Financial Management",
              "Digital Transformation",
              "International Expansion",
              "All topics"
            ]},
            { name: "availability", label: "Preferred Meeting Time *", type: "select", required: true, groupWith: "timezone", options: [
              "Weekday mornings",
              "Weekday afternoons",
              "Weekday evenings",
              "Weekend mornings",
              "Flexible"
            ]},
            { name: "timezone", label: "Your Timezone *", type: "select", required: true, groupWith: "availability", options: [
              "WAT (West Africa)",
              "EAT (East Africa)",
              "CAT (Central Africa)",
              "SAST (Southern Africa)",
              "GMT/UTC",
              "Other"
            ]},
            { name: "message", label: "What challenges are you facing? *", type: "textarea", required: true, placeholder: "Tell us about the challenges you're facing and what you hope to gain from peer collaboration..." }
          ]
        };
      default:
        return {
          title: title,
          description: description,
          fields: [
            { name: "name", label: "Full Name *", type: "text", required: true },
            { name: "email", label: "Email Address *", type: "email", required: true },
            { name: "subject", label: "Subject *", type: "text", required: true },
            { name: "message", label: "Message *", type: "textarea", required: true }
          ]
        };
    }
  };

  const formConfig = getFormConfig();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Get required fields from form config
    const requiredFields = formConfig.fields.filter(field => field.required).map(field => field.name);
    
    // Add conditional required fields
    if (formType === "outsource" && formData.outsourcingScope === "Other") {
      requiredFields.push("customOutsourcingScope");
    }
    if (formType === "webinar-speaker" && formData.speakingTopic === "Other") {
      requiredFields.push("customSpeakingTopic");
    }
    if (formType === "mentor" && formData.mentorshipArea === "Other") {
      requiredFields.push("customMentorshipArea");
    }
    
    const missingFields = requiredFields.filter(field => {
      const value = formData[field];
      return !value || (typeof value === 'string' && !value.trim());
    });
    
    if (missingFields.length > 0) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    try {
      // Determine which API endpoint to use based on form type
      const endpoint = formType === "freelancer" ? '/api/hiring' : '/api/contact';
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          formType, // Include form type for backend processing
          subject: formData.subject || `${formConfig.title} Request`,
          // Use custom outsourcing scope if "Other" is selected
          outsourcingScope: formData.outsourcingScope === "Other" ? formData.customOutsourcingScope : formData.outsourcingScope,
          // Use custom speaking topic if "Other" is selected
          speakingTopic: formData.speakingTopic === "Other" ? formData.customSpeakingTopic : formData.speakingTopic,
          // Use custom mentorship area if "Other" is selected
          mentorshipArea: formData.mentorshipArea === "Other" ? formData.customMentorshipArea : formData.mentorshipArea
        }),
      });

      if (response.ok) {
        toast.success("Request submitted successfully! We'll get back to you soon.");
        // Reset form
        setFormData({
          name: user?.full_name || user?.name || "",
          email: user?.email || "",
          subject: "",
          message: "",
          projectType: "",
          budgetRange: "",
          timeline: "",
          skillsNeeded: "",
          companyName: user?.agencyName || "",
          partnerAgencyName: "",
          partnerAgencyContact: "",
          projectValue: "",
          servicesCombined: "",
          outsourcingScope: "",
          customOutsourcingScope: "",
          whiteLabelRequired: false,
          deliveryTimeline: "",
          speakingTopic: "",
          customSpeakingTopic: "",
          availability: "",
          timezone: "",
          mentorshipArea: "",
          customMentorshipArea: "",
          menteePreference: "",
          commitmentLevel: "",
          agencySize: "",
          roundtableTopics: "",
        });
        onClose();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to send request. Please try again.");
      }
    } catch (error) {
      console.error('Error sending request:', error);
      toast.error("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        name: user?.full_name || user?.name || "",
        email: user?.email || "",
        subject: "",
        message: "",
        projectType: "",
        budgetRange: "",
        timeline: "",
        skillsNeeded: "",
        companyName: user?.agencyName || "",
        partnerAgencyName: "",
        partnerAgencyContact: "",
        projectValue: "",
        servicesCombined: "",
        outsourcingScope: "",
        customOutsourcingScope: "",
        whiteLabelRequired: false,
        deliveryTimeline: "",
        speakingTopic: "",
        customSpeakingTopic: "",
        availability: "",
        timezone: "",
        mentorshipArea: "",
        customMentorshipArea: "",
        menteePreference: "",
        commitmentLevel: "",
        agencySize: "",
        roundtableTopics: "",
      });
      onClose();
    }
  };

  // Update form data when user changes or modal opens
  React.useEffect(() => {
    if (isOpen) {
      setFormData({
        name: user?.full_name || user?.name || "",
        email: user?.email || "",
        subject: initialSubject || "",
        message: "",
        projectType: "",
        budgetRange: "",
        timeline: "",
        skillsNeeded: "",
        companyName: user?.agencyName || "",
        partnerAgencyName: "",
        partnerAgencyContact: "",
        projectValue: "",
        servicesCombined: "",
        outsourcingScope: "",
        customOutsourcingScope: "",
        whiteLabelRequired: false,
        deliveryTimeline: "",
        speakingTopic: "",
        customSpeakingTopic: "",
        availability: "",
        timezone: "",
        mentorshipArea: "",
        customMentorshipArea: "",
        menteePreference: "",
        commitmentLevel: "",
        agencySize: "",
        roundtableTopics: "",
      });
    }
  }, [isOpen, user, initialSubject]);

  const renderField = (field) => {
    const { name, label, type, required, options, placeholder } = field;
    
    switch (type) {
      case "email":
        return (
          <div key={name} className="relative">
            <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {label}
            </label>
            <input
              type="email"
              id={name}
              name={name}
              value={formData[name] || ""}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-paan-blue focus:border-transparent dark:bg-gray-800 dark:text-white transition-colors bg-gray-50 dark:bg-gray-700"
              placeholder={placeholder || "Enter your email address"}
              required={required}
              readOnly={!!user?.email}
            />
          </div>
        );
      
      case "select":
        return (
          <div key={name}>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {label}
            </label>
            <select
              id={name}
              name={name}
              value={formData[name] || ""}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-paan-blue focus:border-transparent dark:bg-gray-800 dark:text-white transition-colors"
              required={required}
            >
              <option value="">Select an option</option>
              {options?.map((option, index) => (
                <option key={index} value={option}>{option}</option>
              ))}
            </select>
          </div>
        );
      
      case "textarea":
        return (
          <div key={name}>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {label}
            </label>
            <textarea
              id={name}
              name={name}
              value={formData[name] || ""}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-paan-blue focus:border-transparent dark:bg-gray-800 dark:text-white transition-colors resize-none"
              placeholder={placeholder || "Enter details..."}
              required={required}
            />
          </div>
        );
      
      case "checkbox":
        return (
          <div key={name} className="flex items-center">
            <input
              type="checkbox"
              id={name}
              name={name}
              checked={formData[name] || false}
              onChange={handleInputChange}
              className="h-4 w-4 text-paan-blue focus:ring-paan-blue border-gray-300 rounded"
            />
            <label htmlFor={name} className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              {label}
            </label>
          </div>
        );
      
      default:
        return (
          <div key={name}>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {label}
            </label>
            <input
              type="text"
              id={name}
              name={name}
              value={formData[name] || ""}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-paan-blue focus:border-transparent dark:bg-gray-800 dark:text-white transition-colors"
              placeholder={placeholder || `Enter ${label.toLowerCase().replace(' *', '')}`}
              required={required}
            />
          </div>
        );
    }
  };

  return (
    <SimpleModal
      isOpen={isOpen}
      onClose={handleClose}
      title={formConfig.title}
      mode={mode}
      width="max-w-2xl"
    >
      <div className="space-y-6">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-paan-blue/10 rounded-full flex items-center justify-center mb-4">
            <Icon icon="mdi:email-outline" className="w-8 h-8 text-paan-blue" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {formConfig.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            {formConfig.description}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Render fields based on form configuration */}
          {(() => {
            const renderedFields = [];
            for (let i = 0; i < formConfig.fields.length; i++) {
              const field = formConfig.fields[i];
              
              // Skip if this field was already rendered as part of a group
              if (i > 0 && formConfig.fields[i - 1] && formConfig.fields[i - 1].groupWith === field.name) {
                continue;
              }
              
              // Check if field should be shown based on conditions
              if (field.showWhen && field.showWhenValue) {
                const dependentFieldValue = formData[field.showWhen];
                if (dependentFieldValue !== field.showWhenValue) {
                  continue; // Skip this field if condition not met
                }
              }
              
              // Handle checkbox and textarea fields separately
              if (field.type === "checkbox" || field.type === "textarea") {
                renderedFields.push(renderField(field));
              }
              // Group fields that should be on the same row
              else if (field.groupWith) {
                const groupedField = formConfig.fields.find(f => f.name === field.groupWith);
                if (groupedField) {
                  renderedFields.push(
                    <div key={field.name} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {renderField(field)}
                      {renderField(groupedField)}
                    </div>
                  );
                } else {
                  renderedFields.push(renderField(field));
                }
              } else {
                renderedFields.push(renderField(field));
              }
            }
            return renderedFields;
          })()}

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-paan-red hover:bg-paan-red/80 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <Icon icon="mdi:loading" className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Icon icon="mdi:send" className="w-4 h-4 mr-2" />
                  Send Request
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </SimpleModal>
  );
};

export default ContactFormModal; 