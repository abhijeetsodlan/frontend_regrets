import { apiClient, buildAuthConfig } from "./apiClient";

export const getNotifications = async ({ token = "", email = "" } = {}) => {
  const response = await apiClient.get(
    "/notifications",
    buildAuthConfig({ token, email, includeEmail: Boolean(email) })
  );
  return response.data;
};

export const markNotificationRead = async (notificationId, { token = "", email = "" } = {}) => {
  const response = await apiClient.post(
    `/notifications/${notificationId}/read`,
    { email },
    buildAuthConfig({ token, headers: { "Content-Type": "application/json" } })
  );
  return response.data;
};

export const clearNotifications = async ({ token = "", email = "" } = {}) => {
  const response = await apiClient.post(
    "/notifications/clear",
    { email },
    buildAuthConfig({ token, headers: { "Content-Type": "application/json" } })
  );
  return response.data;
};

export const markAllNotificationsRead = async ({ token = "", email = "" } = {}) => {
  const response = await apiClient.post(
    "/notifications/read-all",
    { email },
    buildAuthConfig({ token, headers: { "Content-Type": "application/json" } })
  );
  return response.data;
};
