import { HomeIcon, CurrencyDollarIcon, ChartBarIcon, Cog6ToothIcon, TagIcon } from '@heroicons/react/24/outline';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/20/solid';
import { useLocation, Link, Outlet, useNavigate } from 'react-router-dom';
import { Menu } from '@headlessui/react';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../hooks/useProfile';

function UserAvatar() {
  const { user, signOut } = useAuth();
  const { profile } = useProfile(user);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <Menu as="div" className="relative">
      <Menu.Button className="flex items-center gap-3 bg-gray-800 rounded-full py-2 px-4 shadow-lg hover:bg-gray-700 transition-colors">
        <span className="text-sm text-white">{profile?.full_name || user?.email}</span>
        <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm font-medium">
          {profile?.full_name ? profile.full_name[0].toUpperCase() : user?.email?.[0].toUpperCase()}
        </div>
      </Menu.Button>

      <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-gray-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        <Menu.Item>
          {({ active }) => (
            <button
              onClick={handleSignOut}
              className={`${active ? 'bg-gray-700' : ''} group flex w-full items-center px-4 py-3 text-sm text-white gap-2`}
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
              Sign Out
            </button>
          )}
        </Menu.Item>
      </Menu.Items>
    </Menu>
  );
}

export default function Layout() {
  const location = useLocation();
  
  const links = [
    { name: 'Dashboard', href: '/', icon: HomeIcon },
    { name: 'Wages', href: '/wages', icon: CurrencyDollarIcon },
    { name: 'Expenses', href: '/expenses', icon: ChartBarIcon },
    { name: 'Deposit Types', href: '/deposit-types', icon: TagIcon, hideOnMobile: true },
    { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      {/* Side Navigation for Desktop */}
      <nav className="hidden lg:flex flex-col w-64 bg-gray-800 border-r border-gray-700 p-4 fixed h-full">
        <div className="flex items-center justify-center p-4 mb-8">
          <h1 className="text-2xl font-bold text-primary">Tally-Yo</h1>
        </div>
        <div className="space-y-4">
          {links.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.name}
                to={link.href}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${isActive ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}`}
              >
                <link.icon className="h-6 w-6" />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 overflow-y-auto pb-16 lg:pb-0">
        {/* Header with Avatar */}
        <div className="bg-gray-900 p-4 flex justify-end">
          <UserAvatar />
        </div>
        <div className="p-4">
          <Outlet />
        </div>
      </main>
      
      {/* Bottom Navigation Bar for Mobile/Tablet */}
      <nav className="fixed bottom-0 left-0 right-0 lg:hidden bg-gray-800 border-t border-gray-700">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="flex justify-around py-3">
            {links.map((link) => {
              if (link.hideOnMobile) return null;
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`flex flex-col items-center p-2 rounded-lg transition-colors ${isActive ? 'text-primary' : 'text-gray-400 hover:text-primary'}`}
                >
                  <link.icon className="h-6 w-6" />
                  <span className="text-xs mt-1">{link.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}
