/**
 * Thin fetch wrapper around the Expense Tracker REST API.
 *
 * - Base URL comes from VITE_API_URL (see .env.example), defaulting to
 *   the backend's usual http://localhost:5001.
 * - The JWT is read from localStorage on every request and sent as
 *   `Authorization: Bearer <token>`, exactly as the backend expects.
 * - Non-2xx responses are turned into thrown Errors carrying the
 *   server's `{ error: "..." }` message so pages can display them.
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export function getToken() {
  return localStorage.getItem('expenses_token');
}

export function setToken(token) {
  if (token) localStorage.setItem('expenses_token', token);
  else localStorage.removeItem('expenses_token');
}

async function request(path, { method = 'GET', body } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (res.status === 204) return null; // e.g. DELETE success

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data;
}

function query(params) {
  const qs = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v)
  ).toString();
  return qs ? `?${qs}` : '';
}

// ---- Auth + entries + reports ----------------------------------------
export const api = {
  register: (payload) => request('/api/auth/register', { method: 'POST', body: payload }),
  login: (payload) => request('/api/auth/login', { method: 'POST', body: payload }),

  listExpenses: (params = {}) => request(`/api/expenses${query(params)}`),
  createExpense: (payload) => request('/api/expenses', { method: 'POST', body: payload }),
  updateExpense: (id, payload) =>
    request(`/api/expenses/${id}`, { method: 'PATCH', body: payload }),
  deleteExpense: (id) => request(`/api/expenses/${id}`, { method: 'DELETE' }),

  getSummary: (month) => request(`/api/expenses/summary${query({ month })}`),
  getMonthly: () => request('/api/expenses/monthly'),
};
