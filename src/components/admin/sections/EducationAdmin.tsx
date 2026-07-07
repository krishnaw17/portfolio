import { useEffect, useState } from 'react';
import { api } from '@/utils/api';
import { Plus, Pencil, Trash2, X, Save } from 'lucide-react';

interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  period: string;
  description: string;
}

const EMPTY: Education = { id: '', institution: '', degree: '', field: '', period: '', description: '' };

export function EducationAdmin() {
  const [items, setItems] = useState<Education[]>([]);
  const [editing, setEditing] = useState<Education | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchItems = async () => {
    try {
      const data = await api.get<{ education: Education[] }>('/admin/content', true);
      setItems(data.education || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    setError('');
    try {
      if (isNew) {
        await api.post('/admin/content/education', editing, true);
      } else {
        await api.put(`/admin/content/education/${editing.id}`, editing, true);
      }
      setEditing(null);
      setIsNew(false);
      await fetchItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this entry?')) return;
    try {
      await api.delete(`/admin/content/education/${id}`, true);
      await fetchItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
    }
  };

  if (loading) return <p className="text-neutral-500 text-sm">Loading…</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Education</h1>
        <button
          onClick={() => { setEditing({ ...EMPTY, id: `edu-${Date.now()}` }); setIsNew(true); }}
          className="inline-flex items-center gap-1.5 rounded-md bg-white px-3 py-1.5 text-sm font-medium text-black hover:opacity-90"
        >
          <Plus size={14} /> Add
        </button>
      </div>

      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

      {editing && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm pt-[5vh] overflow-y-auto pb-10">
          <div className="w-full max-w-2xl rounded-lg border border-neutral-800 bg-[#0f0f14] p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold">{isNew ? 'New Education' : 'Edit Education'}</h2>
              <button onClick={() => { setEditing(null); setIsNew(false); }} className="text-neutral-500 hover:text-white"><X size={18} /></button>
            </div>
            <div className="space-y-3">
              <Field label="ID" value={editing.id} onChange={(v) => setEditing({ ...editing, id: v })} disabled={!isNew} />
              <Field label="Institution" value={editing.institution} onChange={(v) => setEditing({ ...editing, institution: v })} />
              <div className="grid grid-cols-2 gap-3">
                <Field label="Degree" value={editing.degree} onChange={(v) => setEditing({ ...editing, degree: v })} />
                <Field label="Field" value={editing.field} onChange={(v) => setEditing({ ...editing, field: v })} />
              </div>
              <Field label="Period" value={editing.period} onChange={(v) => setEditing({ ...editing, period: v })} />
              <Field label="Description" value={editing.description} onChange={(v) => setEditing({ ...editing, description: v })} textarea />
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => { setEditing(null); setIsNew(false); }} className="rounded-md border border-neutral-800 px-3 py-1.5 text-sm text-neutral-400 hover:text-white">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="inline-flex items-center gap-1.5 rounded-md bg-white px-3 py-1.5 text-sm font-medium text-black hover:opacity-90 disabled:opacity-50">
                <Save size={14} /> {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {items.length === 0 && <p className="text-neutral-600 text-sm">No education entries.</p>}
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between rounded-lg border border-neutral-800/50 bg-neutral-900/30 px-4 py-3">
            <div className="min-w-0">
              <div className="text-sm font-medium truncate">{item.degree} — {item.field}</div>
              <div className="text-xs text-neutral-500 mt-0.5">{item.institution} · {item.period}</div>
            </div>
            <div className="flex items-center gap-1 ml-3 shrink-0">
              <button onClick={() => { setEditing({ ...item }); setIsNew(false); }} className="p-1.5 text-neutral-500 hover:text-white"><Pencil size={14} /></button>
              <button onClick={() => handleDelete(item.id)} className="p-1.5 text-neutral-500 hover:text-red-400"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, textarea, disabled }: { label: string; value: string; onChange: (v: string) => void; textarea?: boolean; disabled?: boolean }) {
  const cls = 'w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-white outline-none focus:border-neutral-600 disabled:opacity-40';
  return (
    <div>
      <label className="block text-xs text-neutral-500 mb-1">{label}</label>
      {textarea ? <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} className={cls} disabled={disabled} /> : <input value={value} onChange={(e) => onChange(e.target.value)} className={cls} disabled={disabled} />}
    </div>
  );
}
