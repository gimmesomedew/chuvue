'use client';

import Link from "next/link";
import { HamburgerMenu } from "./HamburgerMenu";
import { Button } from "@/components/ui/button";
import { LogIn, UserPlus, User, ChevronDown, Shield, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getProfileImage } from "@/types/profile";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getSectionedEntries } from "@/lib/menuItems";

export function Header() {
  const { user, profile, userRole, signOut } = useAuth();

  const sections = getSectionedEntries(userRole);

  const baseLinks = (sections.base || []).filter((e) => e.label !== 'Add Listing');
  const addListingEntry = (sections.base || []).find((e) => e.label === 'Add Listing');
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

                {/* Avatar Dropdown */}
                <Popover>
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
                  <PopoverContent className="w-56 p-2 space-y-1">
                    {/* Administrator Dashboard - only visible to admins */}
                    {userRole === 'admin' && (
                      <Link 
                        href="/admin" 
                        className="flex items-center gap-2 text-sm hover:bg-gray-100 rounded px-2 py-1 text-gray-700"
                      >
                        <Shield className="w-4 h-4" />
                        Administrator Dashboard
                      </Link>
                    )}
                    
                    {/* Reviewer Dashboard - visible to both reviewers and admins */}
                    {(userRole === 'reviewer' || userRole === 'admin') && (
                      <Link 
                        href="/review/pending" 
                        className="flex items-center gap-2 text-sm hover:bg-gray-100 rounded px-2 py-1 text-gray-700"
                      >
                        <Shield className="w-4 h-4" />
                        Reviewer Dashboard
                      </Link>
                    )}
                    
                    {/* Divider if we have role-specific links */}
                    {((userRole === 'reviewer' || userRole === 'admin')) && (
                      <div className="border-t border-gray-200 my-1"></div>
                    )}
                    
                    {/* Regular account links */}
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
