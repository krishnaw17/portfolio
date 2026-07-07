import { useEffect, useState } from 'react';
import { api } from '@/utils/api';
import { Plus, Pencil, Trash2, X, Save } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  image?: string;
  tags: string[];
  category: string;
  github?: string;
  live?: string;
  metrics: { label: string; value: string }[];
  problem: string;
  solution: string;
  impact: string;
  year: number;
  featured?: boolean;
}

const EMPTY_PROJECT: Project = {
  id: '',
  title: '',
  description: '',
  longDescription: '',
  image: '',
  tags: [],
  category: 'web',
  github: '',
  live: '',
  metrics: [],
  problem: '',
  solution: '',
  impact: '',
  year: new Date().getFullYear(),
  featured: false,
};

export function ProjectsAdmin() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editing, setEditing] = useState<Project | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchProjects = async () => {
    try {
      const data = await api.get<{ projects: Project[] }>('/admin/content', true);
      setProjects(data.projects || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    setError('');

    try {
      if (isNew) {
        await api.post('/admin/content/projects', editing, true);
      } else {
        await api.put(`/admin/content/projects/${editing.id}`, editing, true);
      }
      setEditing(null);
      setIsNew(false);
      await fetchProjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project?')) return;
    try {
      await api.delete(`/admin/content/projects/${id}`, true);
      await fetchProjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
    }
  };

  if (loading) return <p className="text-neutral-500 text-sm">Loading…</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Projects</h1>
        <button
          onClick={() => {
            setEditing({ ...EMPTY_PROJECT, id: `proj-${Date.now()}` });
            setIsNew(true);
          }}
          className="inline-flex items-center gap-1.5 rounded-md bg-white px-3 py-1.5 text-sm font-medium text-black hover:opacity-90"
        >
          <Plus size={14} /> Add
        </button>
      </div>

      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm pt-[5vh] overflow-y-auto pb-10">
          <div className="w-full max-w-2xl rounded-lg border border-neutral-800 bg-[#0f0f14] p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold">{isNew ? 'New Project' : 'Edit Project'}</h2>
              <button onClick={() => { setEditing(null); setIsNew(false); }} className="text-neutral-500 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
              <Field label="ID" value={editing.id} onChange={(v) => setEditing({ ...editing, id: v })} disabled={!isNew} />
              <Field label="Title" value={editing.title} onChange={(v) => setEditing({ ...editing, title: v })} />
              <Field label="Description" value={editing.description} onChange={(v) => setEditing({ ...editing, description: v })} textarea />
              <Field label="Long Description" value={editing.longDescription} onChange={(v) => setEditing({ ...editing, longDescription: v })} textarea />
              <Field label="Image URL" value={editing.image || ''} onChange={(v) => setEditing({ ...editing, image: v })} />
              <Field label="Tags (comma-separated)" value={editing.tags.join(', ')} onChange={(v) => setEditing({ ...editing, tags: v.split(',').map((t) => t.trim()).filter(Boolean) })} />
              <div className="grid grid-cols-2 gap-3">
                <Field label="Category" value={editing.category} onChange={(v) => setEditing({ ...editing, category: v })} />
                <Field label="Year" value={String(editing.year)} onChange={(v) => setEditing({ ...editing, year: Number(v) || 0 })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="GitHub URL" value={editing.github || ''} onChange={(v) => setEditing({ ...editing, github: v })} />
                <Field label="Live URL" value={editing.live || ''} onChange={(v) => setEditing({ ...editing, live: v })} />
              </div>
              <Field label="Problem" value={editing.problem} onChange={(v) => setEditing({ ...editing, problem: v })} textarea />
              <Field label="Solution" value={editing.solution} onChange={(v) => setEditing({ ...editing, solution: v })} textarea />
              <Field label="Impact" value={editing.impact} onChange={(v) => setEditing({ ...editing, impact: v })} textarea />
              <label className="flex items-center gap-2 text-sm text-neutral-400">
                <input
                  type="checkbox"
                  checked={editing.featured ?? false}
                  onChange={(e) => setEditing({ ...editing, featured: e.target.checked })}
                  className="rounded border-neutral-700"
                />
                Featured
              </label>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => { setEditing(null); setIsNew(false); }} className="rounded-md border border-neutral-800 px-3 py-1.5 text-sm text-neutral-400 hover:text-white">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving} className="inline-flex items-center gap-1.5 rounded-md bg-white px-3 py-1.5 text-sm font-medium text-black hover:opacity-90 disabled:opacity-50">
                <Save size={14} /> {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Project list */}
      <div className="space-y-2">
        {projects.length === 0 && (
          <p className="text-neutral-600 text-sm">No projects yet.</p>
        )}
        {projects.map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between rounded-lg border border-neutral-800/50 bg-neutral-900/30 px-4 py-3"
          >
            <div className="min-w-0">
              <div className="text-sm font-medium truncate">{p.title}</div>
              <div className="text-xs text-neutral-500 mt-0.5">{p.category} · {p.year}{p.featured ? ' · ★' : ''}</div>
            </div>
            <div className="flex items-center gap-1 ml-3 shrink-0">
              <button
                onClick={() => { setEditing({ ...p }); setIsNew(false); }}
                className="p-1.5 text-neutral-500 hover:text-white transition-colors"
              >
                <Pencil size={14} />
              </button>
              <button
                onClick={() => handleDelete(p.id)}
                className="p-1.5 text-neutral-500 hover:text-red-400 transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  textarea,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
  disabled?: boolean;
}) {
  const cls =
    'w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-white outline-none focus:border-neutral-600 placeholder:text-neutral-600 disabled:opacity-40';
  return (
    <div>
      <label className="block text-xs text-neutral-500 mb-1">{label}</label>
      {textarea ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} className={cls} disabled={disabled} />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} className={cls} disabled={disabled} />
      )}
    </div>
  );
}
