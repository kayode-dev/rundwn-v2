"use client";

import { useGetAccessToken } from "@/lib/hooks/useCheckAuth";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

export default function CallbackPage() {
  const params = useSearchParams();
  const router = useRouter();
  const code = params.get("code") || "";
  const { isSuccess } = useGetAccessToken(code);
  if (isSuccess) router.replace("app");

  return (
    <Suspense>
      <p>Authenticating....</p>
    </Suspense>
  );
}
