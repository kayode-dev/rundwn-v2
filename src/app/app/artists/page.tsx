"use client";
import { getTopArtists } from "@/lib/actions/user";
import { useQuery } from "@tanstack/react-query";
import { LoadingState } from "../components/loading";
import Image from "next/image";
import { useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export default function ArtistsPage() {
  const [timeRange, setTimeRange] = useState<
    "long_term" | "medium_term" | "short_term"
  >("short_term");
  console.log(timeRange);
  const { data: artistData, isLoading: artistsLoading } = useQuery({
    queryKey: ["GET_USER_ARTISTS", timeRange],
    queryFn: () => getTopArtists({ timeRange: timeRange, limit: 30 }),
  });

  return (
    <div className="p-4 pt-8 space-y-10 md:space-y-20 w-full max-w-7xl mx-auto">
      <div className="flex flex-col gap-8 md:flex-row items-center justify-between">
        <p className=" text-lg md:text-2xl text-center font-bold">
          Top Artists
        </p>

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
      {artistsLoading && <LoadingState />}
      <div className="grid grid-cols-2 w-full items-center md:grid-cols-4 gap-4 gap-y-10">
        {artistData?.items &&
          artistData.items.map((artist) => (
            <div key={artist.id} className="flex flex-col items-center gap-6 ">
              <div className="size-28 min-h-28 md:w-52 md:min-h-52 rounded-full overflow-hidden">
                <Image
                  src={artist.images[0].url}
                  height={300}
                  width={300}
                  alt="artiste image"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-sm md:text-lg text-neutral-400 font-semibold">
                {artist.name}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
}
