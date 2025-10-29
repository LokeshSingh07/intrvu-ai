"use server"
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import prisma from "@/lib/prisma"
import { errorResponse, successResponse } from "@/lib/response";
import { InterviewSetupType } from "@/schema/InterviewSetupSchema";
import { SignupType } from "@/schema/signupSchema"
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { InterviewType as PrismaInterviewType, DifficultyLevel as PrismaDifficultyLevel, Duration as PrismaDuration, InterviewMode as PrismaInterviewMode, JobPosition as PrismaJobPosition, ExperienceLevel as PrismaExperienceLevel } from "@/generated/prisma";


import Groq from "groq-sdk";
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });






// export async function dashboardStats(){
//     try{
//         const session = await getServerSession(authOptions)

//         if(!session || !session?.user?.email){
//             return errorResponse("Unauthorized: User not logged in");
//         }

//         // fetch dashboard stats
//         const totalInterviews = await prisma.interviewSession.count({
//             where: {userId: session?.user?.id}
//         })

//         const recentInterviews = await prisma.interviewSession.findMany({
//             where: {
//                 userId : session?.user?.id
//             },
//             // orderBy: { createdAt: "desc "},
//             take: 4
//         })

//         const averageRating = 5;
//         const accuracy = 10;

//         const result = {
//             totalInterviewCount: totalInterviews,
//             rating: averageRating,
//             accuracy,
//             recentInterviews
//         };

//         console.log("result :", result);

//         return successResponse(result, "Interview sessions fetched successfully");
//     }
//     catch(err){
//         console.log("Error in dashboardStats -> ", err)
//         return errorResponse();
//     }
// }





export async function createInterviewSession({difficultyLevel, duration, experienceLevel, interviewMode, interviewType, jobPosition, jobDescription, targetCompanySize, techStack}: InterviewSetupType){
    try{
        const session = await getServerSession(authOptions);
        console.log("session: ", session)

        if(!session || !session?.user?.email){
            return errorResponse("Unauthorized: User not logged in");
        }
        const userId = session?.user?.id;
        if (!userId) {
            return errorResponse("Unauthorized: User ID missing in session");
        }

        const durationEnum = (() => {
            switch(duration) {
                case 15: return "MIN_15";
                case 30: return "MIN_30";
                case 45: return "MIN_45";
                case 60: return "MIN_60";
                case 90: return "MIN_90";
                case 120: return "MIN_120";
                default: throw new Error("Invalid duration");
            }
        })();

        const interview = await prisma.interviewSession.create({
            data: {
                  userId,
                  interviewType,
                  difficultyLevel,
                  duration: durationEnum,
                  interviewMode,
                  experienceLevel,
                  jobPosition,
                  jobDescription,
                  techStack,
            }
        })
        if(!interview){
            return errorResponse("error while creating interview session")
        }


        // ✅ Generate questions using Groq LLM
        const sysPrompt = `You are an expert technical interviewer.
            - Generate exactly 5 coding/technical interview questions.
            - Tailor them to the candidate's job position, tech stack, and difficulty level.
            - Respond in JSON format as an array like:
            [
                {"question": "...", "correctAnswer": "..."},
                {"question": "...", "correctAnswer": "..."},
                ...
            ]
            - Keep questions concise and relevant.
            - Avoid any extra text outside the JSON array.`;


          const userPrompt = `Job Position: ${jobPosition}
            Tech Stack: ${Array.isArray(techStack) ? techStack.join(", ") : techStack}
            Difficulty Level: ${difficultyLevel}
            Experience Level: ${experienceLevel}
            Interview Type: ${interviewType}
            Mode: ${interviewMode}
            Job Description: ${jobDescription || "N/A"}

            Generate the 5 best interview questions.`;


        const completion = await groq.chat.completions.create({
            model: "llama-3.1-8b-instant",
            messages: [
                { role: "system", content: sysPrompt },
                { role: "user", content: userPrompt },
            ],
            temperature: 0.3,
            max_tokens: 800,
        });
        const content = completion.choices?.[0]?.message?.content?.trim() || "[]";

        // ✅ Parse and validate the AI output
        let generatedQuestions = [];
        try {
        generatedQuestions = JSON.parse(content);
        } catch (err) {
        console.warn("Failed to parse LLM output, fallback to empty list");
        generatedQuestions = [];
        }




        console.log("interview session details: ", interview)

        return successResponse(
            {interview, questions: generatedQuestions}, 
            "Interview sessionn created"
        )
    }
    catch(err){
        console.log("Error in creating interview session -> ")
        return errorResponse();
    }
}














// create interview









// const sysPrompt = `You are an expert meeting-notes summarizer.
//             - Follow the user's instruction exactly.
//             - Prefer clear markdown with headings.
//             - Be concise, factual, and actionable.
//             - Include Action Items (who/what/when) if asked.
//             - Never include raw prompt engineering or meta talk; output only the summary.`;


//         const userPrompt = `INSTRUCTION:\n${userInstruction || "Summarize clearly in bullet points and list action items at the end."}\n\nTRANSCRIPT:\n${trimmedTranscript}`;


//         const completion = await groq.chat.completions.create({
//         model: "llama-3.1-8b-instant",
//         messages: [
//             { role: "system", content: sysPrompt },
//             { role: "user", content: userPrompt }
//         ],
//         temperature: 0.2,
//         max_tokens: 1200
//         });

//         const content = completion.choices?.[0]?.message?.content || "";





