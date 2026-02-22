import axios from "axios";
import { apiClient, buildAuthConfig } from "./apiClient";
import { csrfCookieUrl, googleAuthUrl } from "./config";

export const getGoogleLoginUrl = () => googleAuthUrl;

export const requestCsrfCookie = async () => {
  await axios.get(csrfCookieUrl, { withCredentials: true });
};

export const logoutRequest = async ({ token = "" } = {}) => {
  const response = await apiClient.post(
    "/logout",
    {},
    {
      ...buildAuthConfig({ token, headers: { "Content-Type": "application/json" } }),
      withCredentials: true
    }
  );
  return response.data;
};
