import { Context, createContext } from "react";
import { IAuthContext } from "./IAuthContext";

export const AuthContext: Context<IAuthContext> = createContext(
  {} as IAuthContext
);
