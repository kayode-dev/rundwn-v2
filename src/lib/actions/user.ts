"use client";
import { storage } from "../hooks/storage";
import { checkTokenValidity } from "./auth";

const baseURL = "https://api.spotify.com/v1/me";

export const getUserDetails = async () => {
  await checkTokenValidity();

  const accessToken = storage.getItem("accessToken");
  const result = await fetch(baseURL, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (result.ok) {
    const final = await result.json();

    return final as {
      display_name: string;
      images: { url: string }[];
    };
  }
};
type TopAttributeType = {
  timeRange: "long_term" | "medium_term" | "short_term";
  limit: number;
};

export interface ArtistData {
  external_urls: ExternalUrls;
  genres: string[];
  href: string;
  id: string;
  images: Image[];
  name: string;
  popularity: number;
  type: string;
  uri: string;
}

interface ExternalUrls {
  spotify: string;
}

interface Image {
  height: number;
  url: string;
  width: number;
}

export const getTopArtists = async ({ timeRange, limit }: TopAttributeType) => {
  await checkTokenValidity();

  const accessToken = storage.getItem("accessToken");
  const result = await fetch(
    `${baseURL}/top/artists?time_range=${timeRange}&limit=${limit}`,
    { method: "GET", headers: { Authorization: `Bearer ${accessToken}` } }
  );
  if (result.ok) {
    const topArtists = await result.json();
    return topArtists as { items: ArtistData[] };
  }
};

interface SongData {
  album: Album;
  artists: Artist[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_urls: ExternalUrls;
  href: string;
  id: string;
  is_local: boolean;
  is_playable: boolean;
  name: string;
  popularity: number;
  track_number: number;
  type: string;
  uri: string;
}

interface Album {
  album_type: string;
  artists: Artist[];
  available_markets: string[];
  external_urls: ExternalUrls;
  href: string;
  id: string;
  images: Image[];
  is_playable: boolean;
  name: string;
  release_date: string;
  release_date_precision: string;
  total_tracks: number;
  type: string;
  uri: string;
}
export interface Artist {
  external_urls: ExternalUrls;
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
}

export const getTopSongs = async ({ timeRange, limit }: TopAttributeType) => {
  await checkTokenValidity();

  const accessToken = storage.getItem("accessToken");
  const result = await fetch(
    `${baseURL}/top/tracks?time_range=${timeRange}&limit=${limit}`,
    { method: "GET", headers: { Authorization: `Bearer ${accessToken}` } }
  );
  if (result.ok) {
    const topArtists = await result.json();
    return topArtists as { items: SongData[] };
  }
};

interface RecentTracksData {
  track: Track;
  played_at: string;
}

interface Track {
  album: Album;
  artists: Artist[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_urls: ExternalUrls;
  href: string;
  id: string;
  is_local: boolean;
  name: string;
  popularity: number;
  track_number: number;
  type: string;
  uri: string;
}

export const getRecentTracks = async (limit: number) => {
  await checkTokenValidity();

  const accessToken = storage.getItem("accessToken");
  const currentTime = new Date().getTime();
  const result = await fetch(
    `${baseURL}/player/recently-played?limit=${limit}&before=${currentTime}`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
  if (result.ok) {
    const recentTracks = await result.json();
    console.log(recentTracks);
    return recentTracks as { items: RecentTracksData[] };
  }
};

interface PlaylistData {
  collaborative: boolean;
  description: string;
  external_urls: ExternalUrls;
  href: string;
  id: string;
  images: Image[];
  name: string;
  owner: Owner;
  public: boolean;
  snapshot_id: string;
  tracks: Tracks;
  type: string;
  uri: string;
}
export interface Owner {
  display_name: string;
  external_urls: ExternalUrls;
  href: string;
  id: string;
  type: string;
  uri: string;
}
export interface Tracks {
  href: string;
  total: number;
}

export const getPlaylists = async (limit: number) => {
  await checkTokenValidity();

  const accessToken = storage.getItem("accessToken");
  const result = await fetch(`${baseURL}/playlists?limit=${limit}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (result.ok) {
    const playlists = await result.json();
    return playlists as { items: PlaylistData[] };
  }
};
