'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { Navbar } from '@/components/layout/Navbar';
import Spinner from '@/components/ui/Spinner';

// Auth guard for all /journal routes.
// Redirects unauthenticated users to / before rendering any child page.
export default function JournalLayout({ children }) {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/');
    }
  }, [user, isLoading]);

  // ── Restoring session ──
  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Spinner size="lg" />
      </div>
    );
  }

  // ── Not logged in — redirect in progress ──
  if (!user) return null;

  return (
    <>
      <Navbar />
      <div className="page-content">{children}</div>
    </>
  );
}
