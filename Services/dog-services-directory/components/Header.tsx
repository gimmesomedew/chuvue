'use client';

import Link from "next/link";
import { HamburgerMenu } from "./HamburgerMenu";
import { Button } from "@/components/ui/button";
import { LogIn, UserPlus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export function Header() {
  const { user } = useAuth();
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <img src="/images/DogParkAdventures-Logo.png" alt="Dog Park Adventures Logo" className="h-10" />
        </Link>
        
        <div className="flex items-center space-x-3">
          {/* Authentication buttons - only show if user is not logged in */}
          {!user && (
            <>
              <div className="transform hover:-translate-y-1 transition duration-200 ease-in-out">
                <Button
                  variant="outline"
                  className="hidden sm:flex items-center border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-white"
                  asChild
                >
                  <Link href="/auth/login">
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </Link>
                </Button>
              </div>
              
              <div className="transform hover:-translate-y-1 transition duration-200 ease-in-out">
                <Button
                  className="hidden sm:flex items-center bg-emerald-500 hover:bg-emerald-600 text-white"
                  asChild
                >
                  <Link href="/auth/signup">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Sign Up
                  </Link>
                </Button>
              </div>
            </>
          )}
          
          {/* Hamburger menu - only visible on mobile when not signed in, visible on all devices when signed in */}
          <div className={user ? 'block' : 'block sm:hidden'}>
            <HamburgerMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
