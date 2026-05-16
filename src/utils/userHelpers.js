/**
 * src/utils/userHelpers.js
 * ------------------------
 * Utility functions for user session management and display.
 */

import { USER_KEY, TOKEN_KEY } from "../api/api";

/**
 * Retrieve the logged-in user from localStorage.
 * @returns {object|null} The user object or null if not logged in.
 */
export const getStoredUser = () => {
  try {
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error("Error parsing user from localStorage", error);
    return null;
  }
};

/**
 * Generate initials dynamically from a full name.
 * Example: "Somiya Namdeo" → "SN", "Priya" → "P"
 * @param {string} fullName
 * @returns {string} Initials (1-2 characters)
 */
export const getUserInitials = (fullName) => {
  if (!fullName) return "U";
  
  const names = fullName.trim().split(" ");
  if (names.length >= 2) {
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  } else if (names.length === 1 && names[0].length > 0) {
    return names[0].substring(0, 2).toUpperCase();
  }
  return "U";
};

/**
 * Log out the user by clearing local storage and redirecting.
 */
export const logoutUser = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  window.location.href = "/";
};
