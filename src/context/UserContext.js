'use client';

import { createContext, useContext, useReducer, useEffect } from 'react';
import { createUser, loginUser } from '@/services/user.service';

// ── State shape ──────────────────────────────────────────────────────────────
// { user: { id, username, createdAt } | null, isLoading: boolean, error: string | null }

const initialState = {
  user: null,
  isLoading: false,
  isInitializing: true,
  error: null,
};

// ── Reducer ──────────────────────────────────────────────────────────────────

// Manages auth state transitions for the UserContext.
// Handles RESTORE (session rehydration), AUTH_START/SUCCESS/ERROR (login/register flow), and LOGOUT.
// Returns a new state object for each action type; falls through to current state for unknown actions.
function userReducer(state, action) {
  switch (action.type) {
    case 'RESTORE':
      return { ...state, user: action.payload, isLoading: false, isInitializing: false };
    case 'AUTH_START':
      return { ...state, isLoading: true, error: null };
    case 'AUTH_SUCCESS':
      return { user: action.payload, isLoading: false, error: null };
    case 'AUTH_ERROR':
      return { ...state, isLoading: false, error: action.payload };
    case 'LOGOUT':
      return { user: null, isLoading: false, error: null };
    default:
      return state;
  }
}

// ── Context ──────────────────────────────────────────────────────────────────

const UserContext = createContext(null);

// ── Provider ─────────────────────────────────────────────────────────────────

// Wraps the app and makes the current user available everywhere via useUser().
// On mount it attempts to restore the user from sessionStorage so a page
// refresh does not log the user out.
export function UserProvider({ children }) {
  const [state, dispatch] = useReducer(userReducer, initialState);

  // Restore user from sessionStorage on first render.
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('arvyax_user');
      const user = stored ? JSON.parse(stored) : null;
      dispatch({ type: 'RESTORE', payload: user });
    } catch {
      dispatch({ type: 'RESTORE', payload: null });
    }
  }, []);

  // Registers a new user via POST /api/users.
  // Throws ConflictError (409) if the username is already taken.
  async function register(username) {
    dispatch({ type: 'AUTH_START' });
    try {
      const user = await createUser(username);
      sessionStorage.setItem('arvyax_user', JSON.stringify(user));
      dispatch({ type: 'AUTH_SUCCESS', payload: user });
      return user;
    } catch (err) {
      dispatch({ type: 'AUTH_ERROR', payload: err.message });
      throw err;
    }
  }

  // Logs in an existing user via POST /api/users/login.
  // Throws NotFoundError (404) if no account exists with that username.
  async function login(username) {
    dispatch({ type: 'AUTH_START' });
    try {
      const user = await loginUser(username);
      sessionStorage.setItem('arvyax_user', JSON.stringify(user));
      dispatch({ type: 'AUTH_SUCCESS', payload: user });
      return user;
    } catch (err) {
      dispatch({ type: 'AUTH_ERROR', payload: err.message });
      throw err;
    }
  }

  // Clears the user from state and sessionStorage.
  function logout() {
    sessionStorage.removeItem('arvyax_user');
    dispatch({ type: 'LOGOUT' });
  }

  return (
    <UserContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </UserContext.Provider>
  );
}

// ── Hook ─────────────────────────────────────────────────────────────────────

// Convenience hook — returns { user, isLoading, error, login, register, logout }.
// Must be used inside a component wrapped by UserProvider.
export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return ctx;
}
