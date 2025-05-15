import { useState, useEffect, ReactNode } from "react";

import {
  getCurrentUser,
  login as LoginAPI,
  logout as LogoutAPI,
  resetPassword as ResetAPI,
} from "@api/auth";
import { ApiError } from "@api/ApiError";

import { LoginDTO } from "@Types/LoginDTO";
import { User } from "@Types/User";
import { ILogin } from "./ILogin";
import { IAuthContext } from "./IAuthContext";
import { AuthContext } from "./AuthContext";
import { AxiosError } from "axios";
import { ResetDTO } from "@Types/ResetDTO";
import { IResetPassword } from "./IResetPassword";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const login = async (user: LoginDTO): Promise<ILogin> => {
    try {
      const response = await LoginAPI(user);
      if (response.status !== 200) {
        return { success: false, error: (response.data as ApiError).message };
      }

      setUser(response.data as User);
      const userData = response.data as User;
      return { success: true, error: "", admin: userData.admin } as ILogin;
    } catch (error) {
      if (error instanceof AxiosError) {
        return {
          success: false,
          error: error.response
            ? error.response.data.message
            : "Something went wrong",
        };
      }
      return {
        success: false,
        // @ts-expect-error: 18046
        error: error.message ? error.message : "Something went wrong",
      };
    }
  };

  const logout = async () => {
    await LogoutAPI(); // BE autoclears cookies
  };

  const resetPassword = async (
    resetPassword: ResetDTO
  ): Promise<IResetPassword> => {
    try {
      const response = await ResetAPI(resetPassword);
      if (response.status !== 200) {
        return { success: "", error: (response.data as ApiError).message };
      }

      return { success: response.data, error: "" } as IResetPassword;
    } catch (error) {
      if (error instanceof AxiosError) {
        return {
          success: "",
          error: error.response
            ? error.response.data.message
            : "Something went wrong",
        };
      }
      return {
        success: "",
        // @ts-expect-error: 18046
        error: error.message ? error.message : "Something went wrong",
      };
    }
  };

  // Check if user is admin
  const isAdmin = () => {
    return user ? user.admin : false;
  };

  // Check if user is logged in on first render
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getCurrentUser();
        setUser(response.data);
      } catch (error) {
        if (error instanceof AxiosError) setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const value: IAuthContext = {
    user: user,
    loading: loading,
    login: login,
    logout: logout,
    resetPassword: resetPassword,
    isAdmin: isAdmin,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
