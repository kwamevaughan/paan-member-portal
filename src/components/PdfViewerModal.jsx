import React from "react";
import { Icon } from "@iconify/react";

const PdfViewerModal = ({ isOpen, onClose, pdfUrl, title, mode }) => {
  if (!isOpen) return null;

  const handleDownload = async () => {
    try {
      // Try to fetch the PDF and create a blob for download
      const response = await fetch(pdfUrl, {
        method: 'GET',
        mode: 'cors',
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${title}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        throw new Error('Failed to fetch PDF');
      }
    } catch (error) {
      console.error('Download failed, trying alternative method:', error);
      
      // Fallback: try direct download with additional attributes
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = `${title}.pdf`;
      link.setAttribute('download', `${title}.pdf`);
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[50] overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Enhanced Glassmorphic Background */}
      <div
        className={`fixed inset-0 transition-all duration-500 backdrop-blur-sm
          ${
            mode === "dark"
              ? "bg-gradient-to-br from-slate-900/20 via-blue-900/10 to-blue-900/20"
              : "bg-gradient-to-br from-white/20 via-blue-50/30 to-blue-50/20"
          }`}
        onClick={onClose}
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(0, 123, 255, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(100, 149, 237, 0.1) 0%, transparent 50%)
          `,
        }}
      />

      {/* Modal Content */}
      <div
        className="flex min-h-full items-center justify-center p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`relative w-full max-w-7xl rounded-3xl transform transition-all duration-500 max-h-[95vh] overflow-hidden
            shadow-2xl shadow-black/20
            ${
              mode === "dark"
                ? "bg-gray-900 text-white border border-white/10"
                : "bg-white/20 text-gray-900 border border-white/20"
            } 
            backdrop-blur-xl`}
          style={{
            backdropFilter: "blur(16px) saturate(180%)",
            WebkitBackdropFilter: "blur(16px) saturate(180%)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Premium Header with Gradient Overlay */}
          <div
            className={`relative px-8 py-4 overflow-hidden ${
              mode === "dark" ? "bg-paan-blue" : "bg-paan-blue"
            }`}
            style={{
              backdropFilter: "blur(8px)",
            }}
          >
            {/* Animated Background Elements */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-xl transform -translate-x-16 -translate-y-16"></div>
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-lg transform translate-x-12 translate-y-12"></div>
            </div>

            <div className="relative flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Icon
                    icon="mdi:file-pdf-box"
                    className="h-6 w-6 text-white"
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-medium text-white tracking-tight">
                    {title}
                  </h2>
                  <p className="text-white/80 text-sm">PDF Report</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {/* Download Button */}
                <button
                  onClick={handleDownload}
                  className="group p-3 rounded-2xl transition-all duration-300 hover:bg-white/20 hover:scale-110 active:scale-95"
                  style={{
                    backdropFilter: "blur(4px)",
                    background: "rgba(255, 255, 255, 0.1)",
                  }}
                  title="Download PDF"
                >
                  <Icon
                    icon="mdi:download"
                    className="h-5 w-5 text-white transition-transform duration-300 group-hover:scale-110"
                  />
                </button>

                {/* Open in New Tab Button */}
                <button
                  onClick={() => window.open(pdfUrl, "_blank")}
                  className="group p-3 rounded-2xl transition-all duration-300 hover:bg-white/20 hover:scale-110 active:scale-95"
                  style={{
                    backdropFilter: "blur(4px)",
                    background: "rgba(255, 255, 255, 0.1)",
                  }}
                  title="Open in New Tab"
                >
                  <Icon
                    icon="mdi:open-in-new"
                    className="h-5 w-5 text-white transition-transform duration-300 group-hover:scale-110"
                  />
                </button>

                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="group p-3 rounded-2xl transition-all duration-300 hover:bg-white/20 hover:scale-110 active:scale-95"
                  style={{
                    backdropFilter: "blur(4px)",
                    background: "rgba(255, 255, 255, 0.1)",
                  }}
                >
                  <Icon
                    icon="heroicons:x-mark"
                    className="h-6 w-6 text-white transition-transform duration-300 group-hover:rotate-90"
                  />
                </button>
              </div>
            </div>
          </div>

          {/* PDF Viewer Content */}
          <div
            className={`p-6 overflow-hidden ${
              mode === "dark" ? "bg-gray-900/45" : "bg-white/60"
            }`}
            style={{
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              height: "calc(95vh - 120px)",
            }}
          >
            <div className="relative w-full h-full rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-white">
              <iframe
                src={`${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1&view=FitH`}
                className="w-full h-full"
                title={`PDF Viewer: ${title}`}
                style={{ border: "none" }}
              />
            </div>

            {/* Footer with instructions */}
            <div className="mt-4 flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-4">
                <span className="flex items-center">
                  <Icon
                    icon="mdi:information-outline"
                    className="w-4 h-4 mr-1"
                  />
                  Use PDF controls to navigate, zoom, and search
                </span>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">
                  Ctrl+F
                </kbd>
                <span>to search</span>
              </div>
            </div>
          </div>

          {/* Subtle Border Enhancement */}
          <div
            className="absolute inset-0 rounded-3xl pointer-events-none border border-white/10"
            style={{
              background:
                "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%, rgba(255, 255, 255, 0.05) 100%)",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default PdfViewerModal;
