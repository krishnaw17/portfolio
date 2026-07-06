import { useEffect, useState } from 'react';

export function useTypewriter(words: string[], typingMs = 80, deletingMs = 40, holdMs = 1600) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState('');
  const [phase, setPhase] = useState<'typing' | 'holding' | 'deleting'>('typing');

  useEffect(() => {
    if (words.length === 0) return;
    const current = words[index % words.length];

    let timeout: ReturnType<typeof setTimeout>;

    if (phase === 'typing') {
      if (text.length < current.length) {
        timeout = setTimeout(() => setText(current.slice(0, text.length + 1)), typingMs);
      } else {
        timeout = setTimeout(() => setPhase('holding'), holdMs);
      }
    } else if (phase === 'holding') {
      timeout = setTimeout(() => setPhase('deleting'), holdMs);
    } else if (phase === 'deleting') {
      if (text.length > 0) {
        timeout = setTimeout(() => setText(current.slice(0, text.length - 1)), deletingMs);
      } else {
        setPhase('typing');
        setIndex((i) => i + 1);
      }
    }

    return () => clearTimeout(timeout);
  }, [text, phase, index, words, typingMs, deletingMs, holdMs]);

  return text;
}
