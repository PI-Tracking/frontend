import apiClient from "./api";
import { AxiosResponse } from "axios";
import { ApiError } from "./ApiError";
import { UUID } from "@Types/Base";

const baseEndpoint = "/analysis/face-detection";

interface FaceValidationResponse {
  hasFace: boolean;
  faceCount: number;
}

interface FaceDetectionResponse {
  faceDetected: boolean;
}

/**
 * POST /face-detection/validate
 * Validates if an image contains a face
 * Return:
 *    SUCCESS
 *     { data: { hasFace: boolean, faceCount: number }; status: OK }
 *
 *    FAILURE
 *     status: BAD_REQUEST | UNAUTHORIZED | FORBIDDEN
 */
async function validateFace(
  image: File
): Promise<AxiosResponse<FaceValidationResponse | ApiError>> {
  const formData = new FormData();
  formData.append("image", image);

  const endpoint = `${baseEndpoint}/validate`;
  return apiClient.post(endpoint, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
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

export {
  validateFace,
  detectFaceInVideo,
  type FaceValidationResponse,
  type FaceDetectionResponse,
};
