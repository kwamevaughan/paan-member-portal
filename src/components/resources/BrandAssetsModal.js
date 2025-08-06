import React from "react";
import { Icon } from "@iconify/react";
import SimpleModal from "@/components/SimpleModal";
import JSZip from "jszip";
import toast from "react-hot-toast";

const BrandAssetsModal = ({ isOpen, onClose, mode }) => {
  // Function to download all brand assets as a zip file
  const downloadAllAssets = async () => {
    const assets = [
      // WebP files
      {
        url: "https://ik.imagekit.io/2crwrt8s6/MemberResources/PAAN%20Primary%20Logo%202.webp",
        filename: "WebP_Format/PAAN_Primary_Logo_2.webp",
      },
      {
        url: "https://ik.imagekit.io/2crwrt8s6/MemberResources/PAAN%20primary%20solid%20color%20.webp",
        filename: "WebP_Format/PAAN_Primary_Solid_Color.webp",
      },
      {
        url: "https://ik.imagekit.io/2crwrt8s6/MemberResources/PAAN%20Primary%20Logo.webp",
        filename: "WebP_Format/PAAN_Primary_Logo.webp",
      },
      {
        url: "https://ik.imagekit.io/2crwrt8s6/MemberResources/PAAN%20logo%20white.webp",
        filename: "WebP_Format/PAAN_Logo_White.webp",
      },
      {
        url: "https://ik.imagekit.io/2crwrt8s6/MemberResources/PAAN%20logo%20black.webp",
        filename: "WebP_Format/PAAN_Logo_Black.webp",
      },
      // SVG files
      {
        url: "https://ik.imagekit.io/2crwrt8s6/MemberResources/PAAN%20primary%20solid%20color%20.svg",
        filename: "SVG_Format/PAAN_Primary_Solid_Color.svg",
      },
      {
        url: "https://ik.imagekit.io/2crwrt8s6/MemberResources/PAAN%20Primary%20Logo.svg",
        filename: "SVG_Format/PAAN_Primary_Logo.svg",
      },
      {
        url: "https://ik.imagekit.io/2crwrt8s6/MemberResources/PAAN%20Primary%20Logo%202.svg",
        filename: "SVG_Format/PAAN_Primary_Logo_2.svg",
      },
      {
        url: "https://ik.imagekit.io/2crwrt8s6/MemberResources/PAAN%20logo%20white.svg",
        filename: "SVG_Format/PAAN_Logo_White.svg",
      },
      {
        url: "https://ik.imagekit.io/2crwrt8s6/MemberResources/PAAN%20logo%20black.svg",
        filename: "SVG_Format/PAAN_Logo_Black.svg",
      },
      // PNG files
      {
        url: "https://ik.imagekit.io/2crwrt8s6/MemberResources/PAAN%20primary%20solid%20color%20.png",
        filename: "PNG_Format/PAAN_Primary_Solid_Color.png",
      },
      {
        url: "https://ik.imagekit.io/2crwrt8s6/MemberResources/PAAN%20Primary%20Logo.png",
        filename: "PNG_Format/PAAN_Primary_Logo.png",
      },
      {
        url: "https://ik.imagekit.io/2crwrt8s6/MemberResources/PAAN%20Primary%20Logo%202.png",
        filename: "PNG_Format/PAAN_Primary_Logo_2.png",
      },
      {
        url: "https://ik.imagekit.io/2crwrt8s6/MemberResources/PAAN%20logo%20white.png",
        filename: "PNG_Format/PAAN_Logo_White.png",
      },
      {
        url: "https://ik.imagekit.io/2crwrt8s6/MemberResources/PAAN%20logo%20black.png",
        filename: "PNG_Format/PAAN_Logo_Black.png",
      },
    ];

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
      const downloadPromises = assets.map(async (asset, index) => {
        try {
          toast.loading(`Downloading asset ${index + 1} of ${assets.length}...`, { id: "download-brand-assets" });
          
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
          `Downloaded ${successful.length} of ${assets.length} brand assets. Some files may have been skipped.`,
          { id: "download-brand-assets", duration: 5000 }
        );
      } else {
        toast.success(
          `Successfully downloaded all ${assets.length} brand assets as a zip file!`,
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

  return (
    <SimpleModal
      isOpen={isOpen}
      onClose={onClose}
      title="PAAN Logos & Brand Assets"
      mode={mode}
      width="max-w-4xl"
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* PNG Format */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <Icon
                icon="mdi:file-image"
                className="w-5 h-5 text-paan-blue mr-2"
              />
              <h4 className="font-medium text-gray-900 dark:text-white">
                PNG Format
              </h4>
            </div>
            <div className="space-y-2">
              <a
                href="https://ik.imagekit.io/2crwrt8s6/MemberResources/PAAN%20Primary%20Logo.png"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Primary Logo
                </span>
                <Icon
                  icon="mdi:download"
                  className="w-4 h-4 text-paan-blue"
                />
              </a>
              <a
                href="https://ik.imagekit.io/2crwrt8s6/MemberResources/PAAN%20logo%20white.png"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  White Logo
                </span>
                <Icon
                  icon="mdi:download"
                  className="w-4 h-4 text-paan-blue"
                />
              </a>
              <a
                href="https://ik.imagekit.io/2crwrt8s6/MemberResources/PAAN%20logo%20black.png"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Black Logo
                </span>
                <Icon
                  icon="mdi:download"
                  className="w-4 h-4 text-paan-blue"
                />
              </a>
            </div>
          </div>

          {/* SVG Format */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <Icon
                icon="mdi:vector-square"
                className="w-5 h-5 text-paan-blue mr-2"
              />
              <h4 className="font-medium text-gray-900 dark:text-white">
                SVG Format
              </h4>
            </div>
            <div className="space-y-2">
              <a
                href="https://ik.imagekit.io/2crwrt8s6/MemberResources/PAAN%20Primary%20Logo.svg"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Primary Logo
                </span>
                <Icon
                  icon="mdi:download"
                  className="w-4 h-4 text-paan-blue"
                />
              </a>
              <a
                href="https://ik.imagekit.io/2crwrt8s6/MemberResources/PAAN%20logo%20white.svg"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  White Logo
                </span>
                <Icon
                  icon="mdi:download"
                  className="w-4 h-4 text-paan-blue"
                />
              </a>
              <a
                href="https://ik.imagekit.io/2crwrt8s6/MemberResources/PAAN%20logo%20black.svg"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Black Logo
                </span>
                <Icon
                  icon="mdi:download"
                  className="w-4 h-4 text-paan-blue"
                />
              </a>
            </div>
          </div>

          {/* WebP Format */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <Icon
                icon="mdi:web"
                className="w-5 h-5 text-paan-blue mr-2"
              />
              <h4 className="font-medium text-gray-900 dark:text-white">
                WebP Format
              </h4>
            </div>
            <div className="space-y-2">
              <a
                href="https://ik.imagekit.io/2crwrt8s6/MemberResources/PAAN%20Primary%20Logo.webp"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Primary Logo
                </span>
                <Icon
                  icon="mdi:download"
                  className="w-4 h-4 text-paan-blue"
                />
              </a>
              <a
                href="https://ik.imagekit.io/2crwrt8s6/MemberResources/PAAN%20logo%20white.webp"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  White Logo
                </span>
                <Icon
                  icon="mdi:download"
                  className="w-4 h-4 text-paan-blue"
                />
              </a>
              <a
                href="https://ik.imagekit.io/2crwrt8s6/MemberResources/PAAN%20logo%20black.webp"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Black Logo
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
  );
};

export default BrandAssetsModal;