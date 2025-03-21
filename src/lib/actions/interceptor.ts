import { getRefreshToken } from "../actions/auth";
import { storage } from "../hooks/storage";

async function fetchWithInterceptor(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const accessToken = storage.getItem("accessToken");

  const config: RequestInit = {
    ...init,
    headers: {
      ...init?.headers,
      Authorization: `Bearer ${accessToken}`,
    },
  };

  let response = await fetch(input, config);

  if (response.status === 401) {
    // Token expired, refresh it
    await getRefreshToken();

    // Retry the request with new token
    const newAccessToken = storage.getItem("accessToken");
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${newAccessToken}`,
    };

    response = await fetch(input, config);
  }

  return response;
}

export const spotifyApi = {
  get: async (endpoint: string) => {
    const response = await fetchWithInterceptor(
      `https://api.spotify.com/v1${endpoint}`
    );
    return response.json();
  },

  post: async (endpoint: string, body?: unknown) => {
    const response = await fetchWithInterceptor(
      `https://api.spotify.com/v1${endpoint}`,
      {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.json();
  },

  // Add other methods as needed
};
