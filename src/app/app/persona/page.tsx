"use client";

import { getUserDetails, getTopArtists, getTopSongs } from "@/lib/actions/user";
import { useMutation, useQuery } from "@tanstack/react-query";
import { LoadingState } from "../components/loading";
import { cn } from "@/lib/utils";
import { useMemo } from "react";
import Link from "next/link";
import { TrackTab } from "../components/track-tab";
import { createPlaylist } from "@/lib/actions/track";
import { toast } from "@/components/ui/toast";
import Image from "next/image";
import { GenreGraph } from "./components/genre-chart";

export default function PersonaPage() {
  const { data: userData, isLoading: detailsLoading } = useQuery({
    queryKey: ["GET_USER"],
    queryFn: () => getUserDetails(),
  });
  const { data: artistDataShort, isLoading: shortArtistsLoading } = useQuery({
    queryKey: ["GET_TOP_ARTISTS_SHORT"],
    queryFn: () => getTopArtists({ timeRange: "short_term", limit: 50 }),
  });
  const { data: artistDataMedium, isLoading: mediumArtistsLoading } = useQuery({
    queryKey: ["GET_TOP_ARTISTS_MEDIUM"],
    queryFn: () => getTopArtists({ timeRange: "medium_term", limit: 50 }),
  });
  const { data: artistDataLong, isLoading: longArtistsLoading } = useQuery({
    queryKey: ["GET_TOP_ARTISTS_LONG"],
    queryFn: () => getTopArtists({ timeRange: "long_term", limit: 50 }),
  });
  const { data: trackDataShort, isLoading: songsLoading } = useQuery({
    queryKey: ["GET_TOP_SONGS_SHORT"],
    queryFn: () => getTopSongs({ timeRange: "short_term", limit: 5 }),
  });
  const { data: trackDataMedium, isLoading: loadingSongsMedium } = useQuery({
    queryKey: ["GET_TOP_SONGS_MEDIUM"],
    queryFn: () => getTopSongs({ timeRange: "medium_term", limit: 5 }),
  });
  const { data: trackDataLong, isLoading: loadingSongsLong } = useQuery({
    queryKey: ["GET_TOP_SONGS_LONG"],
    queryFn: () => getTopSongs({ timeRange: "long_term", limit: 5 }),
  });

  const isLoading =
    detailsLoading ||
    shortArtistsLoading ||
    mediumArtistsLoading ||
    longArtistsLoading ||
    songsLoading ||
    loadingSongsMedium ||
    loadingSongsLong;

  const songsOnRepeat = useMemo(() => {
    if (
      !trackDataShort?.items ||
      !trackDataMedium?.items ||
      !trackDataLong?.items
    )
      return { songURIs: [], allSongs: [] };

    const shortTermonRepeat = trackDataShort.items.slice(0, 3);
    const mediumTermonRepeat = trackDataMedium.items.slice(0, 3);
    const longTermonRepeat = trackDataLong.items.slice(0, 3);
    const allSongs = [
      ...shortTermonRepeat,
      ...mediumTermonRepeat,
      ...longTermonRepeat,
    ];
    const songURIs = allSongs.map((s) => s.uri);
    return { songURIs, allSongs };
  }, [trackDataShort, trackDataMedium, trackDataLong]);

  const { songURIs, allSongs } = songsOnRepeat;

  const { mutate: createPlaylistMutation, isPending } = useMutation({
    mutationFn: () => createPlaylist(userData ? userData.id : "", songURIs),
    onSuccess: () => toast.success("Playlist created"),
    onError: () => toast.error("Failed to create playlist"),
  });
  const handleCreatePlaylist = () => {
    if (!userData) return;
    createPlaylistMutation();
  };

  const genreStats = useMemo(() => {
    if (
      !artistDataShort?.items ||
      !artistDataMedium?.items ||
      !artistDataLong?.items
    )
      return { nicheArtist: [], genreCounts: [], uniqueTopArtists: [] };

    const allArtists = [
      ...artistDataShort.items,
      ...artistDataMedium.items,
      ...artistDataLong.items,
    ];

    const topArtists = [
      ...artistDataShort.items.slice(0, 8),
      ...artistDataMedium.items.slice(0, 8),
      ...artistDataLong.items.slice(0, 8),
    ];
    const uniqueTopArtists = Array.from(
      new Map(topArtists.map((artist) => [artist.id, artist])).values()
    );

    // Remove duplicates by creating a Map with artist ID as key
    const uniqueArtists = Array.from(
      new Map(allArtists.map((artist) => [artist.id, artist])).values()
    );

    // Filter for niche artists from unique list
    const nicheArtist = uniqueArtists
      .filter((a) => a.popularity <= 50)
      .sort((a, b) => b.popularity - a.popularity);

    // Reduce all genres into a frequency map using unique artists
    const genreCount = uniqueArtists.reduce((acc, artist) => {
      artist.genres.forEach((genre) => {
        acc[genre] = (acc[genre] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    // Convert to array and sort by frequency
    const genreCounts = Object.entries(genreCount)
      .sort(([, a], [, b]) => b - a)
      .map(([genre, count]) => ({
        genre,
        count,
      }));

    return { nicheArtist, genreCounts, uniqueTopArtists };
  }, [artistDataShort, artistDataMedium, artistDataLong]);

  const { nicheArtist, genreCounts, uniqueTopArtists } = genreStats;
  console.log(genreCounts);
  if (isLoading) return <LoadingState />;
  const typicalNigerian =
    genreCounts[0]?.genre.includes("afro") && userData?.country === "NG";

  return (
    <div className="w-full  mx-auto max-w-6xl p-4 space-y-6 md:text-xl mb-10 pt-10 md:mb-0">
      {userData && (
        <p className="font-semibold">
          Hi <GradientText text={userData.display_name} />, thank you for using{" "}
          <GradientText text="Rundwn" />, we&apos;ve crunched the numbers and
          done the maths, here&apos;s your{" "}
          <GradientText text="listening persona" />
          🎧
        </p>
      )}
      <div className="mt-4 flex flex-col md:flex-row gap-4 md:items-center ">
        <h2 className=" font-semibold">Your top 5 genres are:</h2>
        <div className="flex flex-wrap gap-2 items-center">
          {genreCounts.slice(0, 5).map(({ genre }, index) => (
            <span
              key={genre}
              className={cn(
                "px-3 py-1 rounded-full text-sm",
                index < 3 ? "bg-green-700" : "bg-neutral-800"
              )}
            >
              {genre}
            </span>
          ))}
        </div>
      </div>
      <div>
        <p>if we put that on a graph, it will looks something like this ⬇️</p>
        <GenreGraph chartData={genreCounts.slice(0, 7)} />
      </div>
      {typicalNigerian ? (
        <p>
          Pretty typical for a Nigerian no? but let&apos;s not dwell on that....
        </p>
      ) : (
        <p>We might, have a niche listener on our hands, lets dive deeper...</p>
      )}
      <div className="mt-4 flex flex-col md:flex-row gap-4 md:items-center ">
        <h2 className=" font-semibold">
          You also listen to artist in these genres:
        </h2>
        <div className="flex flex-wrap gap-2 items-center">
          {genreCounts
            .slice(Math.max(genreCounts.length - 7, 1))
            .map(({ genre }, index) => (
              <span
                key={genre}
                className={cn(
                  "px-3 py-1 rounded-full text-sm",
                  index < 3 ? "bg-green-700" : "bg-neutral-800"
                )}
              >
                {genre}
              </span>
            ))}
        </div>
      </div>

      {songsOnRepeat && (
        <div className="flex flex-col gap-4">
          <p>
            At some point in time you were <GradientText text="OBSESSED" /> with
            these songs
          </p>
          <div className="space-y-4">
            {allSongs.map((s) => (
              <TrackTab {...s} key={s.id} />
            ))}
          </div>
          <button
            onClick={handleCreatePlaylist}
            className="self-end text-neu-green"
            disabled={isPending}
          >
            + create playlist
          </button>
        </div>
      )}
      {nicheArtist && nicheArtist?.length > 0 && (
        <div className="flex flex-col md:flex-row gap-4">
          <p>
            You listen to {nicheArtist.length <= 4 ? "some" : "a lot of"}{" "}
            <GradientText text="niche" /> artists like
          </p>
          <div className="flex flex-wrap gap-4 items-center">
            {nicheArtist.map((a) => (
              <Link
                href={`/app/artists/${a.id}`}
                key={a.id}
                className="px-3 py-1 rounded-full text-sm bg-neutral-800"
              >
                {a.name}
              </Link>
            ))}
          </div>
        </div>
      )}
      <div className="mt-10 space-y-8">
        <p>
          anddd as if that was&apos;nt enough, you listened to these artists an{" "}
          <GradientText text="unhealthy" /> amount of times
        </p>
        <div className="grid grid-cols-2 w-full items-center md:grid-cols-4 gap-4 gap-y-10 mt-4">
          {uniqueTopArtists.map((artist) => (
            <Link
              href={`artists/${artist.id}`}
              key={artist.id}
              className="flex flex-col items-center gap-6 "
            >
              <div className="size-28 min-h-28 md:w-52 md:min-h-52 rounded-full overflow-hidden">
                <Image
                  src={artist.images[0].url}
                  height={300}
                  width={300}
                  alt="artiste image"
                  className="w-full h-full object-cover"
                  placeholder="blur"
                  blurDataURL={artist.images[0].url}
                />
              </div>
              <p className="text-sm md:text-lg text-neutral-400 font-semibold">
                {artist.name}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
const GradientText = ({ text }: { text: string }) => {
  return (
    <span className="bg-clip-text font-bold bg-gradient-to-tr from-green-600 to-neu-green text-transparent">
      {text}
    </span>
  );
};
