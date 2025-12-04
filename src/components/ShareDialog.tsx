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
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link2 className="w-5 h-5" />
            Share Report
          </DialogTitle>
          <DialogDescription>
            Share your interview performance with recruiters, mentors, or friends.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Shareable Link */}
          <div className="space-y-2">
            <Label htmlFor="share-link">Direct Link</Label>
            <div className="flex gap-2">
              <Input 
                id="share-link" 
                value={shareUrl} 
                readOnly 
                className="flex-1 font-mono text-sm"
              />
              <Button onClick={copyToClipboard} size="icon" variant="outline">
                {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Social Sharing */}
          <div className="space-y-3">
            <Label>Share via</Label>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" onClick={shareViaEmail}>
                <Mail className="w-4 h-4 mr-2" />
                Email
              </Button>
              <Button variant="outline" onClick={shareToLinkedIn}>
                <Linkedin className="w-4 h-4 mr-2" />
                LinkedIn
              </Button>
              <Button variant="outline" onClick={shareToTwitter}>
                <Twitter className="w-4 h-4 mr-2" />
                Twitter
              </Button>
              <Button variant="outline" onClick={downloadPdf} disabled={!pdfBlob}>
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>

          <div className="text-xs text-muted-foreground text-center">
            Anyone with the link can view your report
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;