/**
 * src/api/analyticsApi.js
 * ------------------------
 * API helper functions for the Analytics page.
 *
 * Functions:
 *   getUserCycleLogs(userId)          → GET /cycles/logs/{user_id}
 *   getUserPredictionInsights(userId) → GET /predictions/insights/{user_id}
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
// Cycle Logs
// ---------------------------------------------------------------------------

/**
 * Fetch all cycle logs for a given user.
 *
 * @param {string} userId  — UUID of the authenticated user
 * @returns {Promise<{ logs: object[], total: number }>}
 * @throws {Error} with user-readable message on failure
 */
export const getUserCycleLogs = async (userId) => {
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

// ---------------------------------------------------------------------------
// Prediction Insights
// ---------------------------------------------------------------------------

/**
 * Fetch personalised prediction insights for a given user.
 *
 * @param {string} userId  — UUID of the authenticated user
 * @returns {Promise<{
 *   cycle_regularity: string,
 *   symptom_summary: string,
 *   wellness_insight: string,
 *   recommendation: string
 * }>}
 * @throws {Error} with user-readable message on failure
 */
export const getUserPredictionInsights = async (userId) => {
  const response = await fetch(`${BASE_URL}/predictions/insights/${userId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const message = await parseErrorDetail(response);
    throw new Error(message);
  }

  return response.json();
};
