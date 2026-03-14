"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@/context/UserContext";

// Top navigation bar — frosted glass effect, gradient brand, active nav links.
export function Navbar() {
  const { user, logout } = useUser();
  const pathname = usePathname();

  return (
    <nav className="navbar" style={{ display: "block" }}>
      <div
        style={{
          maxWidth: "1120px",
          margin: "0 auto",
          padding: "0 24px",
          height: "56px",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "24px",
        }}
      >
        {/* ── Brand ── */}
        <Link
          href="/journal"
          className="navbar-brand"
          style={{ textDecoration: "none" }}
        >
          Arvyax
        </Link>

        {/* ── Nav links ── */}
        <div style={{ display: "flex", gap: "4px", flex: 1 }}>
          <Link
            href="/journal"
            className={`nav-link${pathname === "/journal" ? " active" : ""}`}
          >
            Journal
          </Link>
        </div>

        {/* ── User + logout ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            flexShrink: 0,
          }}
        >
          <span
            style={{ fontSize: "13px", color: "var(--text)", fontWeight: 500 }}
          >
            @{user?.username}
          </span>
          <button className="btn btn-ghost btn-sm" onClick={logout}>
            Log out
          </button>
        </div>
      </div>
    </nav>
  );
}
