import { Suspense } from "react";
import VerifyClient from "./verifyClient";

export const dynamic = "force-dynamic";

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FAF8F4] p-4">
          <div className="w-full max-w-md bg-white border border-[#12151B]/10 rounded-xl p-8 animate-pulse">
            <div className="h-10 w-10 bg-[#F1EFEA] rounded-full mb-5 mx-auto" />
            <div className="h-6 bg-[#F1EFEA] rounded w-1/2 mb-3 mx-auto" />
            <div className="h-4 bg-[#F1EFEA] rounded w-3/4 mx-auto mb-6" />
            <div className="space-y-3">
              <div className="h-11 bg-[#F1EFEA] rounded-lg" />
              <div className="h-11 bg-[#F1EFEA] rounded-lg" />
            </div>
          </div>
        </div>
      }
    >
      <VerifyClient />
    </Suspense>
  );
}
