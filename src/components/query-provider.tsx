"use client";
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { toast } from "./ui/toast";

export const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  const client = new QueryClient({
    queryCache: new QueryCache({
      onError: (error) => {
        // do not show toast when checking if user is logged in
        toast.error(error.message);
      },
    }),
    mutationCache: new MutationCache({
      onError: (error) => {
        toast.error(error.message);
      },
    }),
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};
