import { apiBase } from "./constants";
import { clearSession, getStoredTokens, setSession } from "./auth-storage";

export async function api(path, options = {}) {
  const { token, refreshToken } = getStoredTokens();
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;

  let response = await fetch(`${apiBase}${path}`, { ...options, headers });

  if (response.status === 401 && refreshToken && !options._retry) {
    const refreshResponse = await fetch(`${apiBase}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken })
    });

    if (refreshResponse.ok) {
      const payload = await refreshResponse.json();
      setSession({ token: payload.token });
      return api(path, { ...options, _retry: true });
    }

    clearSession();
  }

  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error || "Request failed");
  return payload;
}

export { apiBase };
