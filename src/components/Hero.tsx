"use client"
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, FileText, Brain } from "lucide-react";
import { useRouter } from "next/navigation";

const Hero = () => {
  const router = useRouter()

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20 pb-24">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 bg-grid-black/[0.02] bg-[size:60px_60px]" />
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-40 right-20 w-40 h-40 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute bottom-20 left-1/3 w-24 h-24 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-full blur-2xl animate-pulse delay-500" />

      <div className="relative container mx-auto px-6">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-sm font-medium text-gray-700 mb-8 animate-fade-in border border-blue-200/50 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 mr-2 text-blue-500 animate-pulse" />
            AI-Powered Interview Platform
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight animate-fade-in">
            Transform Your{" "}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse">
              Hiring Process
            </span>{" "}
            with AI
          </h1>

          {/* Subtext */}
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in animation-delay-300">
           Streamline interviews, eliminate bias, and identify top talent with our intelligent interview platform that adapts to your unique hiring needs.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in animation-delay-500">  
            <Button
              onClick={()=> {
                router.push("/auth")
              }}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 group"
            >
              <Brain className="w-5 h-5 mr-2 group-hover:animate-pulse" />
              Start Mock Interview
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Feature Grid */}
          <div className="grid md:grid-cols-3 gap-8 text-center animate-fade-in animation-delay-700">

            {/* Feature 1 */}
            <div className="p-6 backdrop-blur-sm bg-white/50 rounded-2xl border border-gray-200/50 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse delay-500">
                <span className="text-sm font-bold text-white">Real Time</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Voice Interaction</h3>
              <p className="text-gray-600">
                Uses VAPI to simulate natural, real-time interview conversations.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 backdrop-blur-sm bg-white/50 rounded-2xl border border-gray-200/50 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse delay-500">
                <span className="text-sm font-bold text-white">AI</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Dynamic Questions</h3>
              <p className="text-gray-600">
                Grok AI generates personalized technical and HR interview questions.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 backdrop-blur-sm bg-white/50 rounded-2xl border border-gray-200/50 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse delay-500">
                <span className="text-sm font-bold text-white">Secure</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Data Management</h3>
              <p className="text-gray-600">
                User sessions and results are safely stored using PostgreSQL + Prisma.
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
