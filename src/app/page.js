'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { LoginForm } from '@/components/auth/LoginForm';
import Spinner from '@/components/ui/Spinner';
import './page.css';

export default function HomePage() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  // If already logged in (e.g. sessionStorage restored on refresh), skip auth screen
  useEffect(() => {
    if (!isLoading && user) {
      router.replace('/journal');
    }
  }, [user, isLoading]);

  // ── Restoring user from sessionStorage ──
  if (isLoading) {
    return (
      <div className="home-loading">
        <Spinner size="lg" />
      </div>
    );
  }

  // ── Already logged in — redirect in progress ──
  if (user) return null;

  // ── Not logged in — show auth screen ──
  return (
    <main className="home-auth page-content">
      <LoginForm onSuccess={() => router.push('/journal')} />
    </main>
  );
}
