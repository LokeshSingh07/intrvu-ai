import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verificationEmail";
import { ApiResponse } from "@/lib/response";


export async function sendVerificationEmail(
    email: string,
    verifyCode: string
): Promise<ApiResponse>{

    try{
        const { data, error } = await resend.emails.send({
            from: 'no-reply@codewithlokesh.com',
            to: email,
            subject: 'Intrvu.codewithlokesh message | Verification code',
            react: VerificationEmail({email, verifyCode}),
        });

        console.log("resend error: ", error);
        if (error) {
            return {
                success: false,
                message: "Failed to send verification email"
            }
        }

        return {
            success: true,
            message: "Verifiation mail sent successfully"
        }
    }
    catch(emailError){
        console.error("Error sending verification Email", emailError);
        return {
            success: false,
            message: "Internal server error, Resend"
        }
    }
}