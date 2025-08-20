'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';
import { FaList, FaExclamationTriangle, FaTachometerAlt, FaHome, FaChartBar, FaUsers, FaShieldAlt, FaCog, FaUserShield, FaFileAlt, FaHeartbeat } from 'react-icons/fa';
import { useAuth } from '@/contexts/AuthContext';

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
    href: '/admin/users',
    label: 'Users',
    icon: <FaUsers className="w-5 h-5" />,
  },
  {
    href: '/admin/error-logs',
    label: 'Error Logs',
    icon: <FaExclamationTriangle className="w-5 h-5" />,
  },
  {
    href: '/admin/analytics',
    label: 'Analytics',
    icon: <FaChartBar className="w-5 h-5" />,
  },
  {
    href: '/admin/settings',
    label: 'Settings',
    icon: <FaCog className="w-5 h-5" />,
  },
  {
    href: '/admin/reviewers',
    label: 'Reviewers',
    icon: <FaUserShield className="w-5 h-5" />,
  },
  {
    href: '/admin/reports',
    label: 'Reports',
    icon: <FaFileAlt className="w-5 h-5" />,
  },
  {
    href: '/admin/health',
    label: 'Health',
    icon: <FaHeartbeat className="w-5 h-5" />,
  },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, userRole, isLoading } = useAuth();

  // Check authentication and admin role
  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        // Redirect to login if not authenticated
        router.push('/auth/login');
        return;
      }
      
      if (userRole !== 'admin') {
        // Redirect to home if not admin
        router.push('/');
        return;
      }
    }
  }, [user, userRole, isLoading, router]);

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-base-200">
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
        </div>
      </div>
    );
  }

  // Don't render admin content if not authenticated or not admin
  // TODO: Re-enable this check in production
  if (!user || userRole !== 'admin') {
    console.warn('⚠️ Non-admin user attempting to access admin panel:', { user: user?.email, role: userRole });
    // For development, allow access but show a warning
    // return null;
  }

  return (
    <div className="flex min-h-screen bg-base-200">
      <aside className="w-64 bg-base-100 border-r p-6 flex flex-col gap-2">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
        <nav className="flex flex-col gap-2 flex-1">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors font-semibold ${
                pathname === link.href
                  ? 'bg-[#AED2FC] text-secondary' // selected
                  : 'bg-white text-[#222]' // default
              }`}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>
        
        {/* Back to Home Link */}
        <div className="mt-auto pt-4 border-t border-base-300">
          <Link
            href="/"
            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors font-semibold ${
              pathname === '/' ? 'bg-[#AED2FC] text-secondary' : 'bg-white text-[#222]'
            }`}
          >
            <FaHome className="w-5 h-5" />
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