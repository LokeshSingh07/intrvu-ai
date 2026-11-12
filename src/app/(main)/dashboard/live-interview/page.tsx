'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, PhoneOff, Play, Loader2, MessageSquare, CheckCircle, User } from 'lucide-react';
import { toast } from 'sonner';
import { vapi } from '@/lib/vapi.sdk';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux';
import { useSession } from 'next-auth/react';
import { generateFeedbackForInterview } from '@/actions/interview';
import { ThemeToggle } from '@/components/ThemeToggle';

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
  const { data: session } = useSession();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const interviewState = useSelector((state: RootState) => state.interview);
  // Extract interview data more clearly
  const interviewData = interviewState?.interviewData;
  const interview = interviewData?.interview;
  const questions = interviewData?.questions;
  const interviewSessionId = interview?.id;

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);

  // Prevents generateFeedback from firing twice (once from the disconnect
  // button, once from the natural 'call-end' event) and guards against it
  // firing again if the call never actually produced a transcript.
  const feedbackGeneratedRef = useRef(false);
  const messagesRef = useRef<SavedMessage[]>([]);
  messagesRef.current = messages;

  const generateFeedback = useCallback(async () => {
    if (feedbackGeneratedRef.current) return;
    if (!messagesRef.current.length) {
      toast('No conversation was recorded, so no report could be generated.');
      return;
    }
    feedbackGeneratedRef.current = true;
    try {
      const response = await generateFeedbackForInterview(messagesRef.current, interviewSessionId);
      console.log('feedback response: ', response);
      toast('Report generated successfully');
    } catch (err: any) {
      console.error('Save transcript error:', err);
      toast('Failed to save transcript. You can retry from the report page.');
      // Allow a retry attempt since this one failed.
      feedbackGeneratedRef.current = false;
    }
  }, [interviewSessionId]);

  // Maps Vapi/browser error shapes to a readable message. Vapi's web SDK
  // frequently emits errors as Error instances, plain objects with a
  // `message`/`error` field, or (on mic issues) a DOMException from
  // getUserMedia — so we can't assume a single shape.
  const getErrorMessage = (error: unknown): string => {
    if (!error) return 'Something went wrong starting the interview.';
    if (error instanceof DOMException) {
      if (error.name === 'NotAllowedError') {
        return 'Microphone access was denied. Please allow microphone permissions and try again.';
      }
      if (error.name === 'NotFoundError') {
        return 'No microphone was found on this device.';
      }
      return `Microphone error: ${error.message}`;
    }
    if (typeof error === 'string') return error;
    if (typeof error === 'object') {
      const anyErr = error as any;
      if (anyErr.errorMsg) return anyErr.errorMsg;
      if (anyErr.message) return anyErr.message;
      if (anyErr.error?.message) return anyErr.error.message;
    }
    return 'An unexpected error occurred during the interview.';
  };

  // Check if interview data exists, redirect if missing
  useEffect(() => {
    if (!interview || !questions || !questions.length) {
      if (!isRedirecting) {
        setIsRedirecting(true);
        toast.error('Interview data not found. Redirecting to setup...');
        setTimeout(() => {
          router.push('/dashboard/interview-setup');
        }, 1500);
      }
    }
  }, []);

  useEffect(() => {
    const onCallStart = () => {
      setCallStatus(CallStatus.ACTIVE);
    };

    const onCallEnd = () => {
      setCallStatus(CallStatus.FINISHED);
      // Covers the case where the assistant (or the network) ends the call
      // on its own, not just when the user hits "End interview".
      generateFeedback();
    };

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

    const onError = (error: unknown) => {
      console.error('Vapi error:', error);
      toast(getErrorMessage(error));
      // Without this, a failed start (bad mic permissions, invalid
      // assistant config, provider outage, etc.) leaves the UI stuck on
      // "CONNECTING" forever since call-start never fires.
      setCallStatus((prev) => (prev === CallStatus.ACTIVE ? CallStatus.FINISHED : CallStatus.INACTIVE));
    };

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generateFeedback]);

  // Stop any in-progress call if the user navigates away mid-interview,
  // so we don't leave the mic stream / Vapi session running in the background.
  useEffect(() => {
    return () => {
      if (callStatus === CallStatus.ACTIVE || callStatus === CallStatus.CONNECTING) {
        vapi.stop();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const transcriptDiv = document.querySelector('.transcript-container');
    if (transcriptDiv) {
      transcriptDiv.scrollTop = transcriptDiv.scrollHeight;
    }
  }, [messages]);

  const handleCall = async () => {
    // Data is already extracted in state at the top
    if (!interview || !questions || !questions.length) {
      toast('Interview data not found. Please go back and set up your interview again.');
      return;
    }

    if (!session?.user?.name) {
      toast('You need to be signed in to start an interview.');
      return;
    }

    // Ask for mic permission explicitly before handing off to Vapi. This
    // gives a clear error immediately instead of a silent hang inside the SDK.
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
    } catch (err) {
      toast(getErrorMessage(err));
      return;
    }

    setCallStatus(CallStatus.CONNECTING);
    feedbackGeneratedRef.current = false;
    setMessages([]);

    try {
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
        firstMessage: `Hi ${session.user.name}, how are you? Ready for your interview on ${interview.jobPosition}?`,
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

      // vapi.start() returns a promise that rejects on setup failure
      // (bad API key, invalid assistant config, etc.) — that rejection was
      // previously the only thing caught, so runtime errors from the
      // 'error' event never reset the UI. Both paths are now handled.
      // @ts-ignore-error
      await vapi.start(assistantOptions);
    } catch (err) {
      console.error('Call start failed:', err);
      toast(getErrorMessage(err));
      setCallStatus(CallStatus.INACTIVE);
    }
  };

  const handleDisconnect = async () => {
    try {
      await vapi.stop();
      // Note: setting FINISHED and calling generateFeedback here is
      // redundant with onCallEnd in most cases (vapi.stop() triggers
      // 'call-end'), but kept as a safety net in case that event is
      // delayed or dropped. generateFeedback() is idempotent via the ref guard.
      setCallStatus(CallStatus.FINISHED);
      await generateFeedback();
    } catch (err) {
      console.error('Disconnect failed:', err);
      toast(getErrorMessage(err));
      // Force the UI out of ACTIVE even if vapi.stop() itself errored,
      // so the user isn't stuck with no way to proceed.
      setCallStatus(CallStatus.FINISHED);
    }
  };

  const statusBadgeClasses =
    callStatus === CallStatus.ACTIVE
      ? 'border-[#35D0BA]/40 text-[#12151B] bg-[#35D0BA]/10'
      : callStatus === CallStatus.CONNECTING
      ? 'border-[#3E63DD]/30 text-[#3E63DD] bg-[#3E63DD]/5'
      : 'border-[#12151B]/10 text-[#6B7280] bg-[#F1EFEA]';

  const statusDotClasses =
    callStatus === CallStatus.ACTIVE
      ? 'bg-[#35D0BA] before:absolute before:inset-0 before:rounded-full before:animate-ping before:bg-[#35D0BA]/60'
      : callStatus === CallStatus.CONNECTING
      ? 'bg-[#3E63DD]'
      : 'bg-[#8A8F9C]';

  return (
    <div className="li-root h-screen overflow-hidden bg-[#FAF8F4] dark:bg-[#12151B] flex flex-col md:flex-row items-stretch p-6 gap-6 text-[#12151B] dark:text-white transition-colors duration-200">
      {/* Left: AI Interview Section */}
      <div className="relative flex-1 h-full flex flex-col items-center justify-center rounded-xl bg-white border border-[#12151B]/10 dark:bg-white/[0.04] dark:border-white/10 p-10 md:p-12 overflow-hidden">
        <div className="absolute top-4 left-4">
          <ThemeToggle />
        </div>
        {/* Status badge */}
        <Badge
          variant="outline"
          className={`li-mono absolute top-5 right-5 flex items-center gap-2 text-xs px-3 py-1.5 rounded-full font-medium tracking-wide uppercase border transition-colors duration-300 ${statusBadgeClasses}`}
        >
          <span className={`relative flex h-2 w-2 rounded-full ${statusDotClasses}`} />
          {callStatus}
        </Badge>

        {/* Agent indicator */}
        <div className="relative z-10 flex flex-col items-center space-y-6">
          <div className="relative flex items-center justify-center w-32 h-32 rounded-full bg-[#F1EFEA] border border-[#12151B]/10 dark:bg-white/[0.06] dark:border-white/15">
            {/* Speaking rings — live signal only */}
            {callStatus === CallStatus.ACTIVE && isSpeaking && (
              <>
                <span className="absolute w-32 h-32 rounded-full border-2 border-[#35D0BA]/40 dark:border-[#4ADE80]/40 animate-[ping_1.6s_linear_infinite]" />
                <span className="absolute w-32 h-32 rounded-full border-2 border-[#35D0BA]/20 dark:border-[#4ADE80]/20 animate-[ping_2.2s_linear_infinite]" />
              </>
            )}

            {callStatus === CallStatus.INACTIVE ? (
              <User className="text-[#12151B]/60 dark:text-white/60" strokeWidth={1.75} size={40} />
            ) : callStatus === CallStatus.ACTIVE ? (
              isSpeaking ? (
                <Mic className="text-[#35D0BA] dark:text-[#4ADE80]" strokeWidth={1.75} size={40} />
              ) : (
                <MicOff className="text-[#8A8F9C] dark:text-white/40" strokeWidth={1.75} size={40} />
              )
            ) : callStatus === CallStatus.FINISHED ? (
              <CheckCircle className="text-[#35D0BA] dark:text-[#4ADE80]" strokeWidth={1.75} size={40} />
            ) : callStatus === CallStatus.CONNECTING ? (
              <Loader2 className="text-[#3E63DD] dark:text-[#8FA8FF] animate-spin" strokeWidth={1.75} size={40} />
            ) : null}
          </div>

          {/* Status copy */}
          <div className="text-center space-y-1">
            {callStatus === CallStatus.INACTIVE && (
              <p className="li-body text-[#6B7280] dark:text-white/60 text-lg">Ready to start your mock interview</p>
            )}
            {callStatus === CallStatus.CONNECTING && (
              <p className="li-body text-[#6B7280] dark:text-white/60 text-lg">Connecting to your interviewer…</p>
            )}
            {callStatus === CallStatus.ACTIVE && (
              <p className="li-body text-[#374151] dark:text-white/80 text-lg">
                {isSpeaking ? 'AI is speaking…' : 'Waiting for your response…'}
              </p>
            )}
            {callStatus === CallStatus.FINISHED && (
              <p className="li-body text-[#12151B] dark:text-white text-lg font-medium">Interview ended</p>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="mt-12 z-10 flex flex-col items-center gap-5">
          {callStatus === CallStatus.INACTIVE || callStatus === CallStatus.CONNECTING ? (
            <Button
              size="lg"
              onClick={handleCall}
              disabled={callStatus === CallStatus.CONNECTING}
              className="li-body gap-3 text-base font-semibold px-8 py-5 rounded-lg bg-[#35D0BA] hover:bg-[#2BB8A4] dark:bg-[#4ADE80] dark:hover:bg-[#3BC86E] text-[#12151B] disabled:opacity-60 transition-colors duration-200"
            >
              {callStatus === CallStatus.CONNECTING ? (
                <>
                  <Loader2 className="animate-spin" size={20} /> Connecting…
                </>
              ) : (
                <>
                  <Play size={20} /> Start a mock interview
                </>
              )}
            </Button>
          ) : callStatus === CallStatus.ACTIVE ? (
            <Button
              size="lg"
              onClick={handleDisconnect}
              className="li-body gap-3 text-base font-semibold px-8 py-5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
            >
              <PhoneOff size={20} /> End interview
            </Button>
          ) : callStatus === CallStatus.FINISHED ? (
            <div className="flex flex-col items-center gap-4">
              <Button
                size="lg"
                onClick={() => router.push(`interview-history/${interviewSessionId}`)}
                className="li-body gap-3 text-base font-semibold px-8 py-5 rounded-lg bg-[#12151B] hover:bg-[#1E222B] text-white dark:bg-[#8FA8FF] dark:hover:bg-[#7A96FF] dark:text-[#12151B] transition-colors duration-200"
              >
                View report
              </Button>
            </div>
          ) : null}
        </div>

        {/* Footer text */}
        <div className="li-body absolute bottom-6 text-[#8A8F9C] dark:text-white/40 text-sm text-center">
          {callStatus === CallStatus.INACTIVE
            ? 'Click start to begin your mock interview.'
            : callStatus === CallStatus.FINISHED
            ? 'Interview completed. Transcript saved.'
            : 'You can end the session anytime.'}
        </div>
      </div>

      {/* Right: Chat Transcript */}
      <div className="w-full md:w-2/5 h-full flex flex-col bg-white border border-[#12151B]/10 dark:bg-white/[0.04] dark:border-white/10 rounded-xl p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-6 border-b border-[#12151B]/10 dark:border-white/10 pb-4">
          <div>
            <h2 className="li-display text-xl font-bold text-[#12151B] dark:text-white">Conversation flow</h2>
            <p className="li-body text-sm text-[#6B7280] dark:text-white/60 mt-0.5">Live transcript of your conversation</p>
          </div>
          <span className="li-mono text-xs tracking-wide uppercase text-[#8A8F9C] dark:text-white/40">
            {messages.length ? `${messages.length} messages` : 'No messages yet'}
          </span>
        </div>

        {/* Transcript Messages */}
        <div className="transcript-container flex-1 overflow-y-auto space-y-4 pr-1">
          {messages.length > 0 ? (
            messages.map((msg: any, i: number) => (
              <div
                key={i}
                className={`flex items-end gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role !== 'user' && (
                  <div className="li-mono flex-shrink-0 w-8 h-8 rounded-full bg-[#12151B] dark:bg-white/15 text-white flex items-center justify-center text-xs font-medium">
                    AI
                  </div>
                )}

                <div
                  className={`li-body max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed border ${
                    msg.role === 'user'
                      ? 'bg-[#3E63DD] text-white border-[#3E63DD] dark:bg-[#8FA8FF] dark:text-[#12151B] dark:border-[#8FA8FF]'
                      : 'bg-[#F1EFEA] text-[#12151B] border-[#12151B]/10 dark:bg-white/[0.06] dark:text-white dark:border-white/10'
                  }`}
                >
                  {msg.content}
                  <div
                    className={`li-mono text-[11px] mt-1 text-right ${
                      msg.role === 'user' ? 'text-white/70 dark:text-[#12151B]/70' : 'text-[#8A8F9C] dark:text-white/40'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>

                {msg.role === 'user' && (
                  <div className="li-mono flex-shrink-0 w-8 h-8 rounded-full bg-[#3E63DD] dark:bg-[#8FA8FF] text-white dark:text-[#12151B] flex items-center justify-center text-xs font-medium">
                    U
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="li-body text-center text-[#8A8F9C] dark:text-white/40 text-base flex flex-col items-center gap-2 h-full justify-center">
              <MessageSquare size={26} strokeWidth={1.75} className="text-[#3E63DD] dark:text-[#8FA8FF]" />
              Waiting for messages…
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500&display=swap');
        .li-display {
          font-family: 'Space Grotesk', sans-serif;
        }
        .li-body {
          font-family: 'IBM Plex Sans', sans-serif;
        }
        .li-mono {
          font-family: 'IBM Plex Mono', monospace;
        }
        @media (prefers-reduced-motion: reduce) {
          .li-root * {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
}