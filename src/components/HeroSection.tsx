import { useState, MouseEvent, useRef } from 'react';
import { motion } from 'motion/react';
import { Download, FileText, ShieldCheck, CheckCircle2, FileCheck } from 'lucide-react';
import { playSound } from '../utils/audio';

// Dynamic import or local path of the generated image
// @ts-ignore
import ghostImg from '../assets/images/simon_riley_ghost_1780997541733.png';

export default function HeroSection() {
  const [mouseParallax, setMouseParallax] = useState({ x: 0, y: 0 }); // subtle coordinates translation
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, isHovered: false });
  const [downloaded, setDownloaded] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    // Calculate interactive parallax offset
    const parallaxX = (e.clientX - window.innerWidth / 2) / 45;
    const parallaxY = (e.clientY - window.innerHeight / 2) / 45;
    setMouseParallax({ x: parallaxX, y: parallaxY });

    if (imageContainerRef.current) {
      const rect = imageContainerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMousePos({ x, y, isHovered: true });
    }
  };

  const handleMouseLeave = () => {
    setMouseParallax({ x: 0, y: 0 });
    setMousePos(prev => ({ ...prev, isHovered: false }));
  };

  const handleDownloadResume = () => {
    playSound('unlock');
    setDownloaded(true);

    const link = document.createElement('a');
    link.href = '/Sanath Lal Shibu Lekha Resume.pdf';
    link.download = 'Sanath_Lal.pdf';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      setDownloaded(false);
    }, 4000);
  };

  return (
    <section 
      id="hero"
      className="relative min-h-screen bg-[#0d0e12] flex items-center justify-center overflow-hidden pt-20"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >


      {/* Background 1: Tactical Grid with mouse-parallax translation */}
      <motion.div 
        animate={{ x: mouseParallax.x * 0.4, y: mouseParallax.y * 0.4 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="absolute inset-0 hud-grid-bg opacity-40 z-0 pointer-events-none" 
      />

      {/* Background 2: Topographical altitude SVG lines */}
      <motion.div 
        animate={{ x: mouseParallax.x * -0.6, y: mouseParallax.y * -0.6 }}
        transition={{ type: "spring", stiffness: 100, damping: 25 }}
        className="absolute inset-0 pointer-events-none opacity-10 z-0"
      >
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <path d="M-100,200 C300,100 500,400 900,300 C1300,200 1500,500 1900,400" fill="none" stroke="#c4fd02" strokeWidth="2" />
          <path d="M-100,250 C300,150 500,450 900,350 C1300,250 1500,550 1900,450" fill="none" stroke="#2a2f3d" strokeWidth="1" />
          <path d="M-100,300 C300,200 500,500 900,400 C1300,300 1500,600 1900,500" fill="none" stroke="#c4fd02" strokeWidth="1" strokeDasharray="5,5" />
          <path d="M-100,500 C200,600 600,400 1000,550 C1400,700 1650,450 2000,600" fill="none" stroke="#2a2f3d" strokeWidth="1.5" />
        </svg>
      </motion.div>

      {/* Full Screen Simon Riley Interactive Character Cover (Positioned below the header) */}
      <motion.div 
        ref={imageContainerRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="absolute top-20 bottom-0 left-0 right-0 w-full overflow-hidden pointer-events-none z-[1]"
      >
        <motion.img 
          src={ghostImg} 
          alt="Simon Riley Ghost Full Screen Tactical Image" 
          referrerPolicy="no-referrer"
          animate={{ 
            x: mouseParallax.x * -1.8, 
            y: mouseParallax.y * -1.8,
            scale: 1.05
          }}
          transition={{ type: "spring", stiffness: 90, damping: 24 }}
          className="w-full h-full object-cover object-top opacity-85 transition-all duration-700"
        />
        </motion.div>

        <style>{`

          @keyframes scanLine {
            0% { transform: translateY(0); opacity: 0; }
            10% { opacity: 0.65; }
            90% { opacity: 0.65; }
            100% { transform: translateY(90vh); opacity: 0; }
          }
          @keyframes tacticalRise {
            0% { transform: translateY(0) scale(0.85); opacity: 0; }
            15% { opacity: 0.6; }
            85% { opacity: 0.6; }
            100% { transform: translateY(-75vh) scale(1.3); opacity: 0; }
          }
        `}</style>

        {/* Tactical Night-Vision and Vignette overlay gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0e12] via-[#0d0e12]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d0e12]/20 via-transparent to-[#0d0e12]/20" />

      {/* Dynamic HUD Tracking Decals & Micro Elements */}
      <div className="absolute inset-0 pointer-events-none z-[2]">
        {/* Night-Vision Scanning Sweep Line */}
        <div className="absolute top-20 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-brand/25 to-transparent shadow-[0_0_8px_rgba(196,253,2,0.4)] animate-[scanLine_9s_linear_infinite]" />
        
        {/* Top-Left Tactical Status Panel */}
        <div className="absolute left-6 top-28 font-mono text-[9px] text-brand/50 tracking-widest leading-relaxed hidden sm:block">
          <div className="flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-brand/80 animate-ping" />
            <span className="font-semibold text-brand/70">SYS_LOC // CONNECTED</span>
          </div>
          <div className="text-white/40 mt-0.5">LAT/LON: 47.931° N, 122.342° W</div>
          <div className="w-16 h-[1px] bg-brand/33 mt-1" />
        </div>

        {/* Bottom-Right Tactical Status panel */}
        <div className="absolute right-6 bottom-24 text-right font-mono text-[9px] text-brand/45 tracking-widest leading-relaxed hidden sm:block">
          <div>RECON_REF: OUTLAW-X90</div>
          <div className="text-white/45">SIGNAL STACK: READY</div>
          <div className="flex items-center justify-end space-x-1 mt-1">
            <span className="inline-block w-2.5 h-1 bg-brand/50 animate-pulse" />
            <span className="inline-block w-1.5 h-1 bg-white/25" />
            <span className="inline-block w-4 h-1 bg-brand/30" />
          </div>
        </div>

        {/* Tactical crosshair elements */}
        <div className="absolute left-1/4 top-[40%] w-3 h-3 border border-brand/20 flex items-center justify-center">
          <div className="w-0.5 h-0.5 bg-brand/40 rounded-full" />
        </div>
        <div className="absolute right-1/4 bottom-1/3 w-5 h-5 border border-brand/25 rounded-full flex items-center justify-center animate-[spin_16s_linear_infinite]">
          <div className="w-[1px] h-3 bg-brand/35" />
          <div className="w-3 h-[1px] bg-brand/35" />
        </div>

        {/* Gently rising green dust/sparks particles */}
        {[...Array(10)].map((_, i) => {
          const randomLeft = `${(i * 123) % 94 + 3}%`;
          const randomDelay = `${(i * 1.7) % 9}s`;
          const randomDuration = `${10 + (i * 3.1) % 9}s`;
          const randomSize = `${((i * 4) % 3) + 2}px`;
          return (
            <div
              key={i}
              style={{
                left: randomLeft,
                width: randomSize,
                height: randomSize,
                animationDelay: randomDelay,
                animationDuration: randomDuration,
              }}
              className="absolute bottom-0 bg-brand/20 rounded-full pointer-events-none animate-[tacticalRise_infinite_linear] opacity-0"
            />
          );
        })}
      </div>

      {/* Compact Centered Download Resume Tactical Card */}
      <div className="relative z-20 my-auto pt-28 sm:pt-36 pb-12 flex flex-col items-center justify-center pointer-events-auto">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-[#080a10]/85 backdrop-blur-md border border-[#1b2130] hover:border-brand/50 rounded-xl p-3.5 sm:p-4 shadow-[0_8px_30px_rgba(0,0,0,0.8)] max-w-[280px] sm:max-w-xs w-full mx-auto text-center space-y-2.5 group transition-all duration-300 relative overflow-hidden"
        >
          {/* Subtle Accent Top Border */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />

          {/* Compact Header Badge */}
          <div className="inline-flex items-center space-x-1.5 bg-[#121624] px-2.5 py-0.5 rounded-full border border-[#222938] text-[9px] sm:text-[10px] font-mono text-brand uppercase tracking-wider">
            <ShieldCheck className="w-3 h-3 text-brand" />
            <span>SANATH LAL SHIBU LEKHA</span>
          </div>

          {/* Download Resume Button */}
          <div>
            <button
              type="button"
              onClick={handleDownloadResume}
              onMouseEnter={() => playSound('chirp')}
              className="w-full relative inline-flex items-center justify-center space-x-2 bg-brand hover:bg-[#d4fe1a] text-black font-mono font-bold text-xs px-4 py-2.5 rounded-lg shadow-[0_0_15px_rgba(196,253,2,0.25)] hover:shadow-[0_0_22px_rgba(196,253,2,0.5)] transition-all duration-300 cursor-pointer uppercase tracking-wider group/btn"
            >
              {downloaded ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-black animate-bounce" />
                  <span>RESUME DISPATCHED</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 text-black group-hover/btn:translate-y-0.5 transition-transform" />
                  <span>DOWNLOAD RESUME</span>
                  <FileText className="w-3.5 h-3.5 text-black/70" />
                </> 
              )}
            </button>
          </div>

          {/* Micro Footer Label */}
          <div className="flex items-center justify-between text-[9px] font-mono text-gray-500 pt-1 border-t border-[#161a26]">
            <span className="flex items-center space-x-1">
              <FileCheck className="w-2.5 h-2.5 text-brand" />
              <span className="text-gray-300">FORMAT: PDF</span>
            </span>
            <span className="text-brand/80 font-semibold">[ VERIFIED ]</span>
          </div>
        </motion.div>
      </div>

      {/* Floating tactical scroll down cue */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-2 pointer-events-none z-10">
        <span className="font-mono text-[9px] tracking-[0.3em] text-brand uppercase animate-pulse">SCROLL TO DESCEND</span>
        <motion.div 
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="w-1.5 h-3.5 border border-brand/50 rounded-full flex justify-center p-0.5"
        >
          <div className="w-0.5 h-1 bg-brand rounded-full" />
        </motion.div>
      </div>
    </section>
  );
}
