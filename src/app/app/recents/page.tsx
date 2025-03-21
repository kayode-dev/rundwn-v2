"use client";
import { getRecentTracks } from "@/lib/actions/user";
import { useQuery } from "@tanstack/react-query";
import { LoadingState } from "../components/loading";
import Image from "next/image";
import { convertMilliSecondsToMinutes } from "@/lib/utils";

export default function RecentlyPlayedPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["GET_RECENTLY_PLAYED"],
    queryFn: () => getRecentTracks(30),
  });

  return (
    <div className="p-4 pt-8  w-full space-y-10 md:space-y-20  max-w-7xl mx-auto">
      <p className=" text-lg md:text-2xl text-center font-bold">
        Recently Played
      </p>

      {isLoading && <LoadingState />}
      <div className="grid w-full items-center gap-4 gap-y-2    ">
        {data?.items &&
          data.items.map((track) => (
            <div
              key={track.track.id}
              className="flex items-center gap-4 w-full border-b border-neutral-600 py-4"
            >
              <div className="size-16 min-h-16 md:w-24 md:min-h-24 shrink-0 overflow-hidden">
                <Image
                  src={track.track.album.images[0].url}
                  height={300}
                  width={300}
                  alt="track image"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-1 min-w-0">
                <div className="flex-1 min-w-0 space-y-1">
                  <p className=" md:text-lg font-bold line-clamp-1">
                    {track.track.name}
                  </p>
                  <p className="text-sm md:text-base text-neutral-400 line-clamp-1 font-semibold ">
                    {track.track.artists
                      .map((artist) => artist.name)
                      .join(", ")}{" "}
                    ~ {track.track.album.name}
                  </p>
                </div>
                <div className="flex-shrink-0 ml-2">
                  <p className="text-sm md:text-lg text-neutral-400 font-semibold">
                    {convertMilliSecondsToMinutes(track.track.duration_ms)}
                  </p>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
