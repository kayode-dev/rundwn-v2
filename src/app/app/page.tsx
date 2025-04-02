"use client";
import { getTopArtists, getTopSongs, getUserDetails } from "@/lib/actions/user";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { LoadingState } from "./components/loading";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export default function MainAppPage() {
  const { data: userData, isLoading: detailsLoading } = useQuery({
    queryKey: ["GET_USER"],
    queryFn: () => getUserDetails(),
  });
  const { data: artistData, isLoading: artistsLoading } = useQuery({
    queryKey: ["GET_TOP_ARTISTS"],
    queryFn: () => getTopArtists({ timeRange: "medium_term", limit: 10 }),
  });
  const { data: trackData, isLoading: songsLoading } = useQuery({
    queryKey: ["GET_TOP_SONGS"],
    queryFn: () => getTopSongs({ timeRange: "medium_term", limit: 10 }),
  });
  const isLoading = detailsLoading || artistsLoading || songsLoading;
  if (isLoading) return <LoadingState />;
  return (
    <div className="min-h-dvh w-full max-w-7xl mx-auto space-y-20 p-4 ">
      {userData && (
        <div className="flex flex-col gap-4 items-center text-2xl">
          <Image
            src={userData.images[0].url}
            alt="profile picture"
            className="w-36 rounded-full"
            width={300}
            height={300}
          />
          <p className="font-bold">{userData.display_name}</p>
          <Link
            href="app/persona"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            GET YOUR PERSONA
          </Link>
        </div>
      )}
      <div className="space-y-20 md:flex md:justify-between md:gap-20">
        {artistData && (
          <div className="space-y-6 md:w-1/2">
            <div className="flex items-center justify-between">
              <p className="font-bold md:text-lg">
                Top artistes in the last month
              </p>
              <Link href="app/artists" className={cn(buttonVariants())}>
                SEE MORE
              </Link>
            </div>
            <div className="space-y-8 ">
              {artistData.items.map((artist) => (
                <div key={artist.id} className="flex items-center gap-4">
                  <div className="size-14 min-h-14 md:w-24 md:min-h-24 rounded-full overflow-hidden">
                    <Image
                      src={artist.images[0].url}
                      alt="profile picture"
                      className="w-full h-full"
                      width={300}
                      height={300}
                    />
                  </div>
                  <p className="md:text-lg font-bold">{artist.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {trackData && (
          <div className="space-y-6 md:w-1/2">
            <div className="flex items-center justify-between">
              <p className="font-bold md:text-lg">
                Top songs in the last month
              </p>
              <Link href="app/tracks" className={cn(buttonVariants())}>
                SEE MORE
              </Link>
            </div>
            <div className="space-y-8">
              {trackData.items.map((song) => (
                <div key={song.id} className="flex items-center gap-4">
                  <Image
                    src={song.album.images[0].url}
                    alt="profile picture"
                    className="w-16 md:w-24 object-cover "
                    width={300}
                    height={300}
                  />
                  <div className="space-y-2">
                    <p className="md:text-lg font-bold">{song.name}</p>
                    <p className="text-sm md:text-base text-neutral-500">
                      {song.artists[0].name} ~ {song.album.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
