'use client'

import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, FileText, ArrowLeft,Play } from "lucide-react";
import Link from 'next/link';
import axios from 'axios';
import { toast } from 'sonner';
import { Skeleton } from "@/components/ui/skeleton";






const InterviewHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [allInterviews, setAllInterviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);




  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await axios.get("/api/interviews");

        if (!response.data.success) {
          toast("Error while fetching interview details");
          return;
        }
        setAllInterviews(response.data.data.recentInterviews || []);
      } catch (err) {
        toast("Error while fetching interview details");
      } finally {
        setIsLoading(false);
      }
    };

    fetch();
  }, []);





  const filteredInterviews = allInterviews.filter(interview => {
    const matchesSearch = interview?.interviewType?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || interview?.interviewType.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const sortedInterviews = [...filteredInterviews].sort((a, b) => {
    switch (sortBy) {
      case "score":
        return (b.rating || 0) - (a.rating || 0);
      case "duration":
        return (parseInt(b.duration) || 0) - (parseInt(a.duration) || 0);
      case "date":
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });




  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            
            {/* Left: Back button + Title */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="flex items-center">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              
              <div className='pl-3'>
                <h1 className="text-lg sm:text-2xl font-bold">Interview History & Reports</h1>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Detailed analysis of all your practice sessions
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Filters */}
        <Card>
          <CardContent className="">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search interviews..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className='flex justify-start items-center gap-2'>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-48">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="behavioral">Behavioral</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="system design">System Design</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="score">Score</SelectItem>
                    <SelectItem value="duration">Duration</SelectItem>
                  </SelectContent>
                </Select>
                
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interview Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Interviews</CardTitle>
            <CardDescription>Complete history of your practice sessions</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between space-x-4">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[100px]" />
                    <Skeleton className="h-4 w-[50px]" />
                    <Skeleton className="h-4 w-[80px]" />
                    <Skeleton className="h-8 w-24 rounded-md" />
                  </div>
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Interview</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedInterviews.map((interview) => (
                    <TableRow key={interview.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <Play className="h-4 w-4 text-primary" />
                          </div>
                          <span className="font-medium capitalize">{interview.interviewType} Interview</span>
                        </div>
                      </TableCell>
                      <TableCell>{new Date(interview.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>{interview.duration.split("_")[1]} mins</TableCell>
                      <TableCell>
                        <Badge variant={interview.rating >= 8 ? "default" : "secondary"}>
                          {interview.rating ? `${interview.rating}/10` : "N/A"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {interview.summary ? "Reviewed" : "Pending"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Link href={`/dashboard/interview-history/${interview.id}`}>
                          <Button variant="ghost" size="sm">
                            <FileText className="w-4 h-4 mr-2" />
                            View Report
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InterviewHistory;
