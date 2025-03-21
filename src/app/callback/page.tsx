"use client";
import { useGetAccessToken } from "@/lib/hooks/useCheckAuth";
import { useSearchParams } from "next/navigation";

export default function CallbackPage() {
  const params = useSearchParams();
  const code = params.get("code") || "";
  useGetAccessToken(code);

  return <p>Authenticating....</p>;
}
