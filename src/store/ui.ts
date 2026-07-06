import { create } from 'zustand';

interface UIState {
  loaded: boolean;
  cursorVariant: 'default' | 'hover' | 'text' | 'view';
  cursorText: string;
  setLoaded: (v: boolean) => void;
  setCursor: (variant: UIState['cursorVariant'], text?: string) => void;
}

export const useUI = create<UIState>((set) => ({
  loaded: false,
  cursorVariant: 'default',
  cursorText: '',
  setLoaded: (v) => set({ loaded: v }),
  setCursor: (variant, text = '') => set({ cursorVariant: variant, cursorText: text }),
}));
