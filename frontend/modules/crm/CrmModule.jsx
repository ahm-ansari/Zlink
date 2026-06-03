"use client";

import { useMemo, useState } from "react";
import { CalendarClock, Plus } from "lucide-react";
import { api } from "../../lib/api";
import { Badge } from "../../components/ui/Badge";
import { EmptyState } from "../../components/ui/EmptyState";

export function CrmModule({ appointments, profiles, onRefresh }) {
  const [draft, setDraft] = useState({
    title: "",
    profileId: "",
    scheduledAt: "",
    location: "",
    status: "Scheduled",
    notes: ""
  });

  const profileOptions = useMemo(
    () => profiles.filter((profile) => profile.status !== "Archived"),
    [profiles]
  );

  async function createAppointment(event) {
    event.preventDefault();
    await api("/appointments", {
      method: "POST",
      body: JSON.stringify({
        ...draft,
        scheduledAt: draft.scheduledAt ? new Date(draft.scheduledAt).toISOString() : undefined
      })
    });
    setDraft({ title: "", profileId: "", scheduledAt: "", location: "", status: "Scheduled", notes: "" });
    await onRefresh();
  }

  async function updateAppointment(appointment, updates) {
    await api(`/appointments/${appointment.id}`, {
      method: "PUT",
      body: JSON.stringify({ ...appointment, ...updates })
    });
    await onRefresh();
  }

  return (
    <section className="module-grid crm-grid">
      <form className="panel module-form" onSubmit={createAppointment}>
        <div className="panel-header">
          <h2>Create appointment</h2>
          <CalendarClock size={20} />
        </div>
        <div className="form-grid compact">
          <label>
            Title
            <input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} required />
          </label>
          <label>
            Client profile
            <select
              value={draft.profileId}
              onChange={(event) => setDraft({ ...draft, profileId: event.target.value })}
              required
            >
              <option value="">Select profile</option>
              {profileOptions.map((profile) => (
                <option key={profile.id} value={profile.id}>
                  {profile.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Scheduled at
            <input
              type="datetime-local"
              value={draft.scheduledAt}
              onChange={(event) => setDraft({ ...draft, scheduledAt: event.target.value })}
              required
            />
          </label>
          <label>
            Location
            <input value={draft.location} onChange={(event) => setDraft({ ...draft, location: event.target.value })} />
          </label>
          <label>
            Status
            <select value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value })}>
              <option>Scheduled</option>
              <option>Completed</option>
              <option>Cancelled</option>
              <option>Rescheduled</option>
            </select>
          </label>
          <label className="wide">
            Notes
            <textarea rows="3" value={draft.notes} onChange={(event) => setDraft({ ...draft, notes: event.target.value })} />
          </label>
        </div>
        <div className="form-actions">
          <button className="primary-action">
            <Plus size={17} /> Add appointment
          </button>
        </div>
      </form>

      <div className="panel">
        <div className="panel-header">
          <h2>Appointments</h2>
        </div>
        <div className="stack-list">
          {appointments.map((appointment) => {
            const profile = profiles.find((p) => p.id === appointment.profileId);
            return (
              <article key={appointment.id} className="list-item proposal-card">
                <strong>{appointment.title}</strong>
                <span>
                  {profile?.name || "Profile"} · {new Date(appointment.scheduledAt).toLocaleString()}
                </span>
                <span className="muted">{appointment.location || "Location pending"}</span>
                <div className="detail-actions">
                  <Badge value={appointment.status} />
                  <button
                    className="secondary-action"
                    type="button"
                    onClick={() => updateAppointment(appointment, { status: "Completed" })}
                  >
                    Mark completed
                  </button>
                  <button
                    className="secondary-action"
                    type="button"
                    onClick={() => updateAppointment(appointment, { status: "Cancelled" })}
                  >
                    Cancel
                  </button>
                </div>
              </article>
            );
          })}
          {!appointments.length ? (
            <EmptyState title="No appointments" text="Schedule follow-ups and meetings from the CRM." />
          ) : null}
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <h2>Pipeline guidance</h2>
        </div>
        <div className="stack-list">
          <article className="list-item">
            <strong>New → Contacted → Meeting → Proposal → Outcome</strong>
            <span className="muted">Use appointments for reminders, venue notes, and family coordination.</span>
          </article>
        </div>
      </div>
    </section>
  );
}

