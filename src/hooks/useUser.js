import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabase";

export const useUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      console.log("useUser: Checking session, current route:", router.pathname);
      const session = localStorage.getItem("paan_member_session");
      const email = localStorage.getItem("user_email");

      if (session === "authenticated" && email) {
        console.log("useUser: Session found, fetching user data for:", email);
        try {
          const { data, error } = await supabase
            .from("candidates")
            .select("primaryContactEmail, primaryContactName, job_type, selected_tier")
            .eq("primaryContactEmail", email)
            .single();

          console.log("useUser: Query response:", { data, error });

          if (data && !error) {
            console.log("useUser: User data fetched:", data);
            setUser({
              email: data.primaryContactEmail,
              name: data.primaryContactName,
              job_type: data.job_type,
              selected_tier: data.selected_tier,
            });
          } else {
            console.error(
              "useUser: Error fetching user:",
              error?.message,
              "data:",
              data
            );
            localStorage.removeItem("paan_member_session");
            localStorage.removeItem("user_email");
            if (router.pathname !== "/") {
              console.log("useUser: Invalid session, redirecting to /");
              router.replace("/");
            }
          }
        } catch (err) {
          console.error("useUser: Unexpected error:", err);
          localStorage.removeItem("paan_member_session");
          localStorage.removeItem("user_email");
          if (router.pathname !== "/") {
            console.log("useUser: Unexpected error, redirecting to /");
            router.replace("/");
          }
        }
      } else {
        console.log(
          "useUser: No session or email, session:",
          session,
          "email:",
          email
        );
        if (router.pathname !== "/") {
          console.log("useUser: Redirecting to /");
          router.replace("/");
        }
      }
      setLoading(false);
    };

    checkSession();
  }, [router.pathname]);

  return {
    user,
    loading,
    LoadingComponent: (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    ),
  };
};
