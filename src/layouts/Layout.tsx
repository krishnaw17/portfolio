import type { ReactNode } from 'react';
import { useLenis } from '@/hooks/useLenis';
import { Navbar } from '@/components/ui/Navbar';
import { Cursor } from '@/components/ui/Cursor';
import { ScrollProgress } from '@/components/ui/ScrollProgress';
import { CommandPalette } from '@/components/ui/CommandPalette';
import { CommandHint } from '@/components/ui/CommandHint';

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
      <main id="main" className="relative">
        {children}
      </main>
    </>
  );
}
