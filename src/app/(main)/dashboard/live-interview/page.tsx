'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, PhoneOff, Play, Loader2, MessageSquare, CheckCircle, User } from 'lucide-react';
import { toast } from 'sonner';
import { vapi } from '@/lib/vapi.sdk';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux';
import { useSession } from 'next-auth/react';

enum CallStatus {
  INACTIVE = 'INACTIVE',
  CONNECTING = 'CONNECTING',
  ACTIVE = 'ACTIVE',
  FINISHED = 'FINISHED',
}

interface SavedMessage {
  role: 'user' | 'system' | 'assistant';
  content: string;
  timestamp: string;
}

export default function LiveInterview() {
  const router = useRouter();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const { data: session } = useSession();
  const interviewData = useSelector((state: RootState) => state.interview);



  const saveTranscript = async () => {
    if (!messages.length) return;
    try {
      console.log('transcript data: ', messages);
      toast('✅ Transcript saved successfully!');
    } catch (err: any) {
      console.error('Save transcript error:', err);
      toast('❌ Failed to save transcript');
    }
  };



  useEffect(() => {
    const onCallStart = () => setCallStatus(CallStatus.ACTIVE);
    const onCallEnd = () => setCallStatus(CallStatus.FINISHED);
    const onMessage = (message: any) => {
      if (message?.type === 'transcript' && message?.transcriptType === 'final') {
        const newMessage: SavedMessage = {
          role: message.role,
          content: message.transcript,
          timestamp: new Date().toLocaleTimeString(),
        };
        setMessages((prev) => [...prev, newMessage]);
      }
    };
    const onSpeechStart = () => setIsSpeaking(true);
    const onSpeechEnd = () => setIsSpeaking(false);
    const onError = (error: Error) => console.log('error: ', error);

    vapi.on('call-start', onCallStart);
    vapi.on('call-end', onCallEnd);
    vapi.on('message', onMessage);
    vapi.on('speech-start', onSpeechStart);
    vapi.on('speech-end', onSpeechEnd);
    vapi.on('error', onError);

    return () => {
      vapi.off('call-start', onCallStart);
      vapi.off('call-end', onCallEnd);
      vapi.off('message', onMessage);
      vapi.off('speech-start', onSpeechStart);
      vapi.off('speech-end', onSpeechEnd);
      vapi.off('error', onError);
    };
  }, []);



  useEffect(() => {
    if (callStatus === CallStatus.FINISHED) {
      // saveTranscript();
    }
  }, [callStatus]);



  useEffect(() => {
    const transcriptDiv = document.querySelector('.transcript-container');
    if (transcriptDiv) {
      transcriptDiv.scrollTop = transcriptDiv.scrollHeight;
    }
  }, [messages]);



  const handleCall = async () => {
    try {
      setCallStatus(CallStatus.CONNECTING);

      // @ts-expect-error
      const interview = interviewData?.interviewData?.interview;
      // @ts-ignore-error
      const questions = interviewData?.interviewData?.questions;
      if (!interview || !questions) {
        toast('❌ Interview data not found!');
        setCallStatus(CallStatus.INACTIVE);
        return;
      }

      const questionsList = questions.map((q: any, idx: number) => `${idx + 1}. ${q.question}`).join('\n');
      const assistantPrompt = `
        You are an AI voice assistant conducting a ${interview.interviewType} interview for a ${interview.jobPosition} candidate.
        Job Details:
        - Experience Level: ${interview.experienceLevel}
        - Tech Stack: ${interview.techStack.join(', ')}
        - Difficulty Level: ${interview.difficultyLevel}
        - Interview Mode: ${interview.interviewMode}
        Instructions:
        1. Ask the following questions one by one, waiting for the candidate's response.
        2. Provide brief feedback after each response, if appropriate.
        3. After all questions, give a summary feedback highlighting strengths and areas for improvement.
        Questions:
        ${questionsList}
      `;

      const assistantOptions = {
        name: 'AI Recruiter',
        firstMessage: `Hi ${session?.user?.name}, how are you? Ready for your interview on ${interview.jobPosition}?`,
        transcriber: {
          provider: 'deepgram',
          model: 'nova-2',
          language: 'en-US',
        },
        voice: {
          provider: 'playht',
          voiceId: 'jennifer',
        },
        model: {
          provider: 'openai',
          model: 'gpt-4',
          messages: [{ role: 'system', content: assistantPrompt }],
        },
      };

      // @ts-ignore-error
      await vapi.start(assistantOptions);
    } catch (err) {
      console.error('Call start failed:', err);
      setCallStatus(CallStatus.INACTIVE);
      toast('❌ Failed to start interview');
    }
  };


  const handleDisconnect = async () => {
    try {
      await vapi.stop();
      setCallStatus(CallStatus.FINISHED);
      await saveTranscript();
    } catch (err) {
      console.error('Disconnect failed:', err);
      toast('❌ Failed to end call');
    }
  };




return (
    <div className="h-screen overflow-hidden bg-gray-50 flex flex-col md:flex-row items-stretch p-6 gap-6 text-gray-800">
      {/* Left: AI Interview Section */}
      <div className="relative flex-1 h-full flex flex-col items-center justify-center rounded-lg 
        bg-gray-50 dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-950 dark:to-black 
        border border-gray-200 dark:border-slate-800/60 p-10 md:p-12 shadow-2xl overflow-hidden">

        {/* Decorative Background Glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute w-72 h-72 rounded-full blur-3xl top-1/4 left-1/3 
            bg-blue-500/10 dark:bg-blue-500/20 animate-pulse" />
          <div className="absolute w-96 h-96 rounded-full blur-3xl bottom-0 right-1/4 
            bg-purple-500/10 dark:bg-purple-500/20 animate-[ping_8s_linear_infinite]" />
        </div>

        {/* Status Badge */}
        <Badge
          variant="outline"
          className={`absolute top-5 right-5 flex items-center gap-2 text-sm md:text-base px-4 py-1.5 rounded-full font-semibold tracking-wide border shadow-sm transition-all duration-300 backdrop-blur-md
            ${
              callStatus === CallStatus.ACTIVE
                ? "border-emerald-400 text-emerald-600 bg-emerald-400/10 dark:text-emerald-300 dark:bg-emerald-400/20 animate-pulse"
                : callStatus === CallStatus.CONNECTING
                ? "border-sky-400 text-sky-600 bg-sky-400/10 dark:text-sky-300 dark:bg-sky-400/20"
                : "border-gray-300 text-gray-600 bg-gray-100 dark:border-slate-600 dark:text-slate-400 dark:bg-slate-800/40"
            }
          `}
        >
          <span
            className={`relative flex h-3 w-3 rounded-full 
              ${
                callStatus === CallStatus.ACTIVE
                  ? "bg-emerald-400 before:absolute before:inset-0 before:rounded-full before:animate-ping before:bg-emerald-400/70"
                  : callStatus === CallStatus.CONNECTING
                  ? "bg-sky-400"
                  : "bg-gray-400 dark:bg-slate-500"
              }
            `}
          ></span>
          {callStatus}
        </Badge>

        {/* AI Avatar */}
        <div className="relative z-10 flex flex-col items-center space-y-6">
          <div className="relative flex items-center justify-center w-36 h-36 rounded-full 
            bg-gray-100 dark:bg-gradient-to-br dark:from-slate-800 dark:via-slate-900 dark:to-slate-950 
            shadow-inner border border-gray-300 dark:border-slate-700 overflow-visible">

            {/* Speaking Waves: only during ACTIVE + isSpeaking */}
            {callStatus === CallStatus.ACTIVE && isSpeaking && (
              <>
                <span className="absolute w-36 h-36 rounded-full border-2 border-blue-400/40 dark:border-blue-500/40 animate-[ping_1.5s_linear_infinite]" />
                <span className="absolute w-36 h-36 rounded-full border-2 border-indigo-400/30 dark:border-indigo-500/30 animate-[ping_2s_linear_infinite]" />
                <span className="absolute w-36 h-36 rounded-full border-2 border-purple-400/20 dark:border-purple-500/20 animate-[ping_2.5s_linear_infinite]" />
              </>
            )}

            {/* Icon based on call status */}
            {callStatus === CallStatus.INACTIVE ? (
              <User className="text-blue-400 dark:text-blue-500 animate-pulse" size={46} /> // neutral icon before interview
            ) : callStatus === CallStatus.ACTIVE ? (
              isSpeaking ? (
                <Mic className="text-blue-500 dark:text-blue-400 animate-pulse drop-shadow-[0_0_10px_rgba(56,189,248,0.6)]" size={46} />
              ) : (
                <MicOff className="text-gray-400 dark:text-slate-500" size={46} />
              )
            ) : callStatus === CallStatus.FINISHED ? (
              <CheckCircle className="text-emerald-500 dark:text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]" size={46} />
            ) : null}
          </div>

          {/* Title & Status */}
          <div className="text-center space-y-2 transition-opacity duration-300">
            {callStatus === CallStatus.INACTIVE && (
              <p className="text-gray-500 dark:text-slate-400 text-lg font-medium">
                Ready to start your AI interview
              </p>
            )}
            {callStatus === CallStatus.ACTIVE && (
              <p className="text-gray-600 dark:text-slate-400 text-lg font-medium">
                {isSpeaking ? "AI is speaking..." : "Waiting for your response..."}
              </p>
            )}
            {callStatus === CallStatus.FINISHED && (
              <p className="text-emerald-600 dark:text-emerald-400 text-lg font-semibold">
                ✅ Interview Ended
              </p>
            )}
          </div>
        </div>

        {/* Control Buttons / Interview Ended */}
        <div className="mt-12 z-10 flex flex-col items-center gap-5">
          {callStatus === CallStatus.INACTIVE || callStatus === CallStatus.CONNECTING ? (
            <Button
              size="lg"
              onClick={handleCall}
              disabled={callStatus === CallStatus.CONNECTING}
              className="relative gap-3 text-lg font-semibold px-8 py-5 rounded-xl 
                bg-gradient-to-r from-blue-600 to-purple-600 
                hover:from-blue-500 hover:to-purple-500
                text-white shadow-md hover:shadow-blue-500/25 transition-all duration-300"
            >
              {callStatus === CallStatus.CONNECTING ? (
                <>
                  <Loader2 className="animate-spin" size={22} /> Connecting...
                </>
              ) : (
                <>
                  <Play size={22} /> Start Interview
                </>
              )}
            </Button>
          ) : callStatus === CallStatus.ACTIVE ? (
            <Button
              size="lg"
              variant="destructive"
              onClick={handleDisconnect}
              className="gap-3 text-lg font-semibold px-8 py-5 
                bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 
                text-white rounded-xl shadow-md hover:shadow-red-500/25 transition-all duration-300"
            >
              <PhoneOff size={22} /> End Interview
            </Button>
          ) : callStatus === CallStatus.FINISHED ? (
            <div className="flex flex-col items-center gap-4">
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                🎉 Interview Ended
              </p>
              <Button
                size="lg"
                onClick={() => router.push("interview-history/report")} // replace with your report page route
                className="gap-3 text-lg font-semibold px-8 py-5 rounded-xl 
                  bg-gradient-to-r from-blue-600 to-purple-600 
                hover:from-blue-500 hover:to-purple-500 shadow-md hover:shadow-green-500/25 transition-all duration-300"
              >
                <Play size={22} /> View Report
              </Button>
            </div>
          ) : null}
        </div>


        {/* Footer Text */}
        <div className="absolute bottom-6 text-gray-500 dark:text-slate-400 text-sm text-center">
          {callStatus === CallStatus.INACTIVE
            ? "Click Start to begin your AI interview session."
            : callStatus === CallStatus.FINISHED
            ? "Interview completed. Transcript saved!"
            : "You can end the session anytime."}
        </div>
      </div>

      {/* Right: Chat Transcript */}
      <div className="w-full md:w-2/5 h-full flex flex-col bg-white border border-gray-200 rounded-lg shadow-md p-6">
        {/* Header */}
        <div className="flex justify-between mb-6 border-b border-gray-200 pb-3">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">Conversation Flow</h2>
            <p className='text-sm text-gray-500'>Real-time conversation with AI agent</p>
          </div>
          <span className="text-sm text-gray-500 italic">
            {messages.length ? `${messages.length} messages` : "No messages yet"}
          </span>
        </div>

        {/* Transcript Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {messages.length > 0 ? (
            messages.map((msg: any, i: number) => (
              <div
                key={i}
                className={`flex items-end gap-3 ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {/* AI Avatar */}
                {msg.role !== "user" && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-semibold">
                    AI
                  </div>
                )}

                {/* Message Bubble */}
                <div
                  className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm md:text-base leading-relaxed border ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-gray-100 text-gray-800 border-gray-200"
                  }`}
                >
                  {msg.content}
                  <div className="text-xs text-gray-500 mt-1 text-right">{msg.timestamp}</div>
                </div>

                {/* User Avatar */}
                {msg.role === "user" && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-semibold">
                    U
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center text-gray-400 text-lg flex flex-col items-center gap-2 h-full justify-center">
              <MessageSquare size={28} className="text-blue-400" />
              Waiting for messages...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}