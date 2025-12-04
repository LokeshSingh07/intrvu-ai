'use client'

import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Play, Target, TrendingUp, Clock, Loader2 } from "lucide-react";
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import QuickAction from './_components/QuickAtion';
import Suggestions from './_components/Suggestions';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import axios from "axios";
import { formatDate } from '@/lib/formatDate';



const Dashboard = () => {
  const router  = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState<boolean>(true);


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






  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
          <p className="text-gray-600 text-sm">Loading your dashboard...</p>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            
            {/* Left: Avatar + Welcome */}
            <div className="flex items-center space-x-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>{session?.user?.name?.split("")[0] || "L"}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Welcome back, {session?.user?.name}
                </h1>
                <p className="text-xs sm:text-sm text-gray-600">
                  Ready to ace your next interview?
                </p>
              </div>
            </div>

            {/* Right: Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <Button
                onClick={() => router.push("/dashboard/interview-setup")}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 h-10 sm:h-12 flex items-center justify-center"
              >
                <Play className="w-4 h-4 mr-2" />
                Start Interview
              </Button>

              <Button
                variant="outline"
                className="border-2 h-10 sm:h-12"
                onClick={async () => {
                  await signOut({ redirect: false });
                  setTimeout(() => {
                    toast.success("Signed out successfully!");
                    router.push("/auth");
                  }, 800);
                }}
              >
                Logout
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
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Interviews</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalInterviewCount}</div>
                  <p className="text-xs text-muted-foreground">+3 from last week</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Accuracy</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.accuracy}%</div>
                  <p className="text-xs text-muted-foreground">+5% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Rating</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.rating}</div>
                  <p className="text-xs text-muted-foreground">This week</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Interviews</CardTitle>
                <CardDescription>Your latest practice sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats?.recentInterviews?.map((interview) => (
                    <div key={interview.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <Play className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium capitalize">{interview?.interviewType} Interview</h3>
                            <p className="text-sm text-muted-foreground">{formatDate(interview?.createdAt)} • {interview?.duration.split("_")[1]} min</p>
                          </div>
                        </div>
                        <Badge variant={interview?.rating >= 8 ? "default" : "secondary"}>
                          {(interview?.rating * 10) || 0}%
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">{interview?.summary || "no feedback available"}</p>
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
                    <Button variant="outline" className="w-full">View All Interviews</Button>
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
