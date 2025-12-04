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
import { useSession } from "next-auth/react";



interface ProfileInfoProps {
  profileInfo?: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    bio?: string | null;
  }
}

const ProfileInfo = ({profileInfo}: ProfileInfoProps) => {
  console.log("profileInfo : ", profileInfo);

  if (!profileInfo) return <p>No user data available</p>;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <User className="h-5 w-5 mr-2" />
          Personal Information
        </CardTitle>
        <CardDescription>Update your basic profile details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-6">
          <Avatar className="h-20 w-20">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback>{profileInfo.name?.split(" ")[0][0]}</AvatarFallback>
          </Avatar>
          <div>
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Change Photo
            </Button>
            <p className="text-sm text-gray-600 mt-2">
              JPG, PNG or GIF. Max 5MB.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">Full Name</Label>
            <Input id="full Name" defaultValue={profileInfo?.name || ""} />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue={profileInfo?.email || ""} />
          </div>
        </div>

        <div>
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            placeholder="Tell us about yourself..."
            defaultValue={profileInfo?.bio || ""}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileInfo;
