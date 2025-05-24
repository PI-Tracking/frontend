import apiClient from "./api";
import { AxiosResponse } from "axios";
import { ApiError } from "./ApiError";
import { UUID } from "@Types/Base";

const baseEndpoint = "/analysis/face-detection";

interface FaceDetectionResponse {
  faceDetected: boolean;
}

/**
 * POST /face-detection/detect
 * Detects if a face from reference image exists in the video
 * Return:
 *    SUCCESS
 *     { data: { faceDetected: boolean }; status: OK }
 *
 *    FAILURE
 *     status: BAD_REQUEST | UNAUTHORIZED | FORBIDDEN
 */
async function detectFaceInVideo(
  reportId: UUID,
  referenceImage: File
): Promise<AxiosResponse<FaceDetectionResponse | ApiError>> {
  const formData = new FormData();
  formData.append("faceImage", referenceImage);

  const endpoint = `${baseEndpoint}/${reportId}`;
  return apiClient.post(endpoint, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export { detectFaceInVideo, type FaceDetectionResponse };
