import { useContext } from "react";
import { AuthContext } from "@/context/authContext";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { Icon } from "@iconify/react";

export const useUser = () => {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();

  if (loading) {
    return {
      user: null,
      loading: true,
      LoadingComponent: (
        <div className="fixed inset-0 flex justify-center items-center bg-white/80 backdrop-blur-sm z-50">
          <div className="flex flex-col items-center">
            <Icon
              icon="mdi:loading"
              width={40}
              height={40}
              className="animate-spin text-[#f05d23]"
            />
            <p className="mt-2 text-2xl font-medium animate-pulse text-[#231812]">
              Loading, please wait...
            </p>
          </div>
        </div>
      ),
    };
  }

  if (!user && !loading) {
    toast.error("Please log in to access this page");
    router.push("/");
    return { user: null, loading: false, LoadingComponent: null };
  }

  return { user, loading: false, LoadingComponent: null };
};
