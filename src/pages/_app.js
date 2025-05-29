import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import toast, { Toaster } from "react-hot-toast";
import "../styles/globals.css";
import { sidebarNav } from "@/data/nav";
import { Questrial } from "next/font/google";
import { AuthProvider } from "@/context/authContext";

const questrial = Questrial({
  weight: "400",
  subsets: ["latin"],
});

function MyApp({ Component, pageProps }) {
  const [mode, setMode] = useState("light");
  const router = useRouter();

  const toggleMode = () => {
    const newMode = mode === "light" ? "dark" : "light";
    setMode(newMode);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("mode", newMode);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedMode = window.localStorage.getItem("mode");
    if (savedMode) {
      setMode(savedMode);
    } else {
      const systemMode = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      setMode(systemMode);
      window.localStorage.setItem("mode", systemMode);
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => {
      const systemMode = e.matches ? "dark" : "light";
      if (!window.localStorage.getItem("mode")) {
        setMode(systemMode);
      }
    };
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    const routeChangeStart = (url) => {
      console.log("App: Route change started to:", url);
      const pageSlug = url.split("/").pop() || "overview";
      const navItems = sidebarNav.flatMap((category) => category.items);
      const page = navItems.find(
        (item) => item.href === url || item.href.endsWith(`/${pageSlug}`)
      );
      const pageName = page
        ? page.label
        : pageSlug.charAt(0).toUpperCase() + pageSlug.slice(1);
      toast.loading(`Fetching ${pageName}...`, {
        id: "route-loading",
      });
    };

    const handleRouteChange = (url) => {
      console.log("App: Route change completed to:", url);
      document.body.style.paddingTop = "0px";
    };

    const routeChangeComplete = () => {
      toast.dismiss("route-loading");
    };

    const routeChangeError = (err, url) => {
      console.log("App: Route change error:", err, "URL:", url);
      // Avoid showing error toast for logout redirect to "/"
      if (url === "/") {
        toast.dismiss("route-loading");
      } else {
        toast.error("Failed to load page", { id: "route-loading" });
      }
    };

    router.events.on("routeChangeStart", routeChangeStart);
    router.events.on("routeChangeComplete", handleRouteChange);
    router.events.on("routeChangeError", routeChangeError);

    return () => {
      router.events.off("routeChangeStart", routeChangeStart);
      router.events.off("routeChangeComplete", handleRouteChange);
      router.events.off("routeChangeError", routeChangeError);
    };
  }, [router]);

  const breadcrumbs = (() => {
    const path = router.asPath.split("?")[0];
    const segments = path.split("/").filter((s) => s);
    const crumbs = [{ href: "/", label: "Home" }];

    let currentPath = "";
    const navItems = sidebarNav.flatMap((category) => category.items);

    segments.forEach((segment) => {
      currentPath += `/${segment}`;
      const navItem = navItems.find(
        (item) => item.href === currentPath || item.href.endsWith(`/${segment}`)
      );
      const label = navItem
        ? navItem.label
        : segment.charAt(0).toUpperCase() + segment.slice(1);
      crumbs.push({ href: currentPath, label });
    });

    return crumbs;
  })();

  return (
    <div className={`${mode === "dark" ? "dark" : ""} ${questrial.className}`}>
      <Toaster position="top-center" reverseOrder={false} />
      <AuthProvider>
        <Component
          {...pageProps}
          mode={mode}
          toggleMode={toggleMode}
          breadcrumbs={breadcrumbs}
        />
      </AuthProvider>
    </div>
  );
}

export default MyApp;
