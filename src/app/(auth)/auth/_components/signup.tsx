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
import { Loader2, Lock, Mail, User } from 'lucide-react';
import z from 'zod';
import { signIn, useSession } from 'next-auth/react';
import { createAccount } from '@/actions/auth';




const SignUp = () => {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
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
            <form onSubmit={register.handleSubmit(onSubmit)} className="space-y-8">
                {/* fullname */}
                <FormField
                    control={register.control}
                    name="fullName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                                <div className='relative'>
                                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input 
                                        placeholder="Enter your full name"
                                        className='pl-10'
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
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <div className='relative'>
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input 
                                        placeholder="Enter you email address"
                                        className='pl-10'
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
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <div className='relative'>
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input 
                                        placeholder="Enter your password" 
                                        className='pl-10'
                                        type='password'
                                        {...field}
                                    />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />



                <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    {
                        isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin"/> Creating your account...
                        </>
                        ) : ("Create Account")
                    }
                </Button>
            </form>
        </Form>

    </div>
  );
};

export default SignUp;
