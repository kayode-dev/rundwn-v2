"use client";
import { getArtistData, getArtistTopTracks } from "@/lib/actions/artist";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { LoadingState } from "../../components/loading";
import Image from "next/image";
import { formatWithCommas } from "@/lib/actions/helpers";
import { TrackTab } from "../../components/track-tab";
import { getRecentTracks } from "@/lib/actions/user";
import { useMemo } from "react";

export default function ArtistData() {
  const { slug } = useParams<{ slug: string }>();

  const { data: artistData, isLoading: artistLoading } = useQuery({
    queryKey: ["GET_ARTIST_DATA", slug],
    queryFn: () => getArtistData(slug),
  });
  const { data: artistTopTracks, isLoading: artistTopTracksLoading } = useQuery(
    {
      queryKey: ["GET_ARTIST_TOP_TRACKS", slug],
      queryFn: () => getArtistTopTracks(slug),
    }
  );
  const { data: recentData, isLoading: recentDataLoading } = useQuery({
    queryKey: ["GET_RECENTLY_PLAYED"],
    queryFn: () => getRecentTracks(50),
  });
  const recentTracksByArtist = useMemo(() => {
    return recentData?.items.filter((t) => t.track.artists[0].id === slug);
  }, [recentData, slug]);
  const isLoading =
    artistLoading || artistTopTracksLoading || recentDataLoading;
  if (isLoading) return <LoadingState />;
  return (
    <div className="p-4 pt-8  w-full space-y-10 md:space-y-20  max-w-7xl mx-auto">
      {artistData && (
        <div className="flex flex-col gap-4 items-center justify-between">
          <div className="w-60 aspect-square overflow-hidden">
            <Image
              src={artistData.images[0].url}
              alt="artist image"
              width={300}
              height={300}
              className="w-full object-cover"
              placeholder="blur"
              blurDataURL={artistData.images[0].url}
            />
          </div>
          <p className="text-xl md:text-2xl font-bold">{artistData.name}</p>
          <p className="text-neutral-400 text-lg">
            popularity: {artistData.popularity}%
          </p>
          <p className="text-neutral-400 text-lg">
            followers: {formatWithCommas(artistData.followers.total)}
          </p>
          {artistData.genres.length > 0 && (
            <p className="text-neutral-400 text-lg">
              genres: {artistData.genres.map((g) => g).join(", ")}
            </p>
          )}
        </div>
      )}
      {recentTracksByArtist && recentTracksByArtist.length > 0 ? (
        <div className="space-y-4 md:text-xl">
          <p className="font-bold">
            Songs by this artist that you&apos;ve listened to recently
          </p>
          <div className="space-y-4">
            {recentTracksByArtist.map((r) => (
              <TrackTab {...r.track} key={r.track.id} />
            ))}
          </div>
        </div>
      ) : (
        <p>You haven&apos;t listened to this artist recently :(</p>
      )}
      {artistTopTracks && (
        <div className="space-y-6">
          <p className="font-bold md:text-xl">
            {recentTracksByArtist?.length == 0
              ? "Get back into it"
              : `${artistData?.name}'s Top Tracks`}
          </p>
          <div className="space-y-4">
            {artistTopTracks.tracks.map((a) => (
              <TrackTab {...a} key={a.id} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
