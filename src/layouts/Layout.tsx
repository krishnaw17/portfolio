import type { ReactNode } from 'react';
import { useLenis } from '@/hooks/useLenis';
import { Navbar } from '@/components/ui/Navbar';
import { Cursor } from '@/components/ui/Cursor';
import { ScrollProgress } from '@/components/ui/ScrollProgress';
import { CommandPalette } from '@/components/ui/CommandPalette';
import { CommandHint } from '@/components/ui/CommandHint';
import { StarfieldCanvas } from '@/components/three/Starfield';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  useLenis();
  return (
    <>
      <ScrollProgress />
      <Cursor />
      <Navbar />
      <CommandPalette />
      <CommandHint />
      
      {/* Global Backgrounds */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-40">
        <StarfieldCanvas />
      </div>
      <div className="pointer-events-none fixed inset-0 z-0 grid-bg opacity-[0.18] animate-grid" />
      <div className="pointer-events-none fixed inset-0 z-0 bg-radial-fade opacity-40" />
      <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(180deg,rgba(5,5,5,0.36)_0%,rgba(5,5,5,0.18)_30%,rgba(5,5,5,0.62)_100%)]" />

      <main id="main" className="relative z-10 noise-overlay">
        {children}
      </main>
    </>
  );
}
