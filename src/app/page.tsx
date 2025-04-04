"use client";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
export default function Home() {
  return (
    <div className="h-dvh flex flex-col text-center items-center justify-center gap-4">
      <p className="text-3xl font-semibold">Numerous Cheffings presents:</p>
      <p className="text-xl font-semibold">Rundwn</p>
      <p className="text-lg">
        Get your most listened to artists and tracks at the click of a button
      </p>

      <Link
        href="/app"
        className={cn(
          buttonVariants({ size: "lg" }),
          "font-semibold text-base"
        )}
      >
        Get your Rundwn✨
      </Link>
    </div>
  );
}
