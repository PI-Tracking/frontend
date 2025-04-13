import { UUID } from "@Types/Base";
import apiClient from "./api";
import { AxiosResponse } from "axios";
import SelectedSuspectDTO from "@Types/SelectedSuspectDTO";

const baseEndpoint = "/analysis";

async function requestNewAnalysis(
  camerasId: string[]
): Promise<AxiosResponse<string>> {
  /**
   * GET /analysis/live
   * Return:
   *    SUCCESS
   *     { data: string[]; status: OK }
   *     string[] is an array of UUID to be used in MinIO file upload
   *
   *    FAILURE
   *     status: BAD_REQUEST | UNAUTHORIZED | FORBIDDEN
   */

  const endpoint = `${baseEndpoint}/live/camerasId=${camerasId.join(",")}`;
  return apiClient.get(endpoint);
}

async function requestReanalysis(
  reportId: UUID,
  selectedSuspect?: SelectedSuspectDTO
): Promise<AxiosResponse<string>> {
  /**
   * POST /analysis/{reportId}
   * Return:
   *    SUCCESS
   *     { data: string[]; status: OK }
   *     string[] is an array of UUID of the new analysis (idk why its a fkn list)
   *
   *    FAILURE
   *     status: BAD_REQUEST | UNAUTHORIZED | FORBIDDEN
   */
  const endpoint = `${baseEndpoint}/${reportId}`;
  return apiClient.post(endpoint, selectedSuspect);
}

async function stopAnalysis(analysisId: UUID): Promise<AxiosResponse> {
  /**
   * POST /analysis/live/{analysisId}
   * Return:
   *    SUCCESS
   *     { status: OK }
   *
   *    FAILURE
   *     status: BAD_REQUEST | UNAUTHORIZED | FORBIDDEN
   */
  const endpoint = `${baseEndpoint}/live/${analysisId}`;
  return apiClient.post(endpoint);
}

export { requestNewAnalysis, requestReanalysis, stopAnalysis };
