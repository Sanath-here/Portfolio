import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Shield, 
  Briefcase, 
  MapPin, 
  Calendar, 
  ChevronRight, 
  Terminal, 
  Zap, 
  TrendingUp, 
  Building2, 
  CheckCircle2 
} from 'lucide-react';
import { WORK_EXPERIENCE_DATA } from '../data';
import { playSound } from '../utils/audio';
import DecryptText from './DecryptText';
import ScrollReveal from './ScrollReveal';

export default function AboutMeSection() {
  const [expandedExpId, setExpandedExpId] = useState<string | null>(WORK_EXPERIENCE_DATA[0]?.id || null);

  const toggleExpExpand = (id: string) => {
    playSound('chirp');
    setExpandedExpId(prev => prev === id ? null : id);
  };

  return (
    <section 
      id="about" 
      className="py-24 relative bg-[#090a0d] border-b border-[#1f222b] overflow-hidden"
    >
      {/* Background ambient light */}
      <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-[#c4fd02]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[-10%] w-[400px] h-[400px] bg-[#c4fd02]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <ScrollReveal 
          variant="slide-up"
          margin="-120px"
          className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#2a2f3d]/60 pb-8"
        >
          <div className="space-y-2">
            <span className="font-mono text-xs text-brand tracking-widest block uppercase">
              // DATA ARCHIVE // COG_01 & DEPLOYMENT RECORD
            </span>
            <h2 className="font-display font-black text-4xl text-white tracking-wider flex items-center space-x-3">
              <Shield className="w-8 h-8 text-brand animate-pulse" />
              <DecryptText text="ABOUT ME" />
            </h2>
          </div>
        </ScrollReveal>

        {/* Content Body */}
        <div className="space-y-16">
          
          {/* Top Paragraph Description */}
          <ScrollReveal
            variant="slide-up"
            delay={0.12}
            className="max-w-7xl"
          >
            <p className="font-display text-gray-250 hover:text-white leading-relaxed text-sm sm:text-base md:text-lg font-light tracking-wide transition-colors duration-300 text-justify">
              Hey! I'm <strong className="text-brand font-semibold shadow-brand">Sanath</strong> — a game developer, AI/ML enthusiast, and software designer who loves building things that feel both creative and meaningful. Whether it's developing immersive games, designing intelligent AI models, or crafting smooth software experiences, I enjoy turning ideas into something real and impactful. I'm always curious about new technologies and constantly experimenting, learning, and improving to create smarter and more engaging digital experiences.
            </p>
          </ScrollReveal>

          {/* Grid Cards: Skills & What I'm Working On */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Card 1: Skills */}
            <ScrollReveal
              variant="slide-right"
              delay={0.2}
              className="h-full"
            >
              <div 
                onMouseEnter={() => playSound('chirp')}
                className="bg-[#0b0c10]/95 border border-[#1f222b] hover:border-brand/50 p-8 rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.65)] hover:shadow-[0_0_25px_rgba(196,253,2,0.1)] transition-all duration-300 flex flex-col h-full group"
              >
                <h3 className="font-display font-bold text-2xl text-white tracking-wide mb-6 pb-3 border-b border-[#1f222b]/80 flex items-center justify-between">
                  <span>Skills</span>
                  <span className="font-mono text-[9px] text-brand/70 bg-brand/10 border border-brand/20 px-2.5 py-0.5 rounded-sm">SYS_DECODER</span>
                </h3>
                <ul className="space-y-4 font-normal text-gray-350 text-sm sm:text-base leading-relaxed">
                  <li className="flex items-center group-hover:text-white transition-colors duration-200">
                    <span className="font-mono text-[11px] text-brand mr-3 select-none">[+]</span>
                    HTML5 & CSS3
                  </li>
                  <li className="flex items-center group-hover:text-white transition-colors duration-200">
                    <span className="font-mono text-[11px] text-brand mr-3 select-none">[+]</span>
                    Responsive web design
                  </li>
                  <li className="flex items-center group-hover:text-white transition-colors duration-200">
                    <span className="font-mono text-[11px] text-brand mr-3 select-none">[+]</span>
                    React & TypeScript
                  </li>
                  <li className="flex items-center group-hover:text-white transition-colors duration-200">
                    <span className="font-mono text-[11px] text-brand mr-3 select-none">[+]</span>
                    Unreal Engine Developer
                  </li>
                  <li className="flex items-center group-hover:text-white transition-colors duration-200">
                    <span className="font-mono text-[11px] text-brand mr-3 select-none">[+]</span>
                    Python, C, Visual Scripting
                  </li>
                  <li className="flex items-center group-hover:text-white transition-colors duration-200">
                    <span className="font-mono text-[11px] text-brand mr-3 select-none">[+]</span>
                    AI/ML, MYSQL
                  </li>
                  <li className="flex items-center group-hover:text-white transition-colors duration-200">
                    <span className="font-mono text-[11px] text-brand mr-3 select-none">[+]</span>
                    Blender, Substance 3D Painter, After Effects, Photoshop
                  </li>
                  <li className="flex items-center group-hover:text-white transition-colors duration-200">
                    <span className="font-mono text-[11px] text-brand mr-3 select-none">[+]</span>
                    AI Tools:  Claude, ChatGPT, Antigravity, Cursor, ElevenLabs
                  </li>
                </ul>
              </div>
            </ScrollReveal>

            {/* Card 2: What I'm Working On */}
            <ScrollReveal
              variant="slide-left"
              delay={0.28}
              className="h-full"
            >
              <div 
                onMouseEnter={() => playSound('chirp')}
                className="bg-[#0b0c10]/95 border border-[#1f222b] hover:border-brand/50 p-8 rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.65)] hover:shadow-[0_0_25px_rgba(196,253,2,0.1)] transition-all duration-300 flex flex-col h-full group"
              >
                <h3 className="font-display font-bold text-2xl text-white tracking-wide mb-6 pb-3 border-b border-[#1f222b]/80 flex items-center justify-between">
                  <span>What I'm Working On</span>
                  <span className="font-mono text-[9px] text-brand/70 bg-brand/10 border border-brand/20 px-2.5 py-0.5 rounded-sm">LIVE_THREAD</span>
                </h3>
                <p className="font-sans text-gray-300 text-sm sm:text-base leading-relaxed font-light group-hover:text-white transition-colors duration-200">
                  Passionate about designing immersive games and building modern digital experiences through web development, artificial intelligence, and machine learning. Skilled in creating engaging websites, AI-powered chatbots, training ML models, and leveraging emerging technologies to solve real-world problems and deliver impactful, user-centric solutions.
                </p>
              </div>
            </ScrollReveal>

          </div>

          {/* Sub-Section: WORK EXPERIENCE TIMELINE */}
          <div className="pt-8 border-t border-[#1f222b]">
            <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-brand/10 border border-brand/30 text-brand">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-2xl text-white uppercase tracking-wider">
                    Work Experience
                  </h3>
                  <span className="font-mono text-xs text-brand/80 uppercase">
                    // CAREER RECORD & ROLES DEPLOYED
                  </span>
                </div>
              </div>

              <div className="inline-flex items-center space-x-2 font-mono text-xs text-gray-400 bg-[#12141c] px-4 py-2 rounded-xl border border-[#252a38]">
                <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
                <span className="text-white font-semibold">STATUS:</span>
                <span className="text-brand font-bold">1+ YEARS TOTAL RECORD</span>
              </div>
            </div>

            {/* Timeline List */}
            <div className="relative pl-4 sm:pl-8 space-y-8">
              
              {/* Vertical Connecting Line */}
              <div className="absolute top-3 bottom-3 left-[15px] sm:left-[31px] w-[2px] bg-gradient-to-b from-brand via-[#272d40] to-[#1f222b]" />

              {WORK_EXPERIENCE_DATA.map((exp, idx) => {
                const isExpanded = expandedExpId === exp.id;
                const isActive = exp.status === 'ACTIVE MISSION';

                return (
                  <ScrollReveal 
                    key={exp.id}
                    variant="slide-up"
                    delay={idx * 0.08}
                    className="relative"
                  >
                    {/* Timeline Node Point */}
                    <div 
                      className={`absolute -left-[23px] sm:-left-[39px] top-6 w-5 h-5 rounded-full border-2 transition-all duration-300 flex items-center justify-center bg-[#090a0e] ${
                        isActive 
                          ? 'border-brand shadow-[0_0_15px_rgba(196,253,2,0.6)] text-brand' 
                          : 'border-[#3a4156] text-gray-500'
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-brand' : 'bg-gray-500'}`} />
                    </div>

                    {/* Main Card */}
                    <div 
                      className={`bg-[#0e1017] border rounded-2xl transition-all duration-300 overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.5)] ${
                        isExpanded 
                          ? 'border-brand/60 shadow-[0_0_25px_rgba(196,253,2,0.1)]' 
                          : 'border-[#1f2433] hover:border-[#333a50]'
                      }`}
                    >
                      {/* Card Header Bar */}
                      <div 
                        onClick={() => toggleExpExpand(exp.id)}
                        onMouseEnter={() => playSound('chirp')}
                        className="p-6 sm:p-7 cursor-pointer flex flex-col lg:flex-row lg:items-center justify-between gap-4 select-none hover:bg-[#121520]/60 transition-colors"
                      >
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="font-mono text-xs px-2.5 py-0.5 rounded-md bg-brand/10 border border-brand/30 text-brand font-semibold uppercase tracking-wider">
                              {exp.type}
                            </span>

                            <span className={`font-mono text-[10px] px-2.5 py-0.5 rounded-md border tracking-wider font-semibold uppercase flex items-center space-x-1 ${
                              isActive 
                                ? 'bg-brand/15 border-brand/40 text-brand' 
                                : 'bg-gray-800/40 border-gray-700 text-gray-400'
                            }`}>
                              <CheckCircle2 className="w-3 h-3 mr-1 text-brand" />
                              {exp.status}
                            </span>

                            {exp.metrics && (
                              <span className="font-mono text-[10px] px-2.5 py-0.5 rounded-md bg-[#162012] border border-brand/30 text-brand font-semibold flex items-center space-x-1">
                                <TrendingUp className="w-3 h-3 mr-1 text-brand" />
                                {exp.metrics}
                              </span>
                            )}
                          </div>

                          <h4 className="font-display font-bold text-xl sm:text-2xl text-white group-hover:text-brand transition-colors">
                            {exp.role}
                          </h4>

                          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-gray-400 pt-0.5">
                            <div className="flex items-center space-x-1.5 text-gray-200 font-medium">
                              <Building2 className="w-3.5 h-3.5 text-brand" />
                              <span>{exp.company}</span>
                            </div>
                            <div className="flex items-center space-x-1.5 text-gray-400">
                              <MapPin className="w-3.5 h-3.5 text-gray-500" />
                              <span>{exp.location}</span>
                            </div>
                            <div className="flex items-center space-x-1.5 text-brand/90 font-medium">
                              <Calendar className="w-3.5 h-3.5 text-brand" />
                              <span>{exp.period}</span>
                            </div>
                          </div>
                        </div>

                        {/* Expand Indicator Button */}
                        <div className="flex items-center space-x-3 self-end lg:self-center">
                          <span className="font-mono text-[11px] text-gray-400 hidden sm:inline-block">
                            {isExpanded ? 'COLLAPSE DOSSIER' : 'VIEW DETAILS'}
                          </span>
                          <div className={`p-2 rounded-xl bg-[#161a26] border border-[#272d40] text-brand transition-transform duration-300 ${
                            isExpanded ? 'rotate-90 bg-brand text-black border-brand' : ''
                          }`}>
                            <ChevronRight className="w-4 h-4" />
                          </div>
                        </div>
                      </div>

                      {/* Expanded Details Body */}
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="px-6 pb-7 sm:px-7 pt-2 border-t border-[#1f2433] bg-[#0b0c12]/80"
                        >
                          {/* Overview */}
                          <p className="font-sans text-sm text-gray-300 leading-relaxed font-light mb-5 text-justify">
                            {exp.description}
                          </p>

                          {/* Responsibilities list */}
                          <div className="space-y-3 mb-6">
                            <span className="font-mono text-xs text-brand tracking-widest block uppercase flex items-center space-x-1.5">
                              <Terminal className="w-3.5 h-3.5" />
                              <span>KEY OBJECTIVES & DELIVERABLES:</span>
                            </span>

                            <ul className="space-y-2 pl-1">
                              {exp.responsibilities.map((resp, rIdx) => (
                                <li key={rIdx} className="flex items-start space-x-3 text-xs sm:text-sm text-gray-300 leading-relaxed">
                                  <Zap className="w-3.5 h-3.5 text-brand mt-1 flex-shrink-0" />
                                  <span>{resp}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Tech Stack Pills */}
                          <div className="pt-4 border-t border-[#1a1e2b]">
                            <span className="font-mono text-[10px] text-gray-400 uppercase tracking-widest block mb-2.5">
                              TECH STACK & DEPLOYED TOOLS:
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {exp.techStack.map((tech, tIdx) => (
                                <span 
                                  key={tIdx}
                                  className="font-mono text-[11px] bg-[#141824] border border-[#262c3e] text-gray-200 px-3 py-1 rounded-lg"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

