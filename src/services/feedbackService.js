import { apiClient, buildAuthConfig } from "./apiClient";

export const submitFeedback = async ({ message, contactEmail, token = "", email = "" }) => {
  const response = await apiClient.post(
    "/feedback",
    {
      type: "general",
      message,
      contact_email: contactEmail
    },
    buildAuthConfig({
      token,
      email,
      includeEmail: Boolean(email),
      headers: { "Content-Type": "application/json" }
    })
  );
  return response.data;
};
