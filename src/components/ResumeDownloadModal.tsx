import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck, Send, CheckCircle2, AlertCircle, FileText, Download, Building, User, Mail, MessageSquare, Loader2 } from 'lucide-react';
import { playSound } from '../utils/audio';

interface ResumeDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ResumeDownloadModal({ isOpen, onClose }: ResumeDownloadModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    reason: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successResult, setSuccessResult] = useState<{
    recordId: string;
    emailSent: boolean;
    emailStatusMessage: string;
    downloadUrl: string;
  } | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim() || !formData.company.trim() || !formData.email.trim() || !formData.reason.trim()) {
      setError('All fields are required. Please complete all fields.');
      playSound('beep');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address.');
      playSound('beep');
      return;
    }

    setLoading(true);
    playSound('chirp');

    try {
      const response = await fetch('/api/request-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const resText = await response.text();
      let data: any = {};
      try {
        data = resText ? JSON.parse(resText) : {};
      } catch {
        data = { success: response.ok };
      }

      if (!response.ok || (data && data.success === false)) {
        throw new Error((data && data.error) || 'Failed to submit request.');
      }

      setSuccessResult({
        recordId: data.recordId || 'REQ-VERIFIED',
        emailSent: data.emailSent,
        emailStatusMessage: data.emailStatusMessage || 'Resume request processed.',
        downloadUrl: data.downloadUrl || '/Sanath_Lal_Resume.pdf',
      });

      playSound('unlock');

      // Trigger automatic direct browser download as immediate access fulfillment
      const link = document.createElement('a');
      link.href = data.downloadUrl || '/Sanath_Lal_Resume.pdf';
      link.download = 'Sanath_Lal_Resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An error occurred while dispatching request.';
      setError(msg);
      playSound('beep');
    } finally {
      setLoading(false);
    }
  };

  const handleResetAndClose = () => {
    onClose();
    setTimeout(() => {
      setFormData({ name: '', company: '', email: '', reason: '' });
      setError(null);
      setSuccessResult(null);
    }, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md">
          {/* Backdrop dismiss */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleResetAndClose}
            className="fixed inset-0"
          />

          {/* Tactical Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="relative w-full max-w-lg bg-[#0b0e17] border border-brand/50 rounded-xl shadow-[0_0_40px_rgba(196,253,2,0.15)] p-6 sm:p-8 z-10 overflow-hidden text-slate-100"
          >
            {/* Corner Decorative Decals */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-brand/80 rounded-tl-xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-brand/80 rounded-br-xl pointer-events-none" />

            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-lg bg-brand/10 border border-brand/40 text-brand">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono tracking-widest text-brand font-bold uppercase">
                      SECURE ACCESS REQUISITION
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-brand animate-ping" />
                  </div>
                  <h3 className="text-lg font-mono font-bold text-white tracking-wide">
                    Request Resume Dossier
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={handleResetAndClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            {successResult ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="py-6 space-y-6 text-center"
              >
                <div className="inline-flex p-4 rounded-full bg-brand/10 border-2 border-brand text-brand shadow-[0_0_20px_rgba(196,253,2,0.3)]">
                  <CheckCircle2 className="w-10 h-10 animate-bounce" />
                </div>

                <div className="space-y-2">
                  <h4 className="text-xl font-mono font-bold text-white">
                    ACCESS GRANTED & DISPATCHED
                  </h4>
                  <p className="text-xs font-mono text-slate-300 max-w-sm mx-auto leading-relaxed">
                    Request logged under Clearance Code:{' '}
                    <span className="text-brand font-bold">{successResult.recordId}</span>.
                  </p>
                  <p className="text-xs text-slate-400 pt-1">
                    {successResult.emailStatusMessage}
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-[#121826] border border-slate-800 text-left space-y-2 text-xs font-mono text-slate-300">
                  <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                    <span className="text-slate-500">RECIPIENT:</span>
                    <span className="text-slate-200 font-semibold">{formData.email}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                    <span className="text-slate-500">ORGANIZATION:</span>
                    <span className="text-slate-200">{formData.company}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">DIRECT DOWNLOAD:</span>
                    <span className="text-brand font-bold">INITIATED</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <a
                    href={successResult.downloadUrl}
                    download="Sanath_Lal_Resume.pdf"
                    onClick={() => playSound('unlock')}
                    className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-brand text-black font-mono font-bold text-xs px-5 py-2.5 rounded-lg hover:bg-[#d4fe1a] transition-all cursor-pointer uppercase tracking-wider"
                  >
                    <Download className="w-4 h-4" />
                    <span>DOWNLOAD AGAIN</span>
                  </a>

                  <button
                    type="button"
                    onClick={handleResetAndClose}
                    className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    CLOSE WINDOW
                  </button>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="py-5 space-y-4">
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  To protect personal data and maintain audit security, please provide your details below. The official resume will be logged and dispatched.
                </p>

                {error && (
                  <div className="p-3 rounded-lg bg-red-950/60 border border-red-500/50 text-red-300 text-xs font-mono flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Name Field */}
                <div>
                  <label className="block text-[11px] font-mono font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Your Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Sarah Connor"
                      className="w-full bg-[#121826] border border-slate-800 focus:border-brand rounded-lg pl-9 pr-3 py-2 text-xs font-sans text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-brand/50 transition-all"
                    />
                  </div>
                </div>

                {/* Company Name Field */}
                <div>
                  <label className="block text-[11px] font-mono font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Company / Organization *
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="e.g. Cyberdyne Systems / Hiring Agency"
                      className="w-full bg-[#121826] border border-slate-800 focus:border-brand rounded-lg pl-9 pr-3 py-2 text-xs font-sans text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-brand/50 transition-all"
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-[11px] font-mono font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="s.connor@example.com"
                      className="w-full bg-[#121826] border border-slate-800 focus:border-brand rounded-lg pl-9 pr-3 py-2 text-xs font-sans text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-brand/50 transition-all"
                    />
                  </div>
                </div>

                {/* Reason Field */}
                <div>
                  <label className="block text-[11px] font-mono font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Reason for Download Request *
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                    <textarea
                      required
                      rows={2}
                      value={formData.reason}
                      onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                      placeholder="e.g. Considering for Senior Frontend / Full-Stack Engineer role..."
                      className="w-full bg-[#121826] border border-slate-800 focus:border-brand rounded-lg pl-9 pr-3 py-2 text-xs font-sans text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-brand/50 transition-all resize-none"
                    />
                  </div>
                </div>

                {/* Submit Action Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full inline-flex items-center justify-center space-x-2 bg-brand hover:bg-[#d4fe1a] text-black font-mono font-bold text-xs px-4 py-3 rounded-lg shadow-[0_0_20px_rgba(196,253,2,0.25)] hover:shadow-[0_0_28px_rgba(196,253,2,0.45)] transition-all cursor-pointer uppercase tracking-wider disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-black" />
                        <span>LOGGING & DISPATCHING RESUME...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-black" />
                        <span>SUBMIT & RECEIVE RESUME</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-center space-x-1.5 text-[10px] font-mono text-slate-500 pt-1">
                  <FileText className="w-3 h-3 text-brand" />
                  <span>MongoDB Audit Logged • Direct Resume Dispatch</span>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
