/**
 * src/api/wellnessApi.js
 * ----------------------
 * API functions for the daily wellness tracker.
 *
 * Functions:
 *   saveWellnessLog(logData)     → POST /wellness/log
 *   getWellnessLogs(userId)      → GET  /wellness/logs/{user_id}
 *   getTodayWellnessLog(userId)  → GET  /wellness/today/{user_id}
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
 * Save or update a daily wellness log.
 *
 * @param {{
 *   user_id: string,
 *   log_date: string,
 *   hydration: number,
 *   sleep_hours: number,
 *   energy_level: number,
 *   stress_level: number,
 *   activity_count: number
 * }} logData
 *
 * @returns {Promise<object>} WellnessLogResponse
 */
export const saveWellnessLog = async (logData) => {
  const response = await fetch(`${BASE_URL}/wellness/log`, {
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
// Get All Logs
// ---------------------------------------------------------------------------

/**
 * Fetch all wellness logs for a given user.
 *
 * @param {string} userId
 * @returns {Promise<{ logs: object[], total: number }>}
 */
export const getWellnessLogs = async (userId) => {
  const response = await fetch(`${BASE_URL}/wellness/logs/${userId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const message = await parseErrorDetail(response);
    throw new Error(message);
  }

  return response.json();
};

// ---------------------------------------------------------------------------
// Get Today's Log
// ---------------------------------------------------------------------------

/**
 * Fetch today's wellness log for a given user.
 *
 * @param {string} userId
 * @returns {Promise<object>} WellnessLogResponse
 */
export const getTodayWellnessLog = async (userId) => {
  const response = await fetch(`${BASE_URL}/wellness/today/${userId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (response.status === 404) return null; // Graceful handle for "no log yet"

  if (!response.ok) {
    const message = await parseErrorDetail(response);
    throw new Error(message);
  }

  return response.json();
};
