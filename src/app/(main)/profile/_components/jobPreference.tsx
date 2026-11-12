"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Briefcase, X } from "lucide-react";
import { useState } from "react";

const JobPreference = () => {
  const [selectedRoles, setSelectedRoles] = useState<string[]>(['Software Engineer', 'Frontend Developer']);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>(['Technology', 'Fintech']);

  const roles = [
    'Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
    'Data Scientist', 'Product Manager', 'UX Designer', 'DevOps Engineer',
    'Mobile Developer', 'QA Engineer', 'Technical Lead', 'Engineering Manager'
  ];

  const industries = [
    'Technology', 'Fintech', 'Healthcare', 'E-commerce', 'Gaming',
    'Media', 'Education', 'Automotive', 'Real Estate', 'Consulting'
  ];

  const handleRoleToggle = (role: string) => {
    setSelectedRoles(prev =>
      prev.includes(role)
        ? prev.filter(r => r !== role)
        : [...prev, role]
    );
  };

  const handleIndustryToggle = (industry: string) => {
    setSelectedIndustries(prev =>
      prev.includes(industry)
        ? prev.filter(i => i !== industry)
        : [...prev, industry]
    );
  };

  const chipClasses =
    "profile-body px-3 py-1 rounded-full font-normal border border-[#3E63DD]/20 bg-[#3E63DD]/5 text-[#3E63DD] hover:bg-[#3E63DD]/5 dark:border-[#8FA8FF]/25 dark:bg-[#8FA8FF]/10 dark:text-[#8FA8FF] dark:hover:bg-[#8FA8FF]/15";

  return (
    <Card className="border border-[#12151B]/10 dark:border-white/10 dark:bg-white/[0.04] rounded-xl shadow-none">
      <CardHeader>
        <CardTitle className="profile-display flex items-center text-[#12151B] dark:text-white">
          <Briefcase className="h-5 w-5 mr-2 text-[#3E63DD] dark:text-[#8FA8FF]" strokeWidth={1.75} />
          Job preferences
        </CardTitle>
        <CardDescription className="profile-body text-[#6B7280] dark:text-white/60">
          Select roles and industries you&apos;re interested in
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="profile-body text-base font-medium text-[#12151B] dark:text-white">Target roles</Label>
          <p className="profile-body text-sm text-[#6B7280] dark:text-white/60 mb-3">Choose the positions you&apos;re preparing for</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedRoles.map((role) => (
              <Badge key={role} variant="outline" className={chipClasses}>
                {role}
                <button
                  onClick={() => handleRoleToggle(role)}
                  className="ml-2 text-[#3E63DD] hover:text-[#12151B] dark:text-[#8FA8FF] dark:hover:text-white"
                >
                  <X className="h-3 w-3" strokeWidth={1.75} />
                </button>
              </Badge>
            ))}
          </div>
          <Select onValueChange={(value) => handleRoleToggle(value)}>
            <SelectTrigger className="profile-body rounded-lg border-[#12151B]/15 dark:border-white/15 dark:bg-white/[0.04] dark:text-white focus-visible:ring-[#3E63DD] dark:focus-visible:ring-[#8FA8FF] focus-visible:ring-offset-0">
              <SelectValue placeholder="Add a role" />
            </SelectTrigger>
            <SelectContent>
              {roles.filter(role => !selectedRoles.includes(role)).map((role) => (
                <SelectItem key={role} value={role}>{role}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="profile-body text-base font-medium text-[#12151B] dark:text-white">Industries</Label>
          <p className="profile-body text-sm text-[#6B7280] dark:text-white/60 mb-3">Select industries you&apos;re targeting</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedIndustries.map((industry) => (
              <Badge key={industry} variant="outline" className={chipClasses}>
                {industry}
                <button
                  onClick={() => handleIndustryToggle(industry)}
                  className="ml-2 text-[#3E63DD] hover:text-[#12151B] dark:text-[#8FA8FF] dark:hover:text-white"
                >
                  <X className="h-3 w-3" strokeWidth={1.75} />
                </button>
              </Badge>
            ))}
          </div>
          <Select onValueChange={(value) => handleIndustryToggle(value)}>
            <SelectTrigger className="profile-body rounded-lg border-[#12151B]/15 dark:border-white/15 dark:bg-white/[0.04] dark:text-white focus-visible:ring-[#3E63DD] dark:focus-visible:ring-[#8FA8FF] focus-visible:ring-offset-0">
              <SelectValue placeholder="Add an industry" />
            </SelectTrigger>
            <SelectContent>
              {industries.filter(industry => !selectedIndustries.includes(industry)).map((industry) => (
                <SelectItem key={industry} value={industry}>{industry}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobPreference;