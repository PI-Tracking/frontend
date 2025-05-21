import { UUID } from "@Types/Base";
import apiClient from "./api";
import { AxiosResponse } from "axios";
import SelectedSuspectDTO from "@Types/SelectedSuspectDTO";
import { ApiError } from "./ApiError";
import { CameraTimeIntervalDTO } from "@Types/CameraTimeIntervalDTO";

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

/**
 * POST /analysis/{reportId}
 * Return:
 *    SUCCESS
 *     { data: analysisId; status: OK }
 *
 *    FAILURE
 *     status: BAD_REQUEST | UNAUTHORIZED | FORBIDDEN
 */
async function requestReanalysis(
  reportId: UUID,
  selectedSuspect?: SelectedSuspectDTO,
  faceImage?: File
): Promise<AxiosResponse<{ analysisId: string } | ApiError>> {
  const endpoint = `${baseEndpoint}/${reportId}`;
  const formData = new FormData();
    
  if (selectedSuspect) {
    formData.append("selectedSuspect", JSON.stringify(selectedSuspect));
  }

  if (faceImage) {
    formData.append("faceImage", faceImage);
  }

  return apiClient.post(endpoint, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
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

async function getAnalysisDetections(
  analysisId: UUID
): Promise<AxiosResponse<CameraTimeIntervalDTO[] | ApiError>> {
  /**
   * GET /analysis/live/{analysisId}
   * Return:
   *    SUCCESS
   *     { data: CameraTimeIntervalDTO[]; status: OK }
   *
   *    FAILURE
   *     status: BAD_REQUEST | UNAUTHORIZED | FORBIDDEN | NOT_FOUND
   */
  const endpoint = `${baseEndpoint}/${analysisId}/timestamps`;
  return apiClient.get(endpoint);
}

export {
  requestNewAnalysis,
  requestReanalysis,
  stopAnalysis,
  getAnalysisDetections,
};
