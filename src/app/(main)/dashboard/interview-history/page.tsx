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
import { ThemeToggle } from '@/components/ThemeToggle';






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
    <div className="min-h-screen bg-[#FAF8F4] text-[#12151B] dark:bg-[#12151B] dark:text-white transition-colors duration-200">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500&display=swap');
        .hist-display { font-family: 'Space Grotesk', sans-serif; }
        .hist-body { font-family: 'IBM Plex Sans', sans-serif; }
        .hist-mono { font-family: 'IBM Plex Mono', monospace; }
      `}</style>

      {/* Header */}
      <div className="border-b border-[#12151B]/10 bg-white dark:border-white/10 dark:bg-[#12151B]">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            
            {/* Left: Back button + Title */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="hist-body flex items-center text-[#6B7280] hover:text-[#12151B] dark:text-white/60 dark:hover:text-white">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to dashboard
                </Button>
              </Link>
              
              <div className='pl-3'>
                <h1 className="hist-display text-lg sm:text-2xl font-bold text-[#12151B] dark:text-white">Interview history & reports</h1>
                <p className="hist-body text-xs sm:text-sm text-[#6B7280] dark:text-white/60">
                  Detailed analysis of all your practice sessions
                </p>
              </div>
            </div>

            <ThemeToggle className="self-end sm:self-auto" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 space-y-6">
        {/* Filters */}
        <Card className="border border-[#12151B]/10 dark:border-white/10 dark:bg-white/[0.04] rounded-xl shadow-none">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A8F9C] dark:text-white/40" />
                  <Input
                    placeholder="Search interviews..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="hist-body pl-10 rounded-lg border-[#12151B]/15 dark:border-white/15 dark:bg-white/[0.04] dark:text-white focus-visible:ring-[#3E63DD] dark:focus-visible:ring-[#8FA8FF] focus-visible:ring-offset-0"
                  />
                </div>
              </div>

              <div className='flex justify-start items-center gap-2'>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="hist-body w-48 rounded-lg border-[#12151B]/15 dark:border-white/15 dark:bg-white/[0.04] dark:text-white">
                    <Filter className="w-4 h-4 mr-2 text-[#8A8F9C] dark:text-white/40" />
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="all">All types</SelectItem>
                    <SelectItem value="behavioral">Behavioral</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="system design">System design</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="hist-body w-48 rounded-lg border-[#12151B]/15 dark:border-white/15 dark:bg-white/[0.04] dark:text-white">
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
        <Card className="border border-[#12151B]/10 dark:border-white/10 dark:bg-white/[0.04] rounded-xl shadow-none">
          <CardHeader>
            <CardTitle className="hist-display text-[#12151B] dark:text-white">All interviews</CardTitle>
            <CardDescription className="hist-body text-[#6B7280] dark:text-white/60">Complete history of your practice sessions</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between space-x-4">
                    <Skeleton className="h-8 w-8 rounded-full bg-[#12151B]/5 dark:bg-white/10" />
                    <Skeleton className="h-4 w-[200px] bg-[#12151B]/5 dark:bg-white/10" />
                    <Skeleton className="h-4 w-[100px] bg-[#12151B]/5 dark:bg-white/10" />
                    <Skeleton className="h-4 w-[50px] bg-[#12151B]/5 dark:bg-white/10" />
                    <Skeleton className="h-4 w-[80px] bg-[#12151B]/5 dark:bg-white/10" />
                    <Skeleton className="h-8 w-24 rounded-md bg-[#12151B]/5 dark:bg-white/10" />
                  </div>
                ))}
              </div>
            ) : sortedInterviews.length === 0 ? (
              <div className="hist-body text-center py-12 text-[#8A8F9C] dark:text-white/40 text-sm">
                No interviews match your search or filter.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-[#12151B]/10 dark:border-white/10 hover:bg-transparent">
                    <TableHead className="hist-mono text-[11px] tracking-wide uppercase text-[#6B7280] dark:text-white/60">Interview</TableHead>
                    <TableHead className="hist-mono text-[11px] tracking-wide uppercase text-[#6B7280] dark:text-white/60">Date</TableHead>
                    <TableHead className="hist-mono text-[11px] tracking-wide uppercase text-[#6B7280] dark:text-white/60">Duration</TableHead>
                    <TableHead className="hist-mono text-[11px] tracking-wide uppercase text-[#6B7280] dark:text-white/60">Rating</TableHead>
                    <TableHead className="hist-mono text-[11px] tracking-wide uppercase text-[#6B7280] dark:text-white/60">Status</TableHead>
                    <TableHead className="hist-mono text-[11px] tracking-wide uppercase text-[#6B7280] dark:text-white/60">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedInterviews.map((interview) => (
                    <TableRow key={interview.id} className="border-[#12151B]/10 hover:bg-[#FAF8F4] dark:border-white/10 dark:hover:bg-white/[0.04]">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-8 bg-[#3E63DD]/10 dark:bg-[#8FA8FF]/15 rounded-full flex items-center justify-center">
                            <Play className="h-4 w-4 text-[#3E63DD] dark:text-[#8FA8FF]" strokeWidth={1.75} />
                          </div>
                          <span className="hist-display font-medium capitalize text-[#12151B] dark:text-white">{interview.interviewType} interview</span>
                        </div>
                      </TableCell>
                      <TableCell className="hist-body text-[#6B7280] dark:text-white/60">{new Date(interview.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="hist-body text-[#6B7280] dark:text-white/60">{interview.duration.split("_")[1]} mins</TableCell>
                      <TableCell>
                        <Badge className={`hist-mono text-xs ${
                          interview.rating >= 8
                            ? 'bg-[#35D0BA] text-[#12151B] hover:bg-[#35D0BA] dark:bg-[#4ADE80] dark:hover:bg-[#4ADE80]'
                            : 'bg-[#F1EFEA] text-[#6B7280] hover:bg-[#F1EFEA] dark:bg-white/10 dark:text-white/70 dark:hover:bg-white/10'
                        }`}>
                          {interview.rating ? `${interview.rating}/10` : "N/A"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="hist-mono text-xs capitalize border-[#12151B]/15 text-[#6B7280] dark:border-white/15 dark:text-white/60">
                          {interview.summary ? "Reviewed" : "Pending"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Link href={`/dashboard/interview-history/${interview.id}`}>
                          <Button variant="ghost" size="sm" className="hist-body text-[#3E63DD] hover:text-[#3E63DD] hover:bg-[#3E63DD]/10 dark:text-[#8FA8FF] dark:hover:text-[#8FA8FF] dark:hover:bg-[#8FA8FF]/15">
                            <FileText className="w-4 h-4 mr-2" />
                            View report
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