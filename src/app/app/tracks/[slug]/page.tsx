"use client";
import { getTrack } from "@/lib/actions/track";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { LoadingState } from "../../components/loading";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export default function TrackDetailsPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data: track, isLoading } = useQuery({
    queryKey: ["GET_TRACK_DATA", slug],
    queryFn: () => getTrack(slug),
  });

  if (isLoading) return <LoadingState />;

  return (
    <div className="w-full max-w-7xl mx-auto p-4 pt-10 md:pt-20">
      {track && (
        <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-center ">
          <Image
            src={track.album.images[0].url}
            alt={track.album.name}
            height={300}
            width={300}
            className="w-60"
            placeholder="blur"
            blurDataURL={track.album.images[0].url}
          />
          <div className="flex flex-col gap-3 items-center md:items-start md:gap-4 ">
            <p className="text-xl md:text-4xl font-black">{track.name}</p>
            <p className="text-neutral-400 font-semibold md:text-xl">
              {track.artists.map((artist) => artist.name).join(", ")}
            </p>
            <p className="text-neutral-400 font-semibold text-sm md:text-lg">
              {track.album.name} -{" "}
              {new Date(track.album.release_date).getFullYear()}
            </p>
            <Link href={track.uri} className={cn(buttonVariants())}>
              PLAY ON SPOTIFY
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
