import React, { useState } from "react";
import { Icon } from "@iconify/react";
import SimpleModal from "@/components/SimpleModal";
import JSZip from "jszip";
import toast from "react-hot-toast";

const BrandAssetsModal = ({ isOpen, onClose, mode }) => {
  const [selectedPreview, setSelectedPreview] = useState(null);

  // Brand assets with preview images
  const brandAssets = [
    {
      name: "Primary Logo",
      type: "PNG",
      icon: "mdi:file-image",
      description: "Main PAAN logo with full branding",
      url: "https://ik.imagekit.io/2crwrt8s6/MemberResources/PAAN%20Primary%20Logo.png",
      filename: "PNG_Format/PAAN_Primary_Logo.png",
      preview: "https://ik.imagekit.io/2crwrt8s6/MemberResources/PAAN%20Primary%20Logo.png"
    },
    {
      name: "Primary Logo",
      type: "SVG",
      icon: "mdi:vector-square",
      description: "Scalable vector version",
      url: "https://ik.imagekit.io/2crwrt8s6/MemberResources/PAAN%20Primary%20Logo.svg",
      filename: "SVG_Format/PAAN_Primary_Logo.svg",
      preview: "https://ik.imagekit.io/2crwrt8s6/MemberResources/PAAN%20Primary%20Logo.png"
    },
    {
      name: "Primary Logo",
      type: "WebP",
      icon: "mdi:web",
      description: "Optimized for web use",
      url: "https://ik.imagekit.io/2crwrt8s6/MemberResources/PAAN%20Primary%20Logo.webp",
      filename: "WebP_Format/PAAN_Primary_Logo.webp",
      preview: "https://ik.imagekit.io/2crwrt8s6/MemberResources/PAAN%20Primary%20Logo.png"
    },
    {
      name: "Primary Logo 2",
      type: "PNG",
      icon: "mdi:file-image",
      description: "Alternative primary logo design",
      url: "https://ik.imagekit.io/2crwrt8s6/MemberResources/PAAN%20Primary%20Logo%202.png",
      filename: "PNG_Format/PAAN_Primary_Logo_2.png",
      preview: "https://ik.imagekit.io/2crwrt8s6/MemberResources/PAAN%20Primary%20Logo%202.png"
    },
    {
      name: "Primary Logo 2",
      type: "SVG",
      icon: "mdi:vector-square",
      description: "Scalable vector version",
      url: "https://ik.imagekit.io/2crwrt8s6/MemberResources/PAAN%20Primary%20Logo%202.svg",
      filename: "SVG_Format/PAAN_Primary_Logo_2.svg",
      preview: "https://ik.imagekit.io/2crwrt8s6/MemberResources/PAAN%20Primary%20Logo%202.png"
    },
    {
      name: "Primary Logo 2",
      type: "WebP",
      icon: "mdi:web",
      description: "Optimized for web use",
      url: "https://ik.imagekit.io/2crwrt8s6/MemberResources/PAAN%20Primary%20Logo%202.webp",
      filename: "WebP_Format/PAAN_Primary_Logo_2.webp",
      preview: "https://ik.imagekit.io/2crwrt8s6/MemberResources/PAAN%20Primary%20Logo%202.png"
    },
    {
      name: "Solid Color Logo",
      type: "PNG",
      icon: "mdi:file-image",
      description: "Solid color version",
      url: "https://ik.imagekit.io/2crwrt8s6/MemberResources/PAAN%20primary%20solid%20color%20.png",
      filename: "PNG_Format/PAAN_Primary_Solid_Color.png",
      preview: "https://ik.imagekit.io/2crwrt8s6/MemberResources/PAAN%20primary%20solid%20color%20.png"
    },
    {
      name: "Solid Color Logo",
      type: "SVG",
      icon: "mdi:vector-square",
      description: "Scalable vector version",
      url: "https://ik.imagekit.io/2crwrt8s6/MemberResources/PAAN%20primary%20solid%20color%20.svg",
      filename: "SVG_Format/PAAN_Primary_Solid_Color.svg",
      preview: "https://ik.imagekit.io/2crwrt8s6/MemberResources/PAAN%20primary%20solid%20color%20.png"
    },
    {
      name: "Solid Color Logo",
      type: "WebP",
      icon: "mdi:web",
      description: "Optimized for web use",
      url: "https://ik.imagekit.io/2crwrt8s6/MemberResources/PAAN%20primary%20solid%20color%20.webp",
      filename: "WebP_Format/PAAN_Primary_Solid_Color.webp",
      preview: "https://ik.imagekit.io/2crwrt8s6/MemberResources/PAAN%20primary%20solid%20color%20.png"
    },
    {
      name: "White Logo",
      type: "PNG",
      icon: "mdi:file-image",
      description: "White version for dark backgrounds",
      url: "https://ik.imagekit.io/2crwrt8s6/MemberResources/PAAN%20logo%20white.png",
      filename: "PNG_Format/PAAN_Logo_White.png",
      preview: "https://ik.imagekit.io/2crwrt8s6/MemberResources/PAAN%20logo%20white.png"
    },
    {
      name: "White Logo",
      type: "SVG",
      icon: "mdi:vector-square",
      description: "Scalable vector version",
      url: "https://ik.imagekit.io/2crwrt8s6/MemberResources/PAAN%20logo%20white.svg",
      filename: "SVG_Format/PAAN_Logo_White.svg",
      preview: "https://ik.imagekit.io/2crwrt8s6/MemberResources/PAAN%20logo%20white.png"
    },
    {
      name: "White Logo",
      type: "WebP",
      icon: "mdi:web",
      description: "Optimized for web use",
      url: "https://ik.imagekit.io/2crwrt8s6/MemberResources/PAAN%20logo%20white.webp",
      filename: "WebP_Format/PAAN_Logo_White.webp",
      preview: "https://ik.imagekit.io/2crwrt8s6/MemberResources/PAAN%20logo%20white.png"
    },
    {
      name: "Black Logo",
      type: "PNG",
      icon: "mdi:file-image",
      description: "Black version for light backgrounds",
      url: "https://ik.imagekit.io/2crwrt8s6/MemberResources/PAAN%20logo%20black.png",
      filename: "PNG_Format/PAAN_Logo_Black.png",
      preview: "https://ik.imagekit.io/2crwrt8s6/MemberResources/PAAN%20logo%20black.png"
    },
    {
      name: "Black Logo",
      type: "SVG",
      icon: "mdi:vector-square",
      description: "Scalable vector version",
      url: "https://ik.imagekit.io/2crwrt8s6/MemberResources/PAAN%20logo%20black.svg",
      filename: "SVG_Format/PAAN_Logo_Black.svg",
      preview: "https://ik.imagekit.io/2crwrt8s6/MemberResources/PAAN%20logo%20black.png"
    },
    {
      name: "Black Logo",
      type: "WebP",
      icon: "mdi:web",
      description: "Optimized for web use",
      url: "https://ik.imagekit.io/2crwrt8s6/MemberResources/PAAN%20logo%20black.webp",
      filename: "WebP_Format/PAAN_Logo_Black.webp",
      preview: "https://ik.imagekit.io/2crwrt8s6/MemberResources/PAAN%20logo%20black.png"
    }
  ];

  // Function to download all brand assets as a zip file
  const downloadAllAssets = async () => {
    toast.loading("Creating brand assets zip file...", { id: "download-brand-assets" });

    try {
      const zip = new JSZip();
      
      // Add a README file with brand guidelines
      const readmeContent = `PAAN Brand Assets Package
========================

This package contains official PAAN logos and brand assets in multiple formats.

Contents:
- PNG_Format/: High-resolution PNG logos (transparent background)
- SVG_Format/: Scalable vector graphics (perfect for web and print)
- WebP_Format/: Modern web format (optimized for web use)

Logo Variations:
- PAAN_Primary_Logo: Main logo with full branding
- PAAN_Primary_Logo_2: Alternative primary logo design
- PAAN_Primary_Solid_Color: Solid color version
- PAAN_Logo_White: White version for dark backgrounds
- PAAN_Logo_Black: Black version for light backgrounds

Brand Guidelines:
- Maintain proper spacing around logos (minimum clear space)
- Do not modify, stretch, or alter the logos
- Use appropriate logo version for your background
- For print: Use PNG or SVG formats
- For web: Use SVG or WebP formats
- Maintain brand colors and proportions

For questions about brand usage or additional formats, contact the PAAN team through the member portal.

© ${new Date().getFullYear()} Pan African Advocacy Network (PAAN)
All rights reserved.
`;
      
      zip.file("README.txt", readmeContent);

      // Download and add each file to the zip
      const downloadPromises = brandAssets.map(async (asset, index) => {
        try {
          toast.loading(`Downloading asset ${index + 1} of ${brandAssets.length}...`, { id: "download-brand-assets" });
          
          const response = await fetch(asset.url);
          if (!response.ok) {
            throw new Error(`Failed to download ${asset.filename}`);
          }
          
          const blob = await response.blob();
          zip.file(asset.filename, blob);
          
          return { success: true, filename: asset.filename };
        } catch (error) {
          console.error(`Error downloading ${asset.filename}:`, error);
          return { success: false, filename: asset.filename, error };
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

      toast.loading("Generating brand assets zip file...", { id: "download-brand-assets" });

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
      link.download = `PAAN_Brand_Assets_${new Date().toISOString().split('T')[0]}.zip`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      URL.revokeObjectURL(url);

      if (failed.length > 0) {
        toast.success(
          `Downloaded ${successful.length} of ${brandAssets.length} brand assets. Some files may have been skipped.`,
          { id: "download-brand-assets", duration: 5000 }
        );
      } else {
        toast.success(
          `Successfully downloaded all ${brandAssets.length} brand assets as a zip file!`,
          { id: "download-brand-assets", duration: 4000 }
        );
      }

    } catch (error) {
      console.error("Error creating brand assets zip file:", error);
      toast.error(
        "Failed to create zip file. Please try downloading individual files.",
        { id: "download-brand-assets", duration: 5000 }
      );
    }
  };

  const handlePreviewClick = (asset) => {
    setSelectedPreview(asset);
  };

  const closePreview = () => {
    setSelectedPreview(null);
  };

  // Function to download individual asset
  const downloadAsset = async (asset) => {
    try {
      toast.loading(`Downloading ${asset.name}...`, { id: `download-${asset.filename}` });
      
      const response = await fetch(asset.url);
      if (!response.ok) {
        throw new Error(`Failed to download ${asset.name}`);
      }
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${asset.name.replace(/\s+/g, '_')}_${asset.type}.${asset.type.toLowerCase()}`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      URL.revokeObjectURL(url);
      
      toast.success(`Successfully downloaded ${asset.name}!`, { id: `download-${asset.filename}`, duration: 3000 });
    } catch (error) {
      console.error(`Error downloading ${asset.name}:`, error);
      toast.error(`Failed to download ${asset.name}. Please try again.`, { id: `download-${asset.filename}`, duration: 4000 });
    }
  };

  // Group assets by logo type for better organization
  const groupedAssets = brandAssets.reduce((groups, asset) => {
    const key = asset.name;
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(asset);
    return groups;
  }, {});

  return (
    <>
      <SimpleModal
        isOpen={isOpen}
        onClose={onClose}
        title="PAAN Logos & Brand Assets"
        mode={mode}
        width="max-w-6xl"
      >
        <div className="space-y-6">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-paan-blue/10 rounded-full flex items-center justify-center mb-4">
              <Icon
                icon="mdi:palette"
                className="w-8 h-8 text-paan-blue"
              />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Official PAAN Brand Assets
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Download high-quality PAAN logos and brand assets in multiple formats. Perfect for presentations, websites, and print materials.
            </p>
          </div>

          {/* Logo Categories */}
          <div className="space-y-6">
            {Object.entries(groupedAssets).map(([logoName, assets]) => (
              <div key={logoName} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                  {logoName}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {assets.map((asset, index) => (
                    <div key={index} className="bg-white dark:bg-gray-700 rounded p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {asset.name} ({asset.type})
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded">
                          {asset.type}
                        </span>
                      </div>
                      
                      {/* Preview Image */}
                      <div className="mb-3">
                        <img
                          src={asset.preview}
                          alt={`Preview of ${asset.name}`}
                          className="w-full h-24 object-contain rounded border border-gray-200 dark:border-gray-600 cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => handlePreviewClick(asset)}
                        />
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => handlePreviewClick(asset)}
                          className="flex-1 px-3 py-1.5 text-xs bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-300 rounded transition-colors flex items-center justify-center"
                        >
                          <Icon icon="mdi:eye" className="w-3 h-3 mr-1" />
                          Preview
                        </button>
                        <button
                          onClick={() => downloadAsset(asset)}
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
                  Brand Usage Guidelines
                </h5>
                <p className="text-sm text-blue-700 dark:text-blue-200">
                  Please maintain proper spacing around logos and do not modify, stretch, or alter them. Use the white logo on dark backgrounds and the black logo on light backgrounds. For questions about brand usage, contact our team.
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
              onClick={downloadAllAssets}
              className="flex-1 px-6 py-3 bg-paan-red hover:bg-paan-red/80 text-white rounded-lg font-medium transition-colors"
            >
              <Icon
                icon="mdi:download-multiple"
                className="w-4 h-4 inline mr-2"
              />
              Download All Brand Assets
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
                {selectedPreview.name} - {selectedPreview.type} Format
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
                alt={`Preview of ${selectedPreview.name}`}
                className="w-full h-auto max-h-[70vh] object-contain rounded"
              />
            </div>
                         <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700">
               <span className="text-sm text-gray-500 dark:text-gray-400">
                 {selectedPreview.type} • {selectedPreview.description}
               </span>
               <button
                 onClick={() => downloadAsset(selectedPreview)}
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

export default BrandAssetsModal;