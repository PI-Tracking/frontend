import { User } from "@Types/User";
import apiClient from "./api";
import { AxiosResponse } from "axios";
import { CreateUserDTO, NewUserInfo } from "@Types/CreateUserDTO";
import { UUID } from "@Types/Base";

const baseEndpoint = "/users";

export async function getAllUsers(): Promise<AxiosResponse<User[]>> {
  /**
   * GET /users
   * Return:
   *    SUCCESS
   *     { data: User[]; status: OK }
   *
   *    FAILURE
   *     status: BAD_REQUEST | UNAUTHORIZED | FORBIDDEN
   */

  const endpoint = baseEndpoint;
  return apiClient.get(endpoint);
}

export async function createNewAccount(
  accountData: CreateUserDTO
): Promise<AxiosResponse<NewUserInfo>> {
  /**
   * POST /users
   * Return:
   *    SUCCESS
   *     { data: NewUserInfo, status: OK }
   *
   *    FAILURE
   *     status: BAD_REQUEST | UNAUTHORIZED | FORBIDDEN | METHOD_NOT_ALLOWED(?)
   */

  const endpoint = baseEndpoint;
  return apiClient.post(endpoint, accountData);
}

export async function getUser(badgeId: UUID): Promise<AxiosResponse<User>> {
  /**
   * GET /users/{badgeId}
   * Return:
   *    SUCCESS
   *     { data: User, status: OK }
   *
   *    FAILURE
   *     status: BAD_REQUEST | UNAUTHORIZED | FORBIDDEN
   */

  const endpoint = `${baseEndpoint}/${badgeId}`;
  return apiClient.get(endpoint);
}

export async function toggleAccount(badgeId: UUID): Promise<AxiosResponse> {
  /**
   * PATCH /users/{badgeId}/toggle-active
   * Return:
   *    SUCCESS
   *     { status: OK }
   *
   *    FAILURE
   *     status: BAD_REQUEST | UNAUTHORIZED | FORBIDDEN
   */

  const endpoint = `${baseEndpoint}/${badgeId}/toggle-active`;
  return apiClient.patch(endpoint);
}
