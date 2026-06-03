"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";
import { clearSession, getStoredUser, setSession } from "../lib/auth-storage";
import { copy } from "../lib/copy";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [lang, setLang] = useState("en");
  const [view, setView] = useState("dashboard");
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [notice, setNotice] = useState("");

  const t = copy[lang];
  const dir = lang === "ar" ? "rtl" : "ltr";

  const bootstrapAuth = useCallback(async () => {
    const storedUser = getStoredUser();
    if (!storedUser) {
      setUser(null);
      setAuthLoading(false);
      return;
    }

    try {
      const payload = await api("/auth/me");
      setUser(payload.user);
    } catch {
      clearSession();
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  }, []);

  useEffect(() => {
    bootstrapAuth();
  }, [bootstrapAuth]);

  const login = useCallback(async (credentials) => {
    const payload = await api("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials)
    });
    setSession(payload);
    setUser(payload.user);
    return payload;
  }, []);

  const register = useCallback(async (form) => {
    const payload = await api("/auth/register-broker", {
      method: "POST",
      body: JSON.stringify(form)
    });
    return payload;
  }, []);

  const logout = useCallback(async () => {
    try {
      await api("/auth/logout", { method: "POST", body: JSON.stringify({}) });
    } catch {
      // Clear local session even if logout request fails.
    }
    clearSession();
    setUser(null);
    setView("dashboard");
  }, []);

  const value = useMemo(
    () => ({
      lang,
      setLang,
      view,
      setView,
      user,
      setUser,
      authLoading,
      notice,
      setNotice,
      t,
      dir,
      login,
      register,
      logout,
      isAuthenticated: Boolean(user)
    }),
    [lang, view, user, authLoading, notice, t, dir, login, register, logout]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
}
