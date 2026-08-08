import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, Menu, X, ShieldAlert, Cpu, Terminal, Radio } from 'lucide-react';
import { playSound } from '../utils/audio';

interface NavbarProps {
  isMuted: boolean;
  onToggleMute: () => void;
  activeSection: string;
  onReplayLoading?: () => void;
}

export default function Navbar({ isMuted, onToggleMute, activeSection, onReplayLoading }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { label: 'ABOUT & EXPERIENCE', href: '#about', index: '01' },
    { label: 'PROJECTS & ACHIEVEMENTS', href: '#projects', index: '02' },
    { label: 'CREDENTIALS & SOCIALS', href: '#credentials', index: '03' },
    { label: 'CONTACT & FEEDBACK', href: '#contact', index: '04' }
  ];

  const handleNavClick = (href: string) => {
    playSound('chirp');
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const currentThemeTag = scrolled ? "COMM CONFLICT // DEPLOYED" : "TACTICAL FEED // OFFLINE";

  return (
    <header 
      id="main-header"
      className="fixed top-0 left-0 w-full z-50 border-b bg-[#0d0e12]/95 backdrop-blur-md border-[#2a2f3d]/60"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Left: Brand Name - Lando style but Ghost militarized */}
        <div className="flex items-center space-x-3">
          <div className="flex flex-col select-none cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="flex items-center space-x-2">
              <span className="font-display font-bold text-lg tracking-[0.01em] text-white">
                SANATH
              </span>
              <span className="font-display font-light text-lg tracking-[0.01em] text-brand glow-brand">
                LAL
              </span>
              <span className="font-display font-bold text-lg tracking-[0.01em] text-white">
                SHIBU
              </span>
              <span className="font-display font-light text-lg tracking-[0.01em] text-brand glow-brand">
                LEKHA
              </span>
            </div>
            <div className="flex items-center space-x-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 bg-brand rounded-full animate-pulse" />
              <span className="font-mono text-[9px] tracking-widest text-[#a1a1aa] uppercase">
                {currentThemeTag}
              </span>
            </div>
          </div>
        </div>

        {/* Middle: Desktop HUD Links */}
        <nav className="hidden md:flex items-center space-x-5 lg:space-x-6">
          {menuItems.map((item) => {
            const isActive = activeSection === item.href.slice(1);
            return (
              <button
                key={item.href}
                onClick={() => handleNavClick(item.href)}
                className="relative py-2 group cursor-pointer focus:outline-none"
                onMouseEnter={() => playSound('chirp')}
              >
                <div className="flex items-baseline space-x-1">
                  <span className="font-mono text-[8px] text-[#71717a] group-hover:text-brand transition-colors duration-200">
                    {item.index}
                  </span>
                  <span className={`font-display text-[11px] tracking-widest transition-colors duration-200 font-medium ${
                    isActive ? 'text-brand' : 'text-[#d4d4d8] group-hover:text-white'
                  }`}>
                    {item.label}
                  </span>
                </div>
                {isActive && (
                  <motion.div 
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-0 w-full h-[2px] bg-brand"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-white group-hover:w-full transition-all duration-300" />
              </button>
            );
          })}
        </nav>

        {/* Right: Sound Control + Custom McLaren-style Store button + Burger */}
        <div className="flex items-center space-x-3">
          

          {/* Audio synthezier power trigger */}
          <button
            onClick={() => {
              onToggleMute();
              // A slight beep feedback logic
              setTimeout(() => playSound('beep'), 50);
            }}
            className="p-2.5 rounded-md border border-[#2a2f3d] bg-[#14161d] hover:border-brand hover:text-brand transition-all duration-200 cursor-pointer focus:outline-none group"
            title={isMuted ? "Enable Sonar Audio Feed" : "Mute Sonar Audio Feed"}
            onMouseEnter={() => playSound('chirp')}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-gray-500 group-hover:text-brand-dim" />
            ) : (
              <div className="relative">
                <Volume2 className="w-4 h-4 text-brand animate-pulse" />
                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand"></span>
                </span>
              </div>
            )}
          </button>

          {/* Gamified Button: "ACTIVE DOSSIER" (McLaren style Lime Button) */}
          <button
            onClick={() => handleNavClick('#feedback')}
            className="hidden sm:flex items-center space-x-2 bg-brand text-black font-display font-bold text-xs tracking-widest px-4 py-2.5 rounded-xs hover:bg-[#a3e635] hover:shadow-lg transition-all duration-200 active:scale-95 cursor-pointer border border-brand group"
            onMouseEnter={() => playSound('beep')}
          >
            <Terminal className="w-3.5 h-3.5 animate-bounce" />
            <span>ESTABLISH LINK</span>
          </button>

          {/* Burger Menu for Mobile */}
          <button
            onClick={() => {
              playSound('chirp');
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="md:hidden p-2.5 rounded-md border border-[#2a2f3d] bg-[#14161d] text-[#e4e4e7] hover:border-brand hover:text-brand transition-colors focus:outline-none cursor-pointer"
            onMouseEnter={() => playSound('chirp')}
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0d0e12] border-b border-[#2a2f3d] overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-4">
              {menuItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => handleNavClick(item.href)}
                  className="w-full text-left py-2.5 px-3.5 rounded-md border border-transparent hover:border-[#2a2f3d] hover:bg-[#14161d] transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center space-x-2.5">
                    <span className="font-mono text-[10px] text-brand">{item.index}</span>
                    <span className="font-display text-[12px] font-medium tracking-wider text-white">
                      {item.label}
                    </span>
                  </div>
                  <Terminal className="w-3.5 h-3.5 text-gray-600 group-hover:text-brand transition-all" />
                </button>
              ))}

              <div className="pt-2 flex flex-col space-y-3">
                <button
                  onClick={() => {
                    onToggleMute();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center space-x-3 py-3 rounded-md bg-[#14161d] border border-[#2a2f3d] text-sm text-[#d4d4d8]"
                >
                  {isMuted ? (
                    <>
                      <VolumeX className="w-4 h-4" />
                      <span>UNMUTE RECON FEED</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4 text-brand" />
                      <span className="text-brand">MUTED RECON FEED</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleNavClick('#feedback')}
                  className="flex items-center justify-center space-x-2 w-full bg-brand text-black font-display font-bold text-xs tracking-widest py-3 rounded-md"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>ESTABLISH LINK</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
