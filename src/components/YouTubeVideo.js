import Link from "next/link";
import { useState, useEffect } from "react";

const YouTubeVideo = ({ mode }) => {
  const [isClient, setIsClient] = useState(false);

  // Ensure component only renders on client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Don't render iframe on server side
  if (!isClient) {
    return (
      <div
        className={`p-6 rounded-2xl border shadow-lg ${
          mode === "dark"
            ? "bg-gray-900/60 border-gray-700"
            : "bg-white border-gray-200"
        }`}
      >
        <Link href="https://paan.africa/" target="_blank">
          <h2
            className={`text-xl font-normal mb-4 ${
              mode === "dark" ? "text-white" : "text-gray-800"
            }`}
          >
            Pan African Agency Network - (PAAN)
          </h2>
        </Link>
        <div className="text-gray-500">Loading video...</div>
      </div>
    );
  }

  return (
    <div
      className={`p-6 rounded-2xl border shadow-lg ${
        mode === "dark"
          ? "bg-gray-900/60 border-gray-700"
          : "bg-white border-gray-200"
      }`}
    >
      <Link href="https://paan.africa/" target="_blank">
        <h2
          className={`text-xl font-normal mb-4 ${
            mode === "dark" ? "text-white" : "text-gray-800"
          }`}
        >
          Pan African Agency Network - (PAAN)
        </h2>
      </Link>
      <div
        className="relative w-full"
        style={{ paddingBottom: "56.25%" /* 16:9 aspect ratio */ }}
      >
        <iframe
          className="absolute top-0 left-0 w-full h-full rounded-lg"
          style={{ pointerEvents: "none" }}
          src="https://www.youtube.com/embed/xx0KDvM4_ZE?autoplay=1&loop=1&playlist=xx0KDvM4_ZE&controls=0&mute=1&rel=0&modestbranding=1&disablekb=1&showinfo=0"
          title="Pan African Agency Network Video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default YouTubeVideo;
