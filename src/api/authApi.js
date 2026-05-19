import { BASE_URL } from "./api";

// Parses FastAPI validation or database errors into a readable string
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

export const changePassword = async (payload) => {
  const response = await fetch(`${BASE_URL}/auth/change-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const message = await parseErrorDetail(response);
    throw new Error(message);
  }

  return response.json();
};

export const deleteAccount = async (payload) => {
  const response = await fetch(`${BASE_URL}/auth/delete-account`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const message = await parseErrorDetail(response);
    throw new Error(message);
  }

  return response.json();
};
