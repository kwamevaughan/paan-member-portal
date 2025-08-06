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
    whiteLabelRequired: false,
    deliveryTimeline: "",
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
          subject: formData.subject || `${formConfig.title} Request`
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
          whiteLabelRequired: false,
          deliveryTimeline: "",
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
        whiteLabelRequired: false,
        deliveryTimeline: "",
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
        whiteLabelRequired: false,
        deliveryTimeline: "",
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