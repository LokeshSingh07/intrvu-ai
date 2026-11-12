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
import { ThemeToggle } from '@/components/ThemeToggle';





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
    // @ts-expect-error
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
      if (score >= 85) return "text-[#0F9E8A]";
      if (score >= 70) return "text-amber-600";
      return "text-red-600";
  };

  const getScoreBadgeClass = (score: number) => {
    if (score >= 85) return "bg-[#35D0BA] text-[#12151B] hover:bg-[#35D0BA]";
    if (score >= 70) return "bg-amber-100 text-amber-700 hover:bg-amber-100";
    return "bg-red-100 text-red-700 hover:bg-red-100";
  };




  if (loading) {
      return (
      <div className="flex flex-col items-center justify-center gap-3 h-screen bg-[#FAF8F4] dark:bg-[#12151B]">
          <style jsx global>{`
            @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&display=swap');
            .report-mono { font-family: 'IBM Plex Mono', monospace; }
          `}</style>
          <Loader2 className="w-8 h-8 text-[#12151B] dark:text-[#8FA8FF] animate-spin" strokeWidth={1.75} />
          <p className="report-mono text-xs tracking-wide uppercase text-[#8A8F9C] dark:text-white/40">Loading your report</p>
      </div>
      );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F4] text-[#12151B] dark:bg-[#12151B] dark:text-white transition-colors duration-200">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500&display=swap');
        .report-display { font-family: 'Space Grotesk', sans-serif; }
        .report-body { font-family: 'IBM Plex Sans', sans-serif; }
        .report-mono { font-family: 'IBM Plex Mono', monospace; }
      `}</style>

      {/* Header */}
      <div className="border-b border-[#12151B]/10 bg-white dark:border-white/10 dark:bg-[#12151B]">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            
            {/* Left: Back button + Title */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm"
                    className="report-body text-[#6B7280] hover:text-[#12151B] dark:text-white/60 dark:hover:text-white"
                    onClick={() => router.push('/dashboard/interview-history')}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to history
                </Button>
              </div>

              <div className='pl-3'>  
                <h1 className="report-display text-lg sm:text-2xl font-bold text-[#12151B] dark:text-white">Interview report</h1>
                <p className="report-body text-xs sm:text-sm text-[#6B7280] dark:text-white/60">
                  Detailed analysis of this practice session
                </p>
              </div>
            </div>
          
            {/* right block */}
            <div className="hidden lg:flex items-center space-x-2">
              <ThemeToggle className="no-print" />
              <Button 
                onClick={handlePrint} 
                disabled={isExporting || loading}
                className="report-body relative bg-[#12151B] hover:bg-[#1E222B] text-white dark:bg-[#8FA8FF] dark:hover:bg-[#7A96FF] dark:text-[#12151B] font-semibold rounded-lg"
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
                className="report-body no-print border-[#12151B]/15 text-[#12151B] hover:bg-[#FAF8F4] dark:border-white/15 dark:bg-white/[0.04] dark:text-white dark:hover:bg-white/[0.08] rounded-lg"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share report
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
                <TabsList className="report-body inline-flex h-12 w-max min-w-full items-center justify-start rounded-lg bg-[#F1EFEA] dark:bg-white/[0.06] p-1 gap-1">
                  <TabsTrigger
                    value="overview"
                    className="whitespace-nowrap rounded-md px-6 py-2 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-[#12151B] data-[state=active]:shadow-sm dark:text-white/60 dark:data-[state=active]:bg-[#8FA8FF] dark:data-[state=active]:text-[#12151B]"
                  >
                    Overview
                  </TabsTrigger>
                  <TabsTrigger
                    value="questions"
                    className="whitespace-nowrap rounded-md px-6 py-2 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-[#12151B] data-[state=active]:shadow-sm dark:text-white/60 dark:data-[state=active]:bg-[#8FA8FF] dark:data-[state=active]:text-[#12151B]"
                  >
                    Question analysis
                  </TabsTrigger>
                  <TabsTrigger
                    value="recommendations"
                    className="whitespace-nowrap rounded-md px-6 py-2 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-[#12151B] data-[state=active]:shadow-sm dark:text-white/60 dark:data-[state=active]:bg-[#8FA8FF] dark:data-[state=active]:text-[#12151B]"
                  >
                    Recommendations
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="overview" className="space-y-6">
                {/* Overall Performance */}
                <Card className="border border-[#12151B]/10 dark:border-white/10 dark:bg-white/[0.04] rounded-xl shadow-none">
                  <CardHeader>
                    <CardTitle className="report-display flex items-center gap-2 text-[#12151B] dark:text-white">
                      <Target className="w-5 h-5 text-[#3E63DD] dark:text-[#8FA8FF]" />
                      Overall performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className={`report-display text-4xl font-bold ${getScoreColor(Number(interview?.rating)*10 || 0)}`}>
                        {Number(interview?.rating)*10 || 0}%
                      </div>
                      <Badge className={`report-mono mt-2 text-xs ${getScoreBadgeClass(Number(interview?.rating)*10 || 0)}`}>
                        {(Number(interview?.rating) * 10) >= 85 ? "Excellent" : (Number(interview?.rating) * 10) >= 70 ? "Good" : "Needs improvement"}
                      </Badge>
                    </div>
                    <Separator className="bg-[#12151B]/10 dark:bg-white/10" />
                    <p className="report-body text-[#6B7280] dark:text-white/60">{interview?.summary || ""}</p>
                  </CardContent>
                </Card>

                {/* Strengths and Improvements */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border border-[#12151B]/10 dark:border-white/10 dark:bg-white/[0.04] rounded-xl shadow-none">
                    <CardHeader>
                      <CardTitle className="report-display flex items-center gap-2 text-[#0F9E8A] dark:text-[#4ADE80]">
                        <CheckCircle className="w-5 h-5" />
                        Key strengths
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {interview?.strengths?.map((strength: string, index:number) => (
                          <li key={index} className="flex items-start gap-2">
                            <Star className="w-4 h-4 text-[#35D0BA] dark:text-[#4ADE80] mt-0.5 flex-shrink-0" />
                            <span className="report-body text-sm text-[#374151] dark:text-white/75">{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border border-[#12151B]/10 dark:border-white/10 dark:bg-white/[0.04] rounded-xl shadow-none">
                    <CardHeader>
                      <CardTitle className="report-display flex items-center gap-2 text-amber-600 dark:text-amber-400">
                        <AlertCircle className="w-5 h-5" />
                        Areas for improvement
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {interview?.improvements?.map((improvement:string, index:number) => (
                          <li key={index} className="flex items-start gap-2">
                            <TrendingUp className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                            <span className="report-body text-sm text-[#374151] dark:text-white/75">{improvement}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="questions" className="space-y-6">
                {interview?.answers.map((question, index) => (
                  <Card key={question.id} className="border border-[#12151B]/10 dark:border-white/10 dark:bg-white/[0.04] rounded-xl shadow-none">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="report-display text-lg text-[#12151B] dark:text-white">Question {index + 1}</CardTitle>
                        <Badge className={`report-mono text-xs ${getScoreBadgeClass((Number(question?.rating) * 10) || 0)}`}>
                          {Number(question?.rating) * 10 || 0}%
                        </Badge>
                      </div>
                      <CardDescription className="report-body text-base font-medium text-[#12151B] dark:text-white">
                        {question?.question}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="report-mono text-[11px] tracking-wide uppercase text-[#6B7280] dark:text-white/50 mb-1">Your response summary</h4>
                        <p className="report-body text-sm text-[#6B7280] dark:text-white/70 bg-[#FAF8F4] dark:bg-white/[0.03] p-3 rounded-lg">
                          {question?.userAnswer || ""}
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="report-mono text-[11px] tracking-wide uppercase text-[#6B7280] dark:text-white/50 mb-1">Feedback</h4>
                        <p className="report-body text-sm text-[#374151] dark:text-white/75">{question?.feedback}</p>
                      </div>

                      {/* Correct Answer Dropdown */}
                      <Collapsible>
                        <CollapsibleTrigger className="report-body flex items-center w-full text-sm font-medium text-[#3E63DD] dark:text-[#8FA8FF] hover:underline">
                          {/* Show Correct Answer */}
                          Show suggested answer
                        </CollapsibleTrigger>

                        <CollapsibleContent>
                          <p className="report-body text-sm bg-[#3E63DD]/5 border border-[#3E63DD]/20 dark:bg-[#8FA8FF]/10 dark:border-[#8FA8FF]/20 p-3 mt-2 rounded-lg text-[#3E63DD] dark:text-[#8FA8FF]">
                            {question?.correctAnswer || "No correct answer available."}
                          </p>
                        </CollapsibleContent>
                      </Collapsible>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="report-mono text-[11px] tracking-wide uppercase text-[#0F9E8A] dark:text-[#4ADE80] mb-2">What you did well</h5>
                          <ul className="report-body text-xs space-y-1 text-[#374151] dark:text-white/75">
                            {question?.strengths?.map((strength, idx) => (
                              <li key={idx} className="flex items-center gap-1">
                                <CheckCircle className="w-3 h-3 text-[#35D0BA] dark:text-[#4ADE80]" />
                                {strength}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h5 className="report-mono text-[11px] tracking-wide uppercase text-amber-600 dark:text-amber-400 mb-2">Areas to improve</h5>
                          <ul className="report-body text-xs space-y-1 text-[#374151] dark:text-white/75">
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
                  <Card key={index} className="border border-[#12151B]/10 dark:border-white/10 dark:bg-white/[0.04] rounded-xl shadow-none">
                    <CardHeader>
                      <CardTitle className="report-display flex items-center gap-2 text-[#12151B] dark:text-white">
                        <Lightbulb className="w-5 h-5 text-[#3E63DD] dark:text-[#8FA8FF]" />
                        {rec.title}
                      </CardTitle>
                      <CardDescription className="report-body text-[#6B7280] dark:text-white/60">{rec.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-[#3E63DD]/5 dark:bg-[#8FA8FF]/10 p-4 rounded-lg">
                        <h4 className="report-mono text-[11px] tracking-wide uppercase text-[#6B7280] dark:text-white/50 mb-2">Action item</h4>
                        <p className="report-body text-sm text-[#374151] dark:text-white/80">{rec.action}</p>
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
            <Card className="border border-[#12151B]/10 dark:border-white/10 dark:bg-white/[0.04] rounded-xl shadow-none">
              <CardHeader>
                <CardTitle className="report-display text-[#12151B] dark:text-white">Session details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#8A8F9C] dark:text-white/40" />
                  <span className="report-body text-sm text-[#374151] dark:text-white/75">{new Date(interview?.createdAt ?? "").toLocaleDateString() || ""}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#8A8F9C] dark:text-white/40" />
                  <span className="report-body text-sm text-[#374151] dark:text-white/75">{interview?.duration.split("_")[1]} min</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-[#8A8F9C] dark:text-white/40" />
                  <span className="report-body text-sm capitalize text-[#374151] dark:text-white/75">{interview?.interviewType || ""} interview</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border border-[#12151B]/10 dark:border-white/10 dark:bg-white/[0.04] rounded-xl shadow-none">
              <CardHeader>
                <CardTitle className="report-display text-[#12151B] dark:text-white">Quick actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="outline" 
                  className="report-body w-full justify-start border-[#12151B]/15 text-[#12151B] hover:bg-[#FAF8F4] dark:border-white/15 dark:bg-white/[0.04] dark:text-white dark:hover:bg-white/[0.08] rounded-lg"
                  onClick={handlePrint} 
                  disabled={isExporting || loading}
                >
                  <Download className="w-4 h-4 mr-2 text-[#6B7280] dark:text-white/60" />
                  {isExporting ? "Exporting..." : "Export as PDF"}
                </Button>
                <Button 
                  variant="outline" 
                  className="report-body w-full justify-start no-print border-[#12151B]/15 text-[#12151B] hover:bg-[#FAF8F4] dark:border-white/15 dark:bg-white/[0.04] dark:text-white dark:hover:bg-white/[0.08] rounded-lg"
                  onClick={() => setShareDialogOpen(true)}
                >
                  <Share2 className="w-4 h-4 mr-2 text-[#6B7280] dark:text-white/60" />
                  Share report
                </Button>
                <Button variant="outline" className="report-body w-full justify-start border-[#12151B]/15 text-[#12151B] hover:bg-[#FAF8F4] dark:border-white/15 dark:bg-white/[0.04] dark:text-white dark:hover:bg-white/[0.08] rounded-lg"
                  onClick={()=> router.push("/dashboard/interview-setup")}
                >
                  <Play className="w-4 h-4 mr-2 text-[#6B7280] dark:text-white/60" />
                  Retake interview
                </Button>
              </CardContent>
            </Card>

            {/* Performance Trend */}
            <Card className="border border-[#12151B]/10 dark:border-white/10 dark:bg-white/[0.04] rounded-xl shadow-none">
              <CardHeader>
                <CardTitle className="report-display text-[#12151B] dark:text-white">Your progress</CardTitle>
                <CardDescription className="report-body text-[#6B7280] dark:text-white/60">Compared to previous interviews</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-[#0F9E8A] dark:text-[#4ADE80]" />
                    <span className="report-display text-lg font-bold text-[#0F9E8A] dark:text-[#4ADE80]">+7%</span>
                  </div>
                  <p className="report-body text-xs text-[#8A8F9C] dark:text-white/40">Improvement from last session</p>
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