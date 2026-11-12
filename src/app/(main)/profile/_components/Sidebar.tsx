"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Target } from "lucide-react";

const SidebarProfile = () => {
  return (
    <div className="space-y-6">
      {/* Interview Goals */}
      <Card className="border border-[#12151B]/10 dark:border-white/10 dark:bg-white/[0.04] rounded-xl shadow-none">
        <CardHeader>
          <CardTitle className="profile-display flex items-center text-[#12151B] dark:text-white">
            <Target className="h-5 w-5 mr-2 text-[#3E63DD] dark:text-[#8FA8FF]" strokeWidth={1.75} />
            Interview goals
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="experience" className="profile-body text-[#12151B] dark:text-white">Experience level</Label>
            <Select defaultValue="mid">
              <SelectTrigger className="profile-body rounded-lg border-[#12151B]/15 dark:border-white/15 dark:bg-white/[0.04] dark:text-white focus-visible:ring-[#3E63DD] dark:focus-visible:ring-[#8FA8FF] focus-visible:ring-offset-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="entry">Entry level (0-2 years)</SelectItem>
                <SelectItem value="mid">Mid level (3-5 years)</SelectItem>
                <SelectItem value="senior">Senior level (5+ years)</SelectItem>
                <SelectItem value="lead">Lead/manager (8+ years)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="targetCompany" className="profile-body text-[#12151B] dark:text-white">Target company size</Label>
            <Select defaultValue="medium">
              <SelectTrigger className="profile-body rounded-lg border-[#12151B]/15 dark:border-white/15 dark:bg-white/[0.04] dark:text-white focus-visible:ring-[#3E63DD] dark:focus-visible:ring-[#8FA8FF] focus-visible:ring-offset-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="startup">Startup (1-50 employees)</SelectItem>
                <SelectItem value="small">Small (51-200 employees)</SelectItem>
                <SelectItem value="medium">Medium (201-1000 employees)</SelectItem>
                <SelectItem value="large">Large (1000+ employees)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="profile-body text-[#12151B] dark:text-white">Focus areas</Label>
            <div className="space-y-2 mt-2">
              {['Technical Skills', 'Behavioral Questions', 'System Design', 'Leadership'].map((area) => (
                <div key={area} className="flex items-center space-x-2">
                  <Checkbox
                    id={area}
                    defaultChecked={area === 'Technical Skills'}
                    className="border-[#12151B]/20 dark:border-white/25 data-[state=checked]:bg-[#3E63DD] data-[state=checked]:border-[#3E63DD] dark:data-[state=checked]:bg-[#8FA8FF] dark:data-[state=checked]:border-[#8FA8FF]"
                  />
                  <Label htmlFor={area} className="profile-body text-sm text-[#374151] dark:text-white/75">{area}</Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card className="border border-[#12151B]/10 dark:border-white/10 dark:bg-white/[0.04] rounded-xl shadow-none">
        <CardHeader>
          <CardTitle className="profile-display text-[#12151B] dark:text-white">Profile completion</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="profile-body text-sm text-[#374151] dark:text-white/75">Basic info</span>
              <Badge className="profile-mono text-[11px] uppercase tracking-wide bg-[#35D0BA]/15 text-[#12151B] hover:bg-[#35D0BA]/15 dark:bg-[#4ADE80]/15 dark:text-[#4ADE80] dark:hover:bg-[#4ADE80]/15 border-0">
                Complete
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="profile-body text-sm text-[#374151] dark:text-white/75">Resume</span>
              <Badge className="profile-mono text-[11px] uppercase tracking-wide bg-[#35D0BA]/15 text-[#12151B] hover:bg-[#35D0BA]/15 dark:bg-[#4ADE80]/15 dark:text-[#4ADE80] dark:hover:bg-[#4ADE80]/15 border-0">
                Complete
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="profile-body text-sm text-[#374151] dark:text-white/75">Job preferences</span>
              <Badge className="profile-mono text-[11px] uppercase tracking-wide bg-[#35D0BA]/15 text-[#12151B] hover:bg-[#35D0BA]/15 dark:bg-[#4ADE80]/15 dark:text-[#4ADE80] dark:hover:bg-[#4ADE80]/15 border-0">
                Complete
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="profile-body text-sm text-[#374151] dark:text-white/75">Goals</span>
              <Badge className="profile-mono text-[11px] uppercase tracking-wide bg-amber-500/15 text-amber-700 dark:text-amber-400 hover:bg-amber-500/15 border-0">
                Incomplete
              </Badge>
            </div>
          </div>
          <div className="mt-4 text-center">
            <p className="profile-display text-2xl font-bold text-[#2BB8A4]">85%</p>
            <p className="profile-body text-sm text-[#6B7280]">Profile complete</p>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <Button className="profile-body w-full bg-[#12151B] hover:bg-[#1E222B] text-white rounded-lg">
        Save changes
      </Button>
    </div>
  );
};

export default SidebarProfile;