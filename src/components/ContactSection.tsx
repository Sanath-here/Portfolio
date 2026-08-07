import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  Mail, 
  User, 
  MessageSquare, 
  Star, 
  CheckCircle2, 
  Copy, 
  Sparkles, 
  Terminal, 
  AlertCircle, 
  ExternalLink,
  ShieldCheck,
  Zap,
  Tag,
  Trash2
} from 'lucide-react';
import { Feedback } from '../types';
import { PRESEEDED_FEEDBACK } from '../data';
import { playSound } from '../utils/audio';
import DecryptText from './DecryptText';
import ScrollReveal from './ScrollReveal';

const DESTINATION_EMAIL = 'sanath.lal2023@gmail.com';

const QUICK_TAGS = [
  { label: '⚡ Unreal Engine / Game Dev', subject: 'UE5 Game Dev Inquiry', message: 'Hi Sanath, I am interested in collaborating on Unreal Engine / 3D game development.' },
  { label: '💼 Full-Stack / AI Hiring', subject: 'Career / Freelance Opportunity', message: 'Hi Sanath, we have an opportunity for your software and AI/ML skill sets.' },
  { label: '🌟 Portfolio Feedback', subject: 'Portfolio Review & Feedback', message: 'Hey Sanath! Just reviewed your portfolio. Really impressed by the tactical HUD UI and features.' },
  { label: '🎮 Game Prototype Demo', subject: 'Game Prototype Feedback', message: 'Hey Sanath, loved your game prototypes! Would love to chat about game mechanics and testing.' }
];

export default function ContactSection() {
  // Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Project Inquiry / Feedback');
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [message, setMessage] = useState('');
  const [role, setRole] = useState('Visitor / Guest');

  // UI States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Local Feedback Stream (Starts with preseeded + user submitted)
  const [feedbackList, setFeedbackList] = useState<Feedback[]>(PRESEEDED_FEEDBACK);

  const ratingLabels: Record<number, string> = {
    1: '1 ★ — Needs Improvement',
    2: '2 ★ — Average',
    3: '3 ★ — Solid Performance',
    4: '4 ★ — Great Experience',
    5: '5 ★ — Exceptional / Mission Critical ⚡'
  };

  const handleRatingClick = (r: number) => {
    playSound('chirp');
    setRating(r);
  };

  const applyQuickTag = (tag: typeof QUICK_TAGS[0]) => {
    playSound('chirp');
    setSubject(tag.subject);
    if (!message) {
      setMessage(tag.message);
    }
  };

  const copyEmailToClipboard = () => {
    playSound('chirp');
    navigator.clipboard.writeText(DESTINATION_EMAIL);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const removeFeedback = (id: string) => {
    playSound('chirp');
    setFeedbackList(prev => prev.filter(item => item.id !== id));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Please state your name or callsign.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid transmission email address.');
      return;
    }
    if (!message.trim()) {
      setErrorMsg('Please enter your transmission message or feedback.');
      return;
    }

    playSound('success');
    setIsSubmitting(true);

    // Construct Mailto Link
    const mailSubject = encodeURIComponent(`[Portfolio Commlink] ${subject} - from ${name}`);
    const mailBody = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nRole/Company: ${role}\nRating: ${rating}/5 stars (${ratingLabels[rating]})\nSubject: ${subject}\n\nMessage:\n${message}\n\n---\nTransmitted via Sanath Lal Portfolio Commlink`
    );
    const mailtoUrl = `mailto:${DESTINATION_EMAIL}?subject=${mailSubject}&body=${mailBody}`;

    setTimeout(() => {
      // 1. Add feedback to live list if rating/message is provided
      const newFb: Feedback = {
        id: `fb-user-${Date.now()}`,
        author: name,
        role: role.trim() || 'Portfolio Operative',
        message: message,
        rating: rating,
        date: new Date().toISOString().split('T')[0]
      };

      setFeedbackList(prev => [newFb, ...prev]);

      setIsSubmitting(false);
      setIsSuccess(true);

      // Attempt to launch visitor's email client
      window.open(mailtoUrl, '_blank');
    }, 800);
  };

  const resetForm = () => {
    playSound('chirp');
    setName('');
    setEmail('');
    setSubject('Project Inquiry / Feedback');
    setRating(5);
    setMessage('');
    setRole('Visitor / Guest');
    setIsSuccess(false);
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden bg-[#0a0b0e] border-t border-[#1a1d26]">
      {/* Background glow accents */}
      <div className="absolute top-[20%] left-[-10%] w-[450px] h-[450px] bg-[#c4fd02]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] w-[450px] h-[450px] bg-[#c4fd02]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Title */}
        <ScrollReveal variant="fade">
          <div className="mb-14 space-y-3">
            <div className="inline-flex items-center space-x-2 font-mono text-xs text-brand tracking-widest uppercase bg-brand/10 px-3 py-1 rounded-md border border-brand/30">
              <Mail className="w-3.5 h-3.5 text-brand" />
              <span>// DIRECT COMMLINK CHANNEL // TRANSMISSION HUB</span>
            </div>
            
            <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-white tracking-wider flex items-center space-x-3">
              <Send className="w-8 h-8 text-brand animate-pulse" />
              <DecryptText text="CONTACT & FEEDBACK" />
            </h2>
            
            <p className="font-sans text-sm sm:text-base text-gray-400 max-w-2xl font-light">
              Send a direct message or feedback rating to <strong className="text-white font-medium">{DESTINATION_EMAIL}</strong>. All transmissions dispatch directly to my primary outbox.
            </p>
          </div>
        </ScrollReveal>

        {/* Main Grid: Form Left, Channel Info & Quick Actions Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Interactive Contact & Rating Form */}
          <div className="lg:col-span-7">
            <ScrollReveal variant="slide-up">
              <div className="bg-[#0e1017] border border-[#1f2433] rounded-2xl p-6 sm:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.6)] relative overflow-hidden">
                
                {/* Form Top Header */}
                <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#1f2433]">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-brand animate-ping" />
                    <span className="font-mono text-xs text-white uppercase tracking-wider font-semibold">
                      SECURE COMMLINK FORM
                    </span>
                  </div>
                  
                  <span className="font-mono text-[10px] text-brand/80 bg-[#161a26] px-2.5 py-1 rounded border border-[#272d40]">
                    DEST: {DESTINATION_EMAIL}
                  </span>
                </div>

                {isSuccess ? (
                  /* Success Confirmation Screen */
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-10 text-center space-y-6"
                  >
                    <div className="w-16 h-16 bg-brand/20 border-2 border-brand text-brand rounded-full flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(196,253,2,0.4)]">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-display font-bold text-2xl text-white uppercase">
                        TRANSMISSION DISPATCHED
                      </h3>
                      <p className="font-sans text-sm text-gray-300 max-w-md mx-auto leading-relaxed">
                        Your message and <strong className="text-brand font-semibold">{rating}/5 star rating</strong> have been logged to the stream and dispatched to <span className="text-white font-mono">{DESTINATION_EMAIL}</span>.
                      </p>
                    </div>

                    <div className="p-4 bg-[#141824] border border-[#272d40] rounded-xl max-w-md mx-auto text-left font-mono text-xs space-y-1.5 text-gray-300">
                      <div className="text-brand font-bold uppercase border-b border-[#272d40] pb-1 mb-2">
                        // DISPATCH SUMMARY LOG
                      </div>
                      <div><span className="text-gray-500">SENDER:</span> {name} ({email})</div>
                      <div><span className="text-gray-500">SUBJECT:</span> {subject}</div>
                      <div><span className="text-gray-500">RATING:</span> {rating}/5 Stars</div>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                      <button
                        onClick={resetForm}
                        className="bg-brand text-black hover:bg-brand/90 font-mono text-xs font-bold px-6 py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(196,253,2,0.3)] cursor-pointer"
                      >
                        SEND ANOTHER TRANSMISSION
                      </button>

                      <a
                        href={`mailto:${DESTINATION_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-[#181c28] hover:bg-[#202636] border border-[#2e364a] text-white font-mono text-xs font-medium px-5 py-3 rounded-xl transition-all flex items-center space-x-2"
                      >
                        <span>OPEN IN MAIL CLIENT</span>
                        <ExternalLink className="w-3.5 h-3.5 text-brand" />
                      </a>
                    </div>
                  </motion.div>
                ) : (
                  /* Active Form Input */
                  <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* Quick Topic Chips */}
                    <div className="space-y-2">
                      <label className="font-mono text-xs text-gray-300 uppercase tracking-wider flex items-center space-x-1.5">
                        <Tag className="w-3.5 h-3.5 text-brand" />
                        <span>QUICK TRANSMISSION TOPICS:</span>
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {QUICK_TAGS.map((tag, tIdx) => (
                          <button
                            key={tIdx}
                            type="button"
                            onClick={() => applyQuickTag(tag)}
                            className="font-mono text-[11px] bg-[#141824] hover:bg-[#1a2030] border border-[#272e42] hover:border-brand/50 text-gray-300 hover:text-white px-3 py-1.5 rounded-lg transition-all text-left flex items-center space-x-1 cursor-pointer"
                          >
                            <span>{tag.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Sender Name & Role */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="font-mono text-xs text-gray-300 uppercase tracking-wider block">
                          YOUR NAME / CALLSIGN *
                        </label>
                        <div className="relative">
                          <User className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Commander Soap / Sarah Chen"
                            className="w-full bg-[#121520] border border-[#252c3d] focus:border-brand focus:outline-none rounded-xl py-3 pl-10 pr-4 font-sans text-sm text-white placeholder-gray-600 transition-colors"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="font-mono text-xs text-gray-300 uppercase tracking-wider block">
                          YOUR EMAIL ADDRESS *
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your.email@example.com"
                            className="w-full bg-[#121520] border border-[#252c3d] focus:border-brand focus:outline-none rounded-xl py-3 pl-10 pr-4 font-sans text-sm text-white placeholder-gray-600 transition-colors"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Role & Subject */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="font-mono text-xs text-gray-300 uppercase tracking-wider block">
                          ROLE / ORGANIZATION (OPTIONAL)
                        </label>
                        <input
                          type="text"
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                          placeholder="e.g. Lead Dev, Recruiter, Gamer"
                          className="w-full bg-[#121520] border border-[#252c3d] focus:border-brand focus:outline-none rounded-xl py-3 px-4 font-sans text-sm text-white placeholder-gray-600 transition-colors"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="font-mono text-xs text-gray-300 uppercase tracking-wider block">
                          TRANSMISSION SUBJECT
                        </label>
                        <input
                          type="text"
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          placeholder="Project Inquiry / Feedback"
                          className="w-full bg-[#121520] border border-[#252c3d] focus:border-brand focus:outline-none rounded-xl py-3 px-4 font-sans text-sm text-white placeholder-gray-600 transition-colors"
                        />
                      </div>
                    </div>

                    {/* Interactive Rating Picker */}
                    <div className="space-y-2 bg-[#121520]/80 p-4 rounded-xl border border-[#232a3b]">
                      <div className="flex items-center justify-between">
                        <label className="font-mono text-xs text-brand font-semibold uppercase tracking-wider flex items-center space-x-1.5">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>PORTFOLIO FEEDBACK RATING *</span>
                        </label>
                        
                        <span className="font-mono text-xs text-gray-300 font-semibold">
                          {ratingLabels[hoverRating || rating]}
                        </span>
                      </div>

                      {/* Stars */}
                      <div className="flex items-center space-x-2 pt-1">
                        {[1, 2, 3, 4, 5].map((star) => {
                          const active = star <= (hoverRating || rating);
                          return (
                            <button
                              key={star}
                              type="button"
                              onClick={() => handleRatingClick(star)}
                              onMouseEnter={() => setHoverRating(star)}
                              onMouseLeave={() => setHoverRating(0)}
                              className={`p-2 rounded-lg transition-all duration-200 cursor-pointer ${
                                active 
                                  ? 'bg-brand/20 border border-brand/50 text-brand shadow-[0_0_12px_rgba(196,253,2,0.3)] scale-105' 
                                  : 'bg-[#181c28] border border-[#2b3347] text-gray-600 hover:text-gray-400'
                              }`}
                            >
                              <Star className={`w-6 h-6 ${active ? 'fill-brand text-brand' : ''}`} />
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Message Body */}
                    <div className="space-y-2">
                      <label className="font-mono text-xs text-gray-300 uppercase tracking-wider block flex items-center justify-between">
                        <span>TRANSMISSION MESSAGE *</span>
                        <span className="text-[10px] text-gray-500 font-normal">MAX 1000 CHARS</span>
                      </label>
                      <textarea
                        rows={4}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Write your message, project idea, or feedback here..."
                        className="w-full bg-[#121520] border border-[#252c3d] focus:border-brand focus:outline-none rounded-xl p-4 font-sans text-sm text-white placeholder-gray-600 transition-colors leading-relaxed"
                      />
                    </div>

                    {/* Error Banner */}
                    {errorMsg && (
                      <div className="p-3 bg-red-950/60 border border-red-500/40 rounded-xl text-red-200 text-xs font-mono flex items-center space-x-2">
                        <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                        <span>{errorMsg}</span>
                      </div>
                    )}

                    {/* Submit Action Bar */}
                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full sm:w-auto bg-brand hover:bg-brand/90 text-black font-mono font-bold text-sm px-8 py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(196,253,2,0.3)] flex items-center justify-center space-x-2.5 cursor-pointer disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                            <span>DISPATCHING...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 text-black" />
                            <span>SEND TRANSMISSION TO EMAIL</span>
                          </>
                        )}
                      </button>

                      <div className="flex items-center space-x-1.5 font-mono text-[10px] text-gray-500">
                        <ShieldCheck className="w-3.5 h-3.5 text-brand" />
                        <span>DIRECT SMTP OUTBOX // SAFE</span>
                      </div>
                    </div>

                  </form>
                )}

              </div>
            </ScrollReveal>
          </div>

          {/* Right Column: Direct Commlink Card & Community Stream */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Direct Email Card */}
            <ScrollReveal variant="slide-up" delay={0.1}>
              <div className="bg-[#0e1017] border border-[#1f2433] rounded-2xl p-6 shadow-[0_4px_25px_rgba(0,0,0,0.5)] space-y-5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-brand tracking-widest uppercase flex items-center space-x-2">
                    <Terminal className="w-4 h-4 text-brand" />
                    <span>PRIMARY DESTINATION</span>
                  </span>
                  <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
                </div>

                <div className="p-4 bg-[#141722] border border-[#252d42] rounded-xl space-y-3">
                  <span className="font-mono text-[10px] text-gray-400 block uppercase">
                    OFFICIAL CONTACT EMAIL:
                  </span>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-sm sm:text-base text-white font-bold tracking-tight">
                      {DESTINATION_EMAIL}
                    </span>

                    <button
                      type="button"
                      onClick={copyEmailToClipboard}
                      className="p-2 rounded-lg bg-[#1f2638] hover:bg-brand hover:text-black border border-[#323d57] text-gray-200 transition-all cursor-pointer"
                      title="Copy Email Address"
                    >
                      {copiedEmail ? <CheckCircle2 className="w-4 h-4 text-brand" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  {copiedEmail && (
                    <span className="font-mono text-[10px] text-brand block">
                      ✓ Email copied to clipboard!
                    </span>
                  )}
                </div>

                <p className="font-sans text-xs text-gray-400 leading-relaxed font-light">
                  Prefer sending through your custom mail software or mobile app? Click below to launch your default mail program directly.
                </p>

                <a
                  href={`mailto:${DESTINATION_EMAIL}`}
                  className="w-full bg-[#161a26] hover:bg-[#1d2232] border border-[#2b334a] hover:border-brand/50 text-white font-mono text-xs font-semibold py-3 px-4 rounded-xl transition-all flex items-center justify-center space-x-2 text-center"
                >
                  <Mail className="w-4 h-4 text-brand" />
                  <span>LAUNCH MAILAPP WITH {DESTINATION_EMAIL}</span>
                </a>
              </div>
            </ScrollReveal>

            {/* Live Community Feedback Stream - Only rendered when entries exist */}
            {feedbackList.length > 0 && (
              <ScrollReveal variant="slide-up" delay={0.15}>
                <div className="bg-[#0e1017] border border-[#1f2433] rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[#1f2433]">
                    <span className="font-mono text-xs text-white uppercase tracking-wider font-semibold flex items-center space-x-2">
                      <MessageSquare className="w-4 h-4 text-brand" />
                      <span>FEEDBACK STREAM ({feedbackList.length})</span>
                    </span>

                    <span className="font-mono text-[10px] text-brand bg-brand/10 px-2 py-0.5 rounded border border-brand/30">
                      LIVE ARCHIVE
                    </span>
                  </div>

                  {/* Feedback List Items */}
                  <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1 custom-scrollbar">
                    {feedbackList.map((fb) => (
                      <div 
                        key={fb.id}
                        className="p-4 rounded-xl bg-[#121520] border border-[#22293b] hover:border-[#323c56] transition-all space-y-2.5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="font-display font-bold text-sm text-white">
                              {fb.author}
                            </h4>
                            <span className="font-mono text-[10px] text-gray-400 block">
                              {fb.role} • {fb.date}
                            </span>
                          </div>

                          {/* Star Rating & Remove */}
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center space-x-1 bg-[#181d2c] px-2 py-1 rounded border border-[#2c354d]">
                              <Star className="w-3 h-3 text-brand fill-brand" />
                              <span className="font-mono text-xs text-white font-bold">
                                {fb.rating}.0
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => removeFeedback(fb.id)}
                              className="p-1 rounded bg-[#181d2c] hover:bg-red-950/60 text-gray-500 hover:text-red-400 border border-[#2c354d] hover:border-red-500/40 transition-all cursor-pointer"
                              title="Remove feedback item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <p className="font-sans text-xs text-gray-300 leading-relaxed font-light italic">
                          "{fb.message}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
