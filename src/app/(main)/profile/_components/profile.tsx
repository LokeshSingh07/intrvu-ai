"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Upload,
  User,
} from "lucide-react";

interface ProfileInfoProps {
  profileInfo?: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    bio?: string | null;
  }
}

const ProfileInfo = ({ profileInfo }: ProfileInfoProps) => {
  if (!profileInfo) return <p className="profile-body text-[#6B7280] dark:text-white/60">No user data available</p>;

  return (
    <Card className="border border-[#12151B]/10 dark:border-white/10 dark:bg-white/[0.04] rounded-xl shadow-none">
      <CardHeader>
        <CardTitle className="profile-display flex items-center text-[#12151B] dark:text-white">
          <User className="h-5 w-5 mr-2 text-[#3E63DD] dark:text-[#8FA8FF]" strokeWidth={1.75} />
          Personal information
        </CardTitle>
        <CardDescription className="profile-body text-[#6B7280] dark:text-white/60">
          Update your basic profile details
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-6">
          <Avatar className="h-20 w-20 border border-[#12151B]/10 dark:border-white/15">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback className="profile-display bg-[#F1EFEA] text-[#12151B] dark:bg-[#8FA8FF] dark:text-[#12151B] font-semibold">
              {profileInfo.name?.split(" ")[0][0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <Button
              variant="outline"
              size="sm"
              className="profile-body border border-[#12151B]/15 text-[#12151B] hover:bg-[#FAF8F4] dark:border-white/15 dark:bg-white/[0.04] dark:text-white dark:hover:bg-white/[0.08] rounded-lg"
            >
              <Upload className="h-4 w-4 mr-2" strokeWidth={1.75} />
              Change photo
            </Button>
            <p className="profile-body text-sm text-[#8A8F9C] dark:text-white/40 mt-2">
              JPG, PNG or GIF. Max 5MB.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fullName" className="profile-body text-[#12151B] dark:text-white">Full name</Label>
            <Input
              id="fullName"
              defaultValue={profileInfo?.name || ""}
              className="profile-body rounded-lg border-[#12151B]/15 dark:border-white/15 dark:bg-white/[0.04] dark:text-white focus-visible:ring-[#3E63DD] dark:focus-visible:ring-[#8FA8FF] focus-visible:ring-offset-0"
            />
          </div>
          <div>
            <Label htmlFor="email" className="profile-body text-[#12151B] dark:text-white">Email</Label>
            <Input
              id="email"
              type="email"
              defaultValue={profileInfo?.email || ""}
              className="profile-body rounded-lg border-[#12151B]/15 dark:border-white/15 dark:bg-white/[0.04] dark:text-white focus-visible:ring-[#3E63DD] dark:focus-visible:ring-[#8FA8FF] focus-visible:ring-offset-0"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="bio" className="profile-body text-[#12151B] dark:text-white">Bio</Label>
          <Textarea
            id="bio"
            placeholder="Tell us about yourself..."
            defaultValue={profileInfo?.bio || ""}
            className="profile-body rounded-lg border-[#12151B]/15 dark:border-white/15 dark:bg-white/[0.04] dark:text-white focus-visible:ring-[#3E63DD] dark:focus-visible:ring-[#8FA8FF] focus-visible:ring-offset-0"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileInfo;