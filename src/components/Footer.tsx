'use client'
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { emailAddress, platformName } from "@/data/constant";
import { Mic, Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#12151B] text-white border-t border-white/10">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500&display=swap');
        .foot-display { font-family: 'Space Grotesk', sans-serif; }
        .foot-body { font-family: 'IBM Plex Sans', sans-serif; }
        .foot-mono { font-family: 'IBM Plex Mono', monospace; }
      `}</style>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 border border-[#35D0BA]/40 rounded-lg flex items-center justify-center mr-3">
                <Mic className="w-4 h-4 text-[#35D0BA]" />
              </div>
              <span className="foot-display text-xl font-bold">{platformName}</span>
            </div>
            <p className="foot-body text-[#9CA1AD] mb-6 leading-relaxed max-w-sm">
              A voice-driven interview partner that helps teams evaluate
              candidates consistently and fairly.
            </p>
            <div className="space-y-2.5">
              <a
                href={`mailto:${emailAddress}`}
                className="foot-body group flex items-center text-[#9CA1AD] hover:text-white transition-colors w-fit"
              >
                <Mail className="w-4 h-4 mr-3 text-[#6B7280] group-hover:text-[#35D0BA] transition-colors" />
                <span>{emailAddress}</span>
              </a>
              <a
                href="tel:+15551234567"
                className="foot-body group flex items-center text-[#9CA1AD] hover:text-white transition-colors w-fit"
              >
                <Phone className="w-4 h-4 mr-3 text-[#6B7280] group-hover:text-[#35D0BA] transition-colors" />
                <span>+1 (555) 123-4567</span>
              </a>
              <div className="foot-body flex items-center text-[#9CA1AD]">
                <MapPin className="w-4 h-4 mr-3 text-[#6B7280]" />
                <span>India</span>
              </div>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="foot-mono text-xs tracking-[0.14em] uppercase text-[#6B7280] mb-6">Product</h3>
            <ul className="foot-body space-y-3">
              <li><a href="#" className="text-[#9CA1AD] hover:text-white transition-colors">Features</a></li>
              <li><a href="#" className="text-[#9CA1AD] hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="text-[#9CA1AD] hover:text-white transition-colors">Integrations</a></li>
              <li><a href="#" className="text-[#9CA1AD] hover:text-white transition-colors">Security</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="foot-mono text-xs tracking-[0.14em] uppercase text-[#6B7280] mb-6">Company</h3>
            <ul className="foot-body space-y-3">
              <li><a href="#" className="text-[#9CA1AD] hover:text-white transition-colors">About us</a></li>
              <li><a href="#" className="text-[#9CA1AD] hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="text-[#9CA1AD] hover:text-white transition-colors">Privacy policy</a></li>
            </ul>
          </div>
        </div>

        <Separator className="bg-white/10 mb-8" />

        {/* CTA Section */}
        <div className="text-center mb-8">
          <h3 className="foot-display text-2xl font-bold mb-4">Ready to transform your hiring process?</h3>
          <p className="foot-body text-[#9CA1AD] mb-6">Join the teams already using AI to build better teams.</p>
          <Button className="foot-body bg-[#8FA8FF] hover:bg-[#7A96FF] text-[#12151B] px-8 py-3 rounded-lg font-semibold">
            Start your free trial
          </Button>
        </div>

        <Separator className="bg-white/10 mb-8" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="foot-mono text-[#6B7280] text-xs">
            © {year} <span className="text-[#9CA1AD]">{platformName}.</span> All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/" className="foot-body text-[#9CA1AD] hover:text-white transition-colors text-sm">
              Terms
            </Link>
            <Link href="/" className="foot-body text-[#9CA1AD] hover:text-white transition-colors text-sm">
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;