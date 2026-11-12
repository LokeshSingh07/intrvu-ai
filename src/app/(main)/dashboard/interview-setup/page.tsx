'use client'

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Brain, Clock, MessageSquare, Mic, Video, FileText, Settings, Play, Loader2 } from "lucide-react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { InterviewSetupSchema, InterviewSetupType } from '@/schema/InterviewSetupSchema';
import { toast } from 'sonner';
import { createInterviewSession } from '@/actions/interview';
import { CompanySize, DifficultyLevel, Duration, ExperienceLevel, InterviewMode, InterviewType, JobPosition } from '@/types/enum';
import { useDispatch } from 'react-redux';
import { setInterviewData } from '@/redux/slice/interviewSlice';



const InterviewSetup = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const router = useRouter()
   const dispatch = useDispatch();

  const interviewTypes = [
    {
      id: 'behavioral',
      title: 'Behavioral',
      description: 'Questions about your past experiences and soft skills',
      icon: Brain,
    },
    {
      id: 'technical',
      title: 'Technical',
      description: 'Coding problems and technical knowledge',
      icon: Settings,
    },
    {
      id: 'system-design',
      title: 'System Design',
      description: 'Architecture and scalability questions',
      icon: FileText,
    }
  ];
  

  const modes = [
    // {
    //   id: 'text_chat',
    //   title: 'Text Chat',
    //   description: 'Type your responses',
    //   icon: MessageSquare
    // },
    {
      id: 'voice',
      title: 'Voice',
      description: 'Speak your answers',
      icon: Mic
    },
    // {
    //   id: 'video',
    //   title: 'Video',
    //   description: 'Full video interview experience',
    //   icon: Video
    // }
  ];

  
  // Default Job Descriptions
  const defaultDescriptions: Record<string, string> = {
    frontend_developer:
      "Fresher with strong basics in HTML, CSS, JavaScript, and frontend frameworks. Excited to build clean UI and learn best practices.",
    backend_developer:
      "Fresher who understands APIs, databases, server side logic, and backend fundamentals. Eager to write clean and scalable code.",
    fullstack_developer:
      "Fresher with basic knowledge of both frontend and backend. Ready to build end-to-end features and learn full-stack development.",
    tester:
      "Fresher passionate about testing, bug finding, writing test cases, and improving product quality.",
    data_scientist:
      "Fresher with strong basics in Python, statistics, and machine learning concepts. Interested in exploring data and building models.",
    system_designer:
      "Fresher curious about system design basics like scalability, caching, APIs, and database architecture.",
    devops_engineer:
      "Fresher with basic understanding of CI/CD, cloud platforms, automation, and development workflows."
  };

  const techOptions = [
    // Frontend
    "HTML", "CSS", "JavaScript", "TypeScript",
    "React", "Next.js", "Vue.js", "Angular", 
    "Tailwind CSS", "Bootstrap",

    // Backend
    "Node.js", "Express.js", "NestJS", 
    "Django", "Flask", "FastAPI",
    "Spring Boot", "Laravel",

    // Databases
    "MongoDB", "MySQL", "PostgreSQL", "SQLite",
    "Redis", "Firebase", "Supabase",

    // DevOps / Cloud
    "Docker", "Kubernetes", "AWS", "GCP", "Azure",
    "CI/CD", "GitHub Actions", "Jenkins",

    // Testing
    "Jest", "Mocha", "Cypress", "Playwright",

    // Mobile / Cross-platform
    "React Native", "Flutter",

    // Other in-demand technologies
    "GraphQL", "REST APIs", "Prisma", "ORM", 
    "Kafka", "RabbitMQ",
    "Linux", "Git"
  ];


  
  const { register, handleSubmit, watch, setValue, formState: {errors},clearErrors  } = useForm<InterviewSetupType>({
    resolver: zodResolver(InterviewSetupSchema),
    defaultValues: {
      interviewType: InterviewType.TECHNICAL,
      difficultyLevel: DifficultyLevel.EASY,
      duration: Duration.MIN_15,
      interviewMode: InterviewMode.VOICE,
      jobPosition: JobPosition.FULLSTACK_DEVELOPER,
      jobDescription: "Looking for a fresher with strong basics in HTML, CSS, JavaScript, and modern frontend frameworks. Someone who enjoys building clean UI and learning best practices.",
      experienceLevel: ExperienceLevel.MID,
      techStack: ["React", "Node.js"],
      // targetCompanySize: CompanySize.SMALL,
    }
  })

  const interviewType = watch("interviewType");
  const difficulty = watch("difficultyLevel");
  const duration = watch("duration");
  const mode = watch("interviewMode");
  const jobPosition = watch("jobPosition")
  const jobDescription = watch("jobDescription")






  const onSubmit = async(data: any)=>{
    // console.log("form Data : ", data);
    try{
      setIsSubmitting(true);

      const response = await createInterviewSession(data);
      if (!response?.success || !response?.data?.interview || !response?.data?.questions?.length) {
        toast.error(response?.error || "❌ Error while creating interview session. Please try again.");
        return;
      }

      dispatch(setInterviewData(response.data));

      toast("✅ Interview session created successfully! Redirecting you to the live interview…");
      router.push("/dashboard/live-interview")
    }
    catch(err){
      toast("❌ Error while creating interview session. Please try again.");
      console.error(err);
    }
    finally{
      setIsSubmitting(false);
    }
  }


  
  return (
    <div className="min-h-screen bg-[#FAF8F4]">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500&display=swap');
        .setup-display { font-family: 'Space Grotesk', sans-serif; }
        .setup-body { font-family: 'IBM Plex Sans', sans-serif; }
        .setup-mono { font-family: 'IBM Plex Mono', monospace; }
      `}</style>

      {/* Header */}
      <div className="bg-white border-b border-[#12151B]/10">
        <div className="container mx-auto px-6 py-5">
          <div className="setup-mono text-xs tracking-[0.18em] uppercase text-[#3E63DD] mb-2">Setup</div>
          <h1 className="setup-display text-2xl font-bold text-[#12151B]">Interview setup</h1>
          <p className="setup-body text-[#6B7280]">Configure your practice session</p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:items-start">
          {/* Main Content — flows and scrolls normally with the page */}
          <div className="lg:col-span-2 space-y-8">
              {/* Interview Type */}
              <Card className="border border-[#12151B]/10 rounded-xl shadow-none">
                <CardHeader>
                  <CardTitle className="setup-display text-[#12151B]">Interview type</CardTitle>
                  <CardDescription className="setup-body text-[#6B7280]">Choose the type of interview you want to practice</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {interviewTypes.map((type) => (
                      <div
                        key={type.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          interviewType === type.id
                            ? 'border-[#3E63DD] bg-[#3E63DD]/5'
                            : 'border-[#12151B]/10 hover:border-[#12151B]/25'
                        }`}
                        onClick={() => setValue("interviewType", type.id as any)}
                      >
                        <div className={`h-9 w-9 rounded-lg flex items-center justify-center mb-3 ${
                          interviewType === type.id ? 'bg-[#3E63DD]' : 'bg-[#12151B]/5'
                        }`}>
                          <type.icon className={`h-4 w-4 ${interviewType === type.id ? 'text-white' : 'text-[#12151B]'}`} strokeWidth={1.75} />
                        </div>
                        <h3 className="setup-display font-semibold mb-1 text-[#12151B]">{type.title}</h3>
                        <p className="setup-body text-sm text-[#6B7280]">{type.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Difficulty & Duration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border border-[#12151B]/10 rounded-xl shadow-none">
                  <CardHeader>
                    <CardTitle className="setup-display text-[#12151B]">Difficulty level</CardTitle>
                    <CardDescription className="setup-body text-[#6B7280]">Select the appropriate challenge level</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup value={difficulty} onValueChange={(val) => setValue("difficultyLevel", val as any)}>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="easy" id="easy" />
                          <Label htmlFor="easy" className="flex-1 cursor-pointer">
                            <div className="flex items-center justify-between gap-2">
                              <Badge className="setup-mono text-xs bg-[#F1EFEA] text-[#6B7280] hover:bg-[#F1EFEA]">Beginner</Badge>
                            </div>
                            <p className="setup-body text-sm text-[#6B7280]">Basic questions for entry-level roles</p>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="medium" id="medium" />
                          <Label htmlFor="medium" className="flex-1 cursor-pointer">
                            <div className="flex items-center justify-between gap-2">
                              <Badge className="setup-mono text-xs bg-[#3E63DD] text-white hover:bg-[#3E63DD]">Medium</Badge>
                            </div>
                            <p className="setup-body text-sm text-[#6B7280]">Standard questions for mid-level roles</p>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="hard" id="hard" />
                          <Label htmlFor="hard" className="flex-1 cursor-pointer">
                            <div className="flex items-center justify-between gap-2">
                              <Badge variant="destructive" className="setup-mono text-xs">Hard</Badge>
                            </div>
                            <p className="setup-body text-sm text-[#6B7280]">Complex questions for senior positions</p>
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>

                <Card className="border border-[#12151B]/10 rounded-xl shadow-none">
                  <CardHeader>
                    <CardTitle className="setup-display text-[#12151B]">Duration</CardTitle>
                    <CardDescription className="setup-body text-[#6B7280]">How long do you want to practice?</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="px-3">
                        <Slider
                          value={[duration]}
                          onValueChange={(val) => setValue("duration", val[0])}
                          max={60}
                          min={10}
                          step={5}
                          className="w-full"
                        />
                      </div>
                      <div className="setup-body flex items-center justify-between text-sm text-[#6B7280]">
                        <span>10 min</span>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4 text-[#3E63DD]" />
                          <span className="setup-display font-semibold text-lg text-[#12151B]">{duration} minutes</span>
                        </div>
                        <span>60 min</span>
                      </div>
                      <div className="grid grid-cols-4 gap-2 mt-4">
                        {[10, 20, 30, 45].map((time) => (
                          <Button
                            key={time}
                            size="sm"
                            onClick={() => setValue("duration", time)}
                            className={`setup-body rounded-lg ${
                              duration === time
                                ? 'bg-[#12151B] hover:bg-[#1E222B] text-white'
                                : 'bg-white border border-[#12151B]/15 text-[#12151B] hover:bg-[#FAF8F4]'
                            }`}
                          >
                            {time}m
                          </Button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Interview Mode */}
              <Card className="border border-[#12151B]/10 rounded-xl shadow-none">
                <CardHeader>
                  <CardTitle className="setup-display text-[#12151B]">Interview mode</CardTitle>
                  <CardDescription className="setup-body text-[#6B7280]">Choose how you want to interact during the interview</CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={mode} 
                    onValueChange={(val) => {
                      setValue("interviewMode", val as any)
                      clearErrors("interviewMode");
                    }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {modes.map((modeOption) => (
                        <div key={modeOption.id} className="flex items-center space-x-2">
                          <RadioGroupItem value={modeOption.id} id={modeOption.id} />
                          <Label htmlFor={modeOption.id} className="flex-1 cursor-pointer">
                            <div className={`p-4 border rounded-lg transition-colors ${
                              mode === modeOption.id
                                ? 'border-[#3E63DD] bg-[#3E63DD]/5'
                                : 'border-[#12151B]/10 hover:bg-[#FAF8F4]'
                            }`}>
                              <div className="flex items-center space-x-3 mb-2">
                                <modeOption.icon className="h-4 w-4 text-[#3E63DD]" strokeWidth={1.75} />
                                <span className="setup-display font-medium text-[#12151B]">{modeOption.title}</span>
                              </div>
                              <p className="setup-body text-sm text-[#6B7280]">{modeOption.description}</p>
                            </div>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                  {errors?.interviewMode && (
                    <p className="setup-body text-sm font-semibold text-red-500 mt-2">
                      {errors?.interviewMode?.message || "Select an interview mode"}
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Custom Settings */}
              <Card className="border border-[#12151B]/10 rounded-xl shadow-none">
                <CardHeader>
                  <CardTitle className="setup-display text-[#12151B]">Customization</CardTitle>
                  <CardDescription className="setup-body text-[#6B7280]">Optional: Add specific focus areas or job description</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div>
                    <Label htmlFor="job-role" className="setup-mono text-[11px] tracking-wide uppercase text-[#6B7280]">Target job role</Label>
                    <Select 
                      value={jobPosition}
                      onValueChange={(val)=> {
                        setValue("jobPosition", val as JobPosition)
                        setValue("jobDescription", defaultDescriptions[val] || "");
                        clearErrors("jobDescription");
                      }}
                    >
                      <SelectTrigger className="setup-body mt-2 rounded-lg border-[#12151B]/15 focus:ring-[#3E63DD]">
                        <SelectValue placeholder="Select a job role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="frontend_developer">Frontend Developer</SelectItem>
                        <SelectItem value="backend_developer">Backend Developer</SelectItem>
                        <SelectItem value="fullstack_developer">Full Stack Developer</SelectItem>
                        <SelectItem value="tester">Tester</SelectItem>
                        <SelectItem value="data_scientist">Data Scientist</SelectItem>
                        <SelectItem value="system_designer">System Designer</SelectItem>
                        <SelectItem value="devops_engineer">Devops Engineer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="job-description" className="setup-mono text-[11px] tracking-wide uppercase text-[#6B7280]">Job description</Label>
                    <Textarea
                      id="job-description"
                      placeholder="Paste the job description here to get tailored questions..."
                      className="setup-body mt-2 min-h-[100px] rounded-lg border-[#12151B]/15 focus-visible:ring-[#3E63DD]"
                      {...register("jobDescription", {
                        onChange: () => clearErrors("jobDescription")
                      })}
                    />
                    {errors.jobDescription && <p className="setup-body text-sm font-semibold text-red-500 mt-1">{"Write the description of the job."}</p>}
                  </div>

                  <div>
                      <Label htmlFor="focus-areas" className="setup-mono text-[11px] tracking-wide uppercase text-[#6B7280]">Tech stack</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {techOptions?.map((tech) => {
                          const selected = watch("techStack")?.includes(tech);
                          return (
                            <Badge
                              key={tech}
                              className={`setup-body cursor-pointer border ${
                                selected
                                  ? 'bg-[#12151B] text-white border-[#12151B] hover:bg-[#1E222B]'
                                  : 'bg-white text-[#12151B] border-[#12151B]/15 hover:bg-[#FAF8F4]'
                              }`}
                              onClick={() => {
                                const currentStack = watch("techStack") || [];
                                if (selected) {
                                  // remove
                                  setValue(
                                    "techStack",
                                    currentStack.filter((t: string) => t !== tech)
                                  );
                                } else {
                                  // add
                                  setValue("techStack", [...currentStack, tech]);
                                }
                                if (errors.techStack) clearErrors("techStack");
                              }}
                            >
                              {tech}
                            </Badge>
                          );
                        })}
                      </div>
                     {errors.techStack && <p className="setup-body text-sm font-semibold text-red-500 mt-1">Select at least one technology</p>}
                  </div>
                </CardContent>
              </Card>
            </div>

          {/* Sidebar — scrolls with the page, sticks once it reaches the top */}
          <div className="space-y-6 lg:sticky lg:top-8 lg:self-start">
              {/* Summary */}
              <Card className="border border-[#12151B]/10 rounded-xl shadow-none">
                <CardHeader>
                  <CardTitle className="setup-display text-[#12151B]">Interview summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="setup-mono text-xs uppercase tracking-wide text-[#8A8F9C]">Type</span>
                    <span className="setup-body text-sm font-medium capitalize text-[#12151B]">{interviewType}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="setup-mono text-xs uppercase tracking-wide text-[#8A8F9C]">Difficulty</span>
                    <Badge className={`setup-mono text-xs ${
                      difficulty === 'easy' ? 'bg-[#F1EFEA] text-[#6B7280] hover:bg-[#F1EFEA]' :
                      difficulty === 'medium' ? 'bg-[#3E63DD] text-white hover:bg-[#3E63DD]' :
                      'bg-red-500 text-white hover:bg-red-500'
                    }`}>
                      {difficulty}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="setup-mono text-xs uppercase tracking-wide text-[#8A8F9C]">Duration</span>
                    <span className="setup-body text-sm font-medium text-[#12151B]">{duration} minutes</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="setup-mono text-xs uppercase tracking-wide text-[#8A8F9C]">Mode</span>
                    <span className="setup-body text-sm font-medium capitalize text-[#12151B]">{mode}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Tips */}
              <Card className="border border-[#12151B]/10 rounded-xl shadow-none">
                <CardHeader>
                  <CardTitle className="setup-display text-[#12151B]">Quick tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="setup-body space-y-2 text-sm text-[#6B7280]">
                    <li>— Find a quiet environment</li>
                    <li>— Test your microphone</li>
                    <li>— Have a notepad ready</li>
                    <li>— Practice the STAR method</li>
                    <li>— Take your time to think</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Start Button */}
              <Button className="setup-body w-full bg-[#35D0BA] hover:bg-[#2BB8A4] text-[#12151B] h-12 rounded-lg font-semibold"
                onClick={handleSubmit(onSubmit)}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Starting...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    Start interview
                  </>
                )}
              </Button>
              
              <p className="setup-body text-xs text-[#8A8F9C] text-center">
                Your interview will be saved automatically. You can pause or end at any time.
              </p>
            </div>
          </div>
        </div>
    </div>
  );
};

export default InterviewSetup;