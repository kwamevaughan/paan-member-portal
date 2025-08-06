import React from "react";
import { Icon } from "@iconify/react";
import SimpleModal from "@/components/SimpleModal";
import JSZip from "jszip";
import toast from "react-hot-toast";

const MerchTemplatesModal = ({ isOpen, onClose, mode }) => {
  // Function to download all templates as a zip file
  const downloadAllTemplates = async () => {
    const templates = [
      {
        url: "https://ik.imagekit.io/2crwrt8s6/MemberResources/Tshirt%20artwork%20front.pdf?updatedAt=1754467348448",
        filename: "T-Shirt_Designs/PAAN_Tshirt_Front_Design.pdf",
      },
      {
        url: "https://ik.imagekit.io/2crwrt8s6/MemberResources/Tshirt%20artwork%20back.pdf?updatedAt=1754467348002",
        filename: "T-Shirt_Designs/PAAN_Tshirt_Back_Design.pdf",
      },
      {
        url: "https://ik.imagekit.io/2crwrt8s6/MemberResources/T-Shirt%20Mockups.jpg?updatedAt=1754467348605",
        filename: "T-Shirt_Designs/PAAN_Tshirt_Mockups.jpg",
      },
      {
        url: "https://ik.imagekit.io/2crwrt8s6/MemberResources/Hoodie%20Mockup.jpg?updatedAt=1754467326806",
        filename: "Hoodie_Designs/PAAN_Hoodie_Mockup.jpg",
      },
      {
        url: "https://ik.imagekit.io/2crwrt8s6/MemberResources/Tote%20bag.pdf?updatedAt=1754467348779",
        filename: "Tote_Bag_Designs/PAAN_Tote_Bag_Design.pdf",
      },
      {
        url: "https://ik.imagekit.io/2crwrt8s6/MemberResources/tote-bag-mockup-01.jpg?updatedAt=1754467348418",
        filename: "Tote_Bag_Designs/PAAN_Tote_Bag_Mockup.jpg",
      },
    ];

    toast.loading("Creating zip file...", { id: "download-all" });

    try {
      const zip = new JSZip();
      
      // Add a README file with instructions
      const readmeContent = `PAAN Merch Print Templates
========================

This package contains print-ready designs for PAAN merchandise.

Contents:
- T-Shirt_Designs/: Front and back artwork files plus mockups
- Hoodie_Designs/: Hoodie mockup designs
- Tote_Bag_Designs/: Tote bag artwork and mockups

Print Guidelines:
- All files are optimized for 300 DPI printing
- Use high-quality materials for best results
- Contact PAAN support for custom sizing or format adjustments

For questions or support, contact the PAAN team through the member portal.

© ${new Date().getFullYear()} Pan African Advocacy Network (PAAN)
`;
      
      zip.file("README.txt", readmeContent);

      // Download and add each file to the zip
      const downloadPromises = templates.map(async (template, index) => {
        try {
          toast.loading(`Downloading file ${index + 1} of ${templates.length}...`, { id: "download-all" });
          
          const response = await fetch(template.url);
          if (!response.ok) {
            throw new Error(`Failed to download ${template.filename}`);
          }
          
          const blob = await response.blob();
          zip.file(template.filename, blob);
          
          return { success: true, filename: template.filename };
        } catch (error) {
          console.error(`Error downloading ${template.filename}:`, error);
          return { success: false, filename: template.filename, error };
        }
      });

      const results = await Promise.all(downloadPromises);
      const successful = results.filter(r => r.success);
      const failed = results.filter(r => !r.success);

      if (failed.length > 0) {
        console.warn("Some files failed to download:", failed);
      }

      if (successful.length === 0) {
        throw new Error("No files could be downloaded");
      }

      toast.loading("Generating zip file...", { id: "download-all" });

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
      link.download = `PAAN_Merch_Templates_${new Date().toISOString().split('T')[0]}.zip`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      URL.revokeObjectURL(url);

      if (failed.length > 0) {
        toast.success(
          `Downloaded ${successful.length} of ${templates.length} templates. Some files may have been skipped.`,
          { id: "download-all", duration: 5000 }
        );
      } else {
        toast.success(
          `Successfully downloaded all ${templates.length} templates as a zip file!`,
          { id: "download-all", duration: 4000 }
        );
      }

    } catch (error) {
      console.error("Error creating zip file:", error);
      toast.error(
        "Failed to create zip file. Please try downloading individual files.",
        { id: "download-all", duration: 5000 }
      );
    }
  };

  return (
    <SimpleModal
      isOpen={isOpen}
      onClose={onClose}
      title="Merch Print Templates"
      mode={mode}
      width="max-w-4xl"
    >
      <div className="space-y-6">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-paan-blue/10 rounded-full flex items-center justify-center mb-4">
            <Icon
              icon="mdi:tshirt-crew"
              className="w-8 h-8 text-paan-blue"
            />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Merch Print Templates
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Download print-ready designs for shirts, hoodies, and tote
            bags. Perfect for team swag or events.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* T-Shirt Templates */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <Icon
                icon="mdi:tshirt-crew"
                className="w-5 h-5 text-paan-blue mr-2"
              />
              <h4 className="font-medium text-gray-900 dark:text-white">
                T-Shirt Designs
              </h4>
            </div>
            <div className="space-y-2">
              <a
                href="https://ik.imagekit.io/2crwrt8s6/MemberResources/Tshirt%20artwork%20front.pdf?updatedAt=1754467348448"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  T-Shirt Front Design (PDF)
                </span>
                <Icon
                  icon="mdi:download"
                  className="w-4 h-4 text-paan-blue"
                />
              </a>
              <a
                href="https://ik.imagekit.io/2crwrt8s6/MemberResources/Tshirt%20artwork%20back.pdf?updatedAt=1754467348002"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  T-Shirt Back Design (PDF)
                </span>
                <Icon
                  icon="mdi:download"
                  className="w-4 h-4 text-paan-blue"
                />
              </a>
              <a
                href="https://ik.imagekit.io/2crwrt8s6/MemberResources/T-Shirt%20Mockups.jpg?updatedAt=1754467348605"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  T-Shirt Mockups (JPG)
                </span>
                <Icon
                  icon="mdi:download"
                  className="w-4 h-4 text-paan-blue"
                />
              </a>
            </div>
          </div>

          {/* Hoodie Templates */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <Icon
                icon="mdi:hoodie"
                className="w-5 h-5 text-paan-blue mr-2"
              />
              <h4 className="font-medium text-gray-900 dark:text-white">
                Hoodie Designs
              </h4>
            </div>
            <div className="space-y-2">
              <a
                href="https://ik.imagekit.io/2crwrt8s6/MemberResources/Hoodie%20Mockup.jpg?updatedAt=1754467326806"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Hoodie Mockup (JPG)
                </span>
                <Icon
                  icon="mdi:download"
                  className="w-4 h-4 text-paan-blue"
                />
              </a>
            </div>
          </div>

          {/* Tote Bag Templates */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 md:col-span-2">
            <div className="flex items-center mb-3">
              <Icon
                icon="mdi:bag-personal"
                className="w-5 h-5 text-paan-blue mr-2"
              />
              <h4 className="font-medium text-gray-900 dark:text-white">
                Tote Bag Designs
              </h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <a
                href="https://ik.imagekit.io/2crwrt8s6/MemberResources/Tote%20bag.pdf?updatedAt=1754467348779"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Tote Bag Design (PDF)
                </span>
                <Icon
                  icon="mdi:download"
                  className="w-4 h-4 text-paan-blue"
                />
              </a>
              <a
                href="https://ik.imagekit.io/2crwrt8s6/MemberResources/tote-bag-mockup-01.jpg?updatedAt=1754467348418"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Tote Bag Mockup (JPG)
                </span>
                <Icon
                  icon="mdi:download"
                  className="w-4 h-4 text-paan-blue"
                />
              </a>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <div className="flex items-start">
            <Icon
              icon="mdi:information"
              className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2 mt-0.5"
            />
            <div>
              <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                Print Guidelines
              </h5>
              <p className="text-sm text-blue-700 dark:text-blue-200">
                These templates are print-ready at 300 DPI. For best
                results, use high-quality materials and professional
                printing services. Contact us if you need specific sizing
                or format adjustments.
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
            onClick={downloadAllTemplates}
            className="flex-1 px-6 py-3 bg-paan-red hover:bg-paan-red/80 text-white rounded-lg font-medium transition-colors"
          >
            <Icon
              icon="mdi:download-multiple"
              className="w-4 h-4 inline mr-2"
            />
            Download All Templates
          </button>
        </div>
      </div>
    </SimpleModal>
  );
};

export default MerchTemplatesModal;