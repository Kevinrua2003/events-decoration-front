import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Product images are stored as bare filenames served by the backend
// (e.g. "rosas.jpeg") or as absolute URLs (e.g. Vercel Blob). Resolve
// relative names against the API origin.
export function resolveImageUrl(image: string): string {
  if (!image) return "/placeholder.svg?height=128&width=256";
  if (/^https?:\/\//.test(image)) return image;
  return `${process.env.NEXT_PUBLIC_API_URL}/${image}`;
}
