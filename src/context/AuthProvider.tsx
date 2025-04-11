import { useState, useEffect, ReactNode } from "react";
import HttpStatusCode from "http-status-codes";

import { login as LoginAPI, logout as LogoutAPI } from "@api/auth";
import { ApiError } from "@api/ApiError";

import { LoginDTO } from "@Types/LoginDTO";
import { User } from "@Types/User";
import { ILogin } from "./ILogin";
import { IAuthContext } from "./IAuthContext";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Check if user is logged in on first render
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  console.log("Loaded user: ", user);

  const login = async (user: LoginDTO): Promise<ILogin> => {
    try {
      const response = await LoginAPI(user);

      if (response.status != HttpStatusCode.OK) {
        return { success: false, error: (response.data as ApiError).message };
      }

      localStorage.setItem("user", JSON.stringify(response.data));
      setUser(response.data as User);

      return { success: true, error: "" } as ILogin;
    } catch (error) {
      if (error instanceof Error)
        return { success: false, error: error.message };
      return { success: false, error: "unknown error" };
    }
  };

  const logout = async () => {
    const response = await LogoutAPI();
    if (response.status == HttpStatusCode.OK) {
      localStorage.removeItem("user");
    }
  };

  // Check if user is admin
  const isAdmin = () => {
    return user ? user.admin : false;
  };

  const value: IAuthContext = {
    user: user,
    loading: loading,
    login: login,
    logout: logout,
    isAdmin: isAdmin,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
