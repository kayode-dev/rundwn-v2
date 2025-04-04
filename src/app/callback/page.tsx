"use client";

import { useGetAccessToken } from "@/lib/hooks/useCheckAuth";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

function CallbackContent() {
  const params = useSearchParams();
  const router = useRouter();
  const code = params.get("code") || "";
  const { isSuccess } = useGetAccessToken(code);
  useEffect(() => {
    if (isSuccess) router.replace("app");
  }, [isSuccess, router]);

  return <p>Authenticating....</p>;
}

export default function CallbackPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <CallbackContent />
    </Suspense>
  );
}
