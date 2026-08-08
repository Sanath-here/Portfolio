import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { playSound } from '../utils/audio';

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);

  // Smooth realistic progress counter
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const increment = Math.floor(Math.random() * 8) + 4;
        const next = prev + increment;
        return next > 100 ? 100 : next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Complete transition when progress hits 100%
  useEffect(() => {
    if (progress === 100 && !isDone) {
      playSound('unlock');
      const timer = setTimeout(() => {
        setIsDone(true);
        setTimeout(onComplete, 400); // allow exit transition
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [progress, isDone, onComplete]);

  // Handle manual skip via click or keypress
  const handleSkip = () => {
    if (isDone) return;
    playSound('unlock');
    setIsDone(true);
    setTimeout(onComplete, 300);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        handleSkip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const getStatusText = (p: number) => {
    if (p < 30) return 'INITIALIZING TACTICAL LINK';
    if (p < 60) return 'COMPILING GAME ENGINE SHADERS';
    if (p < 90) return 'VERIFYING OPERATIVE DOSSIER';
    return 'DEPLOYMENT AUTHORIZED';
  };

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.4 }}
          onClick={handleSkip}
          className="fixed inset-0 z-[9999] bg-[#07080a] text-white flex flex-col items-center justify-center select-none overflow-hidden font-mono cursor-pointer"
        >
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute w-[500px] h-[500px] bg-brand/5 rounded-full blur-[120px] pointer-events-none" />

          {/* Centered Minimal COD Tactical Emblem */}
          <div className="relative flex flex-col items-center space-y-8 z-10">
            
            {/* Circular Radar / Reticle HUD Graphic */}
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full border border-brand/25 flex items-center justify-center shadow-[0_0_50px_rgba(196,253,2,0.06)]">
              
              {/* Outer Tick Marks */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-3 bg-brand/60" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-3 bg-brand/60" />
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-0.5 bg-brand/60" />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-0.5 bg-brand/60" />

              {/* Inner Concentric Circle */}
              <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full border border-brand/15 flex flex-col items-center justify-center text-center p-4 relative">
                
                {/* Diagonal Corner Markers */}
                <div className="absolute top-2 left-2 w-1.5 h-1.5 border-t border-l border-brand/40" />
                <div className="absolute top-2 right-2 w-1.5 h-1.5 border-t border-r border-brand/40" />
                <div className="absolute bottom-2 left-2 w-1.5 h-1.5 border-b border-l border-brand/40" />
                <div className="absolute bottom-2 right-2 w-1.5 h-1.5 border-b border-r border-brand/40" />

                {/* Tactical Title Inside Circle */}
                <span className="text-[10px] sm:text-[11px] font-bold text-brand tracking-[0.25em] uppercase">
                  SANATH's
                </span>
                
                <span className="font-display font-black text-xl sm:text-2xl text-white tracking-wider my-1 uppercase">
                  TACTICAL
                </span>

                <span className="text-[9px] text-gray-500 tracking-[0.2em] uppercase">
                  PORTFOLIO // V2.5
                </span>
              </div>

            </div>

            {/* Status Text & Percentage */}
            <div className="text-center space-y-2 w-72 sm:w-80">
              <div className="flex items-center justify-between text-[11px] tracking-[0.18em] text-brand/90 uppercase font-medium">
                <span>{getStatusText(progress)}</span>
                <span className="font-bold text-white font-mono">{progress}%</span>
              </div>

              {/* Sleek Ultra-thin Progress Line */}
              <div className="w-full h-[2px] bg-[#1a1e29] relative overflow-hidden rounded-full">
                <motion.div
                  className="h-full bg-brand shadow-[0_0_12px_rgba(196,253,2,0.8)]"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: 'easeOut', duration: 0.1 }}
                />
              </div>
            </div>

          </div>

          {/* Minimal Side Pulse / Skip Indicator */}
          <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden md:flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border border-brand/30 flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-brand animate-ping" />
            </div>
          </div>

          {/* Bottom Minimal Prompt */}
          <div className="absolute bottom-6 text-[10px] tracking-[0.25em] text-gray-600 uppercase font-mono">
            CLICK ANYWHERE OR PRESS SPACE TO SKIP
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
