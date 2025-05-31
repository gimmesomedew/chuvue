import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, CurrencyDollarIcon, TagIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';

export default function Navigation() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/', icon: HomeIcon, label: 'Dashboard' },
    { path: '/wages', icon: CurrencyDollarIcon, label: 'Wages' },
    { path: '/expenses', icon: TagIcon, label: 'Expenses' },
    { path: '/settings', icon: Cog6ToothIcon, label: 'Settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 md:top-0 md:bottom-auto md:border-t-0 md:border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-around md:justify-start md:gap-8">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col md:flex-row items-center py-3 md:py-4 px-2 md:px-4 text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'text-purple-500'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Icon className="h-6 w-6 md:mr-2" />
                <span className="mt-1 md:mt-0">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
} 