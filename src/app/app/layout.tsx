"use client";
import { useCheckAuth } from "@/lib/hooks/useCheckAuth";
import { Navbar } from "./components/navbar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  useCheckAuth();
  return (
    <div className="relative">
      <Navbar />
      <div className="mb-16 md:ml-28 w-full">{children}</div>
    </div>
  );
}
