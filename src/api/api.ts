import axios, { AxiosError } from "axios";
import { ApiError } from "./ApiError";

const ADDRESS: string = import.meta.env.VITE_BACKEND_URL ?? "http://localhost";
const PORT: string = import.meta.env.VITE_BACKEND_PORT ?? "8080";
const BASE_API_PATH: string = "api";
const API_VERSION: string = "v1";

const apiClient = axios.create({
  baseURL: `${ADDRESS}:${PORT}/${BASE_API_PATH}/${API_VERSION}`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error instanceof AxiosError) {
      const axiosError = error as AxiosError<ApiError>;
      return Promise.reject(axiosError);
    }

    return Promise.reject(error);
  }
);
export default apiClient;
