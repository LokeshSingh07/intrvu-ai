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
      color: 'bg-blue-500'
    },
    {
      id: 'technical',
      title: 'Technical',
      description: 'Coding problems and technical knowledge',
      icon: Settings,
      color: 'bg-green-500'
    },
    {
      id: 'system-design',
      title: 'System Design',
      description: 'Architecture and scalability questions',
      icon: FileText,
      color: 'bg-purple-500'
    }
  ];
  

  const modes = [
    {
      id: 'text_chat',
      title: 'Text Chat',
      description: 'Type your responses',
      icon: MessageSquare
    },
    {
      id: 'voice',
      title: 'Voice',
      description: 'Speak your answers',
      icon: Mic
    },
    {
      id: 'video',
      title: 'Video',
      description: 'Full video interview experience',
      icon: Video
    }
  ];



  
  const { register, handleSubmit, watch, setValue, formState: {errors},clearErrors  } = useForm<InterviewSetupType>({
    resolver: zodResolver(InterviewSetupSchema),
    defaultValues: {
      interviewType: InterviewType.TECHNICAL,
      difficultyLevel: DifficultyLevel.EASY,
      duration: Duration.MIN_15,
      interviewMode: InterviewMode.VOICE,
      jobPosition: JobPosition.FULLSTACK_DEVELOPER,
      jobDescription: "",
      experienceLevel: ExperienceLevel.MID,
      techStack: [],
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
      console.log("reponse: ", response.data)

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Interview Setup</h1>
          <p className="text-gray-600">Configure your practice session</p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Interview Type */}
            <Card>
              <CardHeader>
                <CardTitle>Interview Type</CardTitle>
                <CardDescription>Choose the type of interview you want to practice</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {interviewTypes.map((type) => (
                    <div
                      key={type.id}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        interviewType === type.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setValue("interviewType", type.id as any)}
                    >
                      <div className={`h-10 w-10 ${type.color} rounded-lg flex items-center justify-center mb-3`}>
                        <type.icon className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="font-semibold mb-1">{type.title}</h3>
                      <p className="text-sm text-gray-600">{type.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Difficulty & Duration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Difficulty Level</CardTitle>
                  <CardDescription>Select the appropriate challenge level</CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={difficulty} onValueChange={(val) => setValue("difficultyLevel", val as any)}>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="easy" id="easy" />
                        <Label htmlFor="easy" className="flex-1">
                          <div className="flex items-center justify-between gap-2">
                            {/* <span>Easy</span> */}
                            <Badge variant="secondary">Beginner</Badge>
                          </div>
                          <p className="text-sm text-gray-600">Basic questions for entry-level roles</p>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="medium" id="medium" />
                        <Label htmlFor="medium" className="flex-1">
                          <div className="flex items-center justify-between gap-2">
                            {/* <span>Medium</span> */}
                            <Badge variant="default">Medium</Badge>
                          </div>
                          <p className="text-sm text-gray-600">Standard questions for mid-level roles</p>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="hard" id="hard" />
                        <Label htmlFor="hard" className="flex-1">
                          <div className="flex items-center justify-between gap-2">
                            {/* <span>Hard</span> */}
                            <Badge variant="destructive">Hard</Badge>
                          </div>
                          <p className="text-sm text-gray-600">Complex questions for senior positions</p>
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Duration</CardTitle>
                  <CardDescription>How long do you want to practice?</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="px-3">
                      <Slider
                        value={[duration]}
                        onValueChange={(val) => setValue("duration", val[0])}
                        max={120}
                        min={15}
                        step={15}
                        className="w-full"
                      />
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>15 min</span>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span className="font-semibold text-lg text-gray-900">{duration} minutes</span>
                      </div>
                      <span>120 min</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2 mt-4">
                      {[15, 30, 45, 60].map((time) => (
                        <Button
                          key={time}
                          variant={duration === time ? "default" : "outline"}
                          size="sm"
                          onClick={() => setValue("duration", time)}
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
            <Card>
              <CardHeader>
                <CardTitle>Interview Mode</CardTitle>
                <CardDescription>Choose how you want to interact during the interview</CardDescription>
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
                          <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="flex items-center space-x-3 mb-2">
                              <modeOption.icon className="h-5 w-5 text-blue-600" />
                              <span className="font-medium">{modeOption.title}</span>
                            </div>
                            <p className="text-sm text-gray-600">{modeOption.description}</p>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
                {errors?.interviewMode && (
                  <p className="text-sm font-semibold text-red-500 mt-1">
                    {errors?.interviewMode?.message || "Select an interview mode"}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Custom Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Customization</CardTitle>
                <CardDescription>Optional: Add specific focus areas or job description</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="job-role">Target Job Role</Label>
                  <Select 
                    value={jobPosition}
                    onValueChange={(val)=> setValue("jobPosition", val as JobPosition)}
                  >
                    <SelectTrigger>
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
                  <Label htmlFor="job-description">Job Description</Label>
                  <Textarea
                    id="job-description"
                    placeholder="Paste the job description here to get tailored questions..."
                    className="min-h-[100px]"
                    {...register("jobDescription", {
                      onChange: () => clearErrors("jobDescription")
                    })}
                  />
                  {errors.jobDescription && <p className="text-sm font-semibold text-red-500 mt-1">{"Write the description of the job."}</p>}
                </div>

                <div>
                    <Label htmlFor="focus-areas">Tech Stack</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {['React', 'Node.js', 'TypeScript', 'Python', 'Java', 'C++', 'SQL', 'MongoDB'].map((tech) => {
                        const selected = watch("techStack")?.includes(tech);
                        return (
                          <Badge
                            key={tech}
                            variant={selected ? "default" : "outline"}
                            className="cursor-pointer hover:bg-gray-300"
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
                   {errors.techStack && <p className="text-sm font-semibold text-red-500 mt-1">Select at least one technology</p>}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Interview Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Type:</span>
                  <span className="text-sm font-medium capitalize">{interviewType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Difficulty:</span>
                  <Badge variant={difficulty === 'easy' ? 'secondary' : difficulty === 'medium' ? 'default' : 'destructive'}>
                    {difficulty}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Duration:</span>
                  <span className="text-sm font-medium">{duration} minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Mode:</span>
                  <span className="text-sm font-medium capitalize">{mode}</span>
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Find a quiet environment</li>
                  <li>• Test your microphone/camera</li>
                  <li>• Have a notepad ready</li>
                  <li>• Practice the STAR method</li>
                  <li>• Take your time to think</li>
                </ul>
              </CardContent>
            </Card>

            {/* Start Button */}
            <Button className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 h-12"
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Starting...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Start Interview
                </>
              )}
            </Button>
            
            <p className="text-xs text-gray-500 text-center">
              Your interview will be saved automatically. You can pause or end at any time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewSetup;
