import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

export default function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  // Spring settings to simulate elastic tactical lag-behind ring
  const springConfig = { damping: 25, stiffness: 220, mass: 0.6 };
  const ringX = useSpring(cursorX, springConfig);
  const ringY = useSpring(cursorY, springConfig);

  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) {
        setIsVisible(true);
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      // Check if hovering over any interactive link, button, active tab or clickable inputs
      const isInteractive = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('button') || 
        target.closest('a') || 
        target.getAttribute('role') === 'button' ||
        target.classList.contains('cursor-pointer') ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA';
      
      setIsHovered(!!isInteractive);
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div id="custom-tactical-cursor" className="fixed inset-0 pointer-events-none z-[100000] select-none hidden md:block">
      {/* Outer weighted circular 2px ring trailing in spring */}
      <motion.div
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: isHovered ? 44 : 26,
          height: isHovered ? 44 : 26,
          borderColor: isHovered ? '#ffffff' : '#c4fd02',
          borderWidth: '2px',
          scale: isHovered ? 1.15 : 1,
        }}
        transition={{ type: 'spring', stiffness: 350, damping: 20 }}
        className="absolute rounded-full border-brand pointer-events-none shadow-[0_0_10px_rgba(196,253,2,0.15)]"
      />

      {/* Center sharp laser alignment point/dot */}
      <motion.div
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isHovered ? 1.4 : 1,
          backgroundColor: isHovered ? '#ffffff' : '#c4fd02',
        }}
        className="absolute w-1.5 h-1.5 rounded-full pointer-events-none shadow-[0_0_6px_rgba(196,253,2,0.6)]"
      />
    </div>
  );
}
