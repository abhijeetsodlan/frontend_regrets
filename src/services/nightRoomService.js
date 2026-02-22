import { apiClient, buildAuthConfig } from "./apiClient";

function withNightRoomSession(config = {}, sessionId = "") {
  const params = {
    ...(config.params || {})
  };

  if (sessionId) {
    params.session_id = sessionId;
  }

  return {
    ...config,
    params
  };
}

export const getNightRoomStatus = async ({ token = "", sessionId = "" } = {}) => {
  const response = await apiClient.get(
    "/night-room/status",
    withNightRoomSession(buildAuthConfig({ token }), sessionId)
  );
  return response.data;
};

export const enterNightRoom = async ({ token = "", sessionId = "" } = {}) => {
  const response = await apiClient.post(
    "/night-room/presence/enter",
    {},
    withNightRoomSession(buildAuthConfig({ token }), sessionId)
  );
  return response.data;
};

export const heartbeatNightRoom = async ({ token = "", sessionId = "" } = {}) => {
  const response = await apiClient.post(
    "/night-room/presence/heartbeat",
    {},
    withNightRoomSession(buildAuthConfig({ token }), sessionId)
  );
  return response.data;
};

export const leaveNightRoom = async ({ token = "", sessionId = "" } = {}) => {
  const response = await apiClient.post(
    "/night-room/presence/leave",
    {},
    withNightRoomSession(buildAuthConfig({ token }), sessionId)
  );
  return response.data;
};

export const listNightRoomPosts = async ({ token = "", sessionId = "" } = {}) => {
  const response = await apiClient.get(
    "/night-room/posts",
    withNightRoomSession(buildAuthConfig({ token }), sessionId)
  );
  return response.data;
};

export const createNightRoomPost = async ({ title, isAnonymous = true, token = "" } = {}) => {
  const response = await apiClient.post(
    "/night-room/posts",
    {
      title,
      is_anonymous: isAnonymous ? 1 : 0
    },
    buildAuthConfig({ token, headers: { "Content-Type": "application/json" } })
  );
  return response.data;
};

export const toggleNightRoomLike = async (postId, { token = "" } = {}) => {
  const response = await apiClient.post(
    `/night-room/posts/${postId}/like`,
    {},
    buildAuthConfig({ token, headers: { "Content-Type": "application/json" } })
  );
  return response.data;
};

export const listNightRoomReplies = async (postId, { token = "" } = {}) => {
  const response = await apiClient.get(`/night-room/posts/${postId}/replies`, buildAuthConfig({ token }));
  return response.data;
};

export const getNightRoomPost = async (postId, { token = "", sessionId = "" } = {}) => {
  const response = await apiClient.get(
    `/night-room/posts/${postId}`,
    withNightRoomSession(buildAuthConfig({ token }), sessionId)
  );
  return response.data;
};

export const createNightRoomReply = async (postId, { title, isAnonymous = true, token = "" } = {}) => {
  const response = await apiClient.post(
    `/night-room/posts/${postId}/replies`,
    {
      title,
      is_anonymous: isAnonymous ? 1 : 0
    },
    buildAuthConfig({ token, headers: { "Content-Type": "application/json" } })
  );
  return response.data;
};
