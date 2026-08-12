import { useState, FormEvent, useEffect } from 'react';
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
  Trash2,
  Database,
  Lock,
  Unlock,
  Key,
  X
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

const LOCAL_STORAGE_KEY = 'sanath_portfolio_feedback_v3';

function getLocalFeedback(): Feedback[] {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error('Error reading feedback from localStorage:', e);
  }
  return [];
}

function saveLocalFeedback(list: Feedback[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Error saving feedback to localStorage:', e);
  }
}

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
  const [dbStatusText, setDbStatusText] = useState<string | null>(null);
  const [emailNoticeText, setEmailNoticeText] = useState<string | null>(null);
  const [isEmailSuccess, setIsEmailSuccess] = useState<boolean>(false);

  // SMTP Diagnostic State
  const [smtpTestResult, setSmtpTestResult] = useState<any>(null);
  const [isTestingSmtp, setIsTestingSmtp] = useState(false);

  const runSmtpTest = async () => {
    playSound('chirp');
    setIsTestingSmtp(true);
    setSmtpTestResult(null);
    try {
      const res = await fetch('/api/smtp-test');
      const text = await res.text();
      let data: any = null;
      try {
        data = JSON.parse(text);
      } catch (e) {
        data = null;
      }

      if (data) {
        setSmtpTestResult(data);
      } else {
        setSmtpTestResult({
          configured: false,
          verified: false,
          message: `Backend service response format error (HTTP ${res.status}). Expected JSON.`,
        });
      }
    } catch (err: any) {
      setSmtpTestResult({
        configured: false,
        verified: false,
        message: `Network error reaching diagnostic route: ${err?.message || 'Check dev server connection.'}`,
      });
    } finally {
      setIsTestingSmtp(false);
    }
  };

  // Owner Admin Management States
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [adminPasscode, setAdminPasscode] = useState('sanath2026');
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [inputPasscode, setInputPasscode] = useState('');
  const [adminModalError, setAdminModalError] = useState<string | null>(null);

  // Local Feedback Stream (Loads from localStorage + Server)
  const [feedbackList, setFeedbackList] = useState<Feedback[]>(() => {
    const local = getLocalFeedback();
    if (local.length > 0) {
      const existingIds = new Set(local.map(item => item.id));
      return [...local, ...PRESEEDED_FEEDBACK.filter(p => !existingIds.has(p.id))];
    }
    return PRESEEDED_FEEDBACK;
  });

  // Fetch persisted feedback entries from server on mount & merge
  useEffect(() => {
    async function loadFeedbackFromDB() {
      try {
        const res = await fetch('/api/feedback');
        if (!res.ok) return;
        const text = await res.text();
        if (!text) return;
        const json = JSON.parse(text);
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setFeedbackList(prev => {
            const map = new Map<string, Feedback>();
            // Add server items first
            json.data.forEach((item: Feedback) => map.set(item.id, item));
            // Add existing local/preseeded items
            prev.forEach(item => {
              if (!map.has(item.id)) map.set(item.id, item);
            });
            const merged = Array.from(map.values());
            saveLocalFeedback(merged);
            return merged;
          });
        }
      } catch (err) {
        console.error('Could not fetch stored feedback from database:', err);
      }
    }

    loadFeedbackFromDB();
  }, []);

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

  const handleVerifyAdmin = (e: FormEvent) => {
    e.preventDefault();
    setAdminModalError(null);
    const keyToTest = inputPasscode.trim();
    if (!keyToTest) {
      setAdminModalError('Please enter owner passcode.');
      playSound('beep');
      return;
    }

    setAdminPasscode(keyToTest);
    setIsAdminMode(true);
    setShowAdminModal(false);
    setInputPasscode('');
    playSound('unlock');
  };

  const removeFeedback = async (id: string) => {
    if (!isAdminMode) {
      setShowAdminModal(true);
      return;
    }

    playSound('chirp');
    setFeedbackList(prev => {
      const updated = prev.filter(item => item.id !== id);
      saveLocalFeedback(updated);
      return updated;
    });

    try {
      const res = await fetch(`/api/feedback/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminPasscode || 'sanath2026',
        },
      });

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        let errJson: any = {};
        try { errJson = text ? JSON.parse(text) : {}; } catch { errJson = {}; }
        if (res.status === 403) {
          setErrorMsg(errJson.error || 'Unauthorized: Incorrect owner passcode provided.');
          setIsAdminMode(false);
        }
      }
    } catch (err) {
      console.error('Error deleting feedback:', err);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
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

    try {
      // POST to Backend API
      let res: Response | null = null;
      try {
        res = await fetch('/api/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            role: role.trim() || 'Portfolio Operative',
            subject: subject.trim(),
            rating,
            message: message.trim(),
          }),
        });
      } catch (netErr) {
        console.warn('Network error reaching feedback API endpoint:', netErr);
      }

      let data: any = null;
      if (res) {
        const resText = await res.text().catch(() => '');
        try {
          data = resText ? JSON.parse(resText) : null;
        } catch {
          data = null;
        }
      }

      // Handle backend validation error explicitly
      if (res && res.status >= 400 && res.status < 500 && data && data.error) {
        throw new Error(data.error);
      }

      const isPersisted = Boolean(res?.ok && (data?.dbSaved || data?.source === 'disk_fallback' || data?.success));
      const emailDispatched = Boolean(res?.ok && data?.emailDispatched);
      const emailNoticeMsg = data?.emailNotice || (emailDispatched ? 'Dispatched to inbox' : 'SMTP config needed');

      setIsEmailSuccess(emailDispatched);
      setEmailNoticeText(emailNoticeMsg);

      const newEntry: Feedback = (res && res.ok && data && data.data) ? data.data : {
        id: `fb-usr-${Date.now()}`,
        author: name.trim(),
        role: role.trim() || 'Portfolio Operative',
        subject: subject.trim(),
        email: email.trim(),
        message: message.trim(),
        rating: rating,
        date: new Date().toISOString().split('T')[0],
      };

      setFeedbackList(prev => {
        const updated = [newEntry, ...prev.filter(item => item.id !== newEntry.id)];
        saveLocalFeedback(updated);
        return updated;
      });

      setDbStatusText(
        isPersisted 
          ? 'Logged & Persisted to Database / Disk' 
          : 'Saved locally on device'
      );
      setEmailNoticeText(emailNoticeMsg);
      setIsSuccess(true);
      playSound('unlock');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error submitting feedback.';
      setErrorMsg(msg);
      playSound('beep');
    } finally {
      setIsSubmitting(false);
    }
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
                      <div className="text-brand font-bold uppercase border-b border-[#272d40] pb-1 mb-2 flex items-center justify-between flex-wrap gap-1">
                        <span>// DISPATCH SUMMARY LOG</span>
                        {dbStatusText && (
                          <span className="text-[10px] text-brand/90 bg-brand/10 px-2 py-0.5 rounded border border-brand/30 flex items-center space-x-1">
                            <Database className="w-3 h-3 text-brand" />
                            <span>{dbStatusText}</span>
                          </span>
                        )}
                      </div>
                      <div><span className="text-gray-500">SENDER:</span> {name} ({email})</div>
                      <div><span className="text-gray-500">SUBJECT:</span> {subject}</div>
                      <div><span className="text-gray-500">RATING:</span> {rating}/5 Stars</div>
                      {emailNoticeText && (
                        <div className={`pt-2 border-t border-[#272d40] text-[11px] flex items-start space-x-1.5 ${
                          isEmailSuccess ? 'text-emerald-400' : 'text-amber-400'
                        }`}>
                          <Mail className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                            isEmailSuccess ? 'text-emerald-400' : 'text-amber-400'
                          }`} />
                          <span>{emailNoticeText}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                      <button
                        onClick={resetForm}
                        className="bg-brand text-black hover:bg-brand/90 font-mono text-xs font-bold px-6 py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(196,253,2,0.3)] cursor-pointer"
                      >
                        SEND ANOTHER TRANSMISSION
                      </button>

                      <div className="bg-[#141824] border border-brand/30 text-brand font-mono text-xs font-medium px-4 py-3 rounded-xl flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-brand" />
                        <span>SAVED & LOGGED IN FEEDBACK STREAM</span>
                      </div>
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

                      <div className="flex flex-col items-end space-y-1">
                        <div className="flex items-center space-x-1.5 font-mono text-[10px] text-gray-500">
                          <ShieldCheck className="w-3.5 h-3.5 text-brand" />
                          <span>DIRECT SMTP OUTBOX // SAFE</span>
                        </div>
                        <button
                          type="button"
                          onClick={runSmtpTest}
                          disabled={isTestingSmtp}
                          className="font-mono text-[10px] text-brand/80 hover:text-brand underline cursor-pointer flex items-center space-x-1"
                        >
                          {isTestingSmtp ? (
                            <span>Testing connection...</span>
                          ) : (
                            <span>Check SMTP Status</span>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* SMTP Test Diagnostic Result Panel */}
                    {smtpTestResult && (
                      <div className={`p-4 rounded-xl border font-mono text-xs space-y-2 transition-all ${
                        smtpTestResult.verified 
                          ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200' 
                          : 'bg-amber-950/40 border-amber-500/40 text-amber-200'
                      }`}>
                        <div className="flex items-center justify-between border-b border-white/10 pb-2">
                          <span className="font-bold flex items-center space-x-1.5">
                            {smtpTestResult.verified ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-amber-400" />
                            )}
                            <span>SMTP DIAGNOSTIC STATUS: {smtpTestResult.verified ? 'ONLINE & READY' : 'CONFIG REQUIRED'}</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => setSmtpTestResult(null)}
                            className="text-gray-400 hover:text-white text-[10px]"
                          >
                            [ CLOSE ]
                          </button>
                        </div>
                        <p className="text-[11px] leading-relaxed">{smtpTestResult.message}</p>
                        {smtpTestResult.configured && (
                          <div className="text-[10px] text-gray-400 space-y-0.5 pt-1">
                            <div>Host: {smtpTestResult.host}:{smtpTestResult.port}</div>
                            <div>User: {smtpTestResult.user}</div>
                          </div>
                        )}
                        {smtpTestResult.missing && (
                          <div className="text-[10px] text-amber-300 pt-1">
                            Missing in container environment: {Object.keys(smtpTestResult.missing).filter(k => smtpTestResult.missing[k]).join(', ')}
                          </div>
                        )}
                      </div>
                    )}

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

          </div>

        </div>

        {/* Dedicated "Feedbacks Submitted" Box directly below */}
        <ScrollReveal variant="slide-up" delay={0.2}>
          <div className="mt-12 bg-[#0e1017] border border-[#1f2433] rounded-2xl p-6 sm:p-8 shadow-[0_4px_30px_rgba(0,0,0,0.6)] space-y-6">
            
            {/* Box Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#1f2433]">
              <div className="space-y-1">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-brand/10 border border-brand/40 rounded-xl text-brand">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <h3 className="font-display font-bold text-xl sm:text-2xl text-white tracking-wide uppercase flex items-center space-x-3">
                    <span>FEEDBACKS SUBMITTED</span>
                    <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-brand text-black shadow-[0_0_12px_rgba(196,253,2,0.3)]">
                      {feedbackList.length}
                    </span>
                  </h3>
                </div>
                <p className="font-sans text-xs text-gray-400 font-light pl-11">
                  Public reviews & messages transmitted by visitors. Email addresses are strictly hidden to preserve user privacy.
                </p>
              </div>

              {/* Status & Privacy Badges + Owner Controls */}
              <div className="flex flex-wrap items-center gap-2 font-mono text-[10px]">
                <span className="bg-brand/10 text-brand px-3 py-1 rounded-lg border border-brand/30 flex items-center space-x-1.5">
                  <Database className="w-3.5 h-3.5 text-brand" />
                  <span>MONGODB STORED</span>
                </span>
                <span className="bg-[#161a26] text-gray-300 px-3 py-1 rounded-lg border border-[#272d40] flex items-center space-x-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand" />
                  <span>EMAIL ADDRESSES PROTECTED</span>
                </span>

                {/* Owner Admin Mode Toggle Button */}
                {isAdminMode ? (
                  <div className="flex items-center space-x-1.5 bg-amber-500/10 border border-amber-500/40 text-amber-300 px-3 py-1 rounded-lg">
                    <Unlock className="w-3.5 h-3.5 text-amber-400" />
                    <span className="font-bold uppercase tracking-wide">OWNER MODE</span>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAdminMode(false);
                        playSound('chirp');
                      }}
                      className="ml-1 text-xs text-slate-400 hover:text-white underline cursor-pointer"
                    >
                      (LOCK)
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setShowAdminModal(true);
                      playSound('chirp');
                    }}
                    className="bg-[#181e2e] hover:bg-[#222a40] text-slate-300 hover:text-white px-3 py-1 rounded-lg border border-[#2e3852] transition-colors flex items-center space-x-1.5 cursor-pointer"
                    title="Portfolio Owner Management Access"
                  >
                    <Lock className="w-3.5 h-3.5 text-brand" />
                    <span>OWNER ACCESS</span>
                  </button>
                )}
              </div>
            </div>

            {/* Feedback Stream Grid */}
            {feedbackList.length === 0 ? (
              <div className="py-12 text-center space-y-3 bg-[#121520] border border-[#22293b] rounded-xl">
                <MessageSquare className="w-8 h-8 text-gray-600 mx-auto" />
                <p className="font-mono text-xs text-gray-400">
                  No feedback entries submitted yet. Be the first to leave a feedback message above!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[480px] overflow-y-auto pr-1 custom-scrollbar">
                {feedbackList.map((fb) => (
                  <div 
                    key={fb.id}
                    className="p-5 rounded-xl bg-[#121520] border border-[#22293b] hover:border-brand/40 transition-all space-y-3 flex flex-col justify-between group"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-display font-bold text-sm text-white group-hover:text-brand transition-colors">
                            {fb.author}
                          </h4>
                          <span className="font-mono text-[10px] text-gray-400 block">
                            {fb.role} • {fb.date}
                          </span>
                        </div>

                        {/* Star Rating Badge */}
                        <div className="flex items-center space-x-1 bg-[#181d2c] px-2 py-1 rounded border border-[#2c354d]">
                          <Star className="w-3 h-3 text-brand fill-brand" />
                          <span className="font-mono text-xs text-white font-bold">
                            {fb.rating}.0
                          </span>
                        </div>
                      </div>

                      {/* Optional Subject Badge */}
                      {fb.subject && (
                        <div className="font-mono text-[10px] text-brand/90 font-semibold bg-brand/5 px-2 py-0.5 rounded border border-brand/20 inline-block">
                          {fb.subject}
                        </div>
                      )}

                      {/* Feedback Body */}
                      <p className="font-sans text-xs text-gray-300 leading-relaxed font-light italic pt-1">
                        "{fb.message}"
                      </p>
                    </div>

                    {/* Card Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-[#1e2436] font-mono text-[10px] text-gray-500">
                      <span className="flex items-center space-x-1 text-gray-500">
                        <ShieldCheck className="w-3 h-3 text-brand/70" />
                        <span>Email Kept Private</span>
                      </span>

                      {/* Delete button only accessible in Owner Admin Mode */}
                      {isAdminMode && (
                        <button
                          type="button"
                          onClick={() => removeFeedback(fb.id)}
                          className="p-1 px-2.5 rounded bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-500/40 hover:border-red-400 transition-all cursor-pointer flex items-center space-x-1.5 font-bold"
                          title="Delete feedback entry (Owner Mode)"
                        >
                          <Trash2 className="w-3 h-3 text-red-400" />
                          <span>Delete</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </ScrollReveal>

      </div>

      {/* Owner Passcode Verification Modal */}
      <AnimatePresence>
        {showAdminModal && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              className="relative w-full max-w-sm bg-[#0b0e17] border border-brand/50 rounded-xl p-6 shadow-[0_0_40px_rgba(196,253,2,0.15)] text-slate-100 z-10"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center space-x-2.5 text-brand font-mono font-bold text-xs uppercase tracking-wider">
                  <Key className="w-4 h-4" />
                  <span>OWNER ACCESS UNLOCK</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowAdminModal(false);
                    setAdminModalError(null);
                    setInputPasscode('');
                  }}
                  className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleVerifyAdmin} className="py-4 space-y-4">
                <p className="text-xs font-sans text-slate-400 leading-relaxed">
                  To manage or delete feedback entries, please authenticate as the portfolio owner using your passcode.
                </p>

                {adminModalError && (
                  <div className="p-2.5 rounded bg-red-950/60 border border-red-500/50 text-red-300 text-xs font-mono flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                    <span>{adminModalError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-mono font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Owner Passcode *
                  </label>
                  <input
                    type="password"
                    required
                    value={inputPasscode}
                    onChange={(e) => setInputPasscode(e.target.value)}
                    placeholder="Enter passcode (e.g. sanath2026)"
                    className="w-full bg-[#121826] border border-slate-800 focus:border-brand rounded-lg px-3 py-2 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-brand/50"
                  />
                </div>

                <div className="pt-1 flex items-center justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAdminModal(false);
                      setAdminModalError(null);
                      setInputPasscode('');
                    }}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs rounded-lg cursor-pointer"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-brand hover:bg-[#d4fe1a] text-black font-mono font-bold text-xs rounded-lg transition-all cursor-pointer uppercase tracking-wider shadow-[0_0_15px_rgba(196,253,2,0.3)] font-bold"
                  >
                    UNLOCK OWNER MODE
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
