'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import { FaList, FaExclamationTriangle, FaTachometerAlt } from 'react-icons/fa';

interface AdminLayoutProps {
  children: ReactNode;
}

const navLinks = [
  {
    href: '/admin',
    label: 'Dashboard',
    icon: <FaTachometerAlt className="w-5 h-5" />,
  },
  {
    href: '/admin/services',
    label: 'Services',
    icon: <FaList className="w-5 h-5" />,
  },
  {
    href: '/admin/error-logs',
    label: 'Error Logs',
    icon: <FaExclamationTriangle className="w-5 h-5" />,
  },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-base-200">
      <aside className="w-64 bg-base-100 border-r p-6 flex flex-col gap-2">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
        <nav className="flex flex-col gap-2">
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
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
} 