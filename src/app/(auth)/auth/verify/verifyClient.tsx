"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { MailCheck, ArrowLeft, Loader2, ShieldCheck } from "lucide-react";
import { verifyCode as verifyCodeAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { platformName } from "@/data/constant";

const VerifyClient = () => {
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email");
  const [email, setEmail] = useState(emailParam || "");
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (emailParam) setEmail(emailParam);
  }, [emailParam]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedEmail = email.trim();
    const trimmedCode = code.trim();

    if (!trimmedEmail || !trimmedCode) {
      toast.error("Please enter both your email and verification code.");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await verifyCodeAction({
        email: trimmedEmail,
        verifyCode: trimmedCode,
      });

      if (!res.success) {
        toast.error(res.error || res.message || "Invalid verification code");
        return;
      }

      toast.success("Email verified successfully! Please sign in to continue.");
      setTimeout(() => router.push("/auth"), 500);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while verifying");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F4] text-[#12151B] flex flex-col justify-between p-6">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500&display=swap');
        .verify-display { font-family: 'Space Grotesk', sans-serif; }
        .verify-body { font-family: 'IBM Plex Sans', sans-serif; }
        .verify-mono { font-family: 'IBM Plex Mono', monospace; }
      `}</style>

      {/* Top bar */}
      <div className="w-full max-w-5xl mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="verify-display text-lg font-bold tracking-tight text-[#12151B]"
        >
          {platformName}
        </Link>
        <Link
          href="/auth"
          className="verify-body inline-flex items-center gap-1.5 text-sm text-[#6B7280] hover:text-[#12151B] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to sign in
        </Link>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-md mx-auto my-auto py-10">
        <div className="bg-white border border-[#12151B]/10 rounded-xl p-8">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-12 h-12 rounded-full bg-[#35D0BA]/15 border border-[#35D0BA]/30 flex items-center justify-center mb-4">
              <MailCheck className="w-6 h-6 text-[#12151B]" strokeWidth={1.75} />
            </div>
            <span className="verify-mono text-[11px] uppercase tracking-wider text-[#3E63DD] font-medium mb-1">
              Email Verification
            </span>
            <h1 className="verify-display text-2xl font-bold text-[#12151B]">
              Verify your account
            </h1>
            <p className="verify-body text-sm text-[#6B7280] mt-1.5">
              Enter the 6-digit verification code sent to your inbox.
            </p>
          </div>

          {emailParam && (
            <div className="mb-5 px-3.5 py-2.5 rounded-lg bg-[#FAF8F4] border border-[#12151B]/10 text-center">
              <p className="verify-body text-xs text-[#6B7280]">
                Code sent to{" "}
                <span className="verify-mono font-medium text-[#12151B]">
                  {emailParam}
                </span>
              </p>
            </div>
          )}

          <form onSubmit={handleVerify} className="space-y-4">
            {!emailParam && (
              <div className="space-y-1.5">
                <Label
                  htmlFor="verify-email"
                  className="verify-body text-sm font-medium text-[#12151B]"
                >
                  Email address
                </Label>
                <Input
                  id="verify-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="verify-body h-11 bg-white border-[#12151B]/15 focus-visible:ring-[#3E63DD]"
                  required
                />
              </div>
            )}

            <div className="space-y-1.5">
              <Label
                htmlFor="verify-code"
                className="verify-body text-sm font-medium text-[#12151B]"
              >
                Verification code
              </Label>
              <Input
                id="verify-code"
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                placeholder="000000"
                className="verify-mono h-12 text-center text-lg tracking-[0.35em] bg-white border-[#12151B]/15 focus-visible:ring-[#3E63DD]"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="verify-body w-full h-11 rounded-lg bg-[#12151B] hover:bg-[#1E222B] text-white font-medium transition-colors"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Verifying…
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 mr-2 text-[#35D0BA]" />
                  Verify account
                </>
              )}
            </Button>
          </form>

          <p className="verify-body text-xs text-center text-[#8A8F9C] mt-6">
            Didn&apos;t receive the email? Check your spam folder or try signing up again.
          </p>
        </div>
      </div>

      <div className="verify-mono text-xs text-center text-[#8A8F9C]">
        {platformName}
      </div>
    </div>
  );
};

export default VerifyClient;
