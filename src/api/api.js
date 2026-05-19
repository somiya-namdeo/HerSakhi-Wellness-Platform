// Central API configuration for the HerSakhi backend
export const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://hersakhi-wellness-platform.onrender.com";

export const TOKEN_KEY = "hersakhi_token";
export const USER_KEY = "hersakhi_user";

// Auth state helper functions
export const saveToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const saveUser = (user) => localStorage.setItem(USER_KEY, JSON.stringify(user));
export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const getUser = () => {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
};

export const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};
