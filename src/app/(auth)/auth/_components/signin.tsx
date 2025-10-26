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
import { Loader2, Lock, Mail, Unlock } from 'lucide-react';
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
            <form onSubmit={register.handleSubmit(onSubmit)} className="space-y-8">
                {/* Email */}
                <FormField
                    control={register.control}
                    name="identifier"
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
                                        type={`${showPassword ? "text" : "password"}`}
                                        className='pl-10'
                                        {...field}
                                    />
                                    <Button 
                                        type="button"
                                        onClick={()=> setShowPassword((prev) => !prev)}
                                        className='absolute right-3 top-2 h-5 w-5 bg-gray-300 hover:bg-gray-50'
                                    > 
                                        {showPassword ? (
                                            <Unlock className="h-5 w-5 text-gray-400" />
                                        ) : (
                                            <Lock className="h-5 w-5 text-gray-400" />
                                        )}
                                    </Button>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />



                <Button type="submit" className="w-full" variant={"gradient"}>
                    {
                        isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin"/>Signing you in, please wait...
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
