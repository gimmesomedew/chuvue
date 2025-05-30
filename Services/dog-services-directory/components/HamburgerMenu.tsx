'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Menu, X, User, Settings, LogOut, LogIn, UserPlus, Home, Info, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { showToast } from '@/lib/toast';
import { motion, AnimatePresence } from 'framer-motion';
import { staticMenuItems, roleBasedMenuItems, getMenuItemsByRole } from '@/lib/menuItems';

// Menu item component
type MenuItemProps = {
  icon?: React.ElementType;
  label: string;
  href: string;
  onClick: () => void;
};

function MenuItem({ icon: Icon, label, href, onClick }: MenuItemProps) {
  return (
    <motion.div
      whileHover={{ x: 5 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <Link
        href={href || '#'}
        onClick={onClick}
        className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
      >
        {Icon && (
          <motion.div
            initial={{ rotate: 0 }}
            whileHover={{ rotate: 10, scale: 1.1 }}
            transition={{ duration: 0.2 }}
          >
            <Icon className="w-5 h-5 text-gray-500" />
          </motion.div>
        )}
        <span>{label}</span>
      </Link>
    </motion.div>
  );
}

export function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user, userRole, signOut } = useAuth();

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Prevent body scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  // Handle menu item click
  const handleMenuItemClick = () => {
    setIsOpen(false);
  };

  // Handle sign out
  const handleSignOut = async () => {
    const loadingToast = showToast.loading('Signing out...');
    try {
      await signOut();
      showToast.dismiss(loadingToast);
      showToast.success('Successfully signed out');
      setIsOpen(false);
    } catch (error) {
      console.error('Sign out error:', error);
      showToast.dismiss(loadingToast);
      showToast.error('Error signing out. Please try again.');
    }
  };

  return (
    <div className="relative z-50">
      {/* Hamburger button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
        aria-label="Toggle menu"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Menu className="h-6 w-6 text-emerald-600" />
      </motion.button>

      {/* Menu overlay with AnimatePresence for smooth transitions */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Menu content with AnimatePresence */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={menuRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full bg-white shadow-xl overflow-y-auto w-80 md:w-96 lg:w-[400px]"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-emerald-600">Menu</h2>
                <motion.button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="h-6 w-6" />
                </motion.button>
              </div>

              <nav className="space-y-6">
                {/* Static navigation items */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
                      className="space-y-2"
                    >
                      {staticMenuItems.map((item, index) => (
                        <motion.div
                          key={item.label}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <MenuItem
                            key={item.label}
                            label={item.label}
                            href={item.href}
                            onClick={handleMenuItemClick}
                            icon={item.label === 'Home' ? Home : 
                                 item.label === 'Contact' ? Phone : undefined}
                          />
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>
                </div>

                {/* Role-based menu items (if logged in) */}
                {user && roleBasedMenuItems.filter(item => !item.roles || item.roles.includes(userRole)).length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-4"
                  >
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                      {userRole === 'admin' ? 'Admin' : userRole === 'service_provider' ? 'Provider' : 'My Account'}
                    </h3>
                    <div className="space-y-2">
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ staggerChildren: 0.1, delayChildren: 0.4 }}
                        className="space-y-2"
                      >
                        {roleBasedMenuItems
                          .filter(item => !item.roles || item.roles.includes(userRole))
                          .map((item, index) => (
                            <motion.div
                              key={item.label}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.4 + (index * 0.05) }}
                            >
                              <MenuItem
                                key={item.label}
                                label={item.label}
                                href={item.href}
                                onClick={handleMenuItemClick}
                                icon={item.label.includes('Settings') ? Settings : undefined}
                              />
                            </motion.div>
                          ))
                        }
                      </motion.div>
                    </div>
                  </motion.div>
                )}

                {/* Authentication buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-4"
                >
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Account</h3>
                  <div className="space-y-4">
                    {user ? (
                      <>
                        <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
                          <Button
                            variant="outline"
                            className="w-full justify-center border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-white mb-3"
                            onClick={() => setIsOpen(false)}
                            asChild
                          >
                            <Link href="/profile">
                              <User className="h-4 w-4 mr-2" />
                              My Profile
                            </Link>
                          </Button>
                        </motion.div>
                        <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
                          <Button
                            variant="outline"
                            className="w-full justify-center border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-white"
                            onClick={handleSignOut}
                          >
                            <LogOut className="h-4 w-4 mr-2" />
                            Sign Out
                          </Button>
                        </motion.div>
                      </>
                    ) : (
                      <>
                        <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
                          <Button
                            variant="outline"
                            className="w-full justify-center border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-white"
                            onClick={() => setIsOpen(false)}
                            asChild
                          >
                            <Link href="/auth/login">
                              <LogIn className="h-4 w-4 mr-2" />
                              Sign In
                            </Link>
                          </Button>
                        </motion.div>
                        <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
                          <Button
                            className="w-full justify-center bg-emerald-500 hover:bg-emerald-600 text-white"
                            onClick={() => setIsOpen(false)}
                            asChild
                          >
                            <Link href="/auth/signup">
                              <UserPlus className="h-4 w-4 mr-2" />
                              Sign Up
                            </Link>
                          </Button>
                        </motion.div>
                      </>
                    )}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="pt-6 mt-6 border-t border-gray-200"
                >
                  <p className="text-sm text-gray-500">
                    © {new Date().getFullYear()} Dog Park Adventures. All rights reserved.
                  </p>
                </motion.div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
