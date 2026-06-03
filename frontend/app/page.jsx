"use client";

import { useEffect, useMemo, useState } from "react";
import { AuthModule } from "../modules/auth/AuthModule";
import { DashboardModule } from "../modules/dashboard/DashboardModule";
import { IntakeModule } from "../modules/profiles/IntakeModule";
import { ProfilesModule } from "../modules/profiles/ProfilesModule";
import { SearchModule } from "../modules/search/SearchModule";
import { ProposalsModule } from "../modules/proposals/ProposalsModule";
import { CrmModule } from "../modules/crm/CrmModule";
import { AdminModule } from "../modules/admin/AdminModule";
import { ReportsModule } from "../modules/reports/ReportsModule";
import { Sidebar, Topbar, viewTitle } from "../components/layout/AppShell";
import { useApp } from "../context/AppContext";
import { api, apiBase } from "../lib/api";
import { emptyProfile } from "../lib/constants";
import { normalizePayload, toDateInput } from "../lib/utils";

export default function Home() {
  const { view, setView, t, dir, isAuthenticated, authLoading, notice, setNotice, logout } = useApp();
  const [profiles, setProfiles] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [selected, setSelected] = useState(null);
  const [matches, setMatches] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [savedSearches, setSavedSearches] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [brokers, setBrokers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [report, setReport] = useState(null);
  const [filters, setFilters] = useState({ search: "", gender: "", status: "", leadStage: "" });
  const [form, setForm] = useState(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const query = useMemo(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    return params.toString();
  }, [filters]);

  async function loadData() {
    setLoading(true);
    try {
      const [
        profilePayload,
        dashboardPayload,
        proposalPayload,
        brokerPayload,
        planPayload,
        reportPayload,
        savedSearchPayload,
        appointmentPayload
      ] = await Promise.all([
        api(`/profiles?${query}`),
        api("/dashboard"),
        api("/proposals"),
        api("/brokers"),
        api("/subscription-plans"),
        api("/reports/broker"),
        api("/saved-searches"),
        api("/appointments")
      ]);

      setProfiles(profilePayload.profiles);
      setDashboard(dashboardPayload);
      setProposals(proposalPayload.proposals);
      setBrokers(brokerPayload.brokers);
      setPlans(planPayload.plans);
      setReport(reportPayload);
      setSavedSearches(savedSearchPayload.savedSearches);
      setAppointments(appointmentPayload.appointments);

      if (selected) {
        const updated = profilePayload.profiles.find((profile) => profile.id === selected.id);
        setSelected(updated || null);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!isAuthenticated) return;
    loadData().catch((error) => setNotice(error.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, query]);

  function startNewProfile() {
    setForm(emptyProfile);
    setView("intake");
  }

  function editProfile(profile) {
    setForm({
      ...emptyProfile,
      ...profile,
      followUpDate: toDateInput(profile.followUpDate)
    });
    setView("intake");
  }

  async function saveProfile(event) {
    event.preventDefault();
    setSaving(true);
    try {
      const id = form.id;
      const payload = normalizePayload(form);
      delete payload.id;
      const result = await api(id ? `/profiles/${id}` : "/profiles", {
        method: id ? "PUT" : "POST",
        body: JSON.stringify(payload)
      });
      setNotice(id ? "Profile updated" : "Profile created");
      setForm(emptyProfile);
      setView("profiles");
      await loadData();
      setSelected(result.profile);
      setMatches([]);
    } catch (error) {
      setNotice(error.message);
    } finally {
      setSaving(false);
    }
  }

  async function archiveProfile(profile) {
    const result = await api(`/profiles/${profile.id}`, {
      method: "PUT",
      body: JSON.stringify({ status: "Archived" })
    });
    setSelected(result.profile);
    setNotice("Profile archived");
    await loadData();
  }

  async function findProfileMatches(profile) {
    const payload = await api(`/matches/${profile.id}`);
    setMatches(payload.matches);
  }

  function exportProfiles() {
    window.location.href = `${apiBase}/profiles-export`;
  }

  function applySavedSearch(savedFilters) {
    setFilters({
      search: savedFilters?.search || "",
      gender: savedFilters?.gender || "",
      status: savedFilters?.status || "",
      leadStage: savedFilters?.leadStage || ""
    });
    setView("search");
  }

  const recentProfiles = profiles.slice(0, 6);
  const followUps = profiles
    .filter((profile) => profile.followUpDate)
    .sort((a, b) => String(a.followUpDate).localeCompare(String(b.followUpDate)))
    .slice(0, 6);

  if (authLoading) return null;
  if (!isAuthenticated) return <AuthModule />;

  const title = viewTitle(view, t);

  return (
    <main className="app-shell" dir={dir}>
      <Sidebar onNewProfile={startNewProfile} />

      <section className="workspace">
        <Topbar title={title} onExport={exportProfiles} onNewProfile={startNewProfile} onLogout={logout} />

        {notice ? (
          <div className="notice" onAnimationEnd={() => setNotice("")}>
            {notice}
          </div>
        ) : null}

        {view === "dashboard" ? (
          <DashboardModule
            t={t}
            dashboard={dashboard}
            loading={loading}
            profiles={recentProfiles}
            followUps={followUps}
            onRefresh={loadData}
          />
        ) : null}

        {view === "profiles" ? (
          <ProfilesModule
            t={t}
            filters={filters}
            setFilters={setFilters}
            profiles={profiles}
            selected={selected}
            matches={matches}
            onSelect={(profile) => {
              setSelected(profile);
              setMatches([]);
            }}
            onEdit={editProfile}
            onArchive={archiveProfile}
            onFindMatches={findProfileMatches}
            loading={loading}
          />
        ) : null}

        {view === "search" ? (
          <SearchModule
            t={t}
            filters={filters}
            setFilters={setFilters}
            profiles={profiles}
            savedSearches={savedSearches}
            onRefresh={loadData}
            onApplySavedSearch={applySavedSearch}
          />
        ) : null}

        {view === "proposals" ? (
          <ProposalsModule proposals={proposals} profiles={profiles} onRefresh={loadData} />
        ) : null}

        {view === "crm" ? (
          <CrmModule
            appointments={appointments}
            profiles={profiles}
            onRefresh={loadData}
          />
        ) : null}

        {view === "reports" ? <ReportsModule report={report} dashboard={dashboard} /> : null}

        {view === "admin" ? (
          <AdminModule brokers={brokers} plans={plans} onRefresh={loadData} />
        ) : null}

        {view === "intake" ? (
          <IntakeModule t={t} form={form} setForm={setForm} onSubmit={saveProfile} saving={saving} />
        ) : null}
      </section>
    </main>
  );
}
