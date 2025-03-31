import apiClient from "./api";
import { LoginDTO } from "@Types/LoginDTO";

export async function login(user: LoginDTO) {
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

export async function logout() {
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
