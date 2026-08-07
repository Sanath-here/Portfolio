import { useState, useEffect } from 'react';

interface DecryptTextProps {
  text: string;
  className?: string;
  delay?: number;
  triggerOnScroll?: boolean;
}

export default function DecryptText({ text, className = '', delay = 0 }: DecryptTextProps) {
  const [displayText, setDisplayText] = useState('');
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789X#@$%&*+=_?';

  useEffect(() => {
    let isMounted = true;
    let frameId: number;

    const startTimeout = setTimeout(() => {
      let currentIteration = 0;
      const targetLength = text.length;

      const interval = setInterval(() => {
        if (!isMounted) return;

        const scrambled = text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (index < currentIteration) {
              return text[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('');

        setDisplayText(scrambled);

        if (currentIteration >= targetLength) {
          clearInterval(interval);
        }
        
        currentIteration += 1 / 3; // Decrypt speed
      }, 30);

      return () => clearInterval(interval);
    }, delay);

    return () => {
      isMounted = false;
      clearTimeout(startTimeout);
    };
  }, [text, delay]);

  return (
    <span className={`${className} font-mono tracking-wider transition-all duration-300`}>
      {displayText || text}
    </span>
  );
}
