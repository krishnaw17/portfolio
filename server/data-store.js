import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'content.json');

// ── In-Memory Cache for warm invocations (Vercel Serverless) ─────────────────
let cachedData = null;

// ── Ensure data directory exists (only for local dev) ────────────────────────
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// ── Read all content ─────────────────────────────────────────────────────────

export function readContent() {
  if (cachedData) return cachedData;
  
  ensureDataDir();
  if (!fs.existsSync(DATA_FILE)) {
    return null;
  }
  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  cachedData = JSON.parse(raw);
  return cachedData;
}

// ── Write all content to GitHub API (Git as a DB) ────────────────────────────

export async function writeContent(data) {
  cachedData = data; // Cache instantly for fast subsequent reads

  const token = process.env.GITHUB_TOKEN;
  const repoFullName = process.env.GITHUB_REPO;
  const filePath = 'server/data/content.json'; 

  // If no GitHub credentials, fall back to local filesystem (for local dev)
  if (!token || !repoFullName) {
    console.log('[data-store] GITHUB_TOKEN not found. Writing to local disk.');
    ensureDataDir();
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
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

// ── Get a specific section ───────────────────────────────────────────────────

export function getSection(section) {
  const content = readContent();
  if (!content) return null;
  return content[section] ?? null;
}

// ── Update a specific section (replace entire array/object) ──────────────────

export async function updateSection(section, data) {
  const content = readContent();
  if (!content) return null;
  content[section] = data;
  content._meta = { ...content._meta, updatedAt: new Date().toISOString() };
  await writeContent(content);
  return content[section];
}

// ── Add item to an array section ─────────────────────────────────────────────

export async function addItem(section, item) {
  const content = readContent();
  if (!content || !Array.isArray(content[section])) return null;
  content[section].push(item);
  content._meta = { ...content._meta, updatedAt: new Date().toISOString() };
  await writeContent(content);
  return item;
}

// ── Update item in an array section by id ────────────────────────────────────

export async function updateItem(section, id, updates) {
  const content = readContent();
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
  const content = readContent();
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
