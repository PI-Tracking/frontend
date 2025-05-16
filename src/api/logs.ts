import apiClient from "./api";
import { AxiosResponse } from "axios";
import { Log } from "@Types/Log";

const baseEndpoint = "/userlogs";

async function getAllLogs(): Promise<AxiosResponse<Log[]>> {
  /**
   * GET /userlogs
   * Return:
   *    SUCCESS
   *     { data: Log[]; status: OK }
   *
   *    FAILURE
   *     status: BAD_REQUEST | UNAUTHORIZED | FORBIDDEN
   */

  const endpoint = baseEndpoint;
  return apiClient.get(endpoint);
}

async function getUserLogs(userBadge: string): Promise<AxiosResponse<Log[]>> {
  /**
   * GET /userlogs
   * Return:
   *    SUCCESS
   *     { data: Log[]; status: OK }
   *
   *    FAILURE
   *     status: BAD_REQUEST | UNAUTHORIZED | FORBIDDEN
   */

  const endpoint = baseEndpoint + "/user/" + { userBadge };
  return apiClient.get(endpoint);
}

export { getAllLogs, getUserLogs };
