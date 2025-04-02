import { Loader } from "lucide-react";

export const LoadingState = () => {
  return (
    <div className="absolute bg-black/50 h-dvh left-0 top-0 w-full z-30  flex flex-col items-center justify-center gap-4">
      <Loader className="size-20 md:size-40 animate-spin duration-500" />
      <p>Loading...</p>
    </div>
  );
};
