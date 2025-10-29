"use server"
import prisma from "@/lib/prisma"
import { errorResponse, successResponse } from "@/lib/response";
import { SignupType } from "@/schema/signupSchema"
import bcrypt from "bcryptjs";
import crypto from "crypto"
import { sendVerificationEmail } from "@/lib/sendMail";




interface propsInterface{
    fullName: string,
    email: string,
    password: string
}

interface VerifyCodeProps {
  email: string;
  verifyCode: string;
}



export async function verifyCode({ email, verifyCode }: VerifyCodeProps){
    try{
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return errorResponse("User not found!");
        }

        if (user.isVerified) {
            return successResponse({}, "Account already verified!");
        }

        // Check if code matches
        if (user.verifyCode !== verifyCode) {
            return errorResponse("Invalid verification code!");
        }

        await prisma.user.update({
        where: { email },
            data: {
                isVerified: true,
                verifyCode: "",
            },
        });


        return successResponse({}, "Account verified")
    }
    catch(err){
        return errorResponse();
    }
}


export async function createAccount({fullName, email, password}: propsInterface){
    try{
        // check if user already exist
        const existingUser = await prisma.user.findUnique({
            where: {email}
        })

        if(existingUser){
            return errorResponse("User already exist. Please login!");
        }

        const generatedVerifyCode = crypto.randomInt(100000, 999999).toString();
        
        // hashed the pass
        const hashedPassword = await bcrypt.hash(password, 10);
        

        // create user
        const user = await prisma.user.create({
            data: {
                fullName,
                email,
                password: hashedPassword,
                verifyCode: generatedVerifyCode,
                experienceLevel: "junior",
                targetCompanySize: "small",
                industry: [],
                targetRoles: [],
                focusArea: []
            }
        })


        const { password: _, ...userWithoutPassword } = user;

        // TODO: send `verifyCode` via email (e.g. using Resend/Nodemailer)
        const emailResponse = await sendVerificationEmail(
            email, generatedVerifyCode
        )

        console.log("Email response : ", emailResponse);

        if(!emailResponse.success){
            return successResponse({}, "Email failed to sent")
        }

        return successResponse(userWithoutPassword, "Account created. Email sent")
    }
    catch(err){
        return errorResponse();
    }
}


