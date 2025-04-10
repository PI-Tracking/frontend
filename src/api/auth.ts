import apiClient from "./api";
import { LoginDTO } from "@Types/LoginDTO";

async function login(user: LoginDTO) {
  /**
   * POST /login
   * Return:
   *    SUCCESS
   *     { data: User; status: OK }
   *
   *    FAILURE
   *     status: BAD_REQUEST | UNAUTHORIZED | FORBIDDEN
   */

  const loginEndpoint = "/login";
  return apiClient.post(loginEndpoint, user);
}

async function logout() {
  /**
   * POST /logout
   * Return:
   *    SUCCESS
   *     { status: OK }
   *
   *    FAILURE
   *     status: BAD_REQUEST | UNAUTHORIZED | FORBIDDEN
   */

  const loginEndpoint = "/logout";
  return apiClient.post(loginEndpoint);
}

export { login, logout };
