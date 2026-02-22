import { apiClient, buildAuthConfig } from "./apiClient";

const adminConfig = ({ token = "" } = {}) =>
  buildAuthConfig({ token, headers: { "Content-Type": "application/json" } });

export const adminGetUsers = async ({ search = "", email = "", page = 1, limit = 10, token = "" } = {}) => {
  const response = await apiClient.get(
    "/admin/users",
    buildAuthConfig({
      token,
      params: { search, email, page, limit }
    })
  );
  return response.data;
};

export const adminGetQuestions = async ({ search = "", email = "", page = 1, limit = 10, token = "" } = {}) => {
  const response = await apiClient.get(
    "/admin/questions",
    buildAuthConfig({ token, params: { search, email, page, limit } })
  );
  return response.data;
};

export const adminGetFeedbacks = async ({ search = "", email = "", page = 1, limit = 10, token = "" } = {}) => {
  const response = await apiClient.get(
    "/admin/feedbacks",
    buildAuthConfig({ token, params: { search, email, page, limit } })
  );
  return response.data;
};

export const adminDeleteQuestion = async ({ id, email = "", token = "" }) => {
  const response = await apiClient.delete(`/admin/questions/${id}`, {
    ...adminConfig({ token }),
    data: { email }
  });
  return response.data;
};

export const adminDeleteUser = async ({ id, email = "", token = "" }) => {
  const response = await apiClient.delete(`/admin/users/${id}`, {
    ...adminConfig({ token }),
    data: { email }
  });
  return response.data;
};

export const adminGetUserPosts = async ({ userId, email = "", token = "" }) => {
  const response = await apiClient.get(
    `/admin/users/${userId}/posts`,
    buildAuthConfig({ token, params: { email } })
  );
  return response.data;
};

export const adminGetQuestionReplies = async ({ questionId, email = "", token = "" }) => {
  const response = await apiClient.get(
    `/admin/questions/${questionId}/replies`,
    buildAuthConfig({ token, params: { email } })
  );
  return response.data;
};

export const adminSendNotification = async ({ message, sendToAll, userIds = [], email = "", token = "" }) => {
  const response = await apiClient.post(
    "/admin/notify",
    {
      message,
      send_to_all: sendToAll,
      user_ids: userIds,
      email
    },
    adminConfig({ token })
  );
  return response.data;
};

export const adminCreateStoryType = async ({ name, email = "", token = "" }) => {
  const response = await apiClient.post(
    "/categories",
    { name, email },
    adminConfig({ token })
  );
  return response.data;
};

export const adminGetStoryTypes = async ({ token = "" } = {}) => {
  const response = await apiClient.get("/categories", buildAuthConfig({ token }));
  return response.data;
};
