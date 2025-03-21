import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const convertMilliSecondsToMinutes = (milliSeconds: number) => {
  const minutes = Math.floor(milliSeconds / 60000);
  const seconds = ((milliSeconds % 60000) / 1000).toFixed(0);
  return `${minutes}:${parseInt(seconds) < 10 ? "0" : ""}${seconds}`;
};
