import { Loader } from "lucide-react";

export const LoadingState = () => {
  return (
    <div className="h-dvh flex flex-col items-center justify-center">
      <Loader size={64} className="animate-spin" />
      <p>Loading...</p>
    </div>
  );
};
