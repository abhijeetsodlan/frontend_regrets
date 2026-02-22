import { apiClient, buildAuthConfig } from "./apiClient";

export const getCategories = async ({ token = "", email = "" } = {}) => {
  const response = await apiClient.get("/categories", buildAuthConfig({ token, email, includeEmail: Boolean(email) }));
  return response.data;
};

export const getQuestions = async ({ category = "All", token = "", email = "" } = {}) => {
  const path = category === "All" ? "/questions" : `/questions/category/${category}`;
  const response = await apiClient.get(path, buildAuthConfig({ token, email, includeEmail: Boolean(email) }));
  return response.data;
};

export const likeQuestion = async (questionId, { token = "", email = "" } = {}) => {
  const response = await apiClient.post(
    `/questions/${questionId}/like`,
    {},
    buildAuthConfig({ token, email, includeEmail: Boolean(email) })
  );
  return response.data;
};

export const createQuestion = async ({ title, categoryId, isAnonymous = false, token = "" }) => {
  const payload = {
    title,
    category_id: Number(categoryId)
  };

  if (isAnonymous) {
    payload.is_anonymous = 1;
  }

  const response = await apiClient.post(
    "/question",
    payload,
    buildAuthConfig({ token, headers: { "Content-Type": "application/json" } })
  );

  return response.data;
};

export const getQuestionDetails = async (questionId, { token = "", email = "" } = {}) => {
  const response = await apiClient.get(
    `/questions/${questionId}`,
    buildAuthConfig({ token, email, includeEmail: Boolean(email) })
  );
  return response.data;
};

export const updateQuestion = async (questionId, { title, token = "", email = "" } = {}) => {
  const response = await apiClient.patch(
    `/questions/${questionId}`,
    { title, email },
    buildAuthConfig({ token, headers: { "Content-Type": "application/json" } })
  );
  return response.data;
};

export const saveQuestion = async (questionId, { token = "", email = "" } = {}) => {
  const response = await apiClient.post(
    "/savepost",
    { question_id: questionId },
    buildAuthConfig({ token, email, includeEmail: Boolean(email) })
  );
  return response.data;
};

export const shareQuestion = async (questionId, { token = "", email = "" } = {}) => {
  const response = await apiClient.post(
    `/questions/${questionId}/share`,
    {},
    buildAuthConfig({ token, email, includeEmail: Boolean(email), headers: { "Content-Type": "application/json" } })
  );
  return response.data;
};
