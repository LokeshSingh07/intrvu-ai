'use client'

import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import ProfileInfo from './_components/profile';
import Resume from './_components/resume';
import JobPreference from './_components/jobPreference';
import SidebarProfile from './_components/Sidebar';
import Loader from '@/components/Loader';
import { useRouter } from 'next/navigation';




const Profile = () => {
  const { data: session, status } = useSession();
  console.log("Session data:", session);
  const router = useRouter();




  

  useEffect(() => {
    if (status !== "loading" && !session) {
      router.push("/login");
    }
  }, [status, session, router]);

  if (status === "loading") return <Loader />;

  if (!session) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600">Customize your interview experience</p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Personal Information, RESUME, Jobpreference */}
            <ProfileInfo profileInfo={session?.user } />

            {/* <Resume/> */}

            <JobPreference/>
          </div>

          {/* Sidebar */}
          <SidebarProfile/>
        </div>
      </div>
    </div>
  );
};

export default Profile;
