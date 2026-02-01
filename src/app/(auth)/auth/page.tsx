'use client'
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Chrome, Github } from "lucide-react";
import Link from 'next/link';
import SignIn from './_components/signin';
import SignUp from './_components/signup';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { platformName } from '@/data/constant';


const Auth = () => {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const router  = useRouter();



    const handleGoogleSignIn = async ()=>{
        try {
            setIsSubmitting(true);
            const result = await signIn('google', { redirect: false });

            if (result?.error) {
                toast.error('Failed to sign in with GitHub');
                console.error(result.error);
                return;
            }
            toast('Signed in with google');
            // router.push('/dashboard');
        } 
        catch (err) {
            toast('An unexpected error occurred');
            console.error(err);
        }
        finally {
            setIsSubmitting(false);
        }
    }

    const handleGitHubSignIn = async () => {
        try {
            setIsSubmitting(true);
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
            setIsSubmitting(false);
        }
    };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to {platformName}</h1>
          <p className="text-gray-600">Your AI-powered interview preparation platform</p>
        </div>

        <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl">Get Started</CardTitle>
                <CardDescription>Sign in to your account or create a new one</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="signin" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="signin">Sign In</TabsTrigger>
                        <TabsTrigger value="signup">Sign Up</TabsTrigger>
                    </TabsList>

                    <TabsContent value="signin" className="space-y-4 mt-6">
                        <SignIn/>
                    </TabsContent>

                    <TabsContent value="signup" className="space-y-4 mt-6">
                        <SignUp/>
                    </TabsContent>
                </Tabs>


                {/* GOOGLE & GITHUB SIGNIN */}
                <div className="mt-6">
                    <Separator className="my-4" />
                    <div className="space-y-2">
                        <Button 
                            variant="outline" 
                            className="w-full" 
                            type="button"
                            onClick={handleGoogleSignIn}
                        >
                            <Chrome className="w-4 h-4 mr-2" />
                            Continue with Google
                        </Button>

                        <Button variant="outline" className="w-full" type="button"
                            onClick={handleGitHubSignIn}
                        >
                            <Github className="w-4 h-4 mr-2" />
                            Continue with GitHub
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>


        {/* footer */}
        <div className="text-center mt-6 text-sm text-gray-600">
          By signing up, you agree to our{" "}
          <Link href="/" className="text-blue-600 hover:underline">Terms of Service</Link>
          {" "}and{" "}
          <Link href="/" className="text-blue-600 hover:underline">Privacy Policy</Link>
        </div>
      </div>
    </div>
  );
};

export default Auth;
