import { render } from "@react-email/components";
import VerificationEmail from "../../emails/verificationEmail";
import { ApiResponse } from "@/lib/response";
import { getMailer } from "@/lib/nodemailer";

export async function sendVerificationEmail(
    email: string,
    verifyCode: string
): Promise<ApiResponse> {
    const mailer = getMailer();

    if (!mailer.ok) {
        return {
            success: false,
            message: mailer.error,
        };
    }

    try {
        const html = await render(VerificationEmail({ email, verifyCode }));

        await mailer.transporter.sendMail({
            from: mailer.from,
            to: email,
            subject: "Intrvu.codewithlokesh message | Verification code",
            html,
            text: `Your verification code is: ${verifyCode}`,
        });

        return {
            success: true,
            message: "Verification mail sent successfully",
        };
    } catch (emailError) {
        console.error("Error sending verification Email", emailError);
        return {
            success: false,
            message: "Failed to send verification email",
        };
    }
}