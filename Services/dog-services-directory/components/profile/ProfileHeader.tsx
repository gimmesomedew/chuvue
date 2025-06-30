'use client';

import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProfileHeaderProps {
  title: string;
  backLink?: string;
  backText?: string;
}

export function ProfileHeader({ title, backLink = '/directory', backText = 'Back to Directory' }: ProfileHeaderProps) {
  return (
    <motion.div 
      className="mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Back Navigation */}
      <motion.div 
        className="mb-4"
        whileHover={{ x: -5 }}
        transition={{ duration: 0.2 }}
      >
        <Link
          href={backLink}
          className="inline-flex items-center text-[#D28000] hover:text-[#b06c00] transition-colors duration-300"
        >
          <ChevronLeft className="h-5 w-5" />
          <span className="text-sm font-medium">{backText}</span>
        </Link>
      </motion.div>

      {/* Title */}
      <motion.h1 
        className="text-4xl font-bold text-gray-900"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        {title}
      </motion.h1>
    </motion.div>
  );
}
