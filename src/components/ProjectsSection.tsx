import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Eye, Code, Terminal, Cpu, Info, X, Joystick, Award, Sparkles, ChevronRight, Trophy } from 'lucide-react';
import { Project } from '../types';
import { PROJECTS_DATA, ACHIEVEMENTS_DATA } from '../data';
import { playSound } from '../utils/audio';
import DecryptText from './DecryptText';
import ScrollReveal from './ScrollReveal';

// Interactive canvas game inside the details modal
function InteractiveRetroEvadeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  // Inner game ref values to prevent React re-renders on every game tick (60fps)
  const gameRef = useRef({
    playerX: 150,
    playerY: 260,
    lasers: [] as { x: number; y: number; active: boolean }[],
    enemies: [] as { x: number; y: number; speed: number; size: number }[],
    particles: [] as { x: number; y: number; vx: number; vy: number; color: string; life: number }[],
    keys: {} as Record<string, boolean>,
    frameId: 0
  });

  const startSimulation = () => {
    playSound('success');
    setGameState('playing');
    setScore(0);
    
    // Reset positions
    gameRef.current = {
      playerX: 150,
      playerY: 250,
      lasers: [],
      enemies: [],
      particles: [],
      keys: {},
      frameId: 0
    };
  };

  const handleLeftTouch = () => {
    gameRef.current.playerX = Math.max(15, gameRef.current.playerX - 22);
    playSound('chirp');
  };

  const handleRightTouch = () => {
    gameRef.current.playerX = Math.min(285, gameRef.current.playerX + 22);
    playSound('chirp');
  };

  const handleShootTouch = () => {
    const { playerX, playerY, lasers } = gameRef.current;
    if (lasers.length < 5) {
      playSound('laser');
      lasers.push({ x: playerX, y: playerY - 10, active: true });
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      gameRef.current.keys[e.key] = true;
      if (e.key === ' ' || e.key === 'ArrowUp') {
        e.preventDefault();
        // Fire laser
        const { playerX, playerY, lasers } = gameRef.current;
        if (lasers.length < 5) {
          playSound('laser');
          lasers.push({ x: playerX, y: playerY - 10, active: true });
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      gameRef.current.keys[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Main Canvas loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let localScore = 0;

    const tick = () => {
      const g = gameRef.current;
      const width = canvas.width;
      const height = canvas.height;

      // 1. Move Player
      if (g.keys['ArrowLeft'] || g.keys['a'] || g.keys['A']) {
        g.playerX = Math.max(15, g.playerX - 5);
      }
      if (g.keys['ArrowRight'] || g.keys['d'] || g.keys['D']) {
        g.playerX = Math.min(width - 15, g.playerX + 5);
      }

      // 2. Clear Backdrop
      ctx.fillStyle = '#0d0e12';
      ctx.fillRect(0, 0, width, height);

      // Draw vector guidelines
      ctx.strokeStyle = 'rgba(196, 253, 2, 0.05)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x < width; x += 30) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      ctx.stroke();

      // 3. Move & Draw Lasers
      g.lasers.forEach((laser) => {
        laser.y -= 7;
        if (laser.y < 0) laser.active = false;

        ctx.fillStyle = '#c4fd02';
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#c4fd02';
        ctx.fillRect(laser.x - 1.5, laser.y, 3, 10);
        ctx.shadowBlur = 0; // reset
      });
      g.lasers = g.lasers.filter(l => l.active);

      // 4. Spawn Enemies
      if (Math.random() < 0.035) {
        g.enemies.push({
          x: Math.random() * (width - 30) + 15,
          y: -10,
          speed: Math.random() * 2 + 1.2 + (localScore / 100),
          size: Math.random() * 8 + 8
        });
      }

      // 5. Move & Draw Enemies
      g.enemies.forEach((enemy) => {
        enemy.y += enemy.speed;

        // Draw tactical radar octagon on enemies
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        const pts = 6;
        for (let i = 0; i <= pts; i++) {
          const angle = (i * 2 * Math.PI) / pts;
          const px = enemy.x + Math.cos(angle) * enemy.size;
          const py = enemy.y + Math.sin(angle) * enemy.size;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();

        // Inner core
        ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
        ctx.fill();

        // Crosshairs on enemy
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
        ctx.beginPath();
        ctx.moveTo(enemy.x - enemy.size * 1.5, enemy.y);
        ctx.lineTo(enemy.x + enemy.size * 1.5, enemy.y);
        ctx.moveTo(enemy.x, enemy.y - enemy.size * 1.5);
        ctx.lineTo(enemy.x, enemy.y + enemy.size * 1.5);
        ctx.stroke();
      });

      // 6. Draw Player Ship (Glowing chartreuse cyber jet)
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#c4fd02';
      ctx.fillStyle = '#c4fd02';
      ctx.beginPath();
      ctx.moveTo(g.playerX, g.playerY - 12); // nose
      ctx.lineTo(g.playerX - 10, g.playerY + 8); // left wing
      ctx.lineTo(g.playerX, g.playerY + 3); // center burn
      ctx.lineTo(g.playerX + 10, g.playerY + 8); // right wing
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw thruster plume
      ctx.fillStyle = Math.random() > 0.5 ? '#f59e0b' : '#c4fd02';
      ctx.fillRect(g.playerX - 2, g.playerY + 6, 4, 6);

      // 7. Check Collisions
      g.enemies.forEach((enemy) => {
        // Player distance hit
        const dist = Math.hypot(enemy.x - g.playerX, enemy.y - g.playerY);
        if (dist < enemy.size + 10) {
          playSound('laser');
          playSound('chirp');
          setGameState('gameover');
        }

        // Laser distance check
        g.lasers.forEach((laser) => {
          const hitDist = Math.hypot(enemy.x - laser.x, enemy.y - laser.y);
          if (hitDist < enemy.size + 6) {
            enemy.y = 999; // mark to cull
            laser.active = false;
            localScore += 10;
            setScore(localScore);

            playSound('beep');

            // Spawn explosive sparks
            for (let p = 0; p < 12; p++) {
              g.particles.push({
                x: enemy.x,
                y: enemy.y,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6,
                color: Math.random() > 0.5 ? '#c4fd02' : '#f87171',
                life: 30
              });
            }
          }
        });
      });

      // Culled elements filters
      g.enemies = g.enemies.filter(e => e.y < height + 20 && e.y > -20);

      // 8. Move & Draw Explosion Particles
      g.particles.forEach((part) => {
        part.x += part.vx;
        part.y += part.vy;
        part.life--;

        ctx.fillStyle = part.color;
        ctx.globalAlpha = part.life / 30;
        ctx.fillRect(part.x, part.y, 2, 2);
      });
      ctx.globalAlpha = 1.0; // restore
      g.particles = g.particles.filter(p => p.life > 0);

      g.frameId = requestAnimationFrame(tick);
    };

    gameRef.current.frameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(gameRef.current.frameId);
    };
  }, [gameState]);

  // Keep track of high scores
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
    }
  }, [score, highScore]);

  return (
    <div className="bg-[#090a0d] border border-[#2a2f3d] p-4 rounded-xl flex flex-col items-center">
      <div className="w-full flex justify-between items-center bg-[#14161d] px-3 py-2 rounded-md border border-[#2a2f3d]/60 mb-3 font-mono text-[11px]">
        <div className="flex items-center space-x-2">
          <Joystick className="w-3.5 h-3.5 text-brand animate-spin" />
          <span className="text-white">COGNITIVE HOLO_SIM V1.2</span>
        </div>
        <div className="flex space-x-4">
          <span>SCORE: <strong className="text-brand">{score}</strong></span>
          <span>HIGH: <strong className="text-white">{highScore}</strong></span>
        </div>
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          width={300}
          height={280}
          className="rounded-lg border border-[#2a2f3d] max-w-full block bg-[#0d0e12]"
        />

        {gameState !== 'playing' && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-xs flex flex-col items-center justify-center text-center p-4 rounded-lg">
            {gameState === 'idle' ? (
              <div className="space-y-4">
                <Award className="w-10 h-10 text-brand mx-auto animate-bounce" />
                <h4 className="font-display font-black text-white text-sm tracking-widest uppercase mb-1">
                  READY OPERATIVE?
                </h4>
                <p className="font-sans text-[10px] text-gray-400 max-w-xs leading-relaxed">
                  Evade descending threat matrices. Move left/right using arrow keys or mobile indicators. Fire lasers with [SPACEBAR] to defend.
                </p>
                <button
                  onClick={startSimulation}
                  className="bg-brand text-black font-display font-extrabold text-[10px] tracking-widest px-6 py-2.5 rounded-sm hover:bg-[#a3e635] cursor-pointer"
                >
                  LOAD SIMULATION
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <span className="font-mono text-red-500 text-xs blink uppercase block">
                  🛡️ ARMOR BREACHED // SYSTEM DOWN
                </span>
                <h4 className="font-display font-black text-white text-sm">
                  SCORE: <span className="text-brand">{score}</span>
                </h4>
                <button
                  onClick={startSimulation}
                  className="bg-brand text-black font-display font-extrabold text-[10px] tracking-widest px-6 py-2.5 rounded-sm hover:bg-[#a3e635] cursor-pointer"
                >
                  REBOOT CORE
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Touch controls for Iframe / mobile compliance */}
      <div className="w-full grid grid-cols-3 gap-2 mt-3">
        <button
          onClick={handleLeftTouch}
          disabled={gameState !== 'playing'}
          className="bg-[#14161d] border border-[#2a2f3d] text-white active:bg-brand active:text-black py-2.5 text-xs font-mono font-bold rounded-md disabled:opacity-30 cursor-pointer"
        >
          [◀ LEFT]
        </button>
        <button
          onClick={handleShootTouch}
          disabled={gameState !== 'playing'}
          className="bg-brand/15 border border-brand text-brand active:bg-brand active:text-black py-2.5 text-xs font-mono font-bold rounded-md disabled:opacity-30 cursor-pointer"
        >
          [🔥 LASER]
        </button>
        <button
          onClick={handleRightTouch}
          disabled={gameState !== 'playing'}
          className="bg-[#14161d] border border-[#2a2f3d] text-white active:bg-brand active:text-black py-2.5 text-xs font-mono font-bold rounded-md disabled:opacity-30 cursor-pointer"
        >
          [RIGHT ▶]
        </button>
      </div>
    </div>
  );
}

export default function ProjectsSection() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'game' | 'web' | 'software'>('all');
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  const filteredProjects = selectedCategory === 'all' 
    ? PROJECTS_DATA 
    : PROJECTS_DATA.filter(p => p.category === selectedCategory);

  const filterButtons = [
    { label: 'ALL CRITICAL DEPLOYS', value: 'all' },
    { label: 'GAME MODULES', value: 'game' },
    { label: 'WEB ARCHITECTURES', value: 'web' },
    { label: 'SYSTEM SOFTWARE', value: 'software' }
  ];

  const handleCardClick = (project: Project) => {
    playSound('unlock');
    setActiveProject(project);
  };

  const handleCloseModal = () => {
    playSound('chirp');
    setActiveProject(null);
  };

  return (
    <section 
      id="projects" 
      className="py-24 relative bg-[#090a0d] border-b border-[#1f222b] overflow-hidden"
    >
      {/* Background graphic elements */}
      <div className="absolute bottom-[10%] left-[-10%] w-[350px] h-[350px] bg-[#c4fd02]/3 rounded-full blur-[90px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => {
              playSound('chirp');
              document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center space-x-2 bg-[#10121a] border border-[#222635] text-xs font-mono font-medium tracking-wider text-gray-300 hover:text-white hover:border-brand/50 px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer"
          >
            <span>← Back</span>
          </button>
        </div>

        {/* Section Header */}
        <ScrollReveal 
          variant="slide-up"
          margin="-125px"
          className="mb-12 pb-6 border-b border-[#2a2f3d]/30"
        >
          <div className="space-y-4">
            <span className="font-mono text-xs text-brand tracking-[0.25em] block uppercase">
              // THREAT ANALYSIS // ACTIVE MISSION GRID
            </span>
            <h2 className="font-display font-black text-4.5xl text-white tracking-wider flex items-center space-x-3">
              <Cpu className="w-8 h-8 text-brand animate-pulse" />
              <DecryptText text="PROJECTS & ACHIEVEMENTS" />
            </h2>
          </div>
        </ScrollReveal>

        {/* Project Grid */}
        <ScrollReveal
          variant="slide-up"
          delay={0.1}
          margin="-100px"
        >
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {PROJECTS_DATA.map((project, idx) => {
                return (
                  <motion.div
                    layout
                    key={project.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.5, delay: idx * 0.08 }}
                    whileHover={{ y: -6, transition: { duration: 0.2 } }}
                    onClick={() => handleCardClick(project)}
                    className="bg-[#0b0c10]/95 border border-[#1f222b] hover:border-brand/40 shadow-[0_4px_30px_rgba(0,0,0,0.65)] hover:shadow-[0_0_25px_rgba(196,253,2,0.06)] p-8 rounded-2xl transition-all duration-300 cursor-pointer group flex flex-col justify-between space-y-6"
                    onMouseEnter={() => playSound('chirp')}
                  >
                    <div className="space-y-5">
                      {/* Project Title changed from pastel blue to magnificent theme-matching white/neon */}
                      <h3 className="font-display font-extrabold text-2xl text-white group-hover:text-brand transition-colors tracking-wide flex items-baseline justify-between">
                        <span>{project.title}</span>
                        <span className="font-mono text-[9px] text-brand/50 tracking-widest hidden sm:inline">[PORT_0{idx + 1}]</span>
                      </h3>
                      
                      {/* Formatted body details as requested */}
                      <div className="space-y-4 font-sans text-sm leading-relaxed">
                        <div>
                          <span className="font-mono text-[10px] text-brand/80 uppercase tracking-widest block mb-1">Description //</span>
                          <span className="text-gray-300 font-light block">{project.description}</span>
                        </div>
                        
                        <div>
                          <span className="font-mono text-[10px] text-brand/80 uppercase tracking-widest block mb-1">Technologies Used //</span>
                          <span className="text-gray-400 font-mono text-xs">{project.tags.join(' // ')}</span>
                        </div>

                        <div>
                          <span className="font-mono text-[10px] text-brand/80 uppercase tracking-widest block mb-1">Features //</span>
                          <span className="text-gray-400 font-light block sm:inline">{project.features.join(', ')}</span>
                        </div>
                      </div>
                    </div>

                    {/* Subtle footer hint */}
                    <div className="pt-4 border-t border-[#1f222b] flex justify-between items-center text-[10px] font-mono tracking-widest text-brand/70 uppercase">
                      <span>SECURE DEPLOY // INTEL_CORE</span>
                      <span className="group-hover:translate-x-1.5 transition-transform duration-200">DETAILS [→]</span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </ScrollReveal>

        {/* SUB-SECTION: KEY ACHIEVEMENTS & MILESTONES */}
        <div className="mt-20 pt-16 border-t border-[#1f222b]">
          <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-brand/10 border border-brand/30 text-brand">
                <Trophy className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="font-display font-bold text-2xl text-white uppercase tracking-wider">
                  Key Achievements & Milestones
                </h3>
                <span className="font-mono text-xs text-brand/80 uppercase">
                  // RECOGNITION, HONORS & DEPLOYMENT MEDALS
                </span>
              </div>
            </div>

            <div className="inline-flex items-center space-x-2 font-mono text-xs text-gray-400 bg-[#12141c] px-4 py-2 rounded-xl border border-[#252a38]">
              <span className="w-2 h-2 rounded-full bg-brand animate-ping" />
              <span className="text-white font-semibold">VERIFIED RECORD:</span>
              <span className="text-brand font-bold">{ACHIEVEMENTS_DATA.length} HONORS UNLOCKED</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {ACHIEVEMENTS_DATA.map((ach, idx) => (
              <motion.div
                key={ach.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="bg-[#0b0c10]/95 border border-[#1f222b] hover:border-brand/40 shadow-[0_4px_30px_rgba(0,0,0,0.65)] p-7 sm:p-8 rounded-2xl transition-all duration-300 group flex flex-col justify-between space-y-6"
                onMouseEnter={() => playSound('chirp')}
              >
                <div className="space-y-5">
                  <h4 className="font-display font-extrabold text-xl sm:text-2xl text-white group-hover:text-brand transition-colors tracking-wide flex items-baseline justify-between mb-2">
                    <span>{ach.title}</span>
                    <span className="font-mono text-[9px] text-brand/50 tracking-widest hidden sm:inline">[ACH_0{idx + 1}]</span>
                  </h4>
                  
                  <div className="space-y-4 font-sans text-sm leading-relaxed">
                    <div>
                      <span className="font-mono text-[10px] text-brand/80 uppercase tracking-widest block mb-1">Description //</span>
                      <span className="text-gray-300 font-light block">{ach.description}</span>
                    </div>
                    
                    <div>
                      <span className="font-mono text-[10px] text-brand/80 uppercase tracking-widest block mb-1">Organization/Issuer //</span>
                      <span className="text-gray-300 font-light block">{ach.badgeName}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#1f222b] flex justify-between items-center text-[10px] font-mono tracking-widest text-brand/70 uppercase">
                  <span>SYS_ARCHIVE // INTEL_VERIFIED</span>
                  <span className="opacity-60">SECURE_DOCKET [{idx + 1}]</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* MISSION INTEL MODAL REVEAL */}
        <AnimatePresence>
          {activeProject && (
            <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
              
              {/* Overlay Backdrop */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleCloseModal}
                className="fixed inset-0 bg-[#07080a]/90 backdrop-blur-md"
              />

              {/* Modal Core Stage */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative bg-[#14161d] border border-brand/35 rounded-xl w-full max-w-3xl overflow-hidden z-10 shadow-[0_0_40px_rgba(196,253,2,0.15)]"
              >
                {/* Header Bar */}
                <div className="bg-[#1c1e27] px-6 py-4 border-b border-[#2a2f3d] flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 bg-brand rounded-full animate-ping" />
                    <span className="font-mono text-xs text-[#a1a1aa] tracking-widest uppercase">
                      MISSION DATABANK // ID: {activeProject.id.toUpperCase()}
                    </span>
                  </div>
                  <button
                    onClick={handleCloseModal}
                    className="p-1 rounded-sm hover:bg-black/30 hover:text-brand transition-colors text-gray-400 cursor-pointer focus:outline-none"
                    onMouseEnter={() => playSound('chirp')}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-8">
                  {/* Left Specs side */}
                  <div className="md:col-span-7 space-y-6">
                    <div>
                      <span className="font-mono text-[10px] text-brand tracking-widest block mb-1">
                        MISSION CLASSIFICATION
                      </span>
                      <h3 className="font-display font-black text-2xl text-white tracking-wide">
                        {activeProject.title}
                      </h3>
                      <p className="font-sans text-xs text-gray-400 mt-3 leading-relaxed">
                        {activeProject.description}
                      </p>
                    </div>

                    {/* Features unlocked checklist */}
                    <div className="space-y-3">
                      <span className="font-mono text-[9px] text-[#71717a] tracking-widest uppercase block border-b border-[#2a2f3d]/60 pb-1.5">
                        TACTICAL BREAKDOWN / CORE FEATS
                      </span>
                      <ul className="space-y-2 text-xs font-sans text-gray-300">
                        {activeProject.features.map((feat, idx) => (
                          <li key={idx} className="flex items-start space-x-2">
                            <span className="text-brand font-mono select-none mt-0.5">▶</span>
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Tag list */}
                    <div className="flex flex-wrap gap-1.5">
                      {activeProject.tags.map(tag => (
                        <span key={tag} className="font-mono text-[8px] bg-black/40 text-gray-400 border border-[#2a2f3d] px-2 py-0.5 rounded-sm uppercase">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right Interactive/Simulation side */}
                  <div className="md:col-span-5 space-y-6">
                    
                    {/* If it's the Retro-Evade project, show the playable canvas simulation */}
                    {activeProject.id === 'retro-evade' ? (
                      <InteractiveRetroEvadeGame />
                    ) : (
                      /* Else, show specific Telemetry / System logs specs list */
                      <div className="bg-[#090a0d] border border-[#2a2f3d] p-5 rounded-xl space-y-4 font-mono text-[11px]">
                        <span className="block border-b border-[#2a2f3d]/60 pb-2 text-brand text-xs">
                          SYSTEM TELEMETRY
                        </span>
                        
                        <div className="space-y-2.5">
                          <div className="flex justify-between">
                            <span className="text-gray-500">ENGINE METRIC:</span>
                            <span className="text-white font-medium">{activeProject.telemetry.engine}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">OPERATING STATE:</span>
                            <span className="text-brand font-semibold">{activeProject.status}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">PROCESSING SPEED:</span>
                            <span className="text-white font-medium">{activeProject.telemetry.fps || '60 FPS LOCKED'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">UTILIZATION RATE:</span>
                            <span className="text-white font-medium">{activeProject.telemetry.efficiency}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">ACTIVE DEPLOYS:</span>
                            <span className="text-white font-medium">{activeProject.telemetry.downloads}</span>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-[#2a2f3d]/60 text-center text-[10px] text-gray-400 uppercase leading-relaxed">
                          SECURE SYSTEM INSTRUCTION: MISSION PACK LOADED SUCCESSFULLY. DEPLOY CODES COMMITTED.
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer action */}
                <div className="bg-[#1c1e27] px-6 py-4 border-t border-[#2a2f3d] flex justify-end space-x-3">
                  <button
                    onClick={handleCloseModal}
                    className="border border-[#2a2f3d] bg-black/30 hover:text-white text-gray-400 font-display font-medium text-[10px] tracking-widest px-4 py-2.5 rounded-sm transition-all cursor-pointer"
                    onMouseEnter={() => playSound('chirp')}
                  >
                    DISMISS INTEL
                  </button>
                  <button
                    onClick={() => {
                      playSound('success');
                      document.querySelector('#feedback')?.scrollIntoView({ behavior: 'smooth' });
                      setActiveProject(null);
                    }}
                    className="bg-brand text-black font-display font-extrabold text-[10px] tracking-widest px-5 py-2.5 rounded-sm hover:bg-[#a3e635] cursor-pointer animate-pulse"
                    onMouseEnter={() => playSound('beep')}
                  >
                    INITIATE CONTACT
                  </button>
                </div>

              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
