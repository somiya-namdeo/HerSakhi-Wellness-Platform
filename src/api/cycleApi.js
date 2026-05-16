/**
 * src/api/cycleApi.js
 * -------------------
 * API functions for the daily period tracker.
 *
 * Functions:
 *   saveCycleLog(logData)     → POST /cycles/log
 *   getCycleLogs(userId)      → GET  /cycles/logs/{user_id}
 */

import { BASE_URL } from "./api";

// ---------------------------------------------------------------------------
// Shared error parser
// ---------------------------------------------------------------------------

const parseErrorDetail = async (response) => {
  try {
    const body = await response.json();
    if (typeof body.detail === "string") return body.detail;
    if (Array.isArray(body.detail)) {
      return body.detail.map((e) => e.msg).join(", ");
    }
    return `Request failed (${response.status})`;
  } catch {
    return `Request failed (${response.status})`;
  }
};

// ---------------------------------------------------------------------------
// Save Log
// ---------------------------------------------------------------------------

/**
 * Save or update a daily cycle log.
 *
 * @param {{
 *   user_id: string,
 *   log_date: string,
 *   flow_intensity?: string,
 *   pain_level?: number,
 *   mood?: string,
 *   symptoms?: string[],
 *   notes?: string
 * }} logData
 *
 * @returns {Promise<object>} CycleLogResponse
 * @throws {Error} with user-readable message on failure
 */
export const saveCycleLog = async (logData) => {
  const response = await fetch(`${BASE_URL}/cycles/log`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(logData),
  });

  if (!response.ok) {
    const message = await parseErrorDetail(response);
    throw new Error(message);
  }

  return response.json();
};

// ---------------------------------------------------------------------------
// Get Logs
// ---------------------------------------------------------------------------

/**
 * Fetch all cycle logs for a given user.
 *
 * @param {string} userId
 * @returns {Promise<{ logs: object[], total: number }>}
 * @throws {Error} with user-readable message on failure
 */
export const getCycleLogs = async (userId) => {
  const response = await fetch(`${BASE_URL}/cycles/logs/${userId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const message = await parseErrorDetail(response);
    throw new Error(message);
  }

  return response.json();
};
