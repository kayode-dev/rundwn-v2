import { storage } from "../hooks/storage";
import { checkTokenValidity } from "./auth";
import { TrackData } from "./user";

const baseURL = "https://api.spotify.com/v1";

export const getTrack = async (trackId: string) => {
  await checkTokenValidity();

  const accessToken = storage.getItem("accessToken");
  const result = await fetch(`${baseURL}/tracks/${trackId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (result.ok) {
    const trackData = await result.json();
    return trackData as TrackData;
  }
  return null;
};
export interface TrackAnalysisData {
  meta: Meta;
  track: Track;
  bars: Bar[];
  beats: Beat[];
  sections: Section[];
  segments: Segment[];
  tatums: Tatum[];
}

export interface Meta {
  analyzer_version: string;
  platform: string;
  detailed_status: string;
  status_code: number;
  timestamp: number;
  analysis_time: number;
  input_process: string;
}

export interface Track {
  num_samples: number;
  duration: number;
  sample_md5: string;
  offset_seconds: number;
  window_seconds: number;
  analysis_sample_rate: number;
  analysis_channels: number;
  end_of_fade_in: number;
  start_of_fade_out: number;
  loudness: number;
  tempo: number;
  tempo_confidence: number;
  time_signature: number;
  time_signature_confidence: number;
  key: number;
  key_confidence: number;
  mode: number;
  mode_confidence: number;
  codestring: string;
  code_version: number;
  echoprintstring: string;
  echoprint_version: number;
  synchstring: string;
  synch_version: number;
  rhythmstring: string;
  rhythm_version: number;
}

export interface Bar {
  start: number;
  duration: number;
  confidence: number;
}

export interface Beat {
  start: number;
  duration: number;
  confidence: number;
}

export interface Section {
  start: number;
  duration: number;
  confidence: number;
  loudness: number;
  tempo: number;
  tempo_confidence: number;
  key: number;
  key_confidence: number;
  mode: number;
  mode_confidence: number;
  time_signature: number;
  time_signature_confidence: number;
}

export interface Segment {
  start: number;
  duration: number;
  confidence: number;
  loudness_start: number;
  loudness_max: number;
  loudness_max_time: number;
  loudness_end: number;
  pitches: number[];
  timbre: number[];
}

export interface Tatum {
  start: number;
  duration: number;
  confidence: number;
}

export const getAudioAnalysis = async (trackId: string) => {
  await checkTokenValidity();

  const accessToken = storage.getItem("accessToken");
  const result = await fetch(`${baseURL}/audio-analysis/${trackId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (result.ok) {
    const trackAnalysis = await result.json();
    return trackAnalysis as TrackAnalysisData;
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
export interface TrackFeaturesData {
  acousticness: number;
  analysis_url: string;
  danceability: number;
  duration_ms: number;
  energy: number;
  id: string;
  instrumentalness: number;
  key: number;
  liveness: number;
  loudness: number;
  mode: number;
  speechiness: number;
  tempo: number;
  time_signature: number;
  track_href: string;
  type: string;
  uri: string;
  valence: number;
}

export const getAudioFeatures = async (trackId: string) => {
  await checkTokenValidity();
  const accessToken = storage.getItem("accessToken");
  const result = await fetch(`${baseURL}/audio-features/${trackId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (result.ok) {
    const trackFeatures = await result.json();
    return trackFeatures as TrackFeaturesData;
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
