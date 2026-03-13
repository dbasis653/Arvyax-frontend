'use client';

import { useState } from 'react';
import { useUser } from '@/context/UserContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { ConflictError, NotFoundError } from '@/services/api';
import './LoginForm.css';

// Renders two clearly labelled forms side by side:
//   Register — creates a new account via POST /api/users
//   Login    — retrieves an existing account via POST /api/users/login
// Props:
//   onSuccess — called after the user is stored in context, used to trigger redirect
export function LoginForm({ onSuccess }) {
  const { login, register, isLoading } = useUser();

  const [registerUsername, setRegisterUsername] = useState('');
  const [loginUsername, setLoginUsername] = useState('');
  const [registerError, setRegisterError] = useState(null);
  const [loginError, setLoginError] = useState(null);

  // Submits the register form — calls POST /api/users
  async function handleRegister(e) {
    e.preventDefault();
    setRegisterError(null);
    const trimmed = registerUsername.trim();
    if (!trimmed) { setRegisterError('Please enter a username.'); return; }
    try {
      await register(trimmed);
      onSuccess?.();
    } catch (err) {
      if (err instanceof ConflictError) {
        setRegisterError('That username is already taken. Please choose a different one.');
      } else {
        setRegisterError(err.message);
      }
    }
  }

  // Submits the login form — calls POST /api/users/login
  async function handleLogin(e) {
    e.preventDefault();
    setLoginError(null);
    const trimmed = loginUsername.trim();
    if (!trimmed) { setLoginError('Please enter your username.'); return; }
    try {
      await login(trimmed);
      onSuccess?.();
    } catch (err) {
      if (err instanceof NotFoundError) {
        setLoginError('No account found with that username. Please register first.');
      } else {
        setLoginError(err.message);
      }
    }
  }

  return (
    <div className="auth-page">

      {/* ── Heading ── */}
      <div className="auth-page__header">
        <h1 className="auth-page__title">Arvyax</h1>
        <p className="auth-page__subtitle">Your AI-assisted nature journal</p>
      </div>

      <div className="auth-forms">

        {/* ── Register ── */}
        <div className="auth-card">
          <h2 className="auth-card__title">Register</h2>
          <p className="auth-card__desc">Create a new account with a unique username.</p>
          <form className="auth-form" onSubmit={handleRegister} noValidate>
            <Input
              label="Choose a username"
              placeholder="e.g. nature_walker"
              value={registerUsername}
              onChange={(e) => setRegisterUsername(e.target.value)}
              autoComplete="username"
            />
            <ErrorMessage message={registerError} />
            <Button type="submit" loading={isLoading} size="md">
              Create Account
            </Button>
          </form>
        </div>

        {/* ── Divider ── */}
        <div className="auth-divider">
          <span className="auth-divider__line" />
          <span className="auth-divider__text">or</span>
          <span className="auth-divider__line" />
        </div>

        {/* ── Login ── */}
        <div className="auth-card">
          <h2 className="auth-card__title">Login</h2>
          <p className="auth-card__desc">Already have an account? Enter your username.</p>
          <form className="auth-form" onSubmit={handleLogin} noValidate>
            <Input
              label="Your username"
              placeholder="e.g. nature_walker"
              value={loginUsername}
              onChange={(e) => setLoginUsername(e.target.value)}
              autoComplete="username"
            />
            <ErrorMessage message={loginError} />
            <Button type="submit" loading={isLoading} variant="secondary" size="md">
              Login
            </Button>
          </form>
        </div>

      </div>
    </div>
  );
}
