import apiClient from "./api";
import { UserDTO } from "@Types/UserDTO";

async function login(user: UserDTO) {
  const loginEndpoint = "/login";
  return apiClient.post(loginEndpoint, user);
}

export default login;
