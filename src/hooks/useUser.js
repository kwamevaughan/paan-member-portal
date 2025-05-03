import { useContext } from "react";
import { AuthContext } from "@/context/authContext";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

export const useUser = () => {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();

  if (!user && !loading) {
    toast.error("Please log in to access this page");
    router.push("/");
  }

  return { user, loading };
};
