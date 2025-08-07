import React, { useState } from "react";
import { Icon } from "@iconify/react";
import SimpleModal from "@/components/SimpleModal";
import JSZip from "jszip";
import toast from "react-hot-toast";
import { normalizeTier, getTierBadgeIcon } from "@/components/Badge";

const VerifiedMemberBadgesModal = ({ isOpen, onClose, mode, user }) => {
  const [selectedPreview, setSelectedPreview] = useState(null);

  // Get user's normalized tier
  const userTier = normalizeTier(user?.selected_tier) || "Free Member";
  
  // Map tiers to badge file names
  const tierToBadgeMap = {
    "Free Member": "Free-Member",
    "Associate Member": "Associate-Member", 
    "Full Member": "Full-Member",
    "Gold Member": "Gold-Member",
    "Admin": "Gold-Member" // Admin users get Gold Member badge
  };

  const badgeFileName = tierToBadgeMap[userTier] || "Free-Member";

  // Badge formats with preview images
  const badgeFormats = [
    {
      name: "WebP Format",
      type: "WebP",
      icon: "mdi:web",
      description: "Optimized for web use and social media",
      url: `https://ik.imagekit.io/2crwrt8s6/MemberResources/PAAN%20Badge%20${badgeFileName}.webp`,
      filename: `${userTier.replace(' ', '_')}_Badge/PAAN_Badge_${badgeFileName}.webp`,
      preview: `https://ik.imagekit.io/2crwrt8s6/MemberResources/PAAN%20Badge%20${badgeFileName}.webp`
    },
    {
      name: "PNG Format",
      type: "PNG",
      icon: "mdi:file-image",
      description: "High-resolution with transparent background",
      url: `https://ik.imagekit.io/2crwrt8s6/MemberResources/PAAN%20Badge%20${badgeFileName}.png`,
      filename: `${userTier.replace(' ', '_')}_Badge/PAAN_Badge_${badgeFileName}.png`,
      preview: `https://ik.imagekit.io/2crwrt8s6/MemberResources/PAAN%20Badge%20${badgeFileName}.png`
    },
    {
      name: "JPG Format",
      type: "JPG",
      icon: "mdi:image",
      description: "Standard format for general use",
      url: `https://ik.imagekit.io/2crwrt8s6/MemberResources/PAAN%20Badge%20${badgeFileName}.jpg`,
      filename: `${userTier.replace(' ', '_')}_Badge/PAAN_Badge_${badgeFileName}.jpg`,
      preview: `https://ik.imagekit.io/2crwrt8s6/MemberResources/PAAN%20Badge%20${badgeFileName}.jpg`
    }
  ];

  // Function to download user's specific badge in all formats
  const downloadUserBadge = async () => {
    toast.loading("Creating your member badge package...", { id: "download-user-badge" });

    try {
      const zip = new JSZip();
      
      // Add a personalized README file
      const readmeContent = `${user.agencyName}'s PAAN Member Badge Package
${"=".repeat(50)}

Congratulations ${user.agencyName}!

This package contains your verified ${userTier} badge in multiple formats.

Your Membership Details:
- Name: ${user?.name}
- Agency: ${user.agencyName}
- Email: ${user?.email}
- Tier: ${userTier}
- Member Since: ${
        user?.created_at
          ? new Date(user?.created_at).toLocaleDateString()
          : "N/A"
      }

Badge Formats Included:
- WebP Format: Optimized for web use and social media
- PNG Format: High-resolution with transparent background
- JPG Format: Standard format for general use

Usage Guidelines:
- Use these badges to showcase your verified PAAN membership
- Perfect for email signatures, LinkedIn profiles, and websites
- Maintain the badge's proportions and don't modify the design
- These badges verify your active membership status

For questions about badge usage or membership benefits, contact the PAAN team through the member portal.

© ${new Date().getFullYear()} Pan African Advocacy Network (PAAN)
Member Badge issued to: ${user.agencyName}
`;
      
      zip.file("README.txt", readmeContent);

      // Download and add each badge format to the zip
      const downloadPromises = badgeFormats.map(async (format, index) => {
        try {
          toast.loading(`Downloading badge format ${index + 1} of ${badgeFormats.length}...`, { id: "download-user-badge" });
          
          const response = await fetch(format.url);
          if (!response.ok) {
            throw new Error(`Failed to download ${format.filename}`);
          }
          
          const blob = await response.blob();
          zip.file(format.filename, blob);
          
          return { success: true, filename: format.filename };
        } catch (error) {
          console.error(`Error downloading ${format.filename}:`, error);
          return { success: false, filename: format.filename, error };
        }
      });

      const results = await Promise.all(downloadPromises);
      const successful = results.filter(r => r.success);
      const failed = results.filter(r => !r.success);

      if (failed.length > 0) {
        console.warn("Some badge files failed to download:", failed);
      }

      if (successful.length === 0) {
        throw new Error("No badge files could be downloaded");
      }

      toast.loading("Generating your badge package...", { id: "download-user-badge" });

      // Generate the zip file
      const zipBlob = await zip.generateAsync({ 
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: { level: 6 }
      });

      // Create download link
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${user.agencyName?.replace(
        /\s+/g,
        "_"
      )}_PAAN_${userTier.replace(" ", "_")}_Badge_${
        new Date().toISOString().split("T")[0]
      }.zip`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      URL.revokeObjectURL(url);

      if (failed.length > 0) {
        toast.success(
          `Downloaded ${successful.length} of ${badgeFormats.length} badge formats. Some files may have been skipped.`,
          { id: "download-user-badge", duration: 5000 }
        );
      } else {
        toast.success(
          `Successfully downloaded your ${userTier} badge package!`,
          { id: "download-user-badge", duration: 4000 }
        );
      }

    } catch (error) {
      console.error("Error creating badge package:", error);
      toast.error(
        "Failed to create badge package. Please try downloading individual files.",
        { id: "download-user-badge", duration: 5000 }
      );
    }
  };

  const handlePreviewClick = (format) => {
    setSelectedPreview(format);
  };

  const closePreview = () => {
    setSelectedPreview(null);
  };

  // Function to download individual badge format
  const downloadBadge = async (format) => {
    try {
      toast.loading(`Downloading ${format.name}...`, { id: `download-${format.filename}` });
      
      const response = await fetch(format.url);
      if (!response.ok) {
        throw new Error(`Failed to download ${format.name}`);
      }
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${format.name.replace(/\s+/g, '_')}_${format.type}.${format.type.toLowerCase()}`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      URL.revokeObjectURL(url);
      
      toast.success(`Successfully downloaded ${format.name}!`, { id: `download-${format.filename}`, duration: 3000 });
    } catch (error) {
      console.error(`Error downloading ${format.name}:`, error);
      toast.error(`Failed to download ${format.name}. Please try again.`, { id: `download-${format.filename}`, duration: 4000 });
    }
  };

  // Get tier-specific styling
  const getTierColor = (tier) => {
    switch (tier) {
      case "Gold Member":
        return "text-amber-600 dark:text-amber-400";
      case "Full Member":
        return "text-emerald-600 dark:text-emerald-400";
      case "Associate Member":
        return "text-blue-600 dark:text-blue-400";
      case "Free Member":
        return "text-gray-600 dark:text-gray-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  const getTierIcon = (tier) => {
    return getTierBadgeIcon(tier);
  };

  return (
    <>
      <SimpleModal
        isOpen={isOpen}
        onClose={onClose}
        title="Your Verified Member Badge"
        mode={mode}
        width="max-w-4xl"
      >
        <div className="space-y-6">
          <div className="text-center">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-paan-blue/10 to-paan-red/10 rounded-full flex items-center justify-center mb-4">
              <Icon
                icon={getTierIcon(userTier)}
                className={`w-10 h-10 ${getTierColor(userTier)}`}
              />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {user.agencyName}'s {userTier === "Admin" ? "Gold" : userTier}{" "}
              Badge
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Download your verified PAAN membership badge to showcase your
              membership status on social media, websites, and professional
              profiles.
            </p>
          </div>

          {/* User's Badge Preview */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg p-6">
            <div className="text-center">
              <h4 className="font-medium text-gray-900 dark:text-white mb-4">
                Your Badge Preview
              </h4>
              <div className="inline-block bg-white dark:bg-gray-700 rounded-lg p-4 shadow-sm">
                <img
                  src={`https://ik.imagekit.io/2crwrt8s6/MemberResources/PAAN%20Badge%20${badgeFileName}.webp`}
                  alt={`${userTier} Badge`}
                  className="w-32 h-32 object-contain"
                  onError={(e) => {
                    e.target.src = `https://ik.imagekit.io/2crwrt8s6/MemberResources/PAAN%20Badge%20${badgeFileName}.png`;
                  }}
                />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                {userTier === "Admin" ? "Gold" : userTier} Badge
              </p>
            </div>
          </div>

          {/* Available Formats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {badgeFormats.map((format, index) => (
              <div
                key={index}
                className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4"
              >
                <div className="flex items-center mb-3">
                  <Icon
                    icon={format.icon}
                    className="w-5 h-5 text-paan-blue mr-2"
                  />
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {format.name}
                  </h4>
                </div>
                <div className="space-y-2">
                  <div className="bg-white dark:bg-gray-700 rounded p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {userTier === "Admin" ? "Gold" : userTier} Badge (
                        {format.type})
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded">
                        {format.type}
                      </span>
                    </div>

                    {/* Preview Image */}
                    <div className="mb-3">
                      <img
                        src={format.preview}
                        alt={`Preview of ${format.name}`}
                        className="w-full h-24 object-contain rounded border border-gray-200 dark:border-gray-600 cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => handlePreviewClick(format)}
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handlePreviewClick(format)}
                        className="flex-1 px-3 py-1.5 text-xs bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-300 rounded transition-colors flex items-center justify-center"
                      >
                        <Icon icon="mdi:eye" className="w-3 h-3 mr-1" />
                        Preview
                      </button>
                      <button
                        onClick={() => downloadBadge(format)}
                        className="flex-1 px-3 py-1.5 text-xs bg-green-100 hover:bg-green-200 dark:bg-green-900 dark:hover:bg-green-800 text-green-700 dark:text-green-300 rounded transition-colors flex items-center justify-center"
                      >
                        <Icon icon="mdi:download" className="w-3 h-3 mr-1" />
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <div className="flex items-start">
              <Icon
                icon="mdi:information"
                className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2 mt-0.5"
              />
              <div>
                <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                  Badge Usage Guidelines
                </h5>
                <p className="text-sm text-blue-700 dark:text-blue-200">
                  Use your verified member badge to showcase your PAAN
                  membership on professional profiles, email signatures, and
                  websites. Please maintain the badge's original proportions and
                  don't modify the design. This badge verifies your active{" "}
                  {userTier.toLowerCase()} status.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-medium transition-colors"
            >
              Close
            </button>
            <button
              onClick={downloadUserBadge}
              className="flex-1 px-6 py-3 bg-paan-red hover:bg-paan-red/80 text-white rounded-lg font-medium transition-colors"
            >
              <Icon
                icon="mdi:download-multiple"
                className="w-4 h-4 inline mr-2"
              />
              Download My Badge Package
            </button>
          </div>
        </div>
      </SimpleModal>

      {/* Preview Modal */}
      {selectedPreview && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closePreview}
          />
          <div className="relative bg-white dark:bg-gray-800 rounded-lg max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {selectedPreview.name} -{" "}
                {userTier === "Admin" ? "Gold" : userTier} Badge
              </h3>
              <button
                onClick={closePreview}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Icon
                  icon="mdi:close"
                  className="w-5 h-5 text-gray-500 dark:text-gray-400"
                />
              </button>
            </div>
            <div className="p-4">
              <img
                src={selectedPreview.preview}
                alt={`Preview of ${selectedPreview.name}`}
                className="w-full h-auto max-h-[70vh] object-contain rounded"
              />
            </div>
            <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {selectedPreview.type} • {selectedPreview.description}
              </span>
              <button
                onClick={() => downloadBadge(selectedPreview)}
                className="px-4 py-2 bg-paan-red hover:bg-paan-red/80 text-white rounded-lg font-medium transition-colors flex items-center"
              >
                <Icon icon="mdi:download" className="w-4 h-4 mr-2" />
                Download {selectedPreview.name}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VerifiedMemberBadgesModal;