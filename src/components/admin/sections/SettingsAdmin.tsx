import { useEffect, useState } from 'react';
import { api } from '@/utils/api';
import { Save } from 'lucide-react';

interface SiteSettings {
  name: string;
  shortName: string;
  role: string;
  email: string;
  location: string;
  social: {
    github: string;
    linkedin: string;
    twitter: string;
  };
}

export function SettingsAdmin() {
  const [site, setSite] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Password change
  const [pw, setPw] = useState({ current: '', new: '', confirm: '' });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwMsg, setPwMsg] = useState('');

  // Resume upload
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeLoading, setResumeLoading] = useState(false);
  const [resumeMsg, setResumeMsg] = useState('');

  useEffect(() => {
    api
      .get<{ site: SiteSettings }>('/admin/content', true)
      .then((data) => setSite(data.site))
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load'))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!site) return;
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await api.put('/admin/content/site', site, true);
      setSuccess('Settings saved.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    setPwMsg('');
    if (pw.new !== pw.confirm) {
      setPwMsg('Passwords do not match.');
      return;
    }
    if (pw.new.length < 8) {
      setPwMsg('Password must be at least 8 characters.');
      return;
    }
    setPwLoading(true);
    try {
      const res = await api.post<{ message: string; hash: string }>(
        '/admin/change-password',
        { currentPassword: pw.current, newPassword: pw.new },
        true
      );
      setPwMsg(res.message);
      setPw({ current: '', new: '', confirm: '' });
    } catch (err) {
      setPwMsg(err instanceof Error ? err.message : 'Failed to change password');
    } finally {
      setPwLoading(false);
    }
  };

  const handleResumeUpload = async () => {
    if (!resumeFile) return;
    setResumeLoading(true);
    setResumeMsg('');
    
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const result = e.target?.result as string;
          const base64Content = result.split(',')[1];
          if (!base64Content) throw new Error('Failed to parse file content.');

          const res = await api.post<{ message: string }>('/admin/resume', { content: base64Content }, true);
          setResumeMsg(res.message);
          setResumeFile(null);
        } catch (err) {
          setResumeMsg(err instanceof Error ? err.message : 'Upload failed');
        } finally {
          setResumeLoading(false);
        }
      };
      reader.onerror = () => {
        setResumeMsg('Failed to read file');
        setResumeLoading(false);
      };
      reader.readAsDataURL(resumeFile);
    } catch (err) {
      setResumeMsg(err instanceof Error ? err.message : 'Upload failed');
      setResumeLoading(false);
    }
  };

  if (loading) return <p className="text-neutral-500 text-sm">Loading…</p>;
  if (!site) return <p className="text-red-400 text-sm">{error || 'No data'}</p>;

  return (
    <div className="space-y-10">
      {/* Site Info */}
      <div>
        <h1 className="text-2xl font-semibold mb-6">Settings</h1>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
        {success && <p className="text-green-400 text-sm mb-4">{success}</p>}

        <div className="space-y-3 max-w-lg">
          <Field label="Name" value={site.name} onChange={(v) => setSite({ ...site, name: v })} />
          <Field label="Short Name" value={site.shortName} onChange={(v) => setSite({ ...site, shortName: v })} />
          <Field label="Role" value={site.role} onChange={(v) => setSite({ ...site, role: v })} />
          <Field label="Email" value={site.email} onChange={(v) => setSite({ ...site, email: v })} />
          <Field label="Location" value={site.location} onChange={(v) => setSite({ ...site, location: v })} />
          <Field label="GitHub URL" value={site.social.github} onChange={(v) => setSite({ ...site, social: { ...site.social, github: v } })} />
          <Field label="LinkedIn URL" value={site.social.linkedin} onChange={(v) => setSite({ ...site, social: { ...site.social, linkedin: v } })} />
          <Field label="Twitter URL" value={site.social.twitter} onChange={(v) => setSite({ ...site, social: { ...site.social, twitter: v } })} />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-white px-3 py-1.5 text-sm font-medium text-black hover:opacity-90 disabled:opacity-50"
        >
          <Save size={14} /> {saving ? 'Saving…' : 'Save Settings'}
        </button>
      </div>

      {/* Resume Upload */}
      <div className="border-t border-neutral-800/50 pt-8">
        <h2 className="text-lg font-semibold mb-4">Update Resume (PDF)</h2>
        <div className="space-y-3 max-w-sm">
          <div>
            <label className="block text-xs text-neutral-500 mb-1">Select Resume PDF</label>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
              className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-neutral-400 outline-none file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:bg-neutral-800 file:text-white hover:file:bg-neutral-700"
            />
          </div>
        </div>
        {resumeMsg && <p className="text-sm text-neutral-400 mt-2">{resumeMsg}</p>}
        <button
          onClick={handleResumeUpload}
          disabled={!resumeFile || resumeLoading}
          className="mt-4 rounded-md border border-neutral-800 px-3 py-1.5 text-sm text-neutral-400 hover:text-white disabled:opacity-50"
        >
          {resumeLoading ? 'Uploading…' : 'Upload Resume'}
        </button>
      </div>

      {/* Password Change */}
      <div className="border-t border-neutral-800/50 pt-8">
        <h2 className="text-lg font-semibold mb-4">Change Password</h2>
        <div className="space-y-3 max-w-sm">
          <Field label="Current Password" value={pw.current} onChange={(v) => setPw({ ...pw, current: v })} type="password" />
          <Field label="New Password" value={pw.new} onChange={(v) => setPw({ ...pw, new: v })} type="password" />
          <Field label="Confirm New Password" value={pw.confirm} onChange={(v) => setPw({ ...pw, confirm: v })} type="password" />
        </div>
        {pwMsg && <p className="text-sm text-neutral-400 mt-2">{pwMsg}</p>}
        <button
          onClick={handlePasswordChange}
          disabled={pwLoading}
          className="mt-4 rounded-md border border-neutral-800 px-3 py-1.5 text-sm text-neutral-400 hover:text-white disabled:opacity-50"
        >
          {pwLoading ? 'Changing…' : 'Change Password'}
        </button>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label className="block text-xs text-neutral-500 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-white outline-none focus:border-neutral-600"
      />
    </div>
  );
}
