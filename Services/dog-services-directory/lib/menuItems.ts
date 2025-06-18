import { UserRole } from './supabase';

// Menu item interface
export interface MenuItem {
  label: string;
  href: string;
  icon?: string;
  roles?: UserRole[];
}

// Static menu items (always visible)
export const staticMenuItems: MenuItem[] = [
  {
    label: 'Home',
    href: '/',
  },
  {
    label: 'Contact',
    href: '/contact',
  },
];

// Role-based menu items
export const roleBasedMenuItems: MenuItem[] = [
  // Admin-only items
  {
    label: 'Admin Dashboard',
    href: '/admin',
    roles: ['admin'],
  },
  {
    label: 'Dashboard',
    href: '/admin/dashboard',
    roles: ['admin'],
  },
  {
    label: 'Manage Users',
    href: '/admin/users',
    roles: ['admin'],
  },
  {
    label: 'Contact Messages',
    href: '/admin/contact',
    roles: ['admin'],
  },
  {
    label: 'Site Settings',
    href: '/admin/settings',
    roles: ['admin'],
  },
  
  // Service provider items
  {
    label: 'My Services',
    href: '/provider/services',
    roles: ['service_provider', 'admin'],
  },
  {
    label: 'Bookings',
    href: '/provider/bookings',
    roles: ['service_provider', 'admin'],
  },
  {
    label: 'Business Profile',
    href: '/provider/profile',
    roles: ['service_provider', 'admin'],
  },
  
  // Directory - visible to all logged-in users
  {
    label: 'Directory',
    href: '/directory',
    roles: ['pet_owner', 'service_provider', 'admin', 'reviewer'],
  },
  
  // Messages - visible to all logged-in users
  {
    label: 'Messages',
    href: '/messages',
    roles: ['pet_owner', 'service_provider', 'admin', 'reviewer'],
  },
  
  // Pet owner items
  {
    label: 'Favorites',
    href: '/owner/favorites',
    roles: ['pet_owner', 'admin'],
  },
];

// Quick links for the menu (visible to all users)
export const quickLinks: MenuItem[] = [
  {
    label: 'Dog Parks',
    href: '/services/dog-parks',
  },
  {
    label: 'Veterinarians',
    href: '/services/veterinarians',
  },
  {
    label: 'Groomers',
    href: '/services/groomers',
  },
  {
    label: 'Pet Stores',
    href: '/services/pet-stores',
  },
  {
    label: 'Trainers',
    href: '/services/trainers',
  },
  {
    label: 'Daycare',
    href: '/services/daycare',
  },
];

// Function to get menu items based on user role
export function getMenuItemsByRole(role: UserRole): MenuItem[] {
  const items = [...staticMenuItems];
  
  const roleItems = roleBasedMenuItems.filter(item => 
    !item.roles || item.roles.includes(role)
  );
  
  return [...items, ...roleItems];
}
