"use client";

import { LoadingState } from "../components/loading";
import { getTopSongs } from "@/lib/actions/user";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Image from "next/image";
import { convertMilliSecondsToMinutes } from "@/lib/utils";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export default function TracksPage() {
  const [timeRange, setTimeRange] = useState<
    "long_term" | "medium_term" | "short_term"
  >("short_term");
  const { data: trackData, isLoading: trackLoading } = useQuery({
    queryKey: ["GET_USER_TRACKS", timeRange],
    queryFn: () => getTopSongs({ timeRange: timeRange, limit: 30 }),
  });

  return (
    <div className="p-4 pt-8  w-full space-y-10 md:space-y-20  max-w-7xl mx-auto">
      <div className="flex flex-col gap-8 md:flex-row items-center justify-between">
        <p className=" text-lg md:text-2xl font-bold">Top Tracks</p>

        <ToggleGroup
          type="single"
          value={timeRange}
          onValueChange={(e) =>
            setTimeRange(e as "long_term" | "medium_term" | "short_term")
          }
        >
          <ToggleGroupItem value="short_term">this month</ToggleGroupItem>
          <ToggleGroupItem value="medium_term">last 6 months</ToggleGroupItem>
          <ToggleGroupItem value="long_term">all time</ToggleGroupItem>
        </ToggleGroup>
      </div>
      {trackLoading && <LoadingState />}
      <div className="grid w-full items-center gap-4 gap-y-2">
        {trackData?.items &&
          trackData.items.map((track) => (
            <div
              key={track.id}
              className="flex items-center gap-4 w-full border-b border-neutral-600 py-4"
            >
              <div className="size-16 min-h-16 md:w-24 md:min-h-24 shrink-0 overflow-hidden">
                <Image
                  src={track.album.images[0].url}
                  height={300}
                  width={300}
                  alt="track image"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-1 min-w-0">
                <div className="flex-1 min-w-0 space-y-1">
                  <p className=" md:text-lg font-bold line-clamp-1">
                    {track.name}
                  </p>
                  <p className="text-sm md:text-base text-neutral-400 line-clamp-1 font-semibold ">
                    {track.artists.map((artist) => artist.name).join(", ")} ~{" "}
                    {track.album.name}
                  </p>
                </div>
                <div className="flex-shrink-0 ml-2">
                  <p className="text-sm md:text-lg text-neutral-400 font-semibold">
                    {convertMilliSecondsToMinutes(track.duration_ms)}
                  </p>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
