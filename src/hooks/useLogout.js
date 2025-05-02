import { useRouter } from "next/router";
import Cookies from "js-cookie";

const useLogout = () => {
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    Cookies.remove("token", { path: "/" });
    router.push("/");
  };

  return logout;
};

export default useLogout;
