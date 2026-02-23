import axios from "axios";
import { apiClient, buildAuthConfig } from "./apiClient";
import { csrfCookieUrl, googleAuthUrl } from "./config";

export const getGoogleLoginUrl = () => {
  if (typeof window === "undefined" || !window.location?.origin) {
    return googleAuthUrl;
  }

  const url = new URL(googleAuthUrl);
  url.searchParams.set("redirect", window.location.origin);
  return url.toString();
};

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
