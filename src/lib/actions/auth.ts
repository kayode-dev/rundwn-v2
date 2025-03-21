import { storage } from "../hooks/storage";

const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || "";
const clientSecret = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET || "";

export async function redirectToAuthCodeFlow() {
  const verifier = generateCodeVerifier(128);
  const challenge = await generateCodeChallenge(verifier);

  storage.setItem("verifier", verifier);

  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("response_type", "code");
  params.append(
    "redirect_uri",
    process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI || ""
  );
  params.append(
    "scope",
    "user-read-private user-follow-read user-top-read user-read-recently-played playlist-read-private playlist-read-collaborative"
  );
  params.append("code_challenge_method", "S256");
  params.append("code_challenge", challenge);

  document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

function generateCodeVerifier(length: number) {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

async function generateCodeChallenge(codeVerifier: string) {
  const data = new TextEncoder().encode(codeVerifier);
  const digest = await window.crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export async function getAccessToken(code: string) {
  const verifier = storage.getItem("verifier");

  const params = new URLSearchParams();
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append(
    "redirect_uri",
    process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI || ""
  );
  params.append("code_verifier", verifier!);
  const result = await fetch(`https://accounts.spotify.com/api/token?`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(clientId + ":" + clientSecret).toString("base64"),
    },

    body: params,
  });
  if (result.ok) {
    const { access_token, refresh_token, expires_in } = await result.json();
    const dateToExpire = new Date().getTime() + expires_in * 1000;
    storage.setItem("accessToken", access_token);
    storage.setItem("refreshToken", refresh_token);
    storage.setItem("expiresIn", dateToExpire.toString());
  }
}

export const checkTokenValidity = async () => {
  const currentTimeToMilliseconds = new Date().getTime();
  console.log(currentTimeToMilliseconds);
  const tokenExpiry = storage.getItem("expiresIn");
  console.log(currentTimeToMilliseconds > parseInt(tokenExpiry!));
  if (currentTimeToMilliseconds > parseInt(tokenExpiry!)) {
    console.log(currentTimeToMilliseconds > parseInt(tokenExpiry!));
    await getRefreshToken();
  }
};

export const getRefreshToken = async () => {
  // refresh token that has been previously stored
  const currentRefreshToken = storage.getItem("refreshToken");
  const url = "https://accounts.spotify.com/api/token";
  const params = new URLSearchParams();

  params.append("grant_type", "refresh_token");
  params.append("refresh_token", currentRefreshToken!);
  params.append("client_id", clientId);
  const payload = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      // Authorization:
      //   "Basic " +
      //   Buffer.from(clientId + ":" + clientSecret).toString("base64"),
    },
    body: params,
  };
  const body = await fetch(url, payload);

  if (body.ok) {
    const { access_token, refresh_token, expires_in } = await body.json();
    storage.setItem("accessToken", access_token);
    const dateToExpire = new Date().getTime() + expires_in * 1000;
    storage.setItem("expiresIn", dateToExpire.toString());
    if (refresh_token) {
      storage.setItem("refreshToken", refresh_token);
    }
  }
};
