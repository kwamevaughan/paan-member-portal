import { useEffect, useState } from "react";
import Image from "next/image";

const SimpleFooter = ({ mode, isSidebarOpen }) => {
  const [sidebarHidden, setSidebarHidden] = useState(false);
  const currentYear = new Date().getFullYear();

  // Listen for sidebar visibility changes
  useEffect(() => {
    const handleSidebarVisibilityChange = (event) => {
      setSidebarHidden(event.detail.hidden);
    };
    document.addEventListener(
      "sidebarVisibilityChange",
      handleSidebarVisibilityChange
    );

    // Check initial state from body class
    setSidebarHidden(document.body.classList.contains("sidebar-hidden"));

    return () => {
      document.removeEventListener(
        "sidebarVisibilityChange",
        handleSidebarVisibilityChange
      );
    };
  }, []);

  return (
    <footer
      className={`
        ${
          mode === "dark"
            ? "bg-gray-800/40 text-white"
            : "bg-white/40 text-gray-800"
        }
        backdrop-blur-md
        rounded-xl shadow-lg py-3 px-6
        transition-all duration-300
        w-full sticky bottom-0 z-50 mt-10 md:mt-10
        ${
          sidebarHidden ? "md:ml-0" : isSidebarOpen ? "md:ml-0" : "md:ml-0"
        }
      `}
    >
      <div className="flex flex-col md:flex-row justify-between items-center">
        {/* Left side: Copyright and Website Link */}
        <div className="text-sm flex flex-col md:flex-row items-center md:items-start mb-2 md:mb-0 md:space-x-2">
          <span>Copyright © {currentYear} -</span>
          <span className="relative group mt-1 md:mt-0">
            <span className="cursor-pointer hover:text-blue-400 transition-colors">
            Pan-African Agency Network (PAAN)
            </span>
            <span
              className={`absolute bottom-full mb-2 left-1/2 -translate-x-1/2 text-xs 
              ${
                mode === "dark"
                  ? "bg-gray-700 text-gray-200"
                  : "bg-gray-800 text-white"
              } 
              rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50
              before:content-[''] before:absolute before:top-full before:left-1/2 before:-translate-x-1/2
              before:border-4 before:border-transparent ${
                mode === "dark"
                  ? "before:border-t-gray-700"
                  : "before:border-t-gray-800"
              }`}
            >
              Visit our website
            </span>
          </span>
        </div>

        {/* Right side: Made with ♡ in Nairobi x Accra */}
        <div className="text-sm flex justify-center md:justify-end items-center space-x-1 mt-2 md:mt-0">
          <span>Made with ♡ in</span>
          <span className="relative group">
            <span className="cursor-default"> Nairobi</span>
            <div className="absolute top-0 left-0 w-full h-full bg-transparent opacity-0 transition-all duration-500 ease-in-out group-hover:top-[-120%] group-hover:opacity-100">
              <Image
                src="/assets/images/kenya.gif"
                alt="Nairobi Flag"
                width={30}
                height={30}
                className="absolute top-0 left-0 w-auto"
              />
            </div>
          </span>{" "}
          <span>x</span>{" "}
          <span className="relative group">
            <span className="cursor-default">Accra</span>
            <div className="absolute top-0 left-0 w-full h-full bg-transparent opacity-0 transition-all duration-500 ease-in-out group-hover:top-[-120%] group-hover:opacity-100">
              <Image
                src="/assets/images/ghana.gif"
                alt="Accra Flag"
                width={30}
                height={30}
                className="absolute top-0 left-0 w-auto"
              />
            </div>
          </span>{" "}
          <span>-</span> <span className="font-bold">Version 1.1.0</span>
        </div>
      </div>
    </footer>
  );
};

export default SimpleFooter;
