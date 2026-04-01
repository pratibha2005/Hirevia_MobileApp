// Backend URL
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

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

/** Save auth session to localStorage */
export function saveAuthSession(token: string, user: object) {
  localStorage.setItem('hirevia_token', token);
  localStorage.setItem('hirevia_user', JSON.stringify(user));
}

/** Read current user from localStorage */
export function getStoredUser(): any | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('hirevia_user');
  return raw ? JSON.parse(raw) : null;
}

/** Clear auth session */
export function clearAuthSession() {
  localStorage.removeItem('hirevia_token');
  localStorage.removeItem('hirevia_user');
}

/** Check if a valid token exists */
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('hirevia_token');
}
