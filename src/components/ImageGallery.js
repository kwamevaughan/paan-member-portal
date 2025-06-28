import { useState } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";

const ImageGallery = ({ images = [], title, mode }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);

  if (!images || images.length === 0) {
    return null;
  }

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index) => {
    setCurrentIndex(index);
  };

  const openFullScreen = () => {
    setIsFullScreen(true);
  };

  const closeFullScreen = () => {
    setIsFullScreen(false);
  };

  // Handle keyboard navigation in full-screen mode
  const handleKeyDown = (e) => {
    if (!isFullScreen) return;
    
    switch (e.key) {
      case 'Escape':
        closeFullScreen();
        break;
      case 'ArrowLeft':
        prevImage();
        break;
      case 'ArrowRight':
        nextImage();
        break;
    }
  };

  return (
    <>
      <div className="relative">
        {/* Main Image Display */}
        <div 
          className="relative w-full h-64 rounded-2xl overflow-hidden mb-4 cursor-pointer"
          onClick={openFullScreen}
        >
          <Image
            src={images[currentIndex]}
            width={1200}
            height={0}
            alt={`${title} - Image ${currentIndex + 1}`}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>
          
          {/* Click to expand indicator */}
          <div className="absolute top-4 left-4 px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs font-medium flex items-center gap-1 pointer-events-none">
            <Icon icon="mdi:fullscreen" className="text-sm" />
            Click to expand
          </div>
          
          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-all duration-200 backdrop-blur-sm"
              >
                <Icon icon="mdi:chevron-left" className="text-xl" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-all duration-200 backdrop-blur-sm"
              >
                <Icon icon="mdi:chevron-right" className="text-xl" />
              </button>
            </>
          )}

          {/* Image Counter */}
          {images.length > 1 && (
            <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-sm font-medium pointer-events-none">
              {currentIndex + 1} / {images.length}
            </div>
          )}
        </div>

        {/* Thumbnail Navigation */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={`flex-shrink-0 relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                  index === currentIndex
                    ? "border-paan-blue ring-2 ring-paan-blue/30"
                    : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                }`}
              >
                <Image
                  src={image}
                  width={64}
                  height={64}
                  alt={`${title} thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
                {index === currentIndex && (
                  <div className="absolute inset-0 bg-paan-blue/20 flex items-center justify-center">
                    <Icon icon="mdi:check" className="text-white text-sm" />
                  </div>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Navigation Instructions */}
        {images.length > 1 && (
          <div className={`text-xs text-center mt-2 ${
            mode === "dark" ? "text-gray-400" : "text-gray-600"
          }`}>
            Use arrow keys or click thumbnails to navigate
          </div>
        )}
      </div>

      {/* Full Screen Modal */}
      {isFullScreen && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onKeyDown={handleKeyDown}
          tabIndex={-1}
        >
          {/* Close Button */}
          <button
            onClick={closeFullScreen}
            className="absolute top-4 right-4 w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-all duration-200 backdrop-blur-sm z-10"
          >
            <Icon icon="mdi:close" className="text-2xl" />
          </button>

          {/* Main Image */}
          <div className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center">
            <Image
              src={images[currentIndex]}
              width={1920}
              height={1080}
              alt={`${title} - Full Screen ${currentIndex + 1}`}
              className="max-w-full max-h-full object-contain"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </div>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-16 h-16 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-all duration-200 backdrop-blur-sm"
              >
                <Icon icon="mdi:chevron-left" className="text-3xl" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-16 h-16 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-all duration-200 backdrop-blur-sm"
              >
                <Icon icon="mdi:chevron-right" className="text-3xl" />
              </button>
            </>
          )}

          {/* Image Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-full bg-black/50 backdrop-blur-sm text-white text-lg font-medium">
              {currentIndex + 1} / {images.length}
            </div>
          )}

          {/* Keyboard Instructions */}
          <div className="absolute bottom-4 right-4 px-3 py-2 rounded-lg bg-black/50 backdrop-blur-sm text-white text-sm">
            <div className="flex items-center gap-2">
              <Icon icon="mdi:keyboard" className="text-sm" />
              <span>← → to navigate, ESC to close</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageGallery; 