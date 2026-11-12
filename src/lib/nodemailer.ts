import nodemailer from "nodemailer";

export type MailerResult =
    | { ok: true; transporter: nodemailer.Transporter; from: string }
    | { ok: false; error: string };

export function getMailer(): MailerResult {
    const host = process.env.ZOHO_SMTP_HOST || "smtp.zoho.in";
    const port = Number(process.env.ZOHO_SMTP_PORT || 465);
    const user = process.env.ZOHO_SMTP_USER;
    const pass = process.env.ZOHO_SMTP_PASS;

    if (!user || !pass) {
        console.error("Missing ZOHO_SMTP_USER or ZOHO_SMTP_PASS environment variables");
        return { ok: false, error: "SMTP credentials are not configured" };
    }

    const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
    });

    return { ok: true, transporter, from: user };
}