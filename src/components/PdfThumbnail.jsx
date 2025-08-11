import React, { useState } from "react";
import Image from "next/image";

const PdfThumbnail = ({ pdfUrl, title, IconComponent }) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Try different ImageKit transformation approaches
  const getThumbnailUrls = (pdfUrl) => {
    if (!pdfUrl || !pdfUrl.includes("ik.imagekit.io")) return [];

    return [
      // Try with different transformation parameters
      `${pdfUrl}?tr=f-webp,pg-1,w-400,h-300,q-80`,
      `${pdfUrl}?tr=f-jpg,pg-1,w-400,h-300,q-90`,
      `${pdfUrl}?tr=f-png,pg-1,w-400,h-300`,
      `${pdfUrl}?tr=f-jpg,pg-1,q-80`,
    ];
  };

  const thumbnailUrls = getThumbnailUrls(pdfUrl);
  const [currentUrlIndex, setCurrentUrlIndex] = useState(0);

  const handleImageError = () => {
    // Silently try next URL or fallback to CSS preview
    if (currentUrlIndex < thumbnailUrls.length - 1) {
      // Try next URL
      setCurrentUrlIndex((prev) => prev + 1);
    } else {
      // All URLs failed, show fallback
      setImageError(true);
    }
    setIsLoading(false);
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  // Fallback CSS preview
  const CssPreview = () => (
    <div className="relative w-full h-[150px] mb-4 rounded-lg overflow-hidden bg-paan-blue/30">
      {/* Document mockup */}
      <div className="absolute inset-4 bg-paan-dark-blue rounded-lg p-4 shadow-inner">
        {/* Document lines */}
        
        {/* Document icon */}
        <div className="absolute bottom-2 right-2 w-6 h-6 bg-paan-blue rounded-full flex items-center justify-center">
          <IconComponent icon="mdi:check" className="text-white text-sm" />
        </div>
      </div>
      {/* PDF Document Overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors">
        <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
          <IconComponent
            icon="mdi:file-pdf-box"
            className="text-red-600 text-2xl"
          />
        </div>
      </div>
      {/* PDF Label */}
      <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 rounded text-white text-xs font-medium">
        PDF Report
      </div>
    </div>
  );

  // If we have no thumbnail URLs or all failed, show CSS fallback
  if (thumbnailUrls.length === 0 || imageError) {
    return <CssPreview />;
  }

  return (
    <div className="relative w-full h-[150px] mb-4 rounded-lg overflow-hidden">
      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg"></div>
      )}

      {/* Try to load PDF thumbnail */}
      <Image
        src={thumbnailUrls[currentUrlIndex]}
        width={400}
        height={300}
        alt={`Thumbnail for ${title}`}
        className="w-full h-full object-cover"
        onError={handleImageError}
        onLoad={handleImageLoad}
        priority={false}
      />

      {/* PDF Document Overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors">
        <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
          <IconComponent
            icon="mdi:file-pdf-box"
            className="text-red-600 text-2xl"
          />
        </div>
      </div>

      {/* PDF Label */}
      <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 rounded text-white text-xs font-medium">
        PDF Report
      </div>
    </div>
  );
};

export default PdfThumbnail;
