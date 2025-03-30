import axios from "axios";

const IP: string = "localhost";
const PORT: string = "8080";
const BASE_API_PATH: string = "api";

const apiClient = axios.create({
  baseURL: `http://${IP}:${PORT}/${BASE_API_PATH}`,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
