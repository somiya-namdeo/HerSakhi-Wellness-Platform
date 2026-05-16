/**
 * src/api/predictionApi.js
 * ------------------------
 * API functions for ML predictions.
 *
 * Functions:
 *   getNextCyclePrediction(userId) → GET /predictions/next-cycle/{user_id}
 *   getOvulationPrediction(userId) → GET /predictions/ovulation/{user_id}
 *   getPredictionInsights(userId)  → GET /predictions/insights/{user_id}
 *   getFullPrediction(userId)      → GET /predictions/full/{user_id}
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
// Endpoints
// ---------------------------------------------------------------------------

export const getNextCyclePrediction = async (userId) => {
  const response = await fetch(`${BASE_URL}/predictions/next-cycle/${userId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const message = await parseErrorDetail(response);
    throw new Error(message);
  }

  return response.json();
};

export const getOvulationPrediction = async (userId) => {
  const response = await fetch(`${BASE_URL}/predictions/ovulation/${userId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const message = await parseErrorDetail(response);
    throw new Error(message);
  }

  return response.json();
};

export const getPredictionInsights = async (userId) => {
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

export const getFullPrediction = async (userId) => {
  const response = await fetch(`${BASE_URL}/predictions/full/${userId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const message = await parseErrorDetail(response);
    throw new Error(message);
  }

  return response.json();
};
