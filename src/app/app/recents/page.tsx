"use client";
import { getRecentTracks } from "@/lib/actions/user";
import { useQuery } from "@tanstack/react-query";
import { LoadingState } from "../components/loading";
import { TrackTab } from "../components/track-tab";

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
            <TrackTab {...track.track} key={track.played_at} />
          ))}
      </div>
    </div>
  );
}
