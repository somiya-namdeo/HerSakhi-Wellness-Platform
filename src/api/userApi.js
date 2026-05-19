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

export const getUserStats = async (userId) => {
  const response = await fetch(`${BASE_URL}/users/stats/${userId}`);
  if (!response.ok) {
    const message = await parseErrorDetail(response);
    throw new Error(message);
  }
  return response.json();
};

export const getOnboardingData = async (userId) => {
  const response = await fetch(`${BASE_URL}/users/onboarding/${userId}`);
  if (!response.ok) {
    const message = await parseErrorDetail(response);
    throw new Error(message);
  }
  return response.json();
};
