import { storage } from "../hooks/storage";
import { checkTokenValidity } from "./auth";
import { TrackData } from "./user";

const baseURL = "https://api.spotify.com/v1";

export const getTrack = async (trackId: string) => {
  await checkTokenValidity();

  const accessToken = storage.getItem("accessToken");
  const result = await fetch(`${baseURL}/tracks/${trackId}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (result.ok) {
    const trackData = await result.json();
    return trackData as TrackData;
  }
};
