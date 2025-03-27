"use client";
import { getTrack } from "@/lib/actions/track";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { LoadingState } from "../../components/loading";
import Image from "next/image";
import Link from "next/link";

export default function TrackDetailsPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data: track, isLoading: trackLoading } = useQuery({
    queryKey: ["GET_TRACK_DATA", slug],
    queryFn: () => getTrack(slug),
  });

  const isloading = trackLoading;

  if (isloading) return <LoadingState />;

  return (
    <div className="w-full max-w-7xl mx-auto p-4 pt-10 md:pt-20">
      {track && (
        <div className="flex flex-col md:flex-row gap-8 items-center ">
          <Image
            src={track.album.images[0].url}
            alt={track.album.name}
            height={300}
            width={300}
            className="w-32"
          />
          <div className="space-y-4">
            <p className="text-4xl font-black">{track.name}</p>
            <p className="text-neutral-400 font-semibold text-xl">
              {track.artists.map((artist) => artist.name).join(", ")}
            </p>
            <p className="text-neutral-400 font-semibold text-lg">
              {track.album.name} -{" "}
              {new Date(track.album.release_date).getFullYear()}
            </p>
            <Link
              href={track.uri}
              className="py-2 px-5 flex items-center font-semibold justify-center rounded-full bg-green-600 w-max"
            >
              PLAY ON SPOTIFY
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
