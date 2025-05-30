import { motion, MotionProps } from 'framer-motion';
import { ReactNode } from 'react';

type MotionWrapperProps = {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  variant?: 'fadeIn' | 'slideUp' | 'slideIn' | 'scale' | 'none';
} & MotionProps;

export function MotionWrapper({
  children,
  delay = 0,
  duration = 0.5,
  className = '',
  variant = 'fadeIn',
  ...motionProps
}: MotionWrapperProps) {
  // Animation variants
  const variants = {
    fadeIn: {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration, delay } }
    },
    slideUp: {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration, delay } }
    },
    slideIn: {
      hidden: { opacity: 0, x: -20 },
      visible: { opacity: 1, x: 0, transition: { duration, delay } }
    },
    scale: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { opacity: 1, scale: 1, transition: { duration, delay } }
    },
    none: {
      hidden: {},
      visible: {}
    }
  };

  const selectedVariant = variants[variant];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={selectedVariant}
      className={className}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
}
