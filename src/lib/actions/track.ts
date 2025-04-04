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
