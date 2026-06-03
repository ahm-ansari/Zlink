"use client";

import {
  BarChart3,
  ClipboardList,
  HeartHandshake,
  LayoutDashboard,
  Plus,
  Search,
  Settings,
  UsersRound
} from "lucide-react";
import { useApp } from "../../context/AppContext";

const navItems = [
  { id: "dashboard", icon: LayoutDashboard, labelKey: "dashboard" },
  { id: "profiles", icon: UsersRound, labelKey: "profiles" },
  { id: "search", icon: Search, labelKey: "search" },
  { id: "proposals", icon: HeartHandshake, labelKey: "proposals" },
  { id: "crm", icon: ClipboardList, labelKey: "crm" },
  { id: "reports", icon: BarChart3, labelKey: "reports" },
  { id: "admin", icon: Settings, labelKey: "admin" }
];

export function Sidebar({ onNewProfile }) {
  const { view, setView, t } = useApp();

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">ZL</div>
        <div>
          <strong>{t.brand}</strong>
          <span>{t.arabicBrand}</span>
        </div>
      </div>
      <p className="sidebar-tagline">{t.tagline}</p>

      <nav className="nav">
        {navItems.map(({ id, icon: Icon, labelKey }) => (
          <button
            key={id}
            className={view === id ? "active" : ""}
            onClick={() => setView(id)}
          >
            <Icon size={18} /> {t[labelKey]}
          </button>
        ))}
        <button className={view === "intake" ? "active" : ""} onClick={onNewProfile}>
          <Plus size={18} /> {t.newProfile}
        </button>
      </nav>
    </aside>
  );
}

export function Topbar({ title, onExport, onNewProfile, onLogout }) {
  const { lang, setLang, t, user } = useApp();

  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">{t.workspace}</p>
        <h1>{title}</h1>
        {user ? <p className="user-chip">{user.name} · {user.role}</p> : null}
      </div>
      <div className="topbar-actions">
        <button className="secondary-action" onClick={onExport}>
          CSV
        </button>
        <button className="secondary-action" onClick={() => setLang(lang === "en" ? "ar" : "en")}>
          {lang === "en" ? "العربية" : "English"}
        </button>
        <button className="secondary-action" onClick={onLogout}>
          {t.logout}
        </button>
        <button className="primary-action" onClick={onNewProfile}>
          <Plus size={17} /> {t.addProfile}
        </button>
      </div>
    </header>
  );
}

export function viewTitle(view, t) {
  const titles = {
    dashboard: t.dashboard,
    profiles: t.profiles,
    search: t.search,
    proposals: t.proposals,
    crm: t.crm,
    admin: t.admin,
    intake: t.intake
  };
  return titles[view] || t.dashboard;
}
