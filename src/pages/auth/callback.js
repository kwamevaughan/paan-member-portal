import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabaseClient } from "@/lib/supabase";
import toast from "react-hot-toast";

// Helper function to find user in either candidates or hr_users table
const findUserInTables = async (authUserId) => {
  try {
    // First, try to find user in candidates table
    const { data: candidateData, error: candidateError } = await supabaseClient
      .from("candidates")
      .select(
        "id, primaryContactEmail, primaryContactName, job_type, selected_tier, agencyName, auth_user_id"
      )
      .eq("auth_user_id", authUserId)
      .single();

    if (candidateData && !candidateError) {
      return {
        id: candidateData.id,
        email: candidateData.primaryContactEmail,
        name: candidateData.primaryContactName,
        job_type: candidateData.job_type,
        selected_tier: candidateData.selected_tier,
        agencyName: candidateData.agencyName,
        userType: 'candidate'
      };
    }

    // If not found in candidates, try hr_users table
    const { data: hrUserData, error: hrUserError } = await supabaseClient
      .from("hr_users")
      .select("id, username, name")
      .eq("id", authUserId)
      .single();

    if (hrUserData && !hrUserError) {
      return {
        id: hrUserData.id,
        email: hrUserData.username,
        name: hrUserData.name,
        job_type: "admin",
        selected_tier: "Admin",
        agencyName: null,
        userType: 'hr_user'
      };
    }

    // User not found in either table
    return null;
  } catch (error) {
    console.error("Error finding user in tables:", error);
    return null;
  }
};

export default function AuthCallback() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    async function handleCallback() {
      try {
        console.log("[AuthCallback] Starting callback handling");

        // Handle the auth callback first
        const { data, error } = await supabaseClient.auth.getSession();
        console.log(
          "[AuthCallback] Session:",
          data?.session?.user?.email,
          error?.message
        );

        if (error) {
          console.error("[AuthCallback] Session error:", error);
          throw error;
        }

        if (data.session) {
          console.log("[AuthCallback] Session found:", data.session.user.email);

          // Verify user exists in either candidates or hr_users table
          const authUserId = data.session.user.id;
          const userData = await findUserInTables(authUserId);

          if (!userData) {
            console.error(
              "[AuthCallback] User not found in either table"
            );
            toast.error(
              "No account found for this email. Please ensure your account is activated or contact support.",
              { duration: 4000 }
            );
            await supabaseClient.auth.signOut();
            await router.push("/?auth=error");
            return;
          }

          console.log(
            "[AuthCallback] User data found:",
            userData.email
          );

          // Set localStorage items that AuthContext expects
          localStorage.setItem("paan_member_session", "authenticated");
          localStorage.setItem("user_email", userData.email);

          // Wait a moment for cookies to be properly set by Supabase
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // Check if cookies are properly set
          const cookieExists = document.cookie.includes(
            "sb-kswioogssarubigcpzez-auth-token"
          );
          console.log("[AuthCallback] Auth cookie exists:", cookieExists);

          if (!cookieExists) {
            console.warn(
              "[AuthCallback] Auth cookie not found, forcing a refresh"
            );
            // Try to refresh the session to ensure cookies are set
            const { data: refreshData, error: refreshError } =
              await supabaseClient.auth.refreshSession();
            if (refreshData?.session) {
              console.log("[AuthCallback] Session refreshed successfully");
              await new Promise((resolve) => setTimeout(resolve, 500));
            } else {
              console.error(
                "[AuthCallback] Session refresh failed:",
                refreshError
              );
            }
          }

          console.log("[AuthCallback] Redirecting to dashboard");

          // Use window.location instead of router for a full page reload
          // This ensures the server-side props run with fresh cookies
          window.location.href = "/dashboard";
        } else {
          console.error("[AuthCallback] No session found");
          toast.error("Authentication failed. Please try again.", {
            duration: 3000,
          });
          await router.push("/?auth=error");
        }
      } catch (err) {
        console.error("[AuthCallback] Error:", err);
        toast.error("Authentication error. Please try again.", {
          duration: 3000,
        });
        await router.push("/?auth=error");
      } finally {
        setIsProcessing(false);
      }
    }

    // Only run if we're actually on the callback page and router is ready
    if (router.isReady) {
      handleCallback();
    }
  }, [router, router.isReady]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {isProcessing ? "Processing..." : "Authentication Complete"}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isProcessing
              ? "Please wait while we complete your authentication."
              : "You will be redirected shortly."}
          </p>
        </div>
      </div>
    </div>
  );
}
