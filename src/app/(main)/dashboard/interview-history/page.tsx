'use client'

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  Play, 
  FileText, 
  Download,
  ArrowLeft,
  BarChart3,
  Target,
  Star
} from "lucide-react";
import Link from 'next/link';


const InterviewHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("date");

  // Mock data for all interviews
  const allInterviews = [
    {
      id: 1,
      type: "Behavioral",
      score: 85,
      date: "2024-06-15",
      duration: "25 min",
      status: "completed",
      feedback: "Great storytelling with STAR method. Work on specific examples.",
      strengths: ["Clear communication", "Good structure"],
      improvements: ["More specific examples", "Quantify achievements"]
    },
    {
      id: 2,
      type: "Technical",
      score: 78,
      date: "2024-06-08",
      duration: "45 min",
      status: "completed",
      feedback: "Solid algorithm knowledge. Practice system design concepts.",
      strengths: ["Problem-solving approach", "Code optimization"],
      improvements: ["System design", "Time complexity explanation"]
    },
    {
      id: 3,
      type: "System Design",
      score: 92,
      date: "2024-06-01",
      duration: "60 min",
      status: "completed",
      feedback: "Excellent architecture thinking and scalability considerations.",
      strengths: ["Scalability planning", "Component design", "Trade-off analysis"],
      improvements: ["Database sharding details"]
    },
    {
      id: 4,
      type: "Behavioral",
      score: 71,
      date: "2024-05-25",
      duration: "30 min",
      status: "completed",
      feedback: "Good examples but need more structure in responses.",
      strengths: ["Relevant examples", "Honest self-reflection"],
      improvements: ["STAR method consistency", "Concise responses"]
    },
    {
      id: 5,
      type: "Technical",
      score: 89,
      date: "2024-05-18",
      duration: "50 min",
      status: "completed",
      feedback: "Outstanding problem-solving and clean code implementation.",
      strengths: ["Algorithm efficiency", "Clean code", "Testing approach"],
      improvements: ["Edge case handling"]
    }
  ];

  const filteredInterviews = allInterviews.filter(interview => {
    const matchesSearch = interview.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || interview.type.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const sortedInterviews = [...filteredInterviews].sort((a, b) => {
    switch (sortBy) {
      case "score":
        return b.score - a.score;
      case "duration":
        return parseInt(b.duration) - parseInt(a.duration);
      case "date":
      default:
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
  });

  const averageScore = Math.round(allInterviews.reduce((sum, interview) => sum + interview.score, 0) / allInterviews.length);
  const totalDuration = allInterviews.reduce((sum, interview) => sum + parseInt(interview.duration), 0);
  const improvementTrend = allInterviews.length > 1 ? 
    allInterviews[0].score - allInterviews[allInterviews.length - 1].score : 0;



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
              <div>
                <h1 className="text-lg sm:text-2xl font-bold">Interview History & Reports</h1>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Detailed analysis of all your practice sessions
                </p>
              </div>
            </div>

            {/* Right: Export Button */}
            {/* <div className="flex justify-end">
              <Button className="flex items-center">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div> */}

          </div>
        </div>
      </div>


      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="interviews" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="interviews">All Interviews</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>


          <TabsContent value="interviews" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="pt-6">
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
              </CardContent>
            </Card>

            {/* Interviews Table */}
            <Card>
              <CardHeader>
                <CardTitle>All Interviews ({sortedInterviews.length})</CardTitle>
                <CardDescription>Complete history of your practice sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Interview</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Score</TableHead>
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
                            <span className="font-medium">{interview.type}</span>
                          </div>
                        </TableCell>
                        <TableCell>{interview.date}</TableCell>
                        <TableCell>{interview.duration}</TableCell>
                        <TableCell>
                          <Badge variant={interview.score >= 80 ? "default" : "secondary"}>
                            {interview.score}%
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {interview.status}
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
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Performance by Type */}
              <Card>
                <CardHeader>
                  <CardTitle>Performance by Interview Type</CardTitle>
                  <CardDescription>Average scores across different interview categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {["Behavioral", "Technical", "System Design"].map((type) => {
                      const typeInterviews = allInterviews.filter(i => i.type === type);
                      const avgScore = typeInterviews.length > 0 
                        ? Math.round(typeInterviews.reduce((sum, i) => sum + i.score, 0) / typeInterviews.length)
                        : 0;
                      return (
                        <div key={type} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{type}</span>
                            <span>{avgScore}% ({typeInterviews.length} interviews)</span>
                          </div>
                          <div className="w-full bg-secondary rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full transition-all" 
                              style={{ width: `${avgScore}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Improvement Areas */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Improvement Areas</CardTitle>
                  <CardDescription>Most common feedback points across all interviews</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {["System design concepts", "Specific examples", "Time complexity", "Edge case handling"].map((area, index) => (
                      <div key={area} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <span className="text-sm">{area}</span>
                        <Badge variant="outline">{4 - index} mentions</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default InterviewHistory;