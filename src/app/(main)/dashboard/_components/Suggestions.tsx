"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Star, BookOpen, Users } from "lucide-react";




const Suggestions = () => {


  const suggestions = [
    { title: "Practice the STAR method", icon: Star },
    { title: "Technical questions", icon: BookOpen },
    { title: "Behavioral skills", icon: Users },
    { title: "System design", icon: Target },
  ];



  return (
    <Card className="border border-[#12151B]/10 dark:border-white/10 dark:bg-white/[0.04] rounded-xl shadow-none">
        <CardHeader>
            <CardTitle className="dash-display text-[#12151B] dark:text-white">Recommended for you</CardTitle>
            <CardDescription className="dash-body text-[#6B7280] dark:text-white/60">Based on your recent performance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
            {suggestions.map((suggestion, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 border border-[#12151B]/10 dark:border-white/10 rounded-lg hover:bg-[#FAF8F4] dark:hover:bg-white/[0.04] transition-colors cursor-pointer">
                    <div className="h-8 w-8 bg-[#3E63DD]/10 dark:bg-[#8FA8FF]/15 rounded-full flex items-center justify-center shrink-0">
                      <suggestion.icon className="h-4 w-4 text-[#3E63DD] dark:text-[#8FA8FF]" strokeWidth={1.75} />
                    </div>
                    <span className="dash-body text-sm font-medium text-[#12151B] dark:text-white">{suggestion.title}</span>
                  </div>
            ))}
        </CardContent>
    </Card>
  );
};

export default Suggestions;