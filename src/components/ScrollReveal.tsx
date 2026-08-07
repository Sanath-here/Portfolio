import React, { ReactNode } from 'react';
import { motion } from 'motion/react';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  variant?: 'fade' | 'slide-up' | 'slide-left' | 'slide-right' | 'scale' | 'tilt-3d';
  margin?: string;
  key?: React.Key;
}

export default function ScrollReveal({
  children,
  className = '',
  delay = 0,
  duration = 0.8,
  variant = 'slide-up',
  margin = '-150px'
}: ScrollRevealProps) {
  
  // Custom springs/transition models to simulate advanced tactical HUD system loading states
  const variants = {
    hidden: {
      opacity: 0,
      y: variant === 'slide-up' ? 50 : 0,
      x: variant === 'slide-left' ? 50 : variant === 'slide-right' ? -50 : 0,
      scale: variant === 'scale' ? 0.95 : 1,
      rotateX: variant === 'tilt-3d' ? 12 : 0,
      transformPerspective: variant === 'tilt-3d' ? 1000 : undefined,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        duration: duration,
        delay: delay,
        ease: [0.16, 1, 0.3, 1], // Custom cubic-bezier for a crisp mechanical spring deceleration
        staggerChildren: 0.12,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: margin as any }}
      variants={variants}
      className={`${className} will-change-transform`}
    >
      {children}
    </motion.div>
  );
}
