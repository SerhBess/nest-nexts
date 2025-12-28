'use client';

import { useAuth } from '@/hooks/useAuth/useAuth';
import Sidebar from '@app/(main)/components/sidebar/sidebar';
import type { ReactNode } from 'react';

interface ClientLayoutProps {
  children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  useAuth();
  return (
    <>
      <Sidebar />
      <div className="flex-1 min-h-0">{children}</div>
    </>
  );
}
