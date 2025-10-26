"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, X } from "lucide-react";
import { platformName } from "@/data/constant";
import { signOut, useSession } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-blue-600">{platformName}</Link>


        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-2">
          {
            isLoggedIn ? 
            <>
            <Link href={"/dashboard"}>
              <Button className="ml-4" variant={"gradient"}>
                Dashboard
              </Button>
            </Link> 
            <Button 
              variant={"link"}
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button> 
            </> : 
          (
            <div>        
              <Link href={"/auth"}>
                <Button className="ml-4" variant={"link"}>
                  Sign In
                </Button>
              </Link>
              <Link href={"/auth"}>
                <Button variant={"gradient"}>
                  Get Started
                </Button>
              </Link>

            </div>
          )
          }
        </nav>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden focus:outline-none"
          onClick={toggleMenu}
          aria-label="Toggle Menu"
        >
          {isOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
        </button>
      </div>



      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md">
          <ul className="flex flex-col gap-4 p-6">
           {isLoggedIn ? (
              <>
                <li>
                  <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                    <Button className="w-full" variant="secondary">
                      Dashboard
                    </Button>
                  </Link>
                </li>
                <li>
                  <Button
                    className="w-full border-2"
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
                    <Button className="w-full" variant="secondary">
                      Sign In
                    </Button>
                  </Link>
                </li>
                <li>
                  <Link href="/auth" onClick={() => setIsOpen(false)}>
                    <Button
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                    >
                      Get Started
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
