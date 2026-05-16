/**
 * src/api/aiApi.js
 * -----------------
 * API functions for the HerSakhi AI Assistant.
 */

import { BASE_URL } from "./api";

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

/**
 * Send a message to the AI and receive a mock response + saved turn.
 * @param {string} userId
 * @param {string} userMessage
 * @returns {Promise<object>} ChatTurnResponse
 */
export const sendChatMessage = async (userId, userMessage) => {
  const response = await fetch(`${BASE_URL}/ai/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId, user_message: userMessage }),
  });

  if (!response.ok) {
    const message = await parseErrorDetail(response);
    throw new Error(message);
  }

  return response.json();
};

/**
 * Fetch historical messages for a user.
 * @param {string} userId
 * @returns {Promise<object[]>} ChatHistoryItem[]
 */
export const getChatHistory = async (userId) => {
  const response = await fetch(`${BASE_URL}/ai/history/${userId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const message = await parseErrorDetail(response);
    throw new Error(message);
  }

  return response.json();
};
