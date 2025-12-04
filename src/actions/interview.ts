"use server"
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import prisma from "@/lib/prisma"
import { errorResponse, successResponse } from "@/lib/response";
import { InterviewSetupType } from "@/schema/InterviewSetupSchema";
import { SignupType } from "@/schema/signupSchema"
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { InterviewType as PrismaInterviewType, DifficultyLevel as PrismaDifficultyLevel, Duration as PrismaDuration, InterviewMode as PrismaInterviewMode, JobPosition as PrismaJobPosition, ExperienceLevel as PrismaExperienceLevel } from "@/generated/prisma";
import { jsonrepair } from "jsonrepair";
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
                case 10: return "MIN_10";
                case 15: return "MIN_15";
                case 20: return "MIN_20";
                case 25: return "MIN_25";
                case 30: return "MIN_30";
                case 35: return "MIN_35";
                case 40: return "MIN_40";
                case 45: return "MIN_45";
                case 50: return "MIN_50";
                case 55: return "MIN_55";
                case 60: return "MIN_60";
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


        let questionCount = Math.floor(duration);
        // enforce min–max limits
        if (questionCount < 4) questionCount = 4;
        if (questionCount > 12) questionCount = 12;

        const sysPrompt = `
            You are an expert technical interviewer.

            Generate exactly ${questionCount} real-time, voice-friendly technical interview questions. Each question should:
            - Be short, clear, and spoken-friendly.
            - Not require writing or showing code, diagrams, or mathematical formulas.
            - Focus on conceptual understanding, system thinking, debugging reasoning, definitions, or real-world scenarios.
            - Be answerable in under 60 seconds verbally.
            - Avoid coding challenges or tasks that require typing.

            Format:
            Respond ONLY with a JSON array like below:
            [
            {"question": "...", "expectedAnswer": "..."},
            {"question": "...", "expectedAnswer": "..."},
            ...
            ]

            NO extra text outside of the JSON array.
        `;

        const userPrompt = `
            Job Position: ${jobPosition}
            Tech Stack: ${Array.isArray(techStack) ? techStack.join(", ") : techStack}
            Difficulty Level: ${difficultyLevel}
            Experience Level: ${experienceLevel}
            Interview Type: ${interviewType}
            Mode: ${interviewMode}
            Job Description: ${jobDescription || "N/A"}

            Generate ${questionCount} voice-friendly technical interview questions tailored to the above information.
        `;


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
        }
        catch (err) {
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



interface SavedMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
}


export async function generateFeedbackForInterview(messages: SavedMessage[], sessionId: string) {
    try {
        const session = await getServerSession(authOptions);
        // console.log("session: ", session)

        if(!session || !session?.user?.email){
            return errorResponse("Unauthorized: User not logged in");
        }
        const userId = session?.user?.id;
        if (!userId) {
            return errorResponse("Unauthorized: User ID missing in session");
        }


        if (!messages || messages.length === 0) {
            throw new Error("No messages provided for feedback generation.");
        }

        const sysPrompt = `
            You are an AI interview feedback assistant. Based on the user’s answers, generate structured JSON feedback. Respond ONLY with valid JSON (no code blocks, explanations, or comments). The JSON MUST follow this exact structure:

            {
                "rating": "string (1-10 scale)",
                "summary": "overall interview summary",
                "strengths": ["list of overall strengths"],
                "improvements": ["list of overall improvements"],
                "questions": [
                    {
                        "question": "string",
                        "correctAnswer": "string",
                        "userAnswer": "string",
                        "isCorrect": true/false,
                        "rating": "number (1-5)",
                        "feedback": "detailed feedback on this question",
                        "strengths": ["list of strengths"],
                        "improvements": ["list of improvements"]
                    }
                ]
            }

            STRICT RULES (IMPORTANT):
            - Every key MUST exist.
            - No field may be omitted under any circumstances.
            - No field may be null or undefined.
            - If the user did not answer the question, use: 
            "userAnswer": "", "isCorrect": false, "rating": 0, "feedback": ""
            - If a meaningful value is unavailable, use "" or [].
            - Every question object MUST include: 
            question, correctAnswer, userAnswer, isCorrect, rating, feedback, strengths, improvements.
            - Return ONLY pure JSON that matches the structure exactly.
        `;


        const conversation = messages
        .map((msg) => `[${msg.role.toUpperCase()}]: ${msg.content}`)
        .join("\n");


        const userPrompt = `
            Here is the interview transcript:

            ${conversation}

            Based on this interview, please generate the structured feedback JSON as specified.
        `;

        const completion = await groq.chat.completions.create({
            model: "llama-3.1-8b-instant",
            messages: [
                { role: "system", content: sysPrompt },
                { role: "user", content: userPrompt },
            ],
            temperature: 0.2,
            max_tokens: 600,
        });

        const raw = completion.choices?.[0]?.message?.content?.trim() ?? "";
        console.log("Raw LLM output:", raw);


        let feedback;
        try {
            // Attempt to repair and parse the JSON
            const repaired = jsonrepair(raw);
            console.log("respaired response: ", repaired)

            feedback = JSON.parse(repaired);
            console.log("Feedback : ",  feedback)
        }
        catch (parseErr) {
            console.error("Failed to repair/parse LLM output:", parseErr);
            return errorResponse("Invalid JSON output received from LLM");
        }


        
        try {
            // ---------------------------------------------------
            // 🔥 SANITIZE ALL FIELDS TO PREVENT PRISMA ERRORS
            // ---------------------------------------------------
            const sanitizeString = (val: any) =>
                typeof val === "string" ? val : "";

            const sanitizeBool = (val: any) =>
                typeof val === "boolean" ? val : false;

            const sanitizeNumber = (val: any) =>
                typeof val === "number" ? val : 0;

            const sanitizeArray = (val: any) =>
                Array.isArray(val) ? val : [];

            const sanitizeQuestion = (q: any) => ({
                question: sanitizeString(q.question),
                correctAnswer: sanitizeString(q.correctAnswer),
                userAnswer: sanitizeString(q.userAnswer),
                isCorrect: sanitizeBool(q.isCorrect),
                rating: sanitizeNumber(q.rating),
                feedback: sanitizeString(q.feedback),
                strengths: sanitizeArray(q.strengths),
                improvements: sanitizeArray(q.improvements),
            });

            const safeFeedback = {
                rating: sanitizeString(feedback.rating),
                summary: sanitizeString(feedback.summary),
                strengths: sanitizeArray(feedback.strengths),
                improvements: sanitizeArray(feedback.improvements),
                questions: sanitizeArray(feedback.questions).map(sanitizeQuestion)
            };

            console.log("safe feedback data : ", safeFeedback)
            // ---------------------------------------------------
            // 🔥 UPDATE DATABASE (100% SAFE NOW)
            // ---------------------------------------------------

            const updatedInterview = await prisma.interviewSession.update({
                where: { id: sessionId },
                data: {
                    rating: safeFeedback.rating,
                    summary: safeFeedback.summary,
                    strengths: safeFeedback.strengths,
                    improvements: safeFeedback.improvements,
                    answers: {
                        deleteMany: {},
                        create: safeFeedback.questions.map(q => ({
                            question: q.question,
                            correctAnswer: q.correctAnswer,
                            userAnswer: q.userAnswer,
                            isCorrect: q.isCorrect,
                            rating: q.rating,
                            feedback: q.feedback,
                            strengths: q.strengths,
                            improvements: q.improvements
                        }))
                    }
                }
            });



            // Safely update DB only when parsed JSON is valid
            // const updatedInterview = await prisma.interviewSession.update({
            //     where: { id: sessionId },
            //     data: {
            //         rating: feedback.rating,
            //         summary: feedback.summary,
            //         strengths: feedback.strengths || [],
            //         improvements: feedback.improvements || [],
            //         answers: {
            //             deleteMany: {},
            //             create: feedback.questions.map((q: any) => ({
            //             question: q.question,
            //             correctAnswer: q.correctAnswer,
            //             userAnswer: q.userAnswer,
            //             isCorrect: q.isCorrect,
            //             rating: q.rating,
            //             feedback: q.feedback,
            //             strengths: q.strengths || [],
            //             improvements: q.improvements || [],
            //             })),
            //         },
            //     },
            // });

            return successResponse({ updatedInterview }, "Feedback generated and saved");
        }
        catch (dbErr) {
            console.error("Database insertion error:", dbErr);
            return errorResponse("Failed to save feedback in database");
        }
    }
    catch (err) {
        console.error("Error in generating feedback ->", err);
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





