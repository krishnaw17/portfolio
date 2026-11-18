import { useEffect, useState } from 'react';
import type { Project, Experience, Skill, Education, Certification } from '@/types';

export interface ContentData {
  site?: Record<string, unknown>;
  skills?: Skill[];
  projects?: Project[];
  experience?: Experience[];
  education?: Education[];
  certifications?: Certification[];
  headlineRotations?: string[];
}

/**
 * Fetches portfolio content from the server API.
 * Falls back to null if the server is unavailable (static content.ts is used as default).
 */
export function useContent() {
  const [content, setContent] = useState<ContentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/content', { cache: 'no-store' })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => setContent(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { content, loading, error };
}
