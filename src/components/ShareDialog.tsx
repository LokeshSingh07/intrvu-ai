'use client'

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';
import { 
  Link2, 
  Copy, 
  Download, 
  Mail, 
  Linkedin, 
  Twitter, 
  Check 
} from "lucide-react";

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportTitle: string;
  pdfBlob: Blob | null;
  shareUrl?: string;
}

const ShareDialog: React.FC<ShareDialogProps> = ({ 
  open, 
  onOpenChange, 
  reportTitle,
  pdfBlob,
  shareUrl = typeof window !== 'undefined' ? window.location.href : ''
}) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  const downloadPdf = () => {
    if (!pdfBlob) {
      toast.error("PDF not ready yet");
      return;
    }
    const url = URL.createObjectURL(pdfBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportTitle.replace(/[^a-z0-9]/gi, '_')}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("PDF downloaded!");
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`My ${reportTitle}`);
    const body = encodeURIComponent(`Check out my interview report:\n\n${shareUrl}`);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const shareToLinkedIn = () => {
    const text = encodeURIComponent(`I just completed a ${reportTitle} with a strong score! Practicing for interviews.`);
    const url = encodeURIComponent(shareUrl);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${text}`);
  };

  const shareToTwitter = () => {
    const text = encodeURIComponent(`Just crushed my ${reportTitle}! Check my detailed report`);
    const url = encodeURIComponent(shareUrl);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-2xl border border-[#12151B]/10 dark:border-white/10 dark:bg-[#181C24] dark:text-white p-0 overflow-hidden">
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500&display=swap');
          .share-display { font-family: 'Space Grotesk', sans-serif; }
          .share-body { font-family: 'IBM Plex Sans', sans-serif; }
          .share-mono { font-family: 'IBM Plex Mono', monospace; }
        `}</style>

        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="share-display flex items-center gap-2 text-[#12151B] dark:text-white text-lg font-semibold">
            <Link2 className="w-4 h-4 text-[#3E63DD] dark:text-[#8FA8FF]" />
            Share report
          </DialogTitle>
          <DialogDescription className="share-body text-[#6B7280] dark:text-white/60">
            Share your interview performance with recruiters, mentors, or friends.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 px-6 pb-6 pt-2">
          {/* Shareable Link */}
          <div className="space-y-2">
            <Label htmlFor="share-link" className="share-mono text-[11px] tracking-wide uppercase text-[#6B7280] dark:text-white/60">
              Direct link
            </Label>
            <div className="flex gap-2">
              <Input 
                id="share-link" 
                value={shareUrl} 
                readOnly 
                className="share-mono flex-1 text-sm h-10 rounded-lg border-[#12151B]/15 bg-[#FAF8F4] text-[#374151] dark:border-white/15 dark:bg-white/[0.04] dark:text-white/80 focus-visible:ring-[#3E63DD] dark:focus-visible:ring-[#8FA8FF] focus-visible:ring-offset-0"
              />
              <Button
                onClick={copyToClipboard}
                size="icon"
                variant="outline"
                className="h-10 w-10 shrink-0 rounded-lg border-[#12151B]/15 dark:border-white/15 dark:bg-white/[0.04] dark:hover:bg-white/[0.08]"
              >
                {copied ? <Check className="w-4 h-4 text-[#35D0BA] dark:text-[#4ADE80]" /> : <Copy className="w-4 h-4 text-[#6B7280] dark:text-white/60" />}
              </Button>
            </div>
          </div>

          {/* Social Sharing */}
          <div className="space-y-3">
            <Label className="share-mono text-[11px] tracking-wide uppercase text-[#6B7280] dark:text-white/60">Share via</Label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={shareViaEmail}
                className="share-body justify-start border-[#12151B]/15 text-[#12151B] hover:bg-[#FAF8F4] dark:border-white/15 dark:bg-white/[0.04] dark:text-white dark:hover:bg-white/[0.08] rounded-lg"
              >
                <Mail className="w-4 h-4 mr-2 text-[#6B7280] dark:text-white/60" />
                Email
              </Button>
              <Button
                variant="outline"
                onClick={shareToLinkedIn}
                className="share-body justify-start border-[#12151B]/15 text-[#12151B] hover:bg-[#FAF8F4] dark:border-white/15 dark:bg-white/[0.04] dark:text-white dark:hover:bg-white/[0.08] rounded-lg"
              >
                <Linkedin className="w-4 h-4 mr-2 text-[#6B7280] dark:text-white/60" />
                LinkedIn
              </Button>
              <Button
                variant="outline"
                onClick={shareToTwitter}
                className="share-body justify-start border-[#12151B]/15 text-[#12151B] hover:bg-[#FAF8F4] dark:border-white/15 dark:bg-white/[0.04] dark:text-white dark:hover:bg-white/[0.08] rounded-lg"
              >
                <Twitter className="w-4 h-4 mr-2 text-[#6B7280] dark:text-white/60" />
                Twitter
              </Button>
              <Button
                variant="outline"
                onClick={downloadPdf}
                disabled={!pdfBlob}
                className="share-body justify-start border-[#12151B]/15 text-[#12151B] hover:bg-[#FAF8F4] dark:border-white/15 dark:bg-white/[0.04] dark:text-white dark:hover:bg-white/[0.08] rounded-lg disabled:opacity-40"
              >
                <Download className="w-4 h-4 mr-2 text-[#6B7280] dark:text-white/60" />
                Download PDF
              </Button>
            </div>
          </div>

          <div className="share-mono text-[11px] text-[#8A8F9C] dark:text-white/40 text-center tracking-wide">
            Anyone with the link can view your report
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;