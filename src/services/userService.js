import { apiClient, buildAuthConfig } from "./apiClient";

export const getMyProfile = async ({ token = "", email = "" } = {}) => {
  const response = await apiClient.post(
    "/myprofile",
    { email },
    buildAuthConfig({ token, headers: { "Content-Type": "application/json" } })
  );
  return response.data;
};

export const getMe = async ({ token = "", email = "" } = {}) => {
  const response = await apiClient.get("/me", buildAuthConfig({ token, email, includeEmail: Boolean(email) }));
  return response.data;
};

export const updateMe = async ({ name, token = "", email = "" }) => {
  const response = await apiClient.patch(
    "/me",
    { name, email },
    buildAuthConfig({ token, headers: { "Content-Type": "application/json" } })
  );
  return response.data;
};

export const updateAvatar = async ({ avatar, token = "", email = "" }) => {
  const response = await apiClient.patch(
    "/me/avatar",
    { avatar, email },
    buildAuthConfig({ token, headers: { "Content-Type": "application/json" } })
  );
  return response.data;
};
