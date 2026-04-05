// Backend URL
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://hirevia-mobileapp-2.onrender.com';

/**
 * Typed fetch wrapper that auto-injects the Bearer token from localStorage.
 * Use for all authenticated API calls in the web portal.
 */
export async function apiFetch<T = any>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  let token: string | null = null;
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('hirevia_token');
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || `Request failed: ${res.status}`);
  }

  return data;
}

function dispatchUserUpdated(user: any) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('user-updated', { detail: user }));
}

/** Save auth session to localStorage */
export function saveAuthSession(token: string, user: object) {
  localStorage.setItem('hirevia_token', token);
  localStorage.setItem('hirevia_user', JSON.stringify(user));
  localStorage.setItem('user', JSON.stringify(user));
  dispatchUserUpdated(user);
}

/** Update only the stored user object */
export function updateStoredUser(user: object) {
  localStorage.setItem('hirevia_user', JSON.stringify(user));
  localStorage.setItem('user', JSON.stringify(user));
  dispatchUserUpdated(user);
}

/** Read current user from localStorage */
export function getStoredUser(): any | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('hirevia_user') || localStorage.getItem('user');
  return raw ? JSON.parse(raw) : null;
}

/** Clear auth session */
export function clearAuthSession() {
  localStorage.removeItem('hirevia_token');
  localStorage.removeItem('hirevia_user');
  localStorage.removeItem('user');
}

/** Check if a valid token exists */
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('hirevia_token');
}
