import Link from "next/link";
import { HamburgerMenu } from "./HamburgerMenu";

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <img src="/images/DogParkAdventures-Logo.png" alt="Dog Park Adventures Logo" className="h-10" />
        </Link>
        
        {/* Unified hamburger menu for all devices */}
        <HamburgerMenu />
      </div>
    </header>
  );
}
