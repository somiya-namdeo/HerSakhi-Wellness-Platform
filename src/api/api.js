/**
 * src/api/api.js
 * ---------------
 * Central API configuration for the HerSakhi backend.
 *
 * All other API modules import BASE_URL from here so the
 * backend address only ever needs to change in one place.
 */

export const BASE_URL = "https://hersakhi-wellness-platform.onrender.com";

/** localStorage keys — use these everywhere instead of raw strings */
export const TOKEN_KEY = "hersakhi_token";
export const USER_KEY = "hersakhi_user";

// ---------------------------------------------------------------------------
// Token helpers — imported by pages / protected-route wrappers
// ---------------------------------------------------------------------------

/** Persist the JWT returned after login / register. */
export const saveToken = (token) => localStorage.setItem(TOKEN_KEY, token);

/** Persist the safe user object returned after login / register. */
export const saveUser = (user) => localStorage.setItem(USER_KEY, JSON.stringify(user));

/** Retrieve the stored JWT (or null). */
export const getToken = () => localStorage.getItem(TOKEN_KEY);

/** Retrieve the stored user object (or null). */
export const getUser = () => {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
};

/** Clear auth state (call on logout). */
export const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};
