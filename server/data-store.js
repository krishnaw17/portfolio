import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'content.json');

// ── In-Memory Cache for warm invocations (Vercel Serverless) ─────────────────
let cachedData = null;
let cacheTimestamp = 0;
const CACHE_TTL_MS = 5 * 1000; // 5 seconds - short TTL so updates reflect quickly

// ── Ensure data directory exists (only for local dev) ────────────────────────
function ensureDataDir() {
  if (process.env.VERCEL) return;
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// ── Read all content ─────────────────────────────────────────────────────────

export function readContent() {
  const now = Date.now();
  // On Vercel: use cache with short TTL so writes are reflected quickly
  if (cachedData && (now - cacheTimestamp) < CACHE_TTL_MS) return cachedData;
  
  ensureDataDir();
  if (!fs.existsSync(DATA_FILE)) {
    return null;
  }
  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  cachedData = JSON.parse(raw);
  cacheTimestamp = now;
  return cachedData;
}

// ── Read all content from GitHub (async, for Vercel cold-starts) ─────────────

export async function readContentFromGitHub() {
  // If running locally, ALWAYS read from local disk
  if (!process.env.VERCEL) {
    return readContent();
  }

  const token = process.env.GITHUB_TOKEN;
  const repoFullName = process.env.GITHUB_REPO;
  const filePath = 'server/data/content.json';

  if (!token || !repoFullName) {
    return readContent();
  }

  const now = Date.now();
  if (cachedData && (now - cacheTimestamp) < CACHE_TTL_MS) return cachedData;

  try {
    const getUrl = `https://api.github.com/repos/${repoFullName}/contents/${filePath}`;
    const res = await fetch(getUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        'User-Agent': 'Portfolio-Admin-Dashboard',
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (!res.ok) {
      console.warn('[data-store] GitHub read failed, falling back to cache/local.');
      return cachedData ?? readContent();
    }

    const fileInfo = await res.json();
    const decoded = Buffer.from(fileInfo.content, 'base64').toString('utf-8');
    cachedData = JSON.parse(decoded);
    cacheTimestamp = Date.now();
    console.log('[data-store] ✅ Read content from GitHub.');
    return cachedData;
  } catch (err) {
    console.error('[data-store] readContentFromGitHub error:', err.message);
    return cachedData ?? readContent();
  }
}

// ── Write all content to GitHub API (Git as a DB) ────────────────────────────

export async function writeContent(data) {
  cachedData = data; // Cache instantly for fast subsequent reads
  cacheTimestamp = Date.now();

  // Always write to local disk first if not in Vercel or if local file exists
  if (!process.env.VERCEL) {
    ensureDataDir();
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    console.log('[data-store] 💾 Successfully saved content to local disk.');
  }

  const token = process.env.GITHUB_TOKEN;
  const repoFullName = process.env.GITHUB_REPO;
  const filePath = 'server/data/content.json'; 

  // If no GitHub credentials or not needed, return
  if (!token || !repoFullName) {
    return;
  }

  try {
    const getUrl = `https://api.github.com/repos/${repoFullName}/contents/${filePath}`;
    
    // 1. Get current SHA
    const getRes = await fetch(getUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        'User-Agent': 'Portfolio-Admin-Dashboard',
        Accept: 'application/vnd.github.v3+json'
      }
    });

    let sha;
    if (getRes.ok) {
      const fileInfo = await getRes.json();
      sha = fileInfo.sha;
    }

    // 2. Put new content
    const contentStr = JSON.stringify(data, null, 2);
    const base64Content = Buffer.from(contentStr).toString('base64');
    
    const putRes = await fetch(getUrl, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'User-Agent': 'Portfolio-Admin-Dashboard',
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: '🤖 Automated content update via Admin Dashboard',
        content: base64Content,
        sha: sha // required to update existing files
      })
    });

    if (!putRes.ok) {
      const err = await putRes.text();
      console.error('[data-store] GitHub API Error:', err);
    } else {
      console.log('[data-store] ✅ Successfully pushed update to GitHub.');
    }
  } catch (error) {
    console.error('[data-store] Failed to communicate with GitHub:', error.message);
  }
}

// ── Write Resume to GitHub API ───────────────────────────────────────────────

export async function writeResumeFile(base64Content) {
  const token = process.env.GITHUB_TOKEN;
  const repoFullName = process.env.GITHUB_REPO;
  const filePath = 'src/constants/KrishnaWadhwaResume.pdf'; 

  // If no GitHub credentials, fall back to local filesystem (for local dev)
  if (!token || !repoFullName) {
    console.log('[data-store] GITHUB_TOKEN not found. Writing resume to local disk.');
    const targetPath = path.join(__dirname, '../src/constants/KrishnaWadhwaResume.pdf');
    fs.writeFileSync(targetPath, Buffer.from(base64Content, 'base64'));
    return;
  }

  try {
    const getUrl = `https://api.github.com/repos/${repoFullName}/contents/${filePath}`;
    
    // 1. Get current SHA
    const getRes = await fetch(getUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        'User-Agent': 'Portfolio-Admin-Dashboard',
        Accept: 'application/vnd.github.v3+json'
      }
    });

    let sha;
    if (getRes.ok) {
      const fileInfo = await getRes.json();
      sha = fileInfo.sha;
    }

    // 2. Put new content
    const putRes = await fetch(getUrl, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'User-Agent': 'Portfolio-Admin-Dashboard',
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: '🤖 Automated resume update via Admin Dashboard',
        content: base64Content,
        sha: sha // required to update existing files
      })
    });

    if (!putRes.ok) {
      const err = await putRes.text();
      console.error('[data-store] GitHub API Error:', err);
      throw new Error('GitHub API Error');
    } else {
      console.log('[data-store] ✅ Successfully pushed resume update to GitHub.');
    }
  } catch (error) {
    console.error('[data-store] Failed to communicate with GitHub:', error.message);
    throw error;
  }
}

// ── Get a specific section ───────────────────────────────────────────────────

export function getSection(section) {
  const content = readContent();
  if (!content) return null;
  return content[section] ?? null;
}

// ── Update a specific section (replace entire array/object) ──────────────────

export async function updateSection(section, data) {
  const content = await readContentFromGitHub();
  if (!content) return null;
  content[section] = data;
  content._meta = { ...content._meta, updatedAt: new Date().toISOString() };
  await writeContent(content);
  return content[section];
}

// ── Add item to an array section ─────────────────────────────────────────────

export async function addItem(section, item) {
  const content = await readContentFromGitHub();
  if (!content || !Array.isArray(content[section])) return null;
  content[section].push(item);
  content._meta = { ...content._meta, updatedAt: new Date().toISOString() };
  await writeContent(content);
  return item;
}

// ── Update item in an array section by id ────────────────────────────────────

export async function updateItem(section, id, updates) {
  const content = await readContentFromGitHub();
  if (!content || !Array.isArray(content[section])) return null;
  const idx = content[section].findIndex((item) => item.id === id);
  if (idx === -1) return null;
  content[section][idx] = { ...content[section][idx], ...updates };
  content._meta = { ...content._meta, updatedAt: new Date().toISOString() };
  await writeContent(content);
  return content[section][idx];
}

// ── Delete item from an array section by id ──────────────────────────────────

export async function deleteItem(section, id) {
  const content = await readContentFromGitHub();
  if (!content || !Array.isArray(content[section])) return null;
  const idx = content[section].findIndex((item) => item.id === id);
  if (idx === -1) return null;
  const [removed] = content[section].splice(idx, 1);
  content._meta = { ...content._meta, updatedAt: new Date().toISOString() };
  await writeContent(content);
  return removed;
}

// ── Initialize with seed data if content.json doesn't exist ──────────────────

export async function initializeIfEmpty(seedData) {
  // On Vercel, skip local file check — GitHub is the source of truth
  if (process.env.VERCEL) {
    // Try reading from GitHub — if it exists and has data, skip init
    const existing = await readContentFromGitHub();
    if (existing) {
      console.log('[data-store] Content already exists in GitHub. Skipping init.');
      return false;
    }
    // Not found — push seed data to GitHub
    const data = {
      ...seedData,
      _meta: { createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    };
    await writeContent(data);
    console.log('[data-store] Initialized GitHub content with seed data.');
    return true;
  }

  // Local dev — use filesystem
  ensureDataDir();
  if (!fs.existsSync(DATA_FILE)) {
    const data = {
      ...seedData,
      _meta: { createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    };
    await writeContent(data);
    console.log('[data-store] Initialized content.json with seed data.');
    return true;
  }
  return false;
}
