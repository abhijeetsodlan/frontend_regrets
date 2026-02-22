import axios from "axios";
import { API_BASE_URL } from "./config";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: "application/json"
  }
});

export const getAuthToken = () => localStorage.getItem("auth_token") || "";
export const getStoredEmail = () => localStorage.getItem("useremail") || "";

export const buildAuthConfig = ({
  token = getAuthToken(),
  email = getStoredEmail(),
  includeEmail = false,
  params = {},
  headers = {}
} = {}) => {
  const config = {
    headers: {
      ...headers
    },
    params: {
      ...params
    }
  };

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (includeEmail && email) {
    config.params.email = email;
  }

  return config;
};
