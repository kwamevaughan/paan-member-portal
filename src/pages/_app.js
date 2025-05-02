import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import "../styles/globals.css";
import { sidebarNav } from "@/data/nav";
import { Figtree } from "next/font/google";

// Initialize Figtree font with subsets
const figtree = Figtree({
  display: "swap", // Prevent CLS by using font-display: swap
  subsets: ["latin"], // Specify the "latin" subset
});

function MyApp({ Component, pageProps }) {
  const [mode, setMode] = useState("light");
  const router = useRouter();
  const pageNameRef = useRef("Page"); // Default

  // Toggle dark mode and persist in localStorage
  const toggleMode = () => {
    const newMode = mode === "light" ? "dark" : "light";
    setMode(newMode);
    localStorage.setItem("mode", newMode);
  };

  useEffect(() => {
    // Load saved mode or system preference on mount
    const savedMode = localStorage.getItem("mode");
    if (savedMode) {
      setMode(savedMode);
    } else {
      const systemMode = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      setMode(systemMode);
      localStorage.setItem("mode", systemMode);
    }

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => {
      const systemMode = e.matches ? "dark" : "light";
      if (!localStorage.getItem("mode")) {
        setMode(systemMode);
      }
    };
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Handle route change with toast
  useEffect(() => {
    const routeChangeStart = (url) => {
      const pageSlug = url.split("/").pop() || "overview";
      const page = sidebarNav.find(
        (item) => item.href === url || item.href.endsWith(`/${pageSlug}`)
      );
      const pageName = page
        ? page.label
        : pageSlug.charAt(0).toUpperCase() + pageSlug.slice(1);

      pageNameRef.current = pageName; // Save for later
      toast.loading(`Fetching ${pageName}...`, {
        id: "route-loading",
        duration: Infinity,
      });
    };

    const routeChangeComplete = (url) => {
      setTimeout(() => {
        toast.dismiss("route-loading");
        toast.success(`${pageNameRef.current} loaded`, {
          id: "route-success",
          duration: 2000,
        });
      }, 500);
    };

    const routeChangeError = (err, url) => {
      toast.error("Failed to load page", {
        id: "route-loading",
        duration: 3000,
      });
    };

    router.events.on("routeChangeStart", routeChangeStart);
    router.events.on("routeChangeComplete", routeChangeComplete);
    router.events.on("routeChangeError", routeChangeError);

    return () => {
      router.events.off("routeChangeStart", routeChangeStart);
      router.events.off("routeChangeComplete", routeChangeComplete);
      router.events.off("routeChangeError", routeChangeError);
    };
  }, [router]);

  return (
    <div className={`${mode === "dark" ? "dark" : ""} ${figtree.className}`}>
      <Toaster
        position="top-center"
        toastOptions={{
          success: {
            style: {
              background: "#4ade80",
              color: "#fff",
            },
            iconTheme: {
              primary: "#fff",
              secondary: "#4ade80",
            },
          },
          error: {
            style: {
              background: "#f87171",
              color: "#fff",
            },
            iconTheme: {
              primary: "#fff",
              secondary: "#f87171",
            },
          },
        }}
        reverseOrder={false}
      />
      <Component {...pageProps} mode={mode} toggleMode={toggleMode} />
    </div>
  );
}

export default MyApp;
