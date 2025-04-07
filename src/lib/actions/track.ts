import { storage } from "../hooks/storage";
import { checkTokenValidity } from "./auth";
import { TrackData } from "./user";

export const baseURL = "https://api.spotify.com/v1";

export const getTrack = async (trackId: string) => {
  await checkTokenValidity();

  const accessToken = storage.getItem("accessToken");
  const result = await fetch(`${baseURL}/tracks/${trackId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (result.ok) {
    const trackData = await result.json();
    return trackData as TrackData;
  } else {
    if (result.status >= 500) {
      throw new Error("Someting went wrong. Please try again later.");
    } else {
      const data = (await result.json()) as { error: string };
      throw new Error(
        data?.error ?? "Someting went wrong. Please try again later."
      );
    }
  }
};
export const createPlaylist = async (userId: string, trackUris: string[]) => {
  await checkTokenValidity();
  const reqBody = {
    name: "obsessed",
    description: "tracks you couldn't stop listening to, powered by Rundwn",
    public: false,
  };

  const accessToken = storage.getItem("accessToken");
  const result = await fetch(`${baseURL}/users/${userId}/playlists`, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify(reqBody),
  });
  if (result.ok) {
    const playlists = (await result.json()) as { id: string };
    addTracksToPlaylist(playlists.id, trackUris);
  } else {
    if (result.status >= 500) {
      throw new Error("Someting went wrong. Please try again later.");
    } else {
      const data = (await result.json()) as { error: string };
      throw new Error(
        data?.error ?? "Someting went wrong. Please try again later."
      );
    }
  }
};

export const addTracksToPlaylist = async (
  playlistId: string,
  trackUris: string[]
) => {
  await checkTokenValidity();
  const accessToken = storage.getItem("accessToken");
  const result = await fetch(`${baseURL}/playlists/${playlistId}/tracks`, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify({
      uris: trackUris,
      position: 0,
    }),
  });
  if (result.ok) {
    const playlists = await result.json();
    return playlists as { id: string };
  } else {
    if (result.status >= 500) {
      throw new Error("Someting went wrong. Please try again later.");
    } else {
      const data = (await result.json()) as { error: string };
      throw new Error(
        data?.error ?? "Someting went wrong. Please try again later."
      );
    }
  }
};
