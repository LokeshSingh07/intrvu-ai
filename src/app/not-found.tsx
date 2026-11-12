'use client'
import { Button } from "@/components/ui/button"
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="nf-root flex h-screen flex-col items-center justify-center bg-[#FAF8F4] dark:bg-[#12151B] text-center px-6 transition-colors duration-200">
      <span className="nf-mono text-xs tracking-[0.18em] uppercase text-[#3E63DD] dark:text-[#8FA8FF]">Error 404</span>
      <h1 className="nf-display mt-2 text-6xl font-bold text-[#12151B] dark:text-white">
        Page not found
      </h1>
      <p className="nf-body mt-4 text-lg text-[#6B7280] dark:text-white/60 max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
      </p>
      <Link href="/">
        <Button className="nf-body h-12 px-6 w-fit mt-8 rounded-lg bg-[#12151B] hover:bg-[#1E222B] text-white dark:bg-[#8FA8FF] dark:hover:bg-[#7A96FF] dark:text-[#12151B] font-semibold">
          Go to home page
        </Button>
      </Link>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500&display=swap');
        .nf-display {
          font-family: 'Space Grotesk', sans-serif;
        }
        .nf-body {
          font-family: 'IBM Plex Sans', sans-serif;
        }
        .nf-mono {
          font-family: 'IBM Plex Mono', monospace;
        }
        @media (prefers-reduced-motion: reduce) {
          .nf-root * {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
}