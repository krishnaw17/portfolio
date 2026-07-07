import { useEffect, useState } from 'react';
import { api } from '@/utils/api';
import { FolderKanban, Briefcase, GraduationCap, Wrench, Award } from 'lucide-react';

interface ContentData {
  projects?: unknown[];
  experience?: unknown[];
  education?: unknown[];
  skills?: unknown[];
  certifications?: unknown[];
  _meta?: { updatedAt?: string };
}

const SECTIONS = [
  { key: 'projects', label: 'Projects', icon: FolderKanban, href: '/admin/projects' },
  { key: 'experience', label: 'Experience', icon: Briefcase, href: '/admin/experience' },
  { key: 'education', label: 'Education', icon: GraduationCap, href: '/admin/education' },
  { key: 'skills', label: 'Skills', icon: Wrench, href: '/admin/skills' },
  { key: 'certifications', label: 'Certifications', icon: Award, href: '/admin/settings' },
];

export function AdminDashboard() {
  const [content, setContent] = useState<ContentData | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get<ContentData>('/admin/content', true)
      .then(setContent)
      .catch((err) => setError(err.message));
  }, []);

  if (error) {
    return <p className="text-red-400 text-sm">{error}</p>;
  }

  if (!content) {
    return <p className="text-neutral-500 text-sm">Loading…</p>;
  }

  const lastUpdated = content._meta?.updatedAt
    ? new Date(content._meta.updatedAt).toLocaleString()
    : '—';

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-neutral-500 mt-1">Last updated: {lastUpdated}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {SECTIONS.map(({ key, label, icon: Icon, href }) => {
          const items = (content as Record<string, unknown[]>)[key];
          const count = Array.isArray(items) ? items.length : 0;

          return (
            <a
              key={key}
              href={href}
              className="group flex items-center gap-4 rounded-lg border border-neutral-800/50 bg-neutral-900/40 p-4 transition-colors hover:border-neutral-700"
            >
              <div className="grid h-10 w-10 place-items-center rounded-md bg-neutral-800/60 text-neutral-400 group-hover:text-white transition-colors">
                <Icon size={18} />
              </div>
              <div>
                <div className="text-2xl font-semibold">{count}</div>
                <div className="text-xs text-neutral-500">{label}</div>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
