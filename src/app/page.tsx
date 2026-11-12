import FAQ from "@/components/FAQ";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";

export default function RootPage() {
  return (
    <div className="min-h-full w-full flex flex-col">
      <Navbar />
      <Hero />
      <Features />
      <FAQ />
      <Footer />
    </div>
  );
}
