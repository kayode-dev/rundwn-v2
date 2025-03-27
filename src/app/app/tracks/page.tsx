"use client";

import { LoadingState } from "../components/loading";
import { getTopSongs } from "@/lib/actions/user";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { TrackTab } from "../components/track-tab";

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
      <div className="grid w-full items-center gap-4 gap-y-2    ">
        {trackData?.items &&
          trackData.items.map((track) => (
            <TrackTab {...track} key={track.id} />
          ))}
      </div>
    </div>
  );
}
