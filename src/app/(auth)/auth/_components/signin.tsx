'use client'
import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from 'sonner';
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react';
import z from 'zod';
import { SignInSchema, SignInType } from '@/schema/SignInSchema';
import { signIn, useSession } from 'next-auth/react';




const SignUp = () => {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const router = useRouter()
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const { status, update } = useSession();


  
    const register = useForm<SignInType>({
        resolver: zodResolver(SignInSchema),
        defaultValues: {
            identifier: "",
            password: ""
        }
    })


    useEffect(() => {
        if (status === 'authenticated') {
            router.replace('/dashboard');
        }
    }, [status, router]);
  
  
    const onSubmit: SubmitHandler<SignInType> = async(data: z.infer<typeof SignInSchema>) => {
        try{
            setIsSubmitting(true);

            const response = await signIn('credentials', {
                redirect: false,
                identifier: data.identifier,
                password: data.password
            });
    
            if (response?.error) {
                toast(response.error);
                return;
            }
            
            toast("✅ Logged in successfully. Redirecting to dashboard...");
            // Force revalidate session (ensures cookie sync before redirect)
            await update(); 
            
            setTimeout(() => {
                router.push("/dashboard");
            }, 1000);
        }
        catch(err){
            toast('An unexpected error occurred')
            console.log(err)
        }
        finally{
            setIsSubmitting(false);
        }
    };





  return (
    <div>
        <Form {...register}>
            <form onSubmit={register.handleSubmit(onSubmit)} className="space-y-6">
                {/* Email */}
                <FormField
                    control={register.control}
                    name="identifier"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="auth-mono text-[11px] tracking-wide uppercase text-[#6B7280]">Email</FormLabel>
                            <FormControl>
                                <div className='relative'>
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A8F9C]" />
                                    <Input
                                        placeholder="you@email.com"
                                        className='auth-body pl-10 h-11 rounded-lg border-[#12151B]/15 focus-visible:ring-[#3E63DD] focus-visible:ring-offset-0'
                                        {...field}
                                    />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Password */}
                <FormField
                    control={register.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="auth-mono text-[11px] tracking-wide uppercase text-[#6B7280]">Password</FormLabel>
                            <FormControl>
                                <div className='relative'>
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A8F9C]" />
                                    <Input
                                        placeholder="Enter your password"
                                        type={`${showPassword ? "text" : "password"}`}
                                        className='auth-body pl-10 pr-10 h-11 rounded-lg border-[#12151B]/15 focus-visible:ring-[#3E63DD] focus-visible:ring-offset-0'
                                        {...field}
                                    />
                                    <button
                                        type="button"
                                        onClick={()=> setShowPassword((prev) => !prev)}
                                        className='absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8F9C] hover:text-[#12151B] transition-colors'
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />



                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="auth-body w-full h-11 bg-[#12151B] hover:bg-[#1E222B] text-white rounded-lg font-medium"
                >
                    {
                        isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                            <span>Signing in...</span>
                        </>
                        ) : ("Log in")
                    }
                </Button>
            </form>
        </Form>

    </div>
  );
};

export default SignUp;