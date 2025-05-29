// pages/auth/callback.js
import { useEffect } from "react";
import { useRouter } from "next/router";

const AuthCallback = () => {
  const router = useRouter();

  useEffect(() => {
    console.log("AuthCallback: OAuth callback page loaded", router.query);
  }, [router.query]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Processing login...</p>
    </div>
  );
};

export default AuthCallback;
