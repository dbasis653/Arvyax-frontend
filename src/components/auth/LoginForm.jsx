"use client";

import { useState } from "react";
import { useUser } from "@/context/UserContext";
import { ConflictError, NotFoundError } from "@/services/api";

// Two-panel auth form: Register (left) + Login (right).
// Props:
//   onSuccess — called after user is stored in context, used to trigger redirect
export function LoginForm({ onSuccess }) {
  const { login, register, isLoading } = useUser();

  const [registerUsername, setRegisterUsername] = useState("");
  const [loginUsername, setLoginUsername] = useState("");
  const [registerError, setRegisterError] = useState(null);
  const [loginError, setLoginError] = useState(null);

  async function handleRegister(e) {
    e.preventDefault();
    setRegisterError(null);
    const trimmed = registerUsername.trim();
    if (!trimmed) {
      setRegisterError("Please enter a username.");
      return;
    }
    try {
      await register(trimmed);
      onSuccess?.();
    } catch (err) {
      setRegisterError(
        err instanceof ConflictError
          ? "That username is already taken. Please choose a different one."
          : err.message,
      );
    }
  }

  async function handleLogin(e) {
    e.preventDefault();
    setLoginError(null);
    const trimmed = loginUsername.trim();
    if (!trimmed) {
      setLoginError("Please enter your username.");
      return;
    }
    try {
      await login(trimmed);
      onSuccess?.();
    } catch (err) {
      setLoginError(
        err instanceof NotFoundError
          ? "No account found with that username. Please register first."
          : err.message,
      );
    }
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "40px",
        width: "100%",
        maxWidth: "720px",
      }}
    >
      {/* ── Hero ── */}
      <div className="login-hero">
        <h1 className="login-title">Arvyax</h1>
        <p className="login-subtitle">Your AI-assisted nature journal</p>
      </div>

      {/* ── Two-panel card ── */}
      <div className="login-card" style={{ display: "flex" }}>
        {/* ── Register panel ── */}
        <div
          style={{
            flex: 1,
            padding: "32px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <div>
            <h2
              style={{
                fontSize: "17px",
                fontWeight: 700,
                color: "var(--text-h)",
                margin: "0 0 6px",
              }}
            >
              Create account
            </h2>
            <p
              style={{
                fontSize: "13px",
                color: "var(--text)",
                lineHeight: 1.5,
                margin: 0,
              }}
            >
              Pick a unique username to get started.
            </p>
          </div>
          <form
            style={{ display: "flex", flexDirection: "column", gap: "14px" }}
            onSubmit={handleRegister}
            noValidate
          >
            <FieldGroup label="Choose a username">
              <input
                className={`field${registerError ? " error" : ""}`}
                placeholder="e.g. nature_walker"
                value={registerUsername}
                onChange={(e) => setRegisterUsername(e.target.value)}
                autoComplete="username"
              />
            </FieldGroup>
            {registerError && <InlineError message={registerError} />}
            <button
              className="btn btn-primary"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? <span className="spinner spinner-sm" /> : null}
              <span>Create Account</span>
            </button>
          </form>
        </div>

        {/* ── Divider ── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            padding: "32px 0",
            width: "40px",
            flexShrink: 0,
          }}
        >
          <span
            style={{ flex: 1, width: "1px", background: "var(--border)" }}
          />
          <span
            style={{
              fontSize: "10px",
              fontWeight: 700,
              color: "var(--text)",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            or
          </span>
          <span
            style={{ flex: 1, width: "1px", background: "var(--border)" }}
          />
        </div>

        {/* ── Login panel ── */}
        <div
          style={{
            flex: 1,
            padding: "32px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <div>
            <h2
              style={{
                fontSize: "17px",
                fontWeight: 700,
                color: "var(--text-h)",
                margin: "0 0 6px",
              }}
            >
              Welcome back
            </h2>
            <p
              style={{
                fontSize: "13px",
                color: "var(--text)",
                lineHeight: 1.5,
                margin: 0,
              }}
            >
              Already have an account? Enter your username.
            </p>
          </div>
          <form
            style={{ display: "flex", flexDirection: "column", gap: "14px" }}
            onSubmit={handleLogin}
            noValidate
          >
            <FieldGroup label="Your username">
              <input
                className={`field${loginError ? " error" : ""}`}
                placeholder="e.g. nature_walker"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                autoComplete="username"
              />
            </FieldGroup>
            {loginError && <InlineError message={loginError} />}
            <button
              className="btn btn-secondary"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? <span className="spinner spinner-sm" /> : null}
              <span>Sign In</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ── Local helpers (used only in this file) ──

function FieldGroup({ label, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <label
        style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-h)" }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

function InlineError({ message }) {
  return (
    <div className="error-block">
      <span className="error-icon">!</span>
      <p style={{ margin: 0, fontSize: "13px", lineHeight: 1.5 }}>{message}</p>
    </div>
  );
}
