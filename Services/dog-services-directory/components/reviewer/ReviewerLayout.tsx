'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import { ClipboardList, CheckCircle2, XCircle, Home } from 'lucide-react';

interface ReviewerLayoutProps {
  children: ReactNode;
}

const navLinks = [
  {
    href: '/review/pending',
    label: 'Pending',
    icon: <ClipboardList className="w-5 h-5" />,
  },
  {
    href: '/review/approved',
    label: 'Approved',
    icon: <CheckCircle2 className="w-5 h-5" />,
  },
  {
    href: '/review/rejected',
    label: 'Rejected',
    icon: <XCircle className="w-5 h-5" />,
  },
];

export default function ReviewerLayout({ children }: ReviewerLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-base-200">
      <aside className="w-64 bg-base-100 border-r p-6 flex flex-col gap-2">
        <h2 className="text-xl font-bold mb-6">Reviewer Panel</h2>
        <nav className="flex flex-col gap-2 flex-1">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                pathname === link.href
                  ? 'bg-primary text-primary-content' : 'hover:bg-base-300'
              }`}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>
        <div className="mt-auto pt-4 border-t border-base-300">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-2 rounded-lg transition-colors hover:bg-base-300 text-base-content"
          >
            <Home className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
} 