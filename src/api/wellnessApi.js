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

export const getTodayWellnessLog = async (userId) => {
  const response = await fetch(`${BASE_URL}/wellness/today/${userId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (response.status === 404) return null;

  if (!response.ok) {
    const message = await parseErrorDetail(response);
    throw new Error(message);
  }

  return response.json();
};
