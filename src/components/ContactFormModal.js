import React, { useState } from "react";
import { Icon } from "@iconify/react";
import SimpleModal from "./SimpleModal";
import toast from "react-hot-toast";
import TooltipIconButton from "./TooltipIconButton";

const ContactFormModal = ({ isOpen, onClose, mode, title = "Contact Us", user = null, showLegalSubjects = false, description = "Have a question or need assistance? Send us a message and we'll respond as soon as possible." }) => {
  const [formData, setFormData] = useState({
    name: user?.full_name || user?.name || "",
    email: user?.email || "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error("Please fill in all fields");
      return;
    }

    // Validate custom subject if "Other" is selected (only for legal subjects)
    if (showLegalSubjects && formData.subject === "Other" && !formData.customSubject) {
      toast.error("Please specify your subject");
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
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          subject: formData.subject === "Other" ? formData.customSubject : formData.subject
        }),
      });

      if (response.ok) {
        toast.success("Message sent successfully! We'll get back to you soon.");
        setFormData({
          name: user?.full_name || user?.name || "",
          email: user?.email || "",
          subject: "",
          customSubject: "",
          message: "",
        });
        onClose();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error('Error sending message:', error);
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
        customSubject: "",
        message: "",
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
        subject: "",
        customSubject: "",
        message: "",
      });
    }
  }, [isOpen, user]);

  return (
    <SimpleModal
      isOpen={isOpen}
      onClose={handleClose}
      title={title}
      mode={mode}
      width="max-w-2xl"
    >
      <div className="space-y-6">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-paan-blue/10 rounded-full flex items-center justify-center mb-4">
            <Icon icon="mdi:email-outline" className="w-8 h-8 text-paan-blue" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Get in Touch
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            {description}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-paan-blue focus:border-transparent dark:bg-gray-800 dark:text-white transition-colors"
                placeholder="Enter your full name"
                required
              />
            </div>
            <div className="relative">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email Address *
              </label>
              {user?.email && (
                <div className="absolute top-[-10px] right-0">
                  <TooltipIconButton
                    icon="mdi:information-outline"
                    label="Email pre-filled from your account"
                    mode={mode}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  />
                </div>
              )}
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-paan-blue focus:border-transparent dark:bg-gray-800 dark:text-white transition-colors bg-gray-50 dark:bg-gray-700"
                placeholder="Enter your email address"
                required
                readOnly={!!user?.email}
              />
            </div>
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Subject *
            </label>
            {showLegalSubjects ? (
              <>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-paan-blue focus:border-transparent dark:bg-gray-800 dark:text-white transition-colors"
                  required
                >
                  <option value="">Select a subject</option>
                  <option value="Legal">Legal</option>
                  <option value="IP Protection">IP Protection</option>
                  <option value="Data & Privacy">Data & Privacy</option>
                  <option value="Tax Compliance">Tax Compliance</option>
                  <option value="Other">Other - Specify</option>
                </select>
                {formData.subject === "Other" && (
                  <input
                    type="text"
                    name="customSubject"
                    placeholder="Please specify your subject"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-paan-blue focus:border-transparent dark:bg-gray-800 dark:text-white transition-colors mt-2"
                    onChange={(e) => setFormData(prev => ({ ...prev, customSubject: e.target.value }))}
                    value={formData.customSubject || ""}
                    required
                  />
                )}
              </>
            ) : (
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-paan-blue focus:border-transparent dark:bg-gray-800 dark:text-white transition-colors"
                placeholder="What is this regarding?"
                required
              />
            )}
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Message *
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-paan-blue focus:border-transparent dark:bg-gray-800 dark:text-white transition-colors resize-none"
              placeholder="Tell us more about your inquiry..."
              required
            />
          </div>

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
                  Send Message
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