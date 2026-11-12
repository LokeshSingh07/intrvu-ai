import type { Metadata } from "next";
import { Space_Grotesk, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import NextAuthProvider from "@/context/AuthProvider";
import ClientWrapper from "@/context/ClentWrapper";

export const dynamic = "force-dynamic";

const displayFont = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "700"],
});

const bodyFont = IBM_Plex_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const monoFont = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "AI Intrvu — Practice interviews with a live AI voice agent",
  description: "Voice-driven mock interviews with instant, structured feedback.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${displayFont.variable} ${bodyFont.variable} ${monoFont.variable}`}>
      <body className="antialiased bg-[#FAF8F4] text-[#12151B] dark:bg-[#12151B] dark:text-white font-body transition-colors duration-200">
        <NextAuthProvider>
          <ClientWrapper>
            <main>{children}</main>
            <Toaster />
          </ClientWrapper>
        </NextAuthProvider>
      </body>
    </html>
  );
}