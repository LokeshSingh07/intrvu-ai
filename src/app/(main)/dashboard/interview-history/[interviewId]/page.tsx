'use client'

import React, { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft,  Calendar, Clock, Target, TrendingUp, CheckCircle, AlertCircle, Star, Download, Play, Lightbulb,Share2, Loader2} from "lucide-react";
import axios from 'axios';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { toast } from 'sonner';
import { useReactToPrint } from "react-to-print";
import ShareDialog from '@/components/ShareDialog';





interface Answer {
  id: string;
  question: string;
  answer: string;
  isCorrect: boolean;
  userAnswer?: string;
  correctAnswer?: string;
  rating?: number | string;
  feedback?: string;
  strengths?: string[];
  improvements?: string[];
}

interface Interview {
  id: string;
  interviewType: string;
  createdAt: string;
  score: number;
  duration: string;
  rating?: number | string;
  summary?: string;
  strengths?: string[];
  improvements?: string[];
  answers: Answer[];
}



const InterviewReport = () => {
  const { interviewId } = useParams();
  const [interview, setInterview] = useState<Interview | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isExporting, setIsExporting] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const router  = useRouter();   
  const printRef = useRef<HTMLDivElement>(null);



  // react-to-print setup
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `${interview?.interviewType || "Interview"} Report - ${new Date(interview?.createdAt || "").toLocaleDateString()}`,
    // @ts-ignore
    onBeforeGetContent: () => {
      setIsExporting(true);
      toast.loading("Generating your PDF report...", { id: "pdf" });
    },
    onAfterPrint: () => {
      setIsExporting(false);
      toast.dismiss("pdf");
      toast.success("PDF downloaded successfully!", {
        description: "Your interview report is ready.",
      });
    },
    onPrintError: (error) => {
      setIsExporting(false);
      toast.dismiss("pdf");
      toast.error("Failed to generate PDF");
      console.error("Print error:", error);
    },
    pageStyle: `
      @page { size: A4; margin: 15mm; }
      @media print {
        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .no-print { display: none !important; }
      }
    `,
  });



    
  useEffect(() => {
    const fetchInterviewDetails = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/interviews/${interviewId}`);
        
        if (data.success) {
            setInterview(data.data);
        }
    
        console.log("Interview Data : ", data);
      }
      catch (error) {
        console.error("Failed to fetch interview details: ", error);
      }
      finally {
        setLoading(false);
      }
    };
    

    fetchInterviewDetails();
  }, [interviewId]);



  const recommendations = [
    {
      title: "Practice Quantifying Results",
      description: "Focus on adding specific numbers, percentages, and metrics to your examples",
      action: "Prepare 3-5 stories with clear quantifiable outcomes"
    },
    {
      title: "STAR Method Refinement",
      description: "Continue using STAR but emphasize the Result portion more",
      action: "Practice with timer: 30% situation, 20% task, 30% action, 20% result"
    },
    {
      title: "Business Impact Focus",
      description: "Connect your actions to broader business outcomes",
      action: "Research your company's KPIs and align stories accordingly"
    }
  ]


  const getScoreColor = (score: number) => {
      if (score >= 85) return "text-green-600";
      if (score >= 70) return "text-yellow-600";
      return "text-red-600";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 85) return "default";
    if (score >= 70) return "secondary";
    return "destructive";
  };




  if (loading) {
      return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
          <div className="flex flex-col items-center">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
          <p className="text-gray-600 text-sm">Loading your Report...</p>
          </div>
      </div>
      );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            
            {/* Left: Back button + Title */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm"
                    onClick={() => router.push('/dashboard/interview-history')}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to History
                </Button>
              </div>

              <div className='pl-3'>  
                <h1 className="text-lg sm:text-2xl font-bold">Interview Report Page</h1>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Detailed analysis of all your practice sessions
                </p>
              </div>
            </div>
          
            {/* right block */}
            <div className="hidden lg:flex items-center space-x-2">
              <Button 
                onClick={handlePrint} 
                disabled={isExporting || loading}
                className="relative"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </>
                )}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => setShareDialogOpen(true)}
                className="no-print"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Report
              </Button>
            </div>
          </div>
        </div>
      </div>
      


      <div id="report-content" className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div ref={printRef} className="lg:col-span-2 space-y-8">
            <Tabs defaultValue="overview" className="space-y-6">
              <div className="w-full overflow-x-auto scrollbar-hide">
                <TabsList className="inline-flex h-12 w-max min-w-full items-center justify-start rounded-lg bg-muted p-1 gap-3">
                  <TabsTrigger
                    value="overview"
                    className="whitespace-nowrap rounded-md px-6 py-2 text-sm font-medium transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                  >
                    Overview
                  </TabsTrigger>
                  <TabsTrigger
                    value="questions"
                    className="whitespace-nowrap rounded-md px-6 py-2 text-sm font-medium transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                  >
                    Question Analysis
                  </TabsTrigger>
                  <TabsTrigger
                    value="recommendations"
                    className="whitespace-nowrap rounded-md px-6 py-2 text-sm font-medium transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                  >
                    Recommendations
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="overview" className="space-y-6">
                {/* Overall Performance */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      Overall Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className={`text-4xl font-bold ${getScoreColor(Number(interview?.rating)*10 || 0)}`}>
                        {Number(interview?.rating)*10 || 0}%
                      </div>
                      <Badge variant={getScoreBadge(Number(interview?.rating) || 0)} className="mt-2">
                        {(Number(interview?.rating) * 10) >= 85 ? "Excellent" : (Number(interview?.rating) * 10) >= 70 ? "Good" : "Needs Improvement"}
                      </Badge>
                    </div>
                    <Separator />
                    <p className="text-muted-foreground">{interview?.summary || ""}</p>
                  </CardContent>
                </Card>

                {/* Strengths and Improvements */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="w-5 h-5" />
                        Key Strengths
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {interview?.strengths?.map((strength: string, index:number) => (
                          <li key={index} className="flex items-start gap-2">
                            <Star className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-amber-600">
                        <AlertCircle className="w-5 h-5" />
                        Areas for Improvement
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {interview?.improvements?.map((improvement:string, index:number) => (
                          <li key={index} className="flex items-start gap-2">
                            <TrendingUp className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{improvement}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="questions" className="space-y-6">
                {interview?.answers.map((question, index) => (
                  <Card key={question.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Question {index + 1}</CardTitle>
                        <Badge variant={getScoreBadge((Number(question?.rating) * 10) || 0)}>
                          {Number(question?.rating) * 10 || 0}%
                        </Badge>
                      </div>
                      <CardDescription className="text-base font-medium">
                        {question?.question}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-medium ">Your Response Summary</h4>
                        <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                          {question?.userAnswer || ""}
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-1">Feedback</h4>
                        <p className="text-sm">{question?.feedback}</p>
                      </div>

                      {/* Correct Answer Dropdown */}
                      <Collapsible>
                        <CollapsibleTrigger className="flex items-center w-full text-sm font-medium text-blue-600 hover:underline">
                          {/* Show Correct Answer */}
                          Show Suggested Answer
                        </CollapsibleTrigger>

                        <CollapsibleContent>
                          <p className="text-sm bg-blue-50 dark:bg-blue-900/30 border border-blue-300/40 p-3 mt-2 rounded-lg text-blue-600 dark:text-blue-300">
                            {question?.correctAnswer || "No correct answer available."}
                          </p>
                        </CollapsibleContent>
                      </Collapsible>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="text-sm font-medium text-green-600 mb-2">What you did well:</h5>
                          <ul className="text-xs space-y-1">
                            {question?.strengths?.map((strength, idx) => (
                              <li key={idx} className="flex items-center gap-1">
                                <CheckCircle className="w-3 h-3 text-green-500" />
                                {strength}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h5 className="text-sm font-medium text-amber-600 mb-2">Areas to improve:</h5>
                          <ul className="text-xs space-y-1">
                            {question?.improvements?.map((improvement, idx) => (
                              <li key={idx} className="flex items-center gap-1">
                                <AlertCircle className="w-3 h-3 text-amber-500" />
                                {improvement}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="recommendations" className="space-y-6">
                {recommendations.map((rec, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-yellow-500" />
                        {rec.title}
                      </CardTitle>
                      <CardDescription>{rec.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-primary/5 p-4 rounded-lg">
                        <h4 className="font-medium text-sm mb-2">Action Item:</h4>
                        <p className="text-sm">{rec.action}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}

              </TabsContent>
            </Tabs>
          </div>


          {/* Sidebar */}
          <div className="space-y-6">
            {/* Session Details */}
            <Card>
              <CardHeader>
                <CardTitle>Session Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{new Date(interview?.createdAt ?? "").toLocaleDateString() || ""}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{interview?.duration.split("_")[1]} min</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm capitalize">{interview?.interviewType || ""} Interview</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"  
                  onClick={handlePrint} 
                  disabled={isExporting || loading}
                >
                  <Download className="w-4 h-4 mr-2" />
                  {isExporting ? "Exporting..." : "Export as PDF"}
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start no-print"
                  onClick={() => setShareDialogOpen(true)}
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Report
                </Button>
                <Button variant="outline" className="w-full justify-start"
                  onClick={()=> router.push("/dashboard/interview-setup")}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Retake Interview
                </Button>
              </CardContent>
            </Card>

            {/* Performance Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Your Progress</CardTitle>
                <CardDescription>Compared to previous interviews</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    <span className="text-lg font-bold text-green-600">+7%</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Improvement from last session</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Share Dialog */}
      <ShareDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        reportTitle={`${interview?.interviewType} Interview Report`}
        pdfBlob={pdfBlob}
        shareUrl={typeof window !== 'undefined' ? window.location.href : ''}
      />

    </div>
  );
};

export default InterviewReport;