import axios, { AxiosError } from "axios";
import { ApiError } from "./ApiError";

const IP: string = "localhost";
const PORT: string = "8080";
const BASE_API_PATH: string = "api";
const API_VERSION: string = "v1";

const apiClient = axios.create({
  baseURL: `http://${IP}:${PORT}/${BASE_API_PATH}/${API_VERSION}`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error instanceof AxiosError) {
      return Promise.reject({
        status: error.status,
        error: error.response ? error.response.data.message : error.message,
      } as unknown as ApiError);
    }
  }
);
export default apiClient;
