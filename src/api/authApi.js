/**
 * src/api/authApi.js
 * -------------------
 * Authentication API functions for HerSakhi.
 *
 * All functions throw a plain Error with a user-readable message on failure,
 * so callers just need a single try/catch — no status-code inspection needed.
 *
 * Functions:
 *   registerUser(userData)       → POST /auth/register
 *   loginUser(credentials)       → POST /auth/login
 *   getCurrentUser(token)        → GET  /auth/me
 */

import { BASE_URL } from "./api";

// ---------------------------------------------------------------------------
// Shared helper
// ---------------------------------------------------------------------------

/**
 * Parse a FastAPI error response into a human-readable string.
 * FastAPI returns { detail: string | [{msg, loc, ...}] } on errors.
 */
const parseErrorDetail = async (response) => {
  try {
    const body = await response.json();
    if (typeof body.detail === "string") return body.detail;
    if (Array.isArray(body.detail)) {
      // Pydantic validation errors — surface the first message
      return body.detail.map((e) => e.msg).join(", ");
    }
    return `Request failed (${response.status})`;
  } catch {
    return `Request failed (${response.status})`;
  }
};

// ---------------------------------------------------------------------------
// Register
// ---------------------------------------------------------------------------

/**
 * Register a new HerSakhi user.
 *
 * @param {{ full_name: string, email: string, password: string }} userData
 * @returns {Promise<{ access_token: string, token_type: string, user: object }>}
 * @throws {Error} with user-readable message
 */
export const registerUser = async (userData) => {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const message = await parseErrorDetail(response);
    throw new Error(message);
  }

  return response.json();
};

// ---------------------------------------------------------------------------
// Login
// ---------------------------------------------------------------------------

/**
 * Authenticate an existing user.
 *
 * @param {{ email: string, password: string }} credentials
 * @returns {Promise<{ access_token: string, token_type: string, user: object }>}
 * @throws {Error} with user-readable message
 */
export const loginUser = async (credentials) => {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const message = await parseErrorDetail(response);
    throw new Error(message);
  }

  return response.json();
};

// ---------------------------------------------------------------------------
// Get current user (protected)
// ---------------------------------------------------------------------------

/**
 * Fetch the profile of the currently authenticated user.
 *
 * @param {string} token  — JWT stored in localStorage
 * @returns {Promise<object>}  UserOut schema
 * @throws {Error} with user-readable message
 */
export const getCurrentUser = async (token) => {
  const response = await fetch(`${BASE_URL}/auth/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const message = await parseErrorDetail(response);
    throw new Error(message);
  }

  return response.json();
};
