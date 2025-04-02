"use client";
import { getPlaylists } from "@/lib/actions/user";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { LoadingState } from "../components/loading";

export default function PlaylistsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["GET_PLAYLISTS"],
    queryFn: () => getPlaylists(30),
  });

  return (
    <div className="p-4 pt-8 space-y-10 md:space-y-20 w-full max-w-7xl mx-auto">
      <p className=" text-lg md:text-2xl text-center font-bold">Playlists</p>

      {isLoading && <LoadingState />}
      <div className="grid grid-cols-2 w-full items-center md:grid-cols-4 gap-6 gap-y-10 md:gap-16">
        {data?.items &&
          data.items.map((playlist) => (
            <div key={playlist.id} className="flex flex-col items-center gap-6">
              <div className="w-full h-full aspect-square shrink-0 md:w-52 md:min-h-52  overflow-hidden">
                <Image
                  src={playlist.images[0].url}
                  height={300}
                  width={300}
                  alt="artiste image"
                  className="w-full h-full object-cover"
                  placeholder="blur"
                  blurDataURL={playlist.images[0].url}
                />
              </div>
              <div className="space-y-1 text-center">
                <p className="text-sm md:text-lg text-neutral-400 font-semibold line-clamp-1">
                  {playlist.name}
                </p>
                <p className="text-xs md:text-base">
                  {playlist.owner.display_name}
                </p>
                <p className="text-xs md:text-base">
                  {playlist.tracks.total} tracks
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
