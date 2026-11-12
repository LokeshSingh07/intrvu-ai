'use client'

import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Play, Target, TrendingUp, Clock, Loader2, LogOut } from "lucide-react";
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import QuickAction from './_components/QuickAtion';
import Suggestions from './_components/Suggestions';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import axios from "axios";
import { formatDate } from '@/lib/formatDate';
import { ThemeToggle } from '@/components/ThemeToggle';



const Dashboard = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState<boolean>(true);
  const [loggingOut, setLoggingOut] = useState<boolean>(false);


  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace("/auth");
      toast("You must be logged in to access the dashboard");
    }
  }, [status, router]);




  const [stats, setStats] = useState<{
    totalInterviewCount: number,
    rating: number,
    accuracy: number,
    recentInterviews: any[]
  } | null>({totalInterviewCount:0, rating: 0, accuracy: 0, recentInterviews: []})



  useEffect(()=>{
    const fetch = async()=>{
      try{
        const response = await axios.get("/api/dashboard");

        if(!response.data.success){
          toast("error while fetching dashboard details")
        }
        console.log("response: ", response);

        setStats(response?.data?.data)
      }catch(err){
        toast("error while fetching dashboard details")
      }
      finally{
        setLoading(false); 
      }
    }

    fetch();
  },[])


  // Pulled out (rather than inlined in onClick) so it can be reused, tested,
  // and so the button below can just react to loggingOut/disabled state.
  const handleLogout = async () => {
    if (loggingOut) return; // guard against double-clicks firing signOut twice

    try {
      setLoggingOut(true);
      await signOut({ redirect: false });
      toast.success("Signed out successfully!");
      router.push("/auth");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong signing you out. Please try again.");
      setLoggingOut(false);
    }
    // no `finally` resetting loggingOut on success — we're navigating away,
    // and leaving the button disabled/spinning until then avoids a flash
    // of an active "Logout" button right before the redirect happens.
  };


  const fontImports = (
    <style jsx global>{`
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500&display=swap');
      .dash-display { font-family: 'Space Grotesk', sans-serif; }
      .dash-body { font-family: 'IBM Plex Sans', sans-serif; }
      .dash-mono { font-family: 'IBM Plex Mono', monospace; }
    `}</style>
  );



  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 h-screen bg-[#FAF8F4] dark:bg-[#12151B]">
        {fontImports}
        <Loader2 className="w-8 h-8 text-[#12151B] dark:text-[#8FA8FF] animate-spin" strokeWidth={1.75} />
        <p className="dash-mono text-xs tracking-wide uppercase text-[#8A8F9C] dark:text-white/40">Loading your dashboard</p>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-[#FAF8F4] text-[#12151B] dark:bg-[#12151B] dark:text-white transition-colors duration-200">
      {fontImports}

      {/* Header */}
      <div className="bg-white border-b border-[#12151B]/10 dark:bg-[#12151B] dark:border-white/10">
        <div className="container mx-auto px-4 sm:px-6 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            
            {/* Left: Avatar + Welcome */}
            <div className="flex items-center space-x-4">
              <Avatar className="h-10 w-10 border border-[#12151B]/10 dark:border-white/15">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="dash-display bg-[#12151B] text-white dark:bg-[#8FA8FF] dark:text-[#12151B] font-semibold">
                  {session?.user?.name?.split("")[0] || "L"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="dash-display text-lg sm:text-xl font-semibold text-[#12151B] dark:text-white">
                  Welcome back, {session?.user?.name}
                </h1>
                <p className="dash-body text-xs sm:text-sm text-[#6B7280] dark:text-white/60">
                  Ready to ace your next interview?
                </p>
              </div>
            </div>

            {/* Right: Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <ThemeToggle className="self-start sm:self-auto" />
              <Button
                onClick={() => router.push("/dashboard/interview-setup")}
                disabled={loggingOut}
                className="dash-body bg-[#12151B] hover:bg-[#1E222B] text-white dark:bg-[#8FA8FF] dark:hover:bg-[#7A96FF] dark:text-[#12151B] font-semibold h-10 sm:h-12 rounded-lg flex items-center justify-center"
              >
                <Play className="w-4 h-4 mr-2" />
                Start interview
              </Button>

              <Button
                variant="outline"
                className="dash-body border border-[#12151B]/15 h-10 sm:h-12 rounded-lg text-[#12151B] dark:border-white/15 dark:bg-white/[0.04] dark:text-white dark:hover:bg-white/[0.08] disabled:opacity-60"
                disabled={loggingOut}
                onClick={handleLogout}
              >
                {loggingOut ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <LogOut className="w-4 h-4 mr-2" />
                )}
                {loggingOut ? "Signing out…" : "Logout"}
              </Button>
            </div>

          </div>
        </div>
      </div>


      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border border-[#12151B]/10 dark:border-white/10 dark:bg-white/[0.04] rounded-xl shadow-none">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="dash-mono text-[11px] tracking-wide uppercase text-[#6B7280] dark:text-white/60 font-medium">Total interviews</CardTitle>
                  <Target className="h-4 w-4 text-[#3E63DD] dark:text-[#8FA8FF]" />
                </CardHeader>
                <CardContent>
                  <div className="dash-display text-2xl font-bold text-[#12151B] dark:text-white">{stats?.totalInterviewCount}</div>
                  <p className="dash-body text-xs text-[#8A8F9C] dark:text-white/40">+3 from last week</p>
                </CardContent>
              </Card>
              <Card className="border border-[#12151B]/10 dark:border-white/10 dark:bg-white/[0.04] rounded-xl shadow-none">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="dash-mono text-[11px] tracking-wide uppercase text-[#6B7280] dark:text-white/60 font-medium">Accuracy</CardTitle>
                  <TrendingUp className="h-4 w-4 text-[#3E63DD] dark:text-[#8FA8FF]" />
                </CardHeader>
                <CardContent>
                  <div className="dash-display text-2xl font-bold text-[#12151B] dark:text-white">{stats?.accuracy}%</div>
                  <p className="dash-body text-xs text-[#8A8F9C] dark:text-white/40">+5% from last month</p>
                </CardContent>
              </Card>
              <Card className="border border-[#12151B]/10 dark:border-white/10 dark:bg-white/[0.04] rounded-xl shadow-none">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="dash-mono text-[11px] tracking-wide uppercase text-[#6B7280] dark:text-white/60 font-medium">Rating</CardTitle>
                  <Clock className="h-4 w-4 text-[#3E63DD] dark:text-[#8FA8FF]" />
                </CardHeader>
                <CardContent>
                  <div className="dash-display text-2xl font-bold text-[#12151B] dark:text-white">{stats?.rating}</div>
                  <p className="dash-body text-xs text-[#8A8F9C] dark:text-white/40">This week</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="border border-[#12151B]/10 dark:border-white/10 dark:bg-white/[0.04] rounded-xl shadow-none">
              <CardHeader>
                <CardTitle className="dash-display text-[#12151B] dark:text-white">Recent interviews</CardTitle>
                <CardDescription className="dash-body text-[#6B7280] dark:text-white/60">Your latest practice sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats?.recentInterviews?.map((interview) => (
                    <div key={interview.id} className="p-4 border border-[#12151B]/10 dark:border-white/10 rounded-lg hover:bg-[#FAF8F4] dark:hover:bg-white/[0.04] transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 bg-[#3E63DD]/10 dark:bg-[#8FA8FF]/15 rounded-full flex items-center justify-center">
                            <Play className="h-4 w-4 text-[#3E63DD] dark:text-[#8FA8FF]" />
                          </div>
                          <div>
                            <h3 className="dash-display font-medium capitalize text-[#12151B] dark:text-white">{interview?.interviewType} interview</h3>
                            <p className="dash-mono text-xs text-[#8A8F9C] dark:text-white/40">{formatDate(interview?.createdAt)} · {interview?.duration.split("_")[1]} min</p>
                          </div>
                        </div>
                        <Badge
                          className={`dash-mono text-xs ${
                            interview?.rating >= 8
                              ? "bg-[#35D0BA] text-[#12151B] hover:bg-[#35D0BA] dark:bg-[#4ADE80] dark:hover:bg-[#4ADE80]"
                              : "bg-[#F1EFEA] text-[#6B7280] hover:bg-[#F1EFEA] dark:bg-white/10 dark:text-white/70 dark:hover:bg-white/10"
                          }`}
                        >
                          {(interview?.rating * 10) || 0}%
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <p className="dash-body text-sm text-[#6B7280] dark:text-white/60">{interview?.summary || "no feedback available"}</p>
                        <div className="flex flex-wrap gap-2">
                          {/* {interview?.strengths.length > 0 && interview?.strengths?.map((strength, index) => (
                            <Badge key={index} variant="outline" className="text-green-600 border-green-200">
                              {strength}
                            </Badge>
                          ))} */}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Link href="/dashboard/interview-history">
                    <Button variant="outline" className="dash-body w-full border border-[#12151B]/15 text-[#12151B] hover:bg-[#FAF8F4] dark:border-white/15 dark:bg-white/[0.04] dark:text-white dark:hover:bg-white/[0.08] rounded-lg">View all interviews</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Progress Overview */}
            {/* <Card>
              <CardHeader>
                <CardTitle>Your Progress</CardTitle>
                <CardDescription>Track your improvement across different skills</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Behavioral Questions</span>
                    <span>85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Technical Skills</span>
                    <span>78%</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Communication</span>
                    <span>92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Problem Solving</span>
                    <span>71%</span>
                  </div>
                  <Progress value={71} className="h-2" />
                </div>
              </CardContent>
            </Card> */}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Personalized Suggestions */}
            <Suggestions/>

            {/* Quick Actions */}
            <QuickAction/>

            {/* Achievement */}
            {/* <Card>
              <CardHeader>
                <CardTitle>Latest Achievement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Award className="h-6 w-6 text-yellow-600" />
                  </div>
                  <h3 className="font-semibold">Interview Streak!</h3>
                  <p className="text-sm text-gray-600">5 interviews completed this week</p>
                </div>
              </CardContent>
            </Card> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;