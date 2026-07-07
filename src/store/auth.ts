import { create } from 'zustand';

interface User {
  email: string;
  role: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  checkAuth: () => boolean;
}

export const useAuth = create<AuthState>((set, get) => ({
  token: localStorage.getItem('admin_token'),
  user: (() => {
    try {
      const u = localStorage.getItem('admin_user');
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  })(),
  isAuthenticated: !!localStorage.getItem('admin_token'),

  login: (token, user) => {
    localStorage.setItem('admin_token', token);
    localStorage.setItem('admin_user', JSON.stringify(user));
    set({ token, user, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    set({ token: null, user: null, isAuthenticated: false });
  },

  checkAuth: () => {
    const token = get().token;
    if (!token) return false;

    // Decode JWT to check expiry (without verification — server does that)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.exp * 1000 < Date.now()) {
        get().logout();
        return false;
      }
      return true;
    } catch {
      get().logout();
      return false;
    }
  },
}));
