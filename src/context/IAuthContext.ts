import { LoginDTO } from "@Types/LoginDTO";
import { User } from "@Types/User";
import { ILogin } from "./ILogin";

export interface IAuthContext {
  login: (user: LoginDTO) => Promise<ILogin>;
  logout: () => void;
  user: User | null;
  loading: boolean;
  isAdmin: () => boolean;
  isAuthenticated: boolean;
}
