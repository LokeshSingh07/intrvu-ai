"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyCode as verifyCodeAction } from "@/actions/auth";

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

    if (!email || !code) {
      toast("Please fill all fields");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await verifyCodeAction({ email, verifyCode: code });

      if (!res.success) {
        toast.error(res.message || "Invalid verification code");
        return;
      }

      toast("Email verified successfully! Please login to continue.");
      setTimeout(() => router.push("/auth"), 500);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while verifying");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-2">
          Verify Your Account
        </h1>
        <p className="text-center text-gray-500 mb-1">
          Enter the 6-digit code sent to your inbox.
        </p>

        {email && (
          <p className="text-center text-sm text-gray-600 mb-6">
            Verification email sent to{" "}
            <span className="font-medium text-gray-800">{email}</span>
          </p>
        )}

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Verification Code
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter 6-digit code"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 rounded-lg text-white font-medium transition-all ${
              isSubmitting
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isSubmitting ? "Verifying..." : "Verify Account"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyClient;
