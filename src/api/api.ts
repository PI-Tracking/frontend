import axios from "axios";

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

export default apiClient;
