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
