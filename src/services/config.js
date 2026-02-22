const normalizeBase = (value) => String(value || "").replace(/\/+$/, "");

const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";
const configuredAuthBaseUrl = import.meta.env.VITE_AUTH_BASE_URL || "http://localhost:3000";

export const API_BASE_URL = normalizeBase(configuredApiBaseUrl);
export const AUTH_BASE_URL = normalizeBase(configuredAuthBaseUrl);

export const buildWsUrl = (path = "/ws", query = {}) => {
  const authUrl = new URL(AUTH_BASE_URL);
  const protocol = authUrl.protocol === "https:" ? "wss:" : "ws:";
  const wsUrl = new URL(path, `${protocol}//${authUrl.host}`);
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      wsUrl.searchParams.set(key, String(value));
    }
  });
  return wsUrl.toString();
};

export const googleAuthUrl = `${AUTH_BASE_URL}/auth/google`;
export const csrfCookieUrl = `${AUTH_BASE_URL}/sanctum/csrf-cookie`;
