import { useAuth } from '@/store/auth';

const API_BASE = '/api';

interface FetchOptions extends RequestInit {
  auth?: boolean;
}

export async function apiFetch<T = unknown>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { auth = false, headers: customHeaders, ...rest } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(customHeaders as Record<string, string>),
  };

  if (auth) {
    const token = useAuth.getState().token;
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers,
    ...rest,
  });

  // Auto-logout on 401
  if (res.status === 401 && auth) {
    useAuth.getState().logout();
    window.location.href = '/admin/login';
    throw new Error('Session expired. Please log in again.');
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(body.message || `HTTP ${res.status}`);
  }

  return res.json();
}

// Convenience wrappers
export const api = {
  get: <T = unknown>(endpoint: string, auth = false) =>
    apiFetch<T>(endpoint, { method: 'GET', auth }),

  post: <T = unknown>(endpoint: string, data: unknown, auth = false) =>
    apiFetch<T>(endpoint, { method: 'POST', body: JSON.stringify(data), auth }),

  put: <T = unknown>(endpoint: string, data: unknown, auth = false) =>
    apiFetch<T>(endpoint, { method: 'PUT', body: JSON.stringify(data), auth }),

  delete: <T = unknown>(endpoint: string, auth = false) =>
    apiFetch<T>(endpoint, { method: 'DELETE', auth }),
};
