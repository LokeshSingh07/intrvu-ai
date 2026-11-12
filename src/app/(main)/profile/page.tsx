'use client'

import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import ProfileInfo from './_components/profile';
import Resume from './_components/resume';
import JobPreference from './_components/jobPreference';
import SidebarProfile from './_components/Sidebar';
import Loader from '@/components/Loader';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from '@/components/ThemeToggle';

const Profile = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status !== "loading" && !session) {
      router.push("/login");
    }
  }, [status, session, router]);

  if (status === "loading") return <Loader />;

  if (!session) return null;

  return (
    <div className="profile-root min-h-screen bg-[#FAF8F4] text-[#12151B] dark:bg-[#12151B] dark:text-white transition-colors duration-200">
      {/* Header */}
      <div className="bg-white border-b border-[#12151B]/10 dark:bg-[#12151B] dark:border-white/10">
        <div className="container mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="profile-display text-2xl font-bold text-[#12151B] dark:text-white">Profile settings</h1>
            <p className="profile-body text-[#6B7280] dark:text-white/60">Customize your interview experience</p>
          </div>
          <ThemeToggle />
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <ProfileInfo profileInfo={session?.user} />

            <Resume />

            <JobPreference />
          </div>

          {/* Sidebar */}
          <SidebarProfile />
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500&display=swap');
        .profile-display {
          font-family: 'Space Grotesk', sans-serif;
        }
        .profile-body {
          font-family: 'IBM Plex Sans', sans-serif;
        }
        .profile-mono {
          font-family: 'IBM Plex Mono', monospace;
        }
        @media (prefers-reduced-motion: reduce) {
          .profile-root * {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Profile;