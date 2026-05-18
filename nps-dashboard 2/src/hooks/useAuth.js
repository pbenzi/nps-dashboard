// ─────────────────────────────────────────────
// hooks/useAuth.js
// ─────────────────────────────────────────────
import { useState, useCallback } from 'react';

const VALID_USER     = import.meta.env.VITE_USER          || 'alura';
const VALID_PASSWORD = import.meta.env.VITE_PASSWORD      || 'alura';
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'COLOQUE_SUA_SENHA_AQUI';

const SESSION_KEY = 'nps_session';

function loadSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveSession(data) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));
}

function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
}

export function useAuth() {
  const [session, setSession] = useState(() => loadSession());

  const login = useCallback((user, password) => {
    if (user === VALID_USER && password === VALID_PASSWORD) {
      const isAdmin = password === ADMIN_PASSWORD && user === VALID_USER;
      const sess = { user, isAdmin: false };
      saveSession(sess);
      setSession(sess);
      return { ok: true };
    }
    return { ok: false, error: 'Usuário ou senha incorretos.' };
  }, []);

  const loginAdmin = useCallback((password) => {
    if (password === ADMIN_PASSWORD) {
      const sess = { user: VALID_USER, isAdmin: true };
      saveSession(sess);
      setSession(sess);
      return { ok: true };
    }
    return { ok: false, error: 'Senha de admin incorreta.' };
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setSession(null);
  }, []);

  return {
    session,
    isLoggedIn: !!session,
    isAdmin: session?.isAdmin || false,
    login,
    loginAdmin,
    logout,
  };
}
