'use client'
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Github, CheckCircle2, Loader2 } from "lucide-react";
import Link from 'next/link';
import SignIn from './_components/signin';
import SignUp from './_components/signup';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { platformName } from '@/data/constant';

// Google's actual multi-color mark — a plain "Chrome" glyph reads as the
// wrong product, and a monochrome G loses the one detail people scan for.
const GoogleIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 18 18" aria-hidden="true">
        <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.88 2.7-6.62Z" />
        <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.81.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.95v2.33A9 9 0 0 0 9 18Z" />
        <path fill="#FBBC05" d="M3.95 10.7A5.4 5.4 0 0 1 3.67 9c0-.59.1-1.16.28-1.7V4.97H.95A9 9 0 0 0 0 9c0 1.45.35 2.83.95 4.03l3-2.33Z" />
        <path fill="#EA4335" d="M9 3.58c1.32 0 2.51.46 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .95 4.97l3 2.33C4.66 5.17 6.65 3.58 9 3.58Z" />
    </svg>
);

const Auth = () => {
    const [googleLoading, setGoogleLoading] = useState<boolean>(false);
    const [githubLoading, setGithubLoading] = useState<boolean>(false);
    const router = useRouter();
    const { status } = useSession();
    const isSubmitting = googleLoading || githubLoading;

    useEffect(() => {
        if (status === 'authenticated') {
            router.replace('/dashboard');
        }
    }, [status, router]);

    if (status === 'authenticated') {
        return null;
    }

    const handleGoogleSignIn = async () => {
        try {
            setGoogleLoading(true);
            const result = await signIn('google', { redirect: false });

            if (result?.error) {
                toast.error('Failed to sign in with Google');
                console.error(result.error);
                return;
            }
            toast('Signed in with Google');
            // router.push('/dashboard');
        }
        catch (err) {
            toast('An unexpected error occurred');
            console.error(err);
        }
        finally {
            setGoogleLoading(false);
        }
    }

    const handleGitHubSignIn = async () => {
        try {
            setGithubLoading(true);
            const result = await signIn('github', { redirect: false });
            if (result?.error) {
                toast.error('Failed to sign in with GitHub');
                console.error(result.error);
                return;
            }
            toast('Signed in with GitHub');
            // router.push('/dashboard');
        }
        catch (err) {
            toast('An unexpected error occurred');
            console.error(err);
        }
        finally {
            setGithubLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FAF8F4] flex">
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500&display=swap');
                .auth-display { font-family: 'Space Grotesk', sans-serif; }
                .auth-body { font-family: 'IBM Plex Sans', sans-serif; }
                .auth-mono { font-family: 'IBM Plex Mono', monospace; }
            `}</style>

            {/* LEFT — brand / product panel (hidden on small screens) */}
            <div className="hidden lg:flex lg:w-[46%] xl:w-[42%] bg-[#12151B] text-white flex-col justify-between p-12 relative overflow-hidden">
                {/* faint grid texture */}
                <div
                    className="absolute inset-0 opacity-[0.06] pointer-events-none"
                    style={{
                        backgroundImage:
                            'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
                        backgroundSize: '32px 32px',
                    }}
                />

                <div className="relative z-10">
                    <div className="auth-mono text-xs tracking-[0.18em] uppercase text-[#8FA8FF] mb-10">
                        <Link href={"/"}>{platformName}</Link>
                    </div>

                    <h1 className="auth-display text-4xl xl:text-[2.75rem] leading-[1.1] font-semibold mb-5">
                        Walk into the room<br />already having done this.
                    </h1>
                    <p className="auth-body text-white/60 max-w-sm leading-relaxed">
                        Practice with realistic interview questions and get structured feedback
                        on every answer, before it counts.
                    </p>
                </div>

                {/* signature element: a mock interview exchange */}
                <div className="relative z-10 rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-sm p-5 my-10">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="w-2 h-2 rounded-full bg-[#F87171]" />
                        <span className="w-2 h-2 rounded-full bg-[#FACC15]" />
                        <span className="w-2 h-2 rounded-full bg-[#4ADE80]" />
                        <span className="auth-mono text-[10px] tracking-wide uppercase text-white/40 ml-2">
                            mock interview — live
                        </span>
                    </div>

                    <div className="auth-mono text-[13px] leading-relaxed space-y-3">
                        <p className="text-[#8FA8FF]">
                            Q&nbsp; “Tell me about a time you disagreed with a teammate.”
                        </p>
                        <p className="text-white/70">
                            A&nbsp; “On a launch last quarter, I pushed back on scope
                            after seeing early usage data...”
                        </p>
                    </div>

                    <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/10">
                        <div className="flex items-center gap-1.5 auth-mono text-xs text-[#4ADE80]">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Structure 8/10
                        </div>
                        <div className="flex items-center gap-1.5 auth-mono text-xs text-[#4ADE80]">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Clarity 9/10
                        </div>
                    </div>
                </div>

                {/* <div className="relative z-10 flex items-center gap-8 auth-mono text-xs text-white/40">
                    <div>
                        <div className="text-white text-lg auth-display font-semibold">12K+</div>
                        mock interviews run
                    </div>
                    <div>
                        <div className="text-white text-lg auth-display font-semibold">4.8/5</div>
                        avg. candidate rating
                    </div>
                </div> */}
            </div>

            {/* RIGHT — auth form */}
            <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
                <div className="w-full max-w-sm">
                    {/* mobile-only header, since the brand panel is hidden below lg */}
                    <div className="text-center mb-8 lg:hidden">
                        <div className="auth-mono text-xs tracking-[0.18em] uppercase text-[#3E63DD] mb-3">
                            Welcome
                        </div>
                        <h1 className="auth-display text-3xl font-bold text-[#12151B] mb-2">{platformName}</h1>
                        <p className="auth-body text-[#6B7280]">Your AI-powered interview preparation platform</p>
                    </div>

                    <div className="mb-8 hidden lg:block">
                        <h2 className="auth-display text-2xl font-semibold text-[#12151B] mb-1.5">Get started</h2>
                        <p className="auth-body text-[#6B7280] text-sm">Sign in to your account or create a new one</p>
                    </div>

                    <Tabs defaultValue="signin" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 bg-[#F1EFEA] rounded-lg">
                            <TabsTrigger
                                value="signin"
                                className="auth-mono text-xs tracking-wide uppercase data-[state=active]:bg-[#12151B] data-[state=active]:text-white rounded-md"
                            >
                                Sign in
                            </TabsTrigger>
                            <TabsTrigger
                                value="signup"
                                className="auth-mono text-xs tracking-wide uppercase data-[state=active]:bg-[#12151B] data-[state=active]:text-white rounded-md"
                            >
                                Sign up
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="signin" className="space-y-4 mt-6">
                            <SignIn />
                        </TabsContent>

                        <TabsContent value="signup" className="space-y-4 mt-6">
                            <SignUp />
                        </TabsContent>
                    </Tabs>

                    {/* GOOGLE & GITHUB SIGNIN */}
                    <div className="mt-6">
                        <div className="flex items-center gap-3 my-4">
                            <Separator className="flex-1 bg-[#12151B]/10" />
                            <span className="auth-mono text-[10px] tracking-wide uppercase text-[#8A8F9C]">or</span>
                            <Separator className="flex-1 bg-[#12151B]/10" />
                        </div>
                        <div className="space-y-2.5">
                            <Button
                                variant="outline"
                                className="auth-body w-full h-11 border-[#12151B]/15 text-[#12151B] bg-white hover:bg-[#F1EFEA] hover:border-[#12151B]/25 rounded-lg font-normal transition-colors disabled:opacity-60"
                                type="button"
                                disabled={isSubmitting}
                                onClick={handleGoogleSignIn}
                            >
                                {googleLoading ? (
                                    <Loader2 className="w-4 h-4 mr-2.5 animate-spin" />
                                ) : (
                                    <GoogleIcon className="w-4 h-4 mr-2.5" />
                                )}
                                {googleLoading ? 'Signing in…' : 'Continue with Google'}
                            </Button>

                            <Button
                                variant="outline"
                                className="auth-body w-full h-11 border-[#12151B]/15 text-[#12151B] bg-white hover:bg-[#12151B] hover:text-white hover:border-[#12151B] rounded-lg font-normal transition-colors disabled:opacity-60"
                                type="button"
                                disabled={isSubmitting}
                                onClick={handleGitHubSignIn}
                            >
                                {githubLoading ? (
                                    <Loader2 className="w-4 h-4 mr-2.5 animate-spin" />
                                ) : (
                                    <Github className="w-4 h-4 mr-2.5" />
                                )}
                                {githubLoading ? 'Signing in…' : 'Continue with GitHub'}
                            </Button>
                        </div>
                    </div>

                    {/* footer */}
                    <div className="auth-body text-center mt-8 text-sm text-[#8A8F9C]">
                        By signing up, you agree to our{" "}
                        <Link href="/" className="text-[#3E63DD] hover:underline">Terms of Service</Link>
                        {" "}and{" "}
                        <Link href="/" className="text-[#3E63DD] hover:underline">Privacy Policy</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;