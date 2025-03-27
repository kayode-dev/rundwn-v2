import { Loader } from "lucide-react";

export const LoadingState = () => {
  return (
    <div className="absolute bg-black/50 h-dvh left-0 top-0 w-full  flex flex-col items-center justify-center gap-4">
      <Loader size={52} className="animate-spin duration-500" />
      <p>Loading...</p>
    </div>
  );
};
