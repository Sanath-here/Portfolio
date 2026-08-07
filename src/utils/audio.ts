// Simple synth audio generator using Web Audio API so it works without loading external MP3 files.
let audioCtx: AudioContext | null = null;
let isMuted = true;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  // Try to resume if suspended (browser security)
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export const toggleMute = (muted: boolean) => {
  isMuted = muted;
  if (!isMuted) {
    getAudioContext(); // Warm up context
  }
};

export const playSound = (type: 'chirp' | 'beep' | 'laser' | 'unlock' | 'success') => {
  if (isMuted) return;

  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    const now = ctx.currentTime;

    if (type === 'chirp') {
      // Tactile cyber click
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.1);
      
      gainNode.gain.setValueAtTime(0.08, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === 'beep') {
      // Direct high-tech radar chime
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, now);
      
      gainNode.gain.setValueAtTime(0.05, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (type === 'laser') {
      // Weapon blast or selection sweep
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1500, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.25);
      
      gainNode.gain.setValueAtTime(0.06, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      
      osc.start(now);
      osc.stop(now + 0.25);
    } else if (type === 'unlock') {
      // Upward arcade confirmation chime
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(554, now + 0.08);
      osc.frequency.setValueAtTime(659, now + 0.16);
      osc.frequency.setValueAtTime(880, now + 0.24);
      
      gainNode.gain.setValueAtTime(0.07, now);
      gainNode.gain.setValueAtTime(0.07, now + 0.24);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (type === 'success') {
      // Modern electronic interface double beep
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.setValueAtTime(1200, now + 0.1);
      
      gainNode.gain.setValueAtTime(0.05, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      
      osc.start(now);
      osc.stop(now + 0.25);
    }
  } catch (error) {
    // Graceful fallback for browsers block policies
    console.debug('Killed audio chime due to autoplay restrictions', error);
  }
};
