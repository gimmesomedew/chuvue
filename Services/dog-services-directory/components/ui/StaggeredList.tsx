import { motion } from 'framer-motion';
import { ReactNode } from 'react';

type StaggeredListProps = {
  children: ReactNode[];
  staggerDelay?: number;
  className?: string;
};

export function StaggeredList({ 
  children, 
  staggerDelay = 0.1, 
  className = '' 
}: StaggeredListProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.ul
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {children.map((child, index) => (
        <motion.li key={index} variants={itemVariants}>
          {child}
        </motion.li>
      ))}
    </motion.ul>
  );
}
