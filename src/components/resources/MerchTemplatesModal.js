import React, { useState } from "react";
import { Icon } from "@iconify/react";
import SimpleModal from "@/components/SimpleModal";
import JSZip from "jszip";
import toast from "react-hot-toast";

const MerchTemplatesModal = ({ isOpen, onClose, mode }) => {
  const [selectedPreview, setSelectedPreview] = useState(null);

  // Template data with preview images
  const templates = [
    {
      category: "T-Shirt Designs",
      icon: "mdi:tshirt-crew",
      preview: "https://ik.imagekit.io/2crwrt8s6/MemberResources/T-Shirt%20Mockups.jpg?updatedAt=1754467348605",
      items: [
        {
          name: "T-Shirt Front Design",
          type: "PDF",
          url: "https://ik.imagekit.io/2crwrt8s6/MemberResources/Tshirt%20artwork%20front.pdf?updatedAt=1754467348448",
          filename: "T-Shirt_Designs/PAAN_Tshirt_Front_Design.pdf"
        },
        {
          name: "T-Shirt Back Design",
          type: "PDF",
          url: "https://ik.imagekit.io/2crwrt8s6/MemberResources/Tshirt%20artwork%20back.pdf?updatedAt=1754467348002",
          filename: "T-Shirt_Designs/PAAN_Tshirt_Back_Design.pdf"
        },
        {
          name: "T-Shirt Mockups",
          type: "JPG",
          url: "https://ik.imagekit.io/2crwrt8s6/MemberResources/T-Shirt%20Mockups.jpg?updatedAt=1754467348605",
          filename: "T-Shirt_Designs/PAAN_Tshirt_Mockups.jpg"
        }
      ]
    },
    {
      category: "Hoodie Designs",
      icon: "mdi:hoodie",
      preview: "https://ik.imagekit.io/2crwrt8s6/MemberResources/Hoodie%20Mockup.jpg?updatedAt=1754467326806",
      items: [
        {
          name: "Hoodie Mockup",
          type: "JPG",
          url: "https://ik.imagekit.io/2crwrt8s6/MemberResources/Hoodie%20Mockup.jpg?updatedAt=1754467326806",
          filename: "Hoodie_Designs/PAAN_Hoodie_Mockup.jpg"
        }
      ]
    },
    {
      category: "Tote Bag Designs",
      icon: "mdi:bag-personal",
      preview: "https://ik.imagekit.io/2crwrt8s6/MemberResources/tote-bag-mockup-01.jpg?updatedAt=1754467348418",
      items: [
        {
          name: "Tote Bag Design",
          type: "PDF",
          url: "https://ik.imagekit.io/2crwrt8s6/MemberResources/Tote%20bag.pdf?updatedAt=1754467348779",
          filename: "Tote_Bag_Designs/PAAN_Tote_Bag_Design.pdf"
        },
        {
          name: "Tote Bag Mockup",
          type: "JPG",
          url: "https://ik.imagekit.io/2crwrt8s6/MemberResources/tote-bag-mockup-01.jpg?updatedAt=1754467348418",
          filename: "Tote_Bag_Designs/PAAN_Tote_Bag_Mockup.jpg"
        }
      ]
    }
  ];

  // Function to download all templates as a zip file
  const downloadAllTemplates = async () => {
    const allTemplates = templates.flatMap(category => category.items);

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
      const downloadPromises = allTemplates.map(async (template, index) => {
        try {
          toast.loading(`Downloading file ${index + 1} of ${allTemplates.length}...`, { id: "download-all" });
          
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
          `Downloaded ${successful.length} of ${allTemplates.length} templates. Some files may have been skipped.`,
          { id: "download-all", duration: 5000 }
        );
      } else {
        toast.success(
          `Successfully downloaded all ${allTemplates.length} templates as a zip file!`,
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

  const handlePreviewClick = (category) => {
    setSelectedPreview(category);
  };

  const closePreview = () => {
    setSelectedPreview(null);
  };

  // Function to download individual template
  const downloadTemplate = async (item) => {
    try {
      toast.loading(`Downloading ${item.name}...`, { id: `download-${item.name}` });
      
      const response = await fetch(item.url);
      if (!response.ok) {
        throw new Error(`Failed to download ${item.name}`);
      }
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = item.name;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      URL.revokeObjectURL(url);
      
      toast.success(`Successfully downloaded ${item.name}!`, { id: `download-${item.name}`, duration: 3000 });
    } catch (error) {
      console.error(`Error downloading ${item.name}:`, error);
      toast.error(`Failed to download ${item.name}. Please try again.`, { id: `download-${item.name}`, duration: 4000 });
    }
  };

  return (
    <>
      <SimpleModal
        isOpen={isOpen}
        onClose={onClose}
        title="Merch Print Templates"
        mode={mode}
        width="max-w-6xl"
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((category, categoryIndex) => (
              <div key={categoryIndex} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <Icon
                    icon={category.icon}
                    className="w-5 h-5 text-paan-blue mr-2"
                  />
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {category.category}
                  </h4>
                </div>
                <div className="space-y-2">
                  {category.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="bg-white dark:bg-gray-700 rounded p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {item.name}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded">
                          {item.type}
                        </span>
                      </div>
                      
                      {/* Preview Image */}
                      <div className="mb-3">
                        <img
                          src={category.preview}
                          alt={`Preview of ${item.name}`}
                          className="w-full h-24 object-cover rounded border border-gray-200 dark:border-gray-600 cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => handlePreviewClick(category)}
                        />
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => handlePreviewClick(category)}
                          className="flex-1 px-3 py-1.5 text-xs bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-300 rounded transition-colors flex items-center justify-center"
                        >
                          <Icon icon="mdi:eye" className="w-3 h-3 mr-1" />
                          Preview
                        </button>
                        <button
                          onClick={() => downloadTemplate(item)}
                          className="flex-1 px-3 py-1.5 text-xs bg-green-100 hover:bg-green-200 dark:bg-green-900 dark:hover:bg-green-800 text-green-700 dark:text-green-300 rounded transition-colors flex items-center justify-center"
                        >
                          <Icon icon="mdi:download" className="w-3 h-3 mr-1" />
                          Download
                        </button>
                      </div>
                    </div>
                  ))}
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
                {selectedPreview.category}
              </h3>
              <button
                onClick={closePreview}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Icon icon="mdi:close" className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            <div className="p-4">
              <img
                src={selectedPreview.preview}
                alt={`Preview of ${selectedPreview.category}`}
                className="w-full h-auto max-h-[70vh] object-contain rounded"
              />
            </div>
            <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Print-ready at 300 DPI
              </span>
              <button
                onClick={() => downloadTemplate({ name: `${selectedPreview.category}_Preview`, url: selectedPreview.preview })}
                className="px-4 py-2 bg-paan-red hover:bg-paan-red/80 text-white rounded-lg font-medium transition-colors flex items-center"
              >
                <Icon icon="mdi:download" className="w-4 h-4 mr-2" />
                Download Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MerchTemplatesModal;