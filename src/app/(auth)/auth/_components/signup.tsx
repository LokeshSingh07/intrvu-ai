'use client'
import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from "react-hook-form"
import { SignupSchema, SignupType } from '@/schema/signupSchema';
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
import { Eye, EyeOff, Loader2, Lock, Mail, User } from 'lucide-react';
import z from 'zod';
import { signIn, useSession } from 'next-auth/react';
import { createAccount } from '@/actions/auth';




const SignUp = () => {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const router = useRouter()
    const { status, update } = useSession();


    useEffect(() => {
        if (status === 'authenticated') {
            router.replace('/dashboard');
        }
    }, [status, router]);

  
    const register = useForm<SignupType>({
        resolver: zodResolver(SignupSchema),
        defaultValues: {
            fullName: "",
            email: "",
            password: ""
        }
    })

  
  
    const onSubmit: SubmitHandler<SignupType> = async(data: z.infer<typeof SignupSchema>) => {
        try{
            setIsSubmitting(true);

            const response  = await createAccount(data);
            if(!response.success){
                toast("Error creating account");
                return;
            }
            
            router.push(`/auth/verify?email=${data.email}`)
            toast("Account created. Please verify your email before logging in.");
        }
        catch(err){
            toast("An unexpected error occurred")
        }
        finally{
            setIsSubmitting(false);
        }
    };





  return (
    <div>
        <Form {...register}>
            <form onSubmit={register.handleSubmit(onSubmit)} className="space-y-6">
                {/* fullname */}
                <FormField
                    control={register.control}
                    name="fullName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="auth-mono text-[11px] tracking-wide uppercase text-[#6B7280] dark:text-white/60">Full name</FormLabel>
                            <FormControl>
                                <div className='relative'>
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A8F9C] dark:text-white/40" />
                                    <Input
                                        placeholder="Jordan Lee"
                                        className='auth-body pl-10 h-11 rounded-lg border-[#12151B]/15 dark:border-white/15 dark:bg-white/[0.04] dark:text-white dark:placeholder:text-white/40 focus-visible:ring-[#3E63DD] dark:focus-visible:ring-[#8FA8FF] focus-visible:ring-offset-0'
                                        {...field}
                                    />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />


                {/* Email */}
                <FormField
                    control={register.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="auth-mono text-[11px] tracking-wide uppercase text-[#6B7280] dark:text-white/60">Email</FormLabel>
                            <FormControl>
                                <div className='relative'>
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A8F9C] dark:text-white/40" />
                                    <Input
                                        placeholder="you@email.com"
                                        className='auth-body pl-10 h-11 rounded-lg border-[#12151B]/15 dark:border-white/15 dark:bg-white/[0.04] dark:text-white dark:placeholder:text-white/40 focus-visible:ring-[#3E63DD] dark:focus-visible:ring-[#8FA8FF] focus-visible:ring-offset-0'
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
                            <FormLabel className="auth-mono text-[11px] tracking-wide uppercase text-[#6B7280] dark:text-white/60">Password</FormLabel>
                            <FormControl>
                                <div className='relative'>
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A8F9C] dark:text-white/40" />
                                    <Input
                                        placeholder="Create a password"
                                        type={showPassword ? "text" : "password"}
                                        className='auth-body pl-10 pr-10 h-11 rounded-lg border-[#12151B]/15 dark:border-white/15 dark:bg-white/[0.04] dark:text-white dark:placeholder:text-white/40 focus-visible:ring-[#3E63DD] dark:focus-visible:ring-[#8FA8FF] focus-visible:ring-offset-0'
                                        {...field}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        className='absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8F9C] hover:text-[#12151B] dark:text-white/40 dark:hover:text-white transition-colors'
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
                    className="auth-body w-full h-11 bg-[#12151B] hover:bg-[#1E222B] text-white dark:bg-[#8FA8FF] dark:hover:bg-[#7A96FF] dark:text-[#12151B] rounded-lg font-medium"
                >
                    {
                        isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin"/> Creating your account...
                        </>
                        ) : ("Create account")
                    }
                </Button>
            </form>
        </Form>

    </div>
  );
};

export default SignUp;