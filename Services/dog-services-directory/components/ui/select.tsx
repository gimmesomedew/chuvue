'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          className={`w-full p-3 border rounded-md appearance-none bg-gray-50 text-gray-700 pr-10 transition-colors focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 ${className}`}
          ref={ref}
          {...props}
        >
          {children}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <ChevronDown className="h-4 w-4 text-secondary" />
        </div>
      </div>
    );
  }
);

Select.displayName = 'Select'; 