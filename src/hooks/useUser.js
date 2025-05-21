import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
import LoadingSpinner from "@/components/LoadingSpinner";

export const useUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      if (!isMounted) return;
      console.log("useUser: Checking session, current route:", router.pathname);

      try {
        const { data: session } = await supabase.auth.getSession();
        const email = session?.session?.user?.email;

        if (session?.session && email) {
          console.log("useUser: Session found, fetching user data for:", email);
          const { data, error } = await supabase
            .from("candidates")
            .select(
              "id, primaryContactEmail, primaryContactName, job_type, selected_tier, agencyName"
            )
            .eq("primaryContactEmail", email)
            .single();

          console.log("useUser: Query response:", { data, error });

          if (data && !error && isMounted) {
            console.log("useUser: User data fetched:", data);
            setUser({
              id: data.id,
              email: data.primaryContactEmail,
              name: data.primaryContactName,
              job_type: data.job_type,
              selected_tier: data.selected_tier,
              agencyName: data.agencyName,
            });
            localStorage.setItem("paan_member_session", "authenticated");
            localStorage.setItem("user_email", email);
          } else {
            console.error(
              "useUser: Error fetching user:",
              error?.message,
              "data:",
              data
            );
            if (isMounted) {
              setUser(null);
              await supabase.auth.signOut();
              localStorage.removeItem("paan_member_session");
              localStorage.removeItem("user_email");
              if (router.pathname !== "/") {
                console.log("useUser: Invalid session, redirecting to /");
                toast.error("Session invalid. Please log in again.");
                router.replace("/");
              }
            }
          }
        } else {
          console.log("useUser: No session or email, session:", session);
          if (isMounted && router.pathname !== "/") {
            console.log("useUser: Redirecting to /");
            toast.error("No active session. Please log in.");
            router.replace("/");
          }
        }
      } catch (err) {
        console.error("useUser: Unexpected error:", err);
        if (isMounted) {
          setUser(null);
          await supabase.auth.signOut();
          localStorage.removeItem("paan_member_session");
          localStorage.removeItem("user_email");
          if (router.pathname !== "/") {
            console.log("useUser: Unexpected error, redirecting to /");
            toast.error("An error occurred. Please log in again.");
            router.replace("/");
          }
        }
      }
      if (isMounted) setLoading(false);
    };

    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("useUser: Auth state changed:", event, session);
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
          localStorage.setItem("paan_member_session", "authenticated");
          localStorage.setItem("user_email", session.user.email);
          checkSession();
        }
      }
    );

    return () => {
      isMounted = false;
      authListener.subscription?.unsubscribe();
    };
  }, [router]);

  return {
    user,
    loading,
    LoadingComponent: <LoadingSpinner />,
  };
};
