import { User } from "@Types/User";
import apiClient from "./api";

async function login(user: User) {
  const loginEndpoint = "/login";
  return apiClient.post(loginEndpoint, user);
}

export default login;
