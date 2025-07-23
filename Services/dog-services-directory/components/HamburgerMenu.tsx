'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { showToast } from '@/lib/toast';
import { getSectionedEntries, MenuSection } from '@/lib/menuItems';

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
        className="group flex items-center gap-3 px-3 py-2" style={{ color: '#2C3D73' }}
      >
        {Icon && (
          <motion.div
            initial={{ rotate: 0 }}
            whileHover={{ rotate: 10, scale: 1.1 }}
            transition={{ duration: 0.2 }}
          >
            <Icon className="w-5 h-5" style={{ color: '#2C3D73' }} />
          </motion.div>
        )}
        <span>{label}</span>
      </Link>
    </motion.div>
  );
}

export function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { userRole, signOut, unreadMessageCount } = useAuth();

  const sectionsOrder: MenuSection[] = ['base', 'review', 'admin', 'account', 'legal'];
  const sectionHeadings: Record<MenuSection, string> = {
    base: '',
    review: 'Reviewer',
    admin: 'Admin',
    account: 'Account',
    legal: 'Legal'
  } as const;

  const sectionedEntries = getSectionedEntries(userRole);

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
    if (isSigningOut) return; // Prevent duplicate calls
    
    setIsSigningOut(true);
    const loadingToast = showToast.loading('Signing out...');
    try {
      await signOut();
      showToast.dismiss(loadingToast);
      showToast.success('Successfully signed out');
      setIsOpen(false);
      // Force a page reload to ensure clean state
      window.location.href = '/';
    } catch (error) {
      console.error('Sign out error:', error);
      showToast.dismiss(loadingToast);
      showToast.error('Error signing out. Please try again.');
      // Force a page reload even on error to ensure clean state
      window.location.href = '/';
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <div className="relative z-50">
      {/* Hamburger button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 bg-secondary hover:bg-third text-white focus:outline-none border-2 border-white rounded-md"
        aria-label="Toggle menu"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Menu className="h-6 w-6 text-white" />
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
            className="fixed top-0 right-0 h-full" style={{ background: '#7BABDC' }}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold" style={{ color: 'var(--color-secondary, #e91a7e)' }}>Menu</h2>
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
                {sectionsOrder.map((sectionKey) => {
                  const entries = sectionedEntries[sectionKey] || [];
                  if (entries.length === 0) return null;

                  return (
                    <div key={sectionKey} className="space-y-4">
                      {sectionHeadings[sectionKey] && (
                        <h3
                          className={
                            sectionKey === 'admin'
                              ? 'text-sm font-medium text-purple-700 uppercase tracking-wider'
                              : 'text-sm font-medium text-gray-500 uppercase tracking-wider'
                          }
                        >
                          {sectionHeadings[sectionKey]}
                        </h3>
                      )}

                      <div className="space-y-2">
                        {entries.map((entry) => {
                          // compute label modifications (badge)
                          let label = entry.label;
                          if (entry.label === 'Messages' && unreadMessageCount > 0) {
                            label = `${entry.label} (${unreadMessageCount})`;
                          }

                          const onClickHandler =
                            entry.action === 'signout' ? handleSignOut : handleMenuItemClick;

                          return (
                            <MenuItem
                              key={entry.label}
                              label={label}
                              href={entry.href}
                              onClick={onClickHandler}
                              icon={entry.icon}
                            />
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

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
