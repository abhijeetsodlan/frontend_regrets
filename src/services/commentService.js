import { apiClient, buildAuthConfig } from "./apiClient";

export const getCommentsByQuestion = async (questionId, { token = "", email = "" } = {}) => {
  const response = await apiClient.get(
    `/comments/${questionId}`,
    buildAuthConfig({ token, email, includeEmail: Boolean(email) })
  );
  return response.data;
};

export const createComment = async ({ title, questionId, isAnonymous = true, token = "", email = "" }) => {
  const response = await apiClient.post(
    "/comment",
    {
      title,
      question_id: questionId,
      is_anonymous: isAnonymous ? 1 : 0,
      email
    },
    buildAuthConfig({ token, headers: { "Content-Type": "application/json" } })
  );

  return response.data;
};
