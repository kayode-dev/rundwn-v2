import Link from "next/link";
import Image from "next/image";
import { convertMilliSecondsToMinutes } from "@/lib/utils";
import { TrackData } from "@/lib/actions/user";

export const TrackTab = ({
  id,
  album,
  name,
  artists,
  duration_ms,
}: TrackData) => {
  return (
    <Link
      key={id}
      href={`/app/tracks/${id}`}
      className="flex items-center gap-4 w-full border-b border-neutral-600 py-4 hover:bg-neutral-800 duration-300 ease-in transition-colors px-4"
    >
      <div className="relative size-16 min-h-16 md:w-24 md:min-h-24 shrink-0 overflow-hidden">
        <Image
          src={album.images[0].url}
          height={300}
          width={300}
          alt="track image"
          className="w-full h-full object-cover"
          placeholder="blur"
          blurDataURL={album.images[0].url}
        />
      </div>
      <div className="flex flex-1 min-w-0">
        <div className="flex-1 min-w-0 space-y-1">
          <p className=" md:text-lg font-bold line-clamp-1 hover:underline md:w-max underline-offset-2">
            {name}
          </p>
          <p className="text-xs md:text-base text-neutral-400 line-clamp-1 font-semibold ">
            {artists.map((artist) => artist.name).join(", ")} ~ {album.name}
          </p>
        </div>
        <div className="flex-shrink-0 ml-2">
          <p className="text-sm md:text-lg text-neutral-400 font-semibold">
            {convertMilliSecondsToMinutes(duration_ms)}
          </p>
        </div>
      </div>
    </Link>
  );
};
