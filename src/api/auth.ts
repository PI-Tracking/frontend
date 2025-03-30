import apiClient from "./api";
import { LoginDTO } from "@Types/LoginDTO";

async function login(user: LoginDTO) {
  const loginEndpoint = "/login";
  return apiClient.post(loginEndpoint, user);
}

export default login;
