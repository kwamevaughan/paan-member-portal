import { useEffect, useState } from "react";
import Image from "next/image";
import useSidebar from "@/hooks/useSidebar";

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
      className={`${
        mode === "dark"
          ? "bg-gray-800 border-gray-700"
          : "bg-[#231812] border-[#231812] px-8"
      } mt-10 border-b shadow-lg py-4 md:py-6 flex flex-col items-center sticky top-0 z-10 transition-all duration-300 ${
        sidebarHidden
          ? "md:ml-0"
          : isSidebarOpen
          ? "md:ml-[204px]"
          : "md:ml-[84px]"
      }`}
    >
      <div className="flex w-full justify-between items-center mt-4 text-white">
        <div className="flex flex-col">
          <span className="text-base">
            © {currentYear} Pan-African Agency Network (PAAN). Made with ♡ in
            <span className="relative group">
              <span className="cursor-default"> Nairobi</span>
              <div className="absolute top-[-110%] left-0 w-full h-full bg-transparent opacity-0 transition-all duration-500 ease-in-out group-hover:top-[-150%] group-hover:opacity-100">
                <Image
                  src="/assets/images/kenya.gif"
                  alt="Nairobi Flag"
                  width={30}
                  height={30}
                  className="absolute top-0 left-0"
                />
              </div>
            </span>{" "}
            x{" "}
            <span className="relative group">
              <span className="cursor-default">Accra</span>
              <div className="absolute top-[-110%] left-0 w-full h-full bg-transparent opacity-0 transition-all duration-500 ease-in-out group-hover:top-[-150%] group-hover:opacity-100">
                <Image
                  src="/assets/images/ghana.gif"
                  alt="Accra Flag"
                  width={30}
                  height={30}
                  className="absolute top-0 left-0"
                />
              </div>
            </span>
          </span>
        </div>
        <div className="hidden md:flex flex-col items-end">
          <a
            href="https://paan.africa"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src={
                mode === "dark"
                  ? "/assets/images/logo-tagline-white.svg"
                  : "/assets/images/logo-tagline-white-orange.svg"
              }
              alt="PAAN Logo"
              width={300}
              height={40}
            />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default SimpleFooter;
