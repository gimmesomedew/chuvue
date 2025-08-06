'use client';

import Link from "next/link";
import { HamburgerMenu } from "./HamburgerMenu";
import { Button } from "@/components/ui/button";
import { LogIn, UserPlus, User, ChevronDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getProfileImage } from "@/types/profile";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getSectionedEntries } from "@/lib/menuItems";

export function Header() {
  const { user, profile, userRole, signOut } = useAuth();

  const sections = getSectionedEntries(userRole);

  const baseLinks = (sections.base || []).filter((e) => e.label !== 'Add Listing');
  const addListingEntry = (sections.base || []).find((e) => e.label === 'Add Listing');
  const reviewerLinks = sections.review || [];
  const adminLinks = sections.admin || [];
  const accountLinks = sections.account || [];

  return (
          <header className="border-b border-gray-200 sticky top-0 z-10 shadow-sm" style={{ backgroundColor: '#017FA3' }}>
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2 mr-6">
          <img src="/images/DPA-white-logo.png" alt="Dog Park Adventures Logo" className="h-10" />
        </Link>
        
        {/* Desktop navigation */}
        <nav className="hidden md:flex flex-1 items-center justify-between">
          {/* Center links */}
          <div className="flex items-center space-x-6">
            {baseLinks.map((entry) => (
              <Link
                key={entry.label}
                href={entry.href}
                className="px-3 py-2 rounded text-white hover:text-secondary hover:bg-white/10 transition-colors"
              >
                {entry.label}
              </Link>
            ))}
          </div>

          {/* Right-side actions */}
          <div className="flex items-center space-x-4">
            {/* Guest actions */}
            {!user && (
              <>
                {addListingEntry && (
                  <Button variant="outline" className="md:border-2 md:border-secondary md:text-secondary md:rounded-[6px]" asChild>
                    <Link href={addListingEntry.href}>{addListingEntry.label}</Link>
                  </Button>
                )}
                {accountLinks.map((entry) => (
                  entry.label === 'Sign In' ? (
                    <Button key={entry.label} variant="outline" className="md:border-white md:text-white md:rounded-[6px]" asChild>
                      <Link href={entry.href}><LogIn className="h-4 w-4 mr-1"/>{entry.label}</Link>
                    </Button>
                  ) : (
                    <Button key={entry.label} className="md:bg-secondary md:text-white md:rounded-[6px]" asChild>
                      <Link href={entry.href}><UserPlus className="h-4 w-4 mr-1"/>{entry.label}</Link>
                    </Button>
                  )
                ))}
              </>
            )}

            {user && (
              <>
                {/* Add Listing for regular user */}
                {addListingEntry && userRole !== 'reviewer' && userRole !== 'admin' && (
                  <Button variant="outline" className="md:border-2 md:border-secondary md:text-secondary md:rounded-[6px]" asChild>
                    <Link href={addListingEntry.href}>{addListingEntry.label}</Link>
                  </Button>
                )}

                {/* Reviewer Dropdown */}
                {reviewerLinks.length > 0 && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="flex items-center text-white hover:text-secondary hover:bg-white/10 transition-colors">Reviewer <ChevronDown className="h-4 w-4 ml-1"/></button>
                    </PopoverTrigger>
                    <PopoverContent className="w-56 p-2 space-y-1">
                      {reviewerLinks.map((entry) => (
                        <Link key={entry.label} href={entry.href} className="block text-sm text-gray-700 hover:bg-gray-100 rounded px-2 py-1">{entry.label}</Link>
                      ))}
                    </PopoverContent>
                  </Popover>
                )}

                {/* Admin Dropdown */}
                {adminLinks.length > 0 && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="flex items-center text-white hover:text-secondary hover:bg-white/10 transition-colors">Admin <ChevronDown className="h-4 w-4 ml-1"/></button>
                    </PopoverTrigger>
                    <PopoverContent className="w-60 p-2 space-y-1">
                      {adminLinks.map((entry) => (
                        <Link key={entry.label} href={entry.href} className="block text-sm text-gray-700 hover:bg-gray-100 rounded px-2 py-1">{entry.label}</Link>
                      ))}
                    </PopoverContent>
                  </Popover>
                )}

                {/* Avatar Dropdown */}
                <Popover>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <PopoverTrigger asChild>
                          <button className="ml-2 flex items-center justify-center rounded-full bg-emerald-100 hover:bg-emerald-200 w-10 h-10 border border-emerald-300 overflow-hidden">
                            {profile && getProfileImage(profile) ? (
                              <img src={getProfileImage(profile)!} alt="Avatar" className="object-cover w-10 h-10" />
                            ) : <User className="w-6 h-6 text-emerald-700" />}
                          </button>
                        </PopoverTrigger>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{profile?.pet_name || 'My Profile'}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <PopoverContent className="w-44 p-2 space-y-1">
                    {accountLinks.filter((e)=>e.label!=='Sign Out').map((entry)=>(
                      <Link key={entry.label} href={entry.href} className="block text-sm hover:bg-gray-100 rounded px-2 py-1">{entry.label}</Link>
                    ))}
                    <button onClick={async ()=>{ await signOut(); }} className="block w-full text-left text-sm hover:bg-gray-100 rounded px-2 py-1">Sign Out</button>
                  </PopoverContent>
                </Popover>
              </>
            )}
          </div>
        </nav>

        {/* Mobile hamburger */}
        <div className="md:hidden">
          <HamburgerMenu />
        </div>
      </div>
    </header>
  );
}
