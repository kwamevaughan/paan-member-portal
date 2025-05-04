import { useState, useEffect } from "react";

const useSidebar = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(null); // Initial state is null
  const [isLoading, setIsLoading] = useState(true); // Loading state

  const getInitialSidebarState = () => {
    if (typeof window === "undefined") return false; // SSR default
    const savedState = localStorage.getItem("sidebarOpen");
    return savedState !== null
      ? JSON.parse(savedState)
      : window.innerWidth > 768;
  };

  useEffect(() => {
    // Initialize sidebar state
    const initialState = getInitialSidebarState();
    setSidebarOpen(initialState);
    setIsLoading(false); // Once the state is set, stop loading
  }, []);

  useEffect(() => {
    if (isSidebarOpen !== null) {
      // Sync state with localStorage and apply body class only when `isSidebarOpen` is set
      localStorage.setItem("sidebarOpen", JSON.stringify(isSidebarOpen));
      if (typeof window !== "undefined") {
        document.body.classList.toggle("sidebar-open", isSidebarOpen);
        document.body.classList.toggle("sidebar-closed", !isSidebarOpen);
      }
    }
  }, [isSidebarOpen]);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return { isSidebarOpen, toggleSidebar, isLoading }; // Return loading state
};

export default useSidebar;
