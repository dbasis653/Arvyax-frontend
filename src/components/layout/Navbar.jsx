'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { Button } from '@/components/ui/Button';
import './Navbar.css';

// Top navigation bar. Shows the app name, nav links, current username, and logout button.
// Active link is highlighted based on the current pathname.
export function Navbar() {
  const { user, logout } = useUser();
  const pathname = usePathname();

  return (
    <nav className="navbar">
      <div className="navbar__inner">

        {/* ── Brand ── */}
        <Link href="/journal" className="navbar__brand">
          Arvyax
        </Link>

        {/* ── Nav links ── */}
        <div className="navbar__links">
          <Link
            href="/journal"
            className={`navbar__link ${pathname === '/journal' ? 'navbar__link--active' : ''}`}
          >
            Journal
          </Link>
          <Link
            href="/insights"
            className={`navbar__link ${pathname === '/insights' ? 'navbar__link--active' : ''}`}
          >
            Insights
          </Link>
        </div>

        {/* ── User + logout ── */}
        <div className="navbar__user">
          <span className="navbar__username">@{user?.username}</span>
          <Button variant="ghost" size="sm" onClick={logout}>
            Log out
          </Button>
        </div>

      </div>
    </nav>
  );
}
