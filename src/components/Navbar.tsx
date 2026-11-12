"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, X } from "lucide-react";
import { platformName } from "@/data/constant";
import { signOut, useSession } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);
  const {data:session, status} = useSession();
  const isLoggedIn = status === "authenticated";
  const router = useRouter();



  const handleLogout = async () => {
    toast("Signing you out...");
    await signOut({ redirect: false });

    setTimeout(() => {
      toast.success("Signed out successfully!");
      router.push("/auth");
    }, 800);
  };



  return (
    <header className="bg-[#FAF8F4]/90 dark:bg-[#12151B]/90 backdrop-blur-md border-b border-[#12151B]/10 dark:border-white/10 sticky top-0 z-50 transition-colors duration-200">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500&display=swap');
        .nav-display { font-family: 'Space Grotesk', sans-serif; }
        .nav-body { font-family: 'IBM Plex Sans', sans-serif; }
        .nav-mono { font-family: 'IBM Plex Mono', monospace; }
      `}</style>

      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="nav-mono flex items-center gap-2.5 text-sm tracking-[0.18em] uppercase text-[#12151B] hover:text-[#3E63DD] dark:text-[#8FA8FF] dark:hover:text-white transition-colors">
          <span className="w-2 h-2 rounded-full bg-[#16A34A] dark:bg-[#4ADE80]" />
          {platformName}
        </Link>


        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          {
            isLoggedIn ? 
            <>
            <Link href={"/dashboard"}>
              <Button className="nav-body bg-[#12151B] hover:bg-[#1E222B] text-white dark:bg-[#8FA8FF] dark:hover:bg-[#7A96FF] dark:text-[#12151B] font-semibold rounded-lg">
                Dashboard
              </Button>
            </Link> 
            <Button 
              variant={"link"}
              onClick={handleLogout}
              className="nav-body text-[#6B7280] hover:text-[#12151B] dark:text-white/70 dark:hover:text-white"
            >
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button> 
            </> : 
          (
            <>
              <Link href={"/auth"}>
                <Button className="nav-body text-[#12151B] hover:text-[#3E63DD] dark:text-white/75 dark:hover:text-[#8FA8FF]" variant={"link"}>
                  Sign in
                </Button>
              </Link>
              <Link href={"/auth"}>
                <Button className="nav-body bg-[#12151B] hover:bg-[#1E222B] text-white dark:bg-[#8FA8FF] dark:hover:bg-[#7A96FF] dark:text-[#12151B] font-semibold rounded-lg">
                  Get started
                </Button>
              </Link>
            </>
          )
          }
        </nav>

        {/* Mobile Actions */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <button
            className="focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="w-6 h-6 text-[#12151B] dark:text-white" /> : <Menu className="w-6 h-6 text-[#12151B] dark:text-white" />}
          </button>
        </div>
      </div>



      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#FAF8F4] dark:bg-[#12151B] border-t border-[#12151B]/10 dark:border-white/10">
          <ul className="flex flex-col gap-3 p-6">
           {isLoggedIn ? (
              <>
                <li>
                  <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                    <Button className="nav-body w-full bg-[#12151B] hover:bg-[#1E222B] text-white dark:bg-[#8FA8FF] dark:hover:bg-[#7A96FF] dark:text-[#12151B] font-semibold rounded-lg">
                      Dashboard
                    </Button>
                  </Link>
                </li>
                <li>
                  <Button
                    className="nav-body w-full border border-[#12151B]/15 text-[#12151B] dark:border-white/15 dark:bg-white/[0.04] dark:text-white dark:hover:bg-white/[0.08] rounded-lg"
                    variant="outline"
                    onClick={() => {
                      setIsOpen(false);
                      handleLogout();
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </Button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link href="/auth" onClick={() => setIsOpen(false)}>
                    <Button className="nav-body w-full border border-[#12151B]/15 text-[#12151B] dark:border-white/15 dark:bg-white/[0.04] dark:text-white dark:hover:bg-white/[0.08] rounded-lg" variant="outline">
                      Sign in
                    </Button>
                  </Link>
                </li>
                <li>
                  <Link href="/auth" onClick={() => setIsOpen(false)}>
                    <Button
                      className="nav-body w-full bg-[#12151B] hover:bg-[#1E222B] text-white dark:bg-[#8FA8FF] dark:hover:bg-[#7A96FF] dark:text-[#12151B] font-semibold rounded-lg"
                    >
                      Get started
                    </Button>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </header>
  );
};

export default Navbar;