import React from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const FreelancerForm = ({ user, handleFreelancerClick, projectTypes, projectType, setProjectType }) => {
  const router = useRouter();

  return (
    <div className="">
      <form onSubmit={handleFreelancerClick} className="space-y-6">
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
              value={projectType}
              onChange={(e) => setProjectType(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-paan-blue focus:border-transparent"
              required
            >
              <option value="">Select project type</option>
              {projectTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        {projectType === "Other" && (
          <div>
            <label
              htmlFor="customProjectType"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Please specify project type *
            </label>
            <input
              type="text"
              id="customProjectType"
              name="customProjectType"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-paan-blue focus:border-transparent"
              placeholder="Enter your project type"
              required
            />
          </div>
        )}

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
              <option value="$10,000 - $25,000">$10,000 - $25,000</option>
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

        <div className="pt-4">
          <div className="flex items-start mb-4">
            <input
              type="checkbox"
              id="terms"
              name="terms"
              className="mt-1 h-4 w-4 text-paan-red focus:ring-paan-red border-gray-300 rounded"
              required
            />
            <label htmlFor="terms" className="ml-2 text-sm text-gray-700">
              I have read and accept the{" "}
              <Link
                href="https://paan.africa/privacy-policy"
                target="_blank"
                className="text-paan-red hover:text-paan-red/80 underline"
              >
                privacy policy
              </Link>
              .
            </label>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-paan-red hover:bg-paan-red/80 text-white rounded-lg font-medium transition-colors flex items-center justify-center"
            >
              <Icon icon="mdi:send" className="w-4 h-4 mr-2" />
              Submit Hiring Request
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default FreelancerForm;