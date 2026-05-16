/**
 * src/api/userApi.js
 * -------------------
 * User profile and onboarding API functions.
 *
 * Functions:
 *   saveOnboardingData(data)  → POST /users/onboarding
 */

import { BASE_URL } from "./api";

// ---------------------------------------------------------------------------
// Shared error parser (mirrors authApi.js)
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
// Onboarding
// ---------------------------------------------------------------------------

/**
 * Save onboarding health data to the backend.
 *
 * Maps frontend formData fields → backend OnboardingRequest schema:
 *   user_id              ← user.id   (from localStorage hersakhi_user)
 *   age                  ← Number(formData.age)
 *   last_period_date     ← formData.lastPeriod   (YYYY-MM-DD string)
 *   average_cycle_length ← Number(formData.cycleLength)
 *   common_symptoms      ← formData.symptoms     (string[])
 *
 * @param {{
 *   user_id: string,
 *   age: number | null,
 *   last_period_date: string | null,
 *   average_cycle_length: number | null,
 *   common_symptoms: string[]
 * }} data
 *
 * @returns {Promise<{ message: string, data: object }>}
 * @throws {Error} with user-readable message on failure
 */
export const saveOnboardingData = async (data) => {
  const response = await fetch(`${BASE_URL}/users/onboarding`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const message = await parseErrorDetail(response);
    throw new Error(message);
  }

  return response.json();
};

// ---------------------------------------------------------------------------
// Profile
// ---------------------------------------------------------------------------

/**
 * Update user profile data.
 *
 * @param {string} userId
 * @param {{
 *   full_name: string,
 *   phone?: string,
 *   date_of_birth?: string
 * }} profileData
 *
 * @returns {Promise<object>} UserOut
 * @throws {Error} with user-readable message on failure
 */
export const updateUserProfile = async (userId, profileData) => {
  const response = await fetch(`${BASE_URL}/users/profile/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profileData),
  });

  if (!response.ok) {
    const message = await parseErrorDetail(response);
    throw new Error(message);
  }

  return response.json();
};

/**
 * Fetch dynamic usage statistics for a user.
 * @param {string} userId
 * @returns {Promise<object>} UserStatsResponse
 */
export const getUserStats = async (userId) => {
  const response = await fetch(`${BASE_URL}/users/stats/${userId}`);
  if (!response.ok) {
    const message = await parseErrorDetail(response);
    throw new Error(message);
  }
  return response.json();
};

/**
 * Fetch raw onboarding data row for health preference display.
 * @param {string} userId
 * @returns {Promise<object>} OnboardingData
 */
export const getOnboardingData = async (userId) => {
  const response = await fetch(`${BASE_URL}/users/onboarding/${userId}`);
  if (!response.ok) {
    const message = await parseErrorDetail(response);
    throw new Error(message);
  }
  return response.json();
};
