"use client";
import { useCheckAuth } from "@/lib/hooks/useCheckAuth";
import { Navbar } from "./components/navbar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  useCheckAuth();
  return (
    <div className="relative">
      <Navbar />
      <div className="pb-16 md:pl-2">{children}</div>
    </div>
  );
}
