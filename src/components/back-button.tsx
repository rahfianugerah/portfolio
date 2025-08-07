"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

export default function BackButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      aria-label="Go back"
      className="p-1 rounded hover:bg-gray-200 dark:hover:bg-neutral-800 transition-colors"
    >
      <ChevronLeft className="w-6 h-6" />
    </button>
  );
}
