/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import AboutMeSection from './components/AboutMeSection';
import ProjectsSection from './components/ProjectsSection';
import CredentialsSection from './components/CredentialsSection';
import ContactSection from './components/ContactSection';
import CustomCursor from './components/CustomCursor';
import { toggleMute, playSound } from './utils/audio';
import { Target, Cpu, HardDrive, ShieldAlert } from 'lucide-react';

export default function App() {
  const [isMuted, setIsMuted] = useState(true);
  const [activeSection, setActiveSection] = useState('hero');

  const handleToggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    toggleMute(newMuted);
  };

  // Tracking active section via IntersectionObserver
  useEffect(() => {
    const sections = ['hero', 'about', 'projects', 'credentials', 'contact'];
    const observers = sections.map((id) => {
      const element = document.getElementById(id);
      if (!element) return null;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(id);
            }
          });
        },
        { rootMargin: '-30% 0px -40% 0px' }
      );
      observer.observe(element);
      return { observer, element };
    });

    return () => {
      observers.forEach((obs) => {
        if (obs) {
          obs.observer.unobserve(obs.element);
        }
      });
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-[#0d0e12] text-white selection:bg-brand selection:text-black">
      
      {/* Custom interactive mouse cursor */}
      <CustomCursor />
      {/* Absolute Header Overlay */}
      <Navbar 
        isMuted={isMuted} 
        onToggleMute={handleToggleMute} 
        activeSection={activeSection} 
      />

      {/* Main Page Layout Sections */}
      <main>
        {/* HERO INTRO & CENTERPIECE GHOST PORTRAIT */}
        <HeroSection />

        {/* PROFILE DOSSIER, SKILLS & WORK EXPERIENCE TIMELINE */}
        <AboutMeSection />

        {/* PROJECTS GRID, HOLO RETRO ARCADE & KEY ACHIEVEMENTS */}
        <ProjectsSection />

        {/* VERIFIED DOSSIERS & SOCIAL COMMLINKS */}
        <CredentialsSection />

        {/* DIRECT TRANSMISSION CONTACT FORM & RATING FEEDBACK */}
        <ContactSection />
      </main>

      {/* Epic Tactical Footer */}
      <footer className="bg-[#090a0d] border-t border-[#1f222b] py-12 relative overflow-hidden select-none">
        
        {/* Subtle grid accent behind */}
        <div className="absolute inset-0 hud-grid-bg opacity-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center justify-between gap-8 md:flex-row">
          
          <div className="space-y-3.5 max-w-md text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-2">
              <span className="font-display font-black tracking-widest text-[#ffffff] text-sm">
                SANATH
              </span>
              <span className="font-display font-normal tracking-widest text-brand glow-brand text-sm">
                LAL
              </span>
              <span className="font-display font-black tracking-widest text-[#ffffff] text-sm">
                SHIBU
              </span>
              <span className="font-display font-normal tracking-widest text-brand glow-brand text-sm">
                LEKHA
              </span>
            </div>
            <p className="font-sans text-[11px] text-gray-500 leading-relaxed font-light">
              Crafted as a professional tribute. This tactile platform compiles reactive design patterns, Web Audio synthesis loops, and GPU-driven vector assets. 
            </p>
          </div>

          {/* Core Hardware metrics */}
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <span className="bg-[#14161d] border border-[#2a2f3d] rounded-sm px-3 py-1 font-mono text-[9px] text-[#a1a1aa] tracking-widest flex items-center space-x-1.5 hover:text-brand transition-colors cursor-pointer" onMouseEnter={() => playSound('chirp')}>
              <span className="w-1.5 h-1.5 bg-brand rounded-full animate-ping" />
              <span>REACT 19 CORE</span>
            </span>
            <span className="bg-[#14161d] border border-[#2a2f3d] rounded-sm px-3 py-1 font-mono text-[9px] text-[#a1a1aa] tracking-widest flex items-center space-x-1.5 hover:text-brand transition-colors cursor-pointer" onMouseEnter={() => playSound('chirp')}>
              <Cpu className="w-3.5 h-3.5 text-brand" />
              <span>TAILWIND V4</span>
            </span>
            <span className="bg-[#14161d] border border-[#2a2f3d] rounded-sm px-3 py-1 font-mono text-[9px] text-[#a1a1aa] tracking-widest flex items-center space-x-1.5 hover:text-brand transition-colors cursor-pointer" onMouseEnter={() => playSound('chirp')}>
              <Target className="w-3.5 h-3.5 text-brand" />
              <span>60FPS CANVAS PLAYABLE</span>
            </span>
          </div>
        </div>

        {/* Trademark lines */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 border-t border-[#1f222b]/50 mt-8 pt-6 flex flex-col items-center justify-between gap-4 md:flex-row text-[9px] font-mono text-gray-600">
          <span>SANATH LAL SHIBU LEKHA// ALL OPERATIONS PERSISTENT SECURITY LOGS AUTHENTICATED SUCCESSFULLY</span>
          <span>© 2026. CURRENT_SECTOR_ONLINE</span>
        </div>
      </footer>
    </div>
  );
}

