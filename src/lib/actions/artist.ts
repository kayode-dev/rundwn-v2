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
  }
};
