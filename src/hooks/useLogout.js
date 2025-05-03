import { useContext } from "react";
import { AuthContext } from "@/context/authContext";

const useLogout = () => {
  const { logout } = useContext(AuthContext);
  return logout;
};

export default useLogout;
