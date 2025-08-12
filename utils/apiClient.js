import Constants from "expo-constants";

// Base client wrapper to ease later backend integration
export const getApiBaseUrl = () => {
  const url = Constants.expoConfig?.extra?.apiBaseUrl;
  return url && url.trim() !== "" ? url : undefined; // undefined indicates mock/no backend
};

export const apiFetch = async (
  path,
  { method = "GET", headers, body, timeoutMs = 15000 } = {}
) => {
  const base = getApiBaseUrl();
  if (!base) {
    console.log("🔧 No API_BASE_URL configured, using mock response");
    // No backend configured yet; simulate a successful empty response
    return { ok: true, status: 200, json: async () => ({}) };
  }

  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);

  const url = `${base}${path}`;
  console.log(`🌐 ${method} ${url}`);

  if (body) {
    console.log("📤 Request body:", body);
  }

  try {
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json", ...(headers || {}) },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
    clearTimeout(t);

    console.log(`📡 Response: ${res.status} ${res.statusText}`);
    return res;
  } catch (err) {
    clearTimeout(t);
    console.error("🚨 Network error:", err.message);
    throw err;
  }
};
