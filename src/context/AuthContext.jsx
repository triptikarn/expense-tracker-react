import { createContext, useContext, useState } from 'react';
import { api, setToken } from '../api/client';

/**
 * Auth state for the whole app: the logged-in user plus login/logout
 * actions. Both the JWT and the user profile persist in localStorage
 * so a page refresh keeps the session (the token itself is validated
 * by the backend on every API call). The user object also carries the
 * account's currency, used to format every amount in the UI.
 */
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('expenses_user'));
    } catch {
      return null;
    }
  });

  function persist(data) {
    setToken(data.token);
    localStorage.setItem('expenses_user', JSON.stringify(data.user));
    setUser(data.user);
  }

  async function login(email, password) {
    persist(await api.login({ email, password }));
  }

  async function register(name, email, password, currency) {
    persist(await api.register({ name, email, password, currency }));
  }

  function logout() {
    setToken(null);
    localStorage.removeItem('expenses_user');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
