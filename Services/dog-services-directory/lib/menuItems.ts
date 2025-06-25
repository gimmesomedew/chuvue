// lib/menuItems.ts --- REFACTORED
// This file now defines a single canonical list of menu entries that is shared
// by both the desktop header and the mobile hamburger menu.
// Each entry specifies the roles that should see it and the logical section it
// belongs to so that consuming components can group / render as they wish.

import {
  Home,
  Navigation,
  Mail,
  Briefcase,
  Shield,
  User,
  Heart,
  Settings,
  LogOut,
  LogIn,
  UserPlus,
} from 'lucide-react';
import { LucideIcon } from 'lucide-react';

import type { UserRole } from './supabase';

// Logical groupings so menus can be rendered with headings
export type MenuSection = 'base' | 'review' | 'admin' | 'account';

export interface MenuEntry {
  label: string;
  href: string;
  icon: LucideIcon;
  roles: UserRole[]; // which roles can see this item
  section: MenuSection;
  // Optional flag for items that are actions instead of links (e.g. sign-out)
  action?: string;
}

// ---------------------------------------------------------------------------
// Canonical list of ALL possible menu entries in the application
// ---------------------------------------------------------------------------
export const menuEntries: MenuEntry[] = [
  // ----- Base (general navigation) -----
  {
    label: 'Home',
    href: '/',
    icon: Home,
    roles: ['guest', 'pet_owner', 'service_provider', 'reviewer', 'admin'],
    section: 'base',
  },
  {
    label: 'Directory',
    href: '/directory',
    icon: Navigation,
    roles: ['pet_owner', 'service_provider', 'reviewer', 'admin'],
    section: 'base',
  },
  {
    label: 'Messages',
    href: '/messages',
    icon: Mail,
    roles: ['pet_owner', 'service_provider', 'reviewer', 'admin'],
    section: 'base',
  },
  {
    label: 'Add Listing',
    href: '/add-listing',
    icon: Briefcase,
    roles: ['guest', 'pet_owner', 'service_provider'],
    section: 'base',
  },

  // ----- Guest account actions -----
  {
    label: 'Sign In',
    href: '/auth/login',
    icon: LogIn,
    roles: ['guest'],
    section: 'account',
  },
  {
    label: 'Sign Up',
    href: '/auth/signup',
    icon: UserPlus,
    roles: ['guest'],
    section: 'account',
  },

  // ----- Reviewer-only -----
  {
    label: 'Pending Submissions',
    href: '/review/pending',
    icon: Shield,
    roles: ['reviewer', 'admin'],
    section: 'review',
  },
  {
    label: 'Approved Listings',
    href: '/review/approved',
    icon: Shield,
    roles: ['reviewer', 'admin'],
    section: 'review',
  },
  {
    label: 'Rejected Submissions',
    href: '/review/rejected',
    icon: Shield,
    roles: ['reviewer', 'admin'],
    section: 'review',
  },
  {
    label: 'Add Listing',
    href: '/add-listing',
    icon: Briefcase,
    roles: ['reviewer', 'admin'],
    section: 'review',
  },

  // ----- Admin-only -----
  {
    label: 'User Management',
    href: '/admin/users',
    icon: Shield,
    roles: ['admin'],
    section: 'admin',
  },
  {
    label: 'Service Submissions',
    href: '/admin/services',
    icon: Shield,
    roles: ['admin'],
    section: 'admin',
  },
  {
    label: 'Site Analytics',
    href: '/admin/analytics',
    icon: Shield,
    roles: ['admin'],
    section: 'admin',
  },
  {
    label: 'System Settings',
    href: '/admin/settings',
    icon: Shield,
    roles: ['admin'],
    section: 'admin',
  },
  {
    label: 'Reviewer Management',
    href: '/admin/reviewers',
    icon: Shield,
    roles: ['admin'],
    section: 'admin',
  },
  {
    label: 'Reports & Exports',
    href: '/admin/reports',
    icon: Shield,
    roles: ['admin'],
    section: 'admin',
  },
  {
    label: 'Platform Health',
    href: '/admin/health',
    icon: Shield,
    roles: ['admin'],
    section: 'admin',
  },

  // ----- Account (logged-in users) -----
  {
    label: 'Profile',
    href: '/profile',
    icon: User,
    roles: ['pet_owner', 'service_provider', 'reviewer', 'admin'],
    section: 'account',
  },
  {
    label: 'Favorites',
    href: '/owner/favorites',
    icon: Heart,
    roles: ['pet_owner'],
    section: 'account',
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: Settings,
    roles: ['pet_owner', 'service_provider', 'reviewer', 'admin'],
    section: 'account',
  },
  {
    label: 'Sign Out',
    href: '#', // special; will be handled as action
    icon: LogOut,
    roles: ['pet_owner', 'service_provider', 'reviewer', 'admin'],
    section: 'account',
    action: 'signout',
  },
];

// Helper: entries visible to role
export function getEntriesForRole(role: UserRole) {
  return menuEntries.filter((e) => e.roles.includes(role));
}

// Helper: group entries by section for easier rendering
export function getSectionedEntries(role: UserRole) {
  return getEntriesForRole(role).reduce<Record<MenuSection, MenuEntry[]>>(
    (acc, entry) => {
      if (!acc[entry.section]) acc[entry.section] = [] as MenuEntry[];
      acc[entry.section].push(entry);
      return acc;
    },
    {} as Record<MenuSection, MenuEntry[]>,
  );
}
