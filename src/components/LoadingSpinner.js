import { useState, useEffect } from "react";
import Image from "next/image";

const LoadingSpinner = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + 1;
        return newProgress > 100 ? 0 : newProgress;
      });
    }, 30);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="w-40 h-40 mb-6 relative">
        {/* Logo with pulse effect */}
        <div className="animate-pulse absolute inset-0 flex items-center justify-center">
          <Image
            src="/assets/images/logo.svg"
            alt="Logo"
            width={120}
            height={120}
            className="object-contain"
          />
        </div>

        {/* Animated glow effect around logo */}
        <div
          className="absolute inset-0 rounded-full bg-indigo-100 opacity-50 animate-ping"
          style={{ animationDuration: "3s" }}
        ></div>
      </div>

      {/* Progress bar */}
      <div className="w-64 h-2 bg-gray-200 rounded-full mb-4 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Loading text with fade in/out effect */}
      <div className="text-indigo-700 font-medium text-lg animate-pulse">
        Loading your dashboard...
      </div>
    </div>
  );
};

export default LoadingSpinner;
