"use client";

import { useState } from "react";
import { Building2, Loader2, ShieldCheck } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { Badge } from "../../components/ui/Badge";

export function AuthModule() {
  const { t, dir, login, register, setNotice } = useApp();
  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "broker@zawajlink.qa", password: "Broker@12345" });
  const [registerForm, setRegisterForm] = useState({
    businessName: "",
    contactName: "",
    email: "",
    phone: "",
    country: "Qatar",
    city: "Doha",
    password: ""
  });
  const [registrationResult, setRegistrationResult] = useState(null);

  async function handleLogin(event) {
    event.preventDefault();
    setLoading(true);
    try {
      await login(loginForm);
      setNotice("Signed in successfully");
    } catch (error) {
      setNotice(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(event) {
    event.preventDefault();
    setLoading(true);
    try {
      const payload = await register(registerForm);
      setRegistrationResult(payload);
      setMode("login");
      setLoginForm({ email: registerForm.email, password: registerForm.password });
      setNotice("Broker registered. Sign in after verification is approved.");
    } catch (error) {
      setNotice(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-shell" dir={dir}>
      <section className="auth-panel">
        <div className="brand auth-brand">
          <div className="brand-mark">ZL</div>
          <div>
            <strong>{t.brand}</strong>
            <span>{t.arabicBrand}</span>
          </div>
        </div>
        <p className="auth-tagline">{t.tagline}</p>

        <div className="auth-tabs">
          <button className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>
            {t.login}
          </button>
          <button className={mode === "register" ? "active" : ""} onClick={() => setMode("register")}>
            {t.register}
          </button>
        </div>

        {mode === "login" ? (
          <form className="auth-form" onSubmit={handleLogin}>
            <label>
              {t.email}
              <input
                type="email"
                value={loginForm.email}
                onChange={(event) => setLoginForm({ ...loginForm, email: event.target.value })}
                required
              />
            </label>
            <label>
              {t.password}
              <input
                type="password"
                value={loginForm.password}
                onChange={(event) => setLoginForm({ ...loginForm, password: event.target.value })}
                required
              />
            </label>
            <button className="primary-action auth-submit" disabled={loading}>
              {loading ? <Loader2 className="spin" size={17} /> : null}
              {t.login}
            </button>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleRegister}>
            <label>
              {t.businessName}
              <input
                value={registerForm.businessName}
                onChange={(event) => setRegisterForm({ ...registerForm, businessName: event.target.value })}
                required
              />
            </label>
            <label>
              {t.contactName}
              <input
                value={registerForm.contactName}
                onChange={(event) => setRegisterForm({ ...registerForm, contactName: event.target.value })}
                required
              />
            </label>
            <label>
              {t.email}
              <input
                type="email"
                value={registerForm.email}
                onChange={(event) => setRegisterForm({ ...registerForm, email: event.target.value })}
                required
              />
            </label>
            <label>
              {t.phone}
              <input
                value={registerForm.phone}
                onChange={(event) => setRegisterForm({ ...registerForm, phone: event.target.value })}
                required
              />
            </label>
            <label>
              {t.country}
              <input
                value={registerForm.country}
                onChange={(event) => setRegisterForm({ ...registerForm, country: event.target.value })}
              />
            </label>
            <label>
              {t.city}
              <input
                value={registerForm.city}
                onChange={(event) => setRegisterForm({ ...registerForm, city: event.target.value })}
              />
            </label>
            <label>
              {t.password}
              <input
                type="password"
                value={registerForm.password}
                onChange={(event) => setRegisterForm({ ...registerForm, password: event.target.value })}
                required
              />
            </label>
            <button className="primary-action auth-submit" disabled={loading}>
              {loading ? <Loader2 className="spin" size={17} /> : null}
              {t.register}
            </button>
          </form>
        )}

        {registrationResult ? (
          <div className="verification-banner">
            <ShieldCheck size={18} />
            <div>
              <strong>{t.verificationPending}</strong>
              <span>
                {registrationResult.broker?.businessName} · <Badge value={registrationResult.broker?.verificationStatus} />
              </span>
            </div>
          </div>
        ) : null}

        <div className="auth-footnote">
          <Building2 size={16} />
          <span>Demo broker: broker@zawajlink.qa / Broker@12345</span>
        </div>
      </section>
    </main>
  );
}
