import { useContext } from "react";
import { AuthContext } from "@context/AuthContext";

// Custom hook that shorthands the context
export const useAuth = () => {
  return useContext(AuthContext);
};
