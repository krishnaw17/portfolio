import { useEffect, useState } from 'react';
import { api } from '@/utils/api';
import { Plus, Trash2, X, Save } from 'lucide-react';

interface Skill {
  name: string;
  category: string;
  level: number;
}

const CATEGORIES = ['languages', 'frontend', 'backend', 'cloud', 'ai', 'databases', 'tools'];

export function SkillsAdmin() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [editing, setEditing] = useState<Skill | null>(null);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState('all');

  const fetchSkills = async () => {
    try {
      const data = await api.get<{ skills: Skill[] }>('/admin/content', true);
      setSkills(data.skills || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSkills(); }, []);

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    setError('');
    try {
      const updated = [...skills];
      if (isNew) {
        updated.push(editing);
      } else if (editIdx !== null) {
        updated[editIdx] = editing;
      }
      await api.put('/admin/content/skills', updated, true);
      setEditing(null);
      setEditIdx(null);
      setIsNew(false);
      await fetchSkills();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (idx: number) => {
    if (!confirm('Delete this skill?')) return;
    try {
      const updated = skills.filter((_, i) => i !== idx);
      await api.put('/admin/content/skills', updated, true);
      await fetchSkills();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
    }
  };

  const filtered = filter === 'all' ? skills : skills.filter((s) => s.category === filter);

  if (loading) return <p className="text-neutral-500 text-sm">Loading…</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Skills</h1>
        <button
          onClick={() => { setEditing({ name: '', category: 'languages', level: 80 }); setIsNew(true); }}
          className="inline-flex items-center gap-1.5 rounded-md bg-white px-3 py-1.5 text-sm font-medium text-black hover:opacity-90"
        >
          <Plus size={14} /> Add
        </button>
      </div>

      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

      {/* Category filter */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {['all', ...CATEGORIES].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`rounded-md px-2.5 py-1 text-xs transition-colors ${
              filter === cat
                ? 'bg-neutral-700 text-white'
                : 'bg-neutral-900 text-neutral-500 hover:text-neutral-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-lg border border-neutral-800 bg-[#0f0f14] p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold">{isNew ? 'New Skill' : 'Edit Skill'}</h2>
              <button onClick={() => { setEditing(null); setIsNew(false); setEditIdx(null); }} className="text-neutral-500 hover:text-white"><X size={18} /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-neutral-500 mb-1">Name</label>
                <input
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-white outline-none focus:border-neutral-600"
                />
              </div>
              <div>
                <label className="block text-xs text-neutral-500 mb-1">Category</label>
                <select
                  value={editing.category}
                  onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                  className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-white outline-none focus:border-neutral-600"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-neutral-500 mb-1">Level: {editing.level}%</label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={editing.level}
                  onChange={(e) => setEditing({ ...editing, level: Number(e.target.value) })}
                  className="w-full accent-white"
                />
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => { setEditing(null); setIsNew(false); setEditIdx(null); }} className="rounded-md border border-neutral-800 px-3 py-1.5 text-sm text-neutral-400 hover:text-white">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="inline-flex items-center gap-1.5 rounded-md bg-white px-3 py-1.5 text-sm font-medium text-black hover:opacity-90 disabled:opacity-50">
                <Save size={14} /> {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Skill list */}
      <div className="space-y-1">
        {filtered.length === 0 && <p className="text-neutral-600 text-sm">No skills in this category.</p>}
        {filtered.map((s) => {
          const realIdx = skills.indexOf(s);
          return (
            <div
              key={`${s.name}-${s.category}`}
              className="flex items-center justify-between rounded-lg border border-neutral-800/50 bg-neutral-900/30 px-4 py-2.5"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <span className="text-sm font-medium truncate">{s.name}</span>
                <span className="text-xs text-neutral-600 shrink-0">{s.category}</span>
                <div className="flex-1 max-w-[120px]">
                  <div className="h-1 rounded-full bg-neutral-800">
                    <div className="h-1 rounded-full bg-neutral-500" style={{ width: `${s.level}%` }} />
                  </div>
                </div>
                <span className="text-xs text-neutral-500 shrink-0">{s.level}%</span>
              </div>
              <div className="flex items-center gap-1 ml-3 shrink-0">
                <button
                  onClick={() => { setEditing({ ...s }); setEditIdx(realIdx); setIsNew(false); }}
                  className="p-1.5 text-neutral-500 hover:text-white text-xs"
                >
                  Edit
                </button>
                <button onClick={() => handleDelete(realIdx)} className="p-1.5 text-neutral-500 hover:text-red-400">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
