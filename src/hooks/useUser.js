import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
import LoadingSpinner from "@/components/LoadingSpinner";

export const useUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      if (!isMounted) return;

      if (user && user.email) {
        if (process.env.NODE_ENV !== "production") {
          console.log(
            "[useUser] Skipping checkSession, user exists:",
            user.email
          );
        }
        return;
      }

      try {
        const { data: session } = await supabase.auth.getSession();
        const email = session?.session?.user?.email;

        if (session?.session && email) {
          const { data, error } = await supabase
            .from("candidates")
            .select(
              "id, primaryContactEmail, primaryContactName, job_type, selected_tier, agencyName, created_at"
            )
            .eq("primaryContactEmail", email)
            .single();

          if (process.env.NODE_ENV !== "production") {
            console.log(
              "[useUser] Session found, fetching user data for:",
              email
            );
          }

          if (data && !error && isMounted) {
            setUser({
              id: data.id,
              email: data.primaryContactEmail,
              name: data.primaryContactName,
              job_type: data.job_type,
              selected_tier: data.selected_tier,
              agencyName: data.agencyName,
              created_at: data.created_at,
            });
            localStorage.setItem("paan_member_session", "authenticated");
            localStorage.setItem("user_email", email);
          } else {
            if (isMounted) {
              setUser(null);
              await supabase.auth.signOut();
              localStorage.removeItem("paan_member_session");
              localStorage.removeItem("user_email");
              if (router.pathname !== "/") {
                toast.error("Session invalid. Please log in again.");
                router.replace("/");
              }
            }
          }
        } else {
          if (process.env.NODE_ENV !== "production") {
            console.log("[useUser] No session or email, session:", session);
          }
          if (isMounted && router.pathname !== "/") {
            toast.error("No active session. Please log in.");
            router.replace("/");
          }
        }
      } catch (err) {
        if (process.env.NODE_ENV !== "production") {
          console.error("[useUser] Unexpected error:", err);
        }
        if (isMounted) {
          setUser(null);
          await supabase.auth.signOut();
          localStorage.removeItem("paan_member_session");
          localStorage.removeItem("user_email");
          if (router.pathname !== "/") {
            toast.error("An error occurred. Please log in again.");
            router.replace("/");
          }
        }
      }
      if (isMounted) setLoading(false);
    };

    const debouncedCheckSession = debounce(checkSession, 1000);
    debouncedCheckSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (process.env.NODE_ENV !== "production") {
          console.log(
            "[useUser] Auth state changed:",
            event,
            "Session:",
            session
          );
        }

        if (event === "SIGNED_OUT") {
          if (isMounted) {
            setUser(null);
            localStorage.removeItem("paan_member_session");
            localStorage.removeItem("user_email");
            if (router.pathname !== "/") {
              router.replace("/");
            }
          }
        } else if (event === "SIGNED_IN" && session?.user?.email) {
          if (process.env.NODE_ENV !== "production") {
            console.log("[useUser] Signed in, triggering checkSession");
          }
          localStorage.setItem("paan_member_session", "authenticated");
          localStorage.setItem("user_email", session.user.email);
          debouncedCheckSession();
        } else if (event === "TOKEN_REFRESHED") {
          if (process.env.NODE_ENV !== "production") {
            console.log("[useUser] Token refreshed, checking session");
          }
          debouncedCheckSession();
        }
      }
    );

    return () => {
      isMounted = false;
      authListener.subscription?.unsubscribe();
    };
  }, []); // No dependencies

  const memoizedUser = useMemo(() => user, [user]);

  return {
    user: memoizedUser,
    loading,
    LoadingComponent: <LoadingSpinner />,
  };
};
