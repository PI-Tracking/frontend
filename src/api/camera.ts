import apiClient from "./api";
import Camera from "@Types/Camera";
import CameraDTO from "@Types/CameraDTO";
import { UUID } from "@Types/Base";
import { AxiosResponse } from "axios";

const baseEndpoint = "/cameras";

async function getAllCameras(): Promise<AxiosResponse<Camera[]>> {
  /**
   * Return:
   *     { data: Array[Camera]; status: OK }
   */

  const endpoint = baseEndpoint;
  return apiClient.get(endpoint);
}

async function addNewCamera(camera: CameraDTO): Promise<AxiosResponse<Camera>> {
  /**
   * Return:
   *     SUCCESS: { data: Camera; status: OK }
   *     FAILURE: { status: ? }
   */
  const endpoint = baseEndpoint;

  return apiClient.post(endpoint, camera);
}

async function getCameraInfo(id: UUID): Promise<AxiosResponse<Camera>> {
  /**
   * Return:
   *     SUCCESS: { data: Camera; status: OK }
   *     FAILURE: { status: NOT_FOUND }
   */

  const endpoint = `/${id}`;

  return apiClient.get(endpoint);
}

async function toggleCamera(id: UUID): Promise<AxiosResponse> {
  /**
   * Return Status:
   *     SUCCESS: { status: NO_CONTENT }
   *     FAILURE: { status: NOT_FOUND }
   */

  const endpoint = `/${id}/toggle-active`;

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

async function updateCamera(updatedCamera: Camera): Promise<AxiosResponse> {
  const endpoint = baseEndpoint;
  return apiClient.put(endpoint, updatedCamera);
}

export {
  getAllCameras,
  addNewCamera,
  getCameraInfo,
  toggleCamera,
  subscribeToCamera,
  updateCamera,
};
