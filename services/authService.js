import { apiFetch } from "../utils/apiClient";

// Stubbed service. All functions hit apiClient which returns mock responses until API_BASE_URL is configured.

export const requestPasswordReset = async (email) => {
  try {
    console.log("🔄 Requesting password reset for:", email);
    const res = await apiFetch("/auth/forgot-password", {
      method: "POST",
      body: { email },
    });
    console.log("📡 Password reset response status:", res.status);
    return safeJson(res);
  } catch (error) {
    console.error("❌ Password reset request failed:", error);
    return { success: false, error: error.message };
  }
};

export const verifyResetCode = async ({ email, code }) => {
  const res = await apiFetch("/auth/verify-code", {
    method: "POST",
    body: { email, code },
  });
  return safeJson(res);
};

export const resetPassword = async ({ email, code, newPassword }) => {
  const res = await apiFetch("/auth/reset-password", {
    method: "POST",
    body: { email, code, newPassword },
  });
  return safeJson(res);
};

export const login = async ({ email, password }) => {
  try {
    console.log("🔄 Attempting login for:", email);
    const res = await apiFetch("/auth/login", {
      method: "POST",
      body: { email, password },
    });
    console.log("📡 Login response status:", res.status);
    return safeJson(res);
  } catch (error) {
    console.error("❌ Login request failed:", error);
    return { success: false, error: error.message };
  }
};

async function safeJson(res) {
  try {
    const data = await res.json();
    console.log("📋 Response data:", data);
    return { success: res.ok, status: res.status, data };
  } catch (e) {
    console.warn("⚠️ Failed to parse response JSON:", e.message);
    return {
      success: res.ok,
      status: res.status,
      error: "Invalid JSON response",
    };
  }
}
