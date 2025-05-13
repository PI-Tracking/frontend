import { LoginDTO } from "@Types/LoginDTO";
import { User } from "@Types/User";
import { ILogin } from "./ILogin";
import { ResetDTO } from "@Types/ResetDTO";
import { IResetPassword } from "./IResetPassword";

export interface IAuthContext {
  login: (user: LoginDTO) => Promise<ILogin>;
  logout: () => void;
  resetPassword: (dto: ResetDTO) => Promise<IResetPassword>;
  user: User | null;
  loading: boolean;
  isAdmin: () => boolean;
  isAuthenticated: boolean;
}
