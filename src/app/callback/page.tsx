"use client";

import { useGetAccessToken } from "@/lib/hooks/useCheckAuth";
import { useRouter, useSearchParams } from "next/navigation";

export default function CallbackPage() {
  const params = useSearchParams();
  const router = useRouter();
  const code = params.get("code") || "";
  const { isSuccess } = useGetAccessToken(code);
  if (isSuccess) router.replace("app");

  return <p>Authenticating....</p>;
}
