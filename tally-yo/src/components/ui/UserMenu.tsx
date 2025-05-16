import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { UserIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface UserMenuProps {
  fullName: string | undefined;
}

export default function UserMenu({ fullName }: UserMenuProps) {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/signin');
  };

  return (
    <Menu as="div" className="relative">
      <Menu.Button className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors group relative">
        <UserIcon className="h-6 w-6 text-gray-400" />
        {fullName && (
          <div className="absolute invisible group-hover:visible bg-gray-900 text-white text-sm py-1 px-2 rounded -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
            {fullName}
          </div>
        )}
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-gray-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={handleSignOut}
                className={`${
                  active ? 'bg-gray-700' : ''
                } group flex w-full items-center px-4 py-2 text-sm text-gray-300 hover:text-white`}
              >
                Sign Out
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
