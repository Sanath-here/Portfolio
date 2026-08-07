import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Award, 
  ExternalLink, 
  Copy, 
  Check, 
  Github, 
  Linkedin, 
  Twitter, 
  Mail, 
  Gamepad2, 
  MessageSquare, 
  BadgeCheck, 
  Share2,
  Terminal,
  ShieldCheck,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { CERTIFICATIONS_DATA, SOCIAL_PROFILES_DATA } from '../data';
import { playSound } from '../utils/audio';
import DecryptText from './DecryptText';
import ScrollReveal from './ScrollReveal';

export default function CredentialsSection() {
  const [activeTab, setActiveTab] = useState<'all' | 'certs' | 'socials'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [socialList, setSocialList] = useState(SOCIAL_PROFILES_DATA);

  const handleCopy = (text: string, id: string) => {
    playSound('beep');
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const removeSocial = (id: string) => {
    playSound('chirp');
    setSocialList(prev => prev.filter(s => s.id !== id));
  };

  const renderSocialIcon = (iconName: string) => {
    switch (iconName) {
      case 'Github':
        return <Github className="w-5 h-5 text-brand" />;
      case 'Linkedin':
        return <Linkedin className="w-5 h-5 text-[#0a66c2]" />;
      case 'Twitter':
        return <Twitter className="w-5 h-5 text-[#1da1f2]" />;
      case 'Mail':
        return <Mail className="w-5 h-5 text-[#ea4335]" />;
      case 'Gamepad2':
        return <Gamepad2 className="w-5 h-5 text-[#fa5c5c]" />;
      case 'MessageSquare':
        return <MessageSquare className="w-5 h-5 text-[#5865f2]" />;
      default:
        return <Share2 className="w-5 h-5 text-brand" />;
    }
  };

  return (
    <section 
      id="credentials" 
      className="py-24 relative bg-[#0b0c10] border-b border-[#1f222b] overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-[10%] left-[-15%] w-[450px] h-[450px] bg-brand/5 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-15%] w-[450px] h-[450px] bg-[#0a66c2]/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Back navigation button */}
        <div className="mb-6">
          <button
            onClick={() => {
              playSound('chirp');
              document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center space-x-2 bg-[#10121a] border border-[#222635] text-xs font-mono font-medium tracking-wider text-gray-300 hover:text-white hover:border-brand/50 px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer"
          >
            <span>← Back to Projects & Achievements</span>
          </button>
        </div>

        {/* Section Header */}
        <ScrollReveal 
          variant="slide-up"
          delay={0.05}
          className="mb-12 pb-6 border-b border-[#2a2f3d]/40 flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div className="space-y-2">
            <span className="font-mono text-xs text-brand tracking-widest block uppercase">
              // VERIFIED DOSSIER & NETWORK LINKS
            </span>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-wider uppercase flex items-center space-x-3">
              <BadgeCheck className="w-8 h-8 text-brand animate-pulse" />
              <DecryptText text="CERTIFICATIONS & SOCIALS" />
            </h2>
          </div>

          {/* Interactive HUD Filter Tabs */}
          <div className="flex items-center space-x-2 bg-[#12141c] p-1.5 rounded-xl border border-[#252a38]">
            <button
              onClick={() => {
                playSound('chirp');
                setActiveTab('all');
              }}
              className={`px-4 py-2 rounded-lg font-mono text-xs tracking-wider transition-all duration-200 cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-brand text-black font-bold shadow-[0_0_15px_rgba(196,253,2,0.3)]'
                  : 'text-gray-400 hover:text-white hover:bg-[#1a1e2b]'
              }`}
            >
              ALL DOSSIERS
            </button>
            <button
              onClick={() => {
                playSound('chirp');
                setActiveTab('certs');
              }}
              className={`px-4 py-2 rounded-lg font-mono text-xs tracking-wider transition-all duration-200 cursor-pointer ${
                activeTab === 'certs'
                  ? 'bg-brand text-black font-bold shadow-[0_0_15px_rgba(196,253,2,0.3)]'
                  : 'text-gray-400 hover:text-white hover:bg-[#1a1e2b]'
              }`}
            >
              CERTIFICATIONS ({CERTIFICATIONS_DATA.length})
            </button>
            <button
              onClick={() => {
                playSound('chirp');
                setActiveTab('socials');
              }}
              className={`px-4 py-2 rounded-lg font-mono text-xs tracking-wider transition-all duration-200 cursor-pointer ${
                activeTab === 'socials'
                  ? 'bg-brand text-black font-bold shadow-[0_0_15px_rgba(196,253,2,0.3)]'
                  : 'text-gray-400 hover:text-white hover:bg-[#1a1e2b]'
              }`}
            >
              SOCIAL CHANNELS ({socialList.length})
            </button>
          </div>
        </ScrollReveal>

        {/* SECTION 1: CERTIFICATIONS */}
        {(activeTab === 'all' || activeTab === 'certs') && (
          <div className="mb-16 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#1f222b]">
              <div className="flex items-center space-x-2 font-mono text-xs text-brand tracking-widest uppercase">
                <ShieldCheck className="w-4 h-4" />
                <span>OFFICIAL ACCREDITATIONS & CERTIFICATES</span>
              </div>
              <span className="font-mono text-[10px] text-gray-500 uppercase">AUTHENTICATED // ON-CHAIN & ISSUER VERIFIED</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {CERTIFICATIONS_DATA.map((cert, idx) => (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  whileHover={{ y: -4 }}
                  className="bg-[#0e1017] border border-[#1f2433] hover:border-brand/50 rounded-2xl p-6 sm:p-7 shadow-[0_4px_30px_rgba(0,0,0,0.5)] transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
                  onMouseEnter={() => playSound('chirp')}
                >
                  {/* Top glowing accent border line on hover */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand/0 to-transparent group-hover:via-brand transition-all duration-500" />

                  <div className="space-y-4">
                    {/* Header bar */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2.5 rounded-xl bg-brand/10 border border-brand/20 text-brand">
                          <Award className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="font-mono text-[10px] text-brand tracking-widest uppercase block">
                            {cert.issuer}
                          </span>
                          <span className="font-mono text-[9px] text-gray-400">
                            ISSUED: {cert.date}
                          </span>
                        </div>
                      </div>

                      <span className="font-mono text-[9px] px-2.5 py-1 rounded-full bg-brand/10 border border-brand/30 text-brand tracking-wider font-semibold uppercase flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        {cert.status}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-display font-bold text-lg sm:text-xl text-white group-hover:text-brand transition-colors leading-snug">
                      {cert.title}
                    </h3>

                    {/* Skills Covered */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {cert.skills.map((skill, sIdx) => (
                        <span 
                          key={sIdx}
                          className="font-mono text-[10px] bg-[#161924] border border-[#262c3e] text-gray-300 px-2.5 py-0.5 rounded-md"
                        >
                          #{skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Footer Credentials Info & Verification Actions */}
                  <div className="pt-5 mt-5 border-t border-[#1f2433] flex flex-wrap items-center justify-between gap-3">
                    {cert.credentialId && (
                      <div className="flex items-center space-x-2 bg-[#121520] border border-[#212738] px-3 py-1.5 rounded-lg">
                        <span className="font-mono text-[10px] text-gray-400">ID:</span>
                        <span className="font-mono text-[11px] text-white font-medium">{cert.credentialId}</span>
                        <button
                          onClick={() => handleCopy(cert.credentialId!, cert.id)}
                          className="p-1 text-gray-400 hover:text-brand transition-colors cursor-pointer"
                          title="Copy Credential ID"
                        >
                          {copiedId === cert.id ? (
                            <Check className="w-3.5 h-3.5 text-brand" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    )}

                    {cert.verifyUrl && (
                      <a
                        href={cert.verifyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => playSound('beep')}
                        className="inline-flex items-center space-x-1.5 font-mono text-[11px] text-brand hover:text-white transition-colors bg-brand/10 hover:bg-brand/20 px-3 py-1.5 rounded-lg border border-brand/30"
                      >
                        <span>VERIFY CREDENTIAL</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 2: SOCIAL PROFILES & COMMLINKS */}
        {(activeTab === 'all' || activeTab === 'socials') && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#1f222b]">
              <div className="flex items-center space-x-2 font-mono text-xs text-brand tracking-widest uppercase">
                <Terminal className="w-4 h-4" />
                <span>ACTIVE COMMLINK & SOCIAL PROFILES</span>
              </div>
              <span className="font-mono text-[10px] text-gray-500 uppercase">DIRECT BROADCAST // ESTABLISH CONNECTION</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {socialList.map((social, idx) => {
                const isCopied = copiedId === social.id;

                return (
                  <motion.div
                    key={social.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.4, delay: idx * 0.06 }}
                    whileHover={{ y: -4 }}
                    className="bg-[#0e1017] border border-[#1f2433] hover:border-brand/60 rounded-2xl p-6 shadow-[0_4px_30px_rgba(0,0,0,0.5)] transition-all duration-300 flex flex-col justify-between group relative"
                    onMouseEnter={() => playSound('chirp')}
                  >
                    <div className="space-y-4">
                      {/* Top Bar with Platform Icon & Status */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-3 rounded-xl bg-[#141824] border border-[#272d40] group-hover:border-brand/40 transition-colors">
                            {renderSocialIcon(social.iconName)}
                          </div>
                          <div>
                            <h3 className="font-display font-bold text-lg text-white group-hover:text-brand transition-colors">
                              {social.platform}
                            </h3>
                            <span className="font-mono text-[11px] text-gray-400">
                              {social.username}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={() => removeSocial(social.id)}
                            className="p-1 rounded bg-[#141824] hover:bg-red-950/60 text-gray-500 hover:text-red-400 border border-[#272d40] hover:border-red-500/40 transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                            title="Remove channel card"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-2 h-2 rounded-full bg-brand animate-ping" title="Channel Active" />
                        </div>
                      </div>

                      {/* Description */}
                      <p className="font-sans text-xs text-gray-300 leading-relaxed font-light">
                        {social.description}
                      </p>
                    </div>

                    {/* Actions / Buttons */}
                    <div className="pt-5 mt-5 border-t border-[#1f2433] flex items-center justify-between gap-2">
                      <span className="font-mono text-[9px] text-brand/80 tracking-wider uppercase">
                        {social.status}
                      </span>

                      <div className="flex items-center space-x-2">
                        {/* Copy button */}
                        <button
                          onClick={() => handleCopy(social.username, social.id)}
                          className="p-2 rounded-lg bg-[#141824] border border-[#272d40] text-gray-300 hover:text-brand hover:border-brand/50 transition-all cursor-pointer"
                          title={`Copy handle (${social.username})`}
                        >
                          {isCopied ? (
                            <Check className="w-3.5 h-3.5 text-brand" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>

                        {/* Direct link button */}
                        <a
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => playSound('beep')}
                          className="inline-flex items-center space-x-1 bg-brand text-black font-mono font-bold text-[11px] px-3 py-1.5 rounded-lg hover:bg-[#a3e635] transition-all"
                        >
                          <span>CONNECT</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
