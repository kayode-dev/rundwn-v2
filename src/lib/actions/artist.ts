import { storage } from "../hooks/storage";
import { checkTokenValidity } from "./auth";
import { baseURL } from "./track";
import { TrackData } from "./user";

export interface ArtistData {
  external_urls: {
    spotify: string;
  };
  followers: {
    href: string;
    total: number;
  };
  genres: string[];
  href: string;
  id: string;
  images: [
    {
      url: string;
      height: number;
      width: number;
    }
  ];
  name: string;
  popularity: 0;
  type: string;
  uri: string;
}

export const getArtistData = async (id: string) => {
  await checkTokenValidity();
  const accessToken = storage.getItem("accessToken");
  const result = await fetch(`${baseURL}/artists/${id}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (result.ok) {
    const artistData = await result.json();
    return artistData as ArtistData;
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

export const getArtistTopTracks = async (id: string) => {
  await checkTokenValidity();
  const accessToken = storage.getItem("accessToken");
  const result = await fetch(`${baseURL}/artists/${id}/top-tracks`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (result.ok) {
    const topTracks = await result.json();
    return topTracks as { tracks: TrackData[] };
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
