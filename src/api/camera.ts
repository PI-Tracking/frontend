import apiClient from "./api";
import Camera from "@Types/Camera";
import CameraDTO from "@Types/CameraDTO";
import { UUID } from "@Types/Base";
import { AxiosResponse } from "axios";

const baseEndpoint = "/cameras";

async function getAllCameras(): Promise<AxiosResponse<Camera[]>> {
  /**
   * GET /cameras
   * Return:
   *    SUCCESS
   *     { data: Camera[]; statuids: OK }
   *
   *    FAILURE
   *     status: BAD_REQUEST | UNAUTHORIZED | FORBIDDEN
   */

  const endpoint = baseEndpoint;
  return apiClient.get(endpoint);
}

async function addNewCamera(camera: CameraDTO): Promise<AxiosResponse<Camera>> {
  /**
   * POST /cameras
   * Return:
   *     SUCCESS
   *      { data: Camera; status: OK }
   *     FAILURE
   *      status: BAD_REQUEST | UNAUTHORIZED | FORBIDDEN
   */
  const endpoint = baseEndpoint;

  return apiClient.post(endpoint, camera);
}

async function getCameraInfo(id: UUID): Promise<AxiosResponse<Camera>> {
  /**
   * GET /cameras/<id>
   * Return:
   *     SUCCESS
   *      { data: Camera; status: OK }
   *     FAILURE
   *      Unexistent Camera
   *        status: NOT_FOUND
   *      Other:
   *        status: BAD_REQUEST | UNAUTHORIZED | FORBIDDEN
   */

  const endpoint = `${baseEndpoint}/${id}`;

  return apiClient.get(endpoint);
}

async function updateCamera(
  cameraId: UUID,
  updatedCamera: CameraDTO
): Promise<AxiosResponse<Camera>> {
  /**
   * PUT /cameras/<id>
   * Return:
   *     SUCCESS
   *      { data: Camera; status: OK }
   *     FAILURE
   *      Unexistent Camera
   *        status: NOT_FOUND
   *      Other:
   *        status: BAD_REQUEST | UNAUTHORIZED | FORBIDDEN
   */
  const endpoint = `${baseEndpoint}/${cameraId}`;
  return apiClient.put(endpoint, updatedCamera);
}

async function toggleCamera(id: UUID): Promise<AxiosResponse> {
  /**
   * PATCH /cameras/<id>/toggle-active
   * Return Status:
   *     SUCCESS
   *      { status: OK }
   *     FAILURE
   *      status: BAD_REQUEST | UNAUTHORIZED | FORBIDDEN
   */

  const endpoint = `${baseEndpoint}/${id}/toggle-active`;

  return apiClient.patch(endpoint);
}

async function subscribeToCamera(id: UUID) {
  /**
   * Return Status:
   *     SUCCESS: { status: OK }
   *     FAILURE: { status: NOT_FOUND }
   */

  //const endpoint = ``;
  //apiClient.post(endpoint,)
  console.log(id);

  return {
    status: 501,
  };
}

export {
  getAllCameras,
  addNewCamera,
  getCameraInfo,
  toggleCamera,
  subscribeToCamera,
  updateCamera,
};
