"use client";

import { useState } from "react";
import { BookmarkPlus, HeartHandshake, Search } from "lucide-react";
import { api } from "../../lib/api";
import { Badge } from "../../components/ui/Badge";
import { EmptyState } from "../../components/ui/EmptyState";

export function SearchModule({ t, filters, setFilters, profiles, savedSearches, onRefresh, onApplySavedSearch }) {
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [matches, setMatches] = useState([]);
  const [draftSearch, setDraftSearch] = useState({ name: "", alertEnabled: true, alertChannel: "In-App" });

  async function findMatches(profile) {
    setSelectedProfile(profile);
    const payload = await api(`/matches/${profile.id}`);
    setMatches(payload.matches);
  }

  async function saveCurrentSearch(event) {
    event.preventDefault();
    await api("/saved-searches", {
      method: "POST",
      body: JSON.stringify({
        name: draftSearch.name,
        filters: {
          search: filters.search || undefined,
          gender: filters.gender || undefined,
          status: filters.status || undefined,
          leadStage: filters.leadStage || undefined
        },
        alertEnabled: draftSearch.alertEnabled,
        alertChannel: draftSearch.alertChannel
      })
    });
    setDraftSearch({ name: "", alertEnabled: true, alertChannel: "In-App" });
    await onRefresh();
  }

  return (
    <section className="module-grid search-module">
      <div className="panel">
        <div className="panel-header">
          <h2>{t.search}</h2>
          <Search size={20} />
        </div>
        <div className="toolbar search-toolbar">
          <label className="search-box">
            <Search size={17} />
            <input
              value={filters.search}
              onChange={(event) => setFilters({ ...filters, search: event.target.value })}
              placeholder={t.searchPlaceholder}
            />
          </label>
          <select value={filters.gender} onChange={(event) => setFilters({ ...filters, gender: event.target.value })}>
            <option value="">All profiles</option>
            <option>Bride</option>
            <option>Groom</option>
          </select>
          <select
            value={filters.leadStage}
            onChange={(event) => setFilters({ ...filters, leadStage: event.target.value })}
          >
            <option value="">Any stage</option>
            <option>New</option>
            <option>Contacted</option>
            <option>Meeting</option>
            <option>Proposal</option>
            <option>Outcome</option>
          </select>
          <select value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })}>
            <option value="">Any status</option>
            <option>Active</option>
            <option>Pending</option>
            <option>Matched</option>
            <option>Archived</option>
          </select>
        </div>
        <div className="stack-list">
          {profiles.map((profile) => (
            <article className="list-item proposal-card" key={profile.id}>
              <strong>{profile.name}</strong>
              <span>
                {profile.gender} · {profile.age || "-"} yrs · {profile.city || "-"} · {profile.nationality || "-"}
              </span>
              <div className="detail-actions">
                <Badge value={profile.leadStage} />
                <Badge value={profile.verificationStatus} />
                <button className="secondary-action" onClick={() => findMatches(profile)}>
                  <HeartHandshake size={16} /> Explain matches
                </button>
              </div>
            </article>
          ))}
          {!profiles.length ? <EmptyState title={t.noProfiles} text={t.noProfilesText} /> : null}
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <h2>{t.savedSearches}</h2>
          <BookmarkPlus size={20} />
        </div>
        <form className="saved-search-form" onSubmit={saveCurrentSearch}>
          <label>
            Search name
            <input
              value={draftSearch.name}
              onChange={(event) => setDraftSearch({ ...draftSearch, name: event.target.value })}
              placeholder="Verified Qatar-based Indian profiles"
              required
            />
          </label>
          <label>
            Alert channel
            <select
              value={draftSearch.alertChannel}
              onChange={(event) => setDraftSearch({ ...draftSearch, alertChannel: event.target.value })}
            >
              <option>In-App</option>
              <option>Email</option>
              <option>SMS</option>
              <option>WhatsApp</option>
            </select>
          </label>
          <button className="primary-action">Save current filters</button>
        </form>
        <div className="stack-list">
          {savedSearches.map((savedSearch) => (
            <article className="list-item" key={savedSearch.id}>
              <strong>{savedSearch.name}</strong>
              <span>
                {Object.entries(savedSearch.filters || {})
                  .map(([key, value]) => `${key}: ${value}`)
                  .join(" · ") || "No filters"}
              </span>
              <div className="detail-actions">
                <Badge value={savedSearch.alertEnabled ? "Active" : "Archived"} />
                <button className="secondary-action" onClick={() => onApplySavedSearch(savedSearch.filters)}>
                  Apply
                </button>
              </div>
            </article>
          ))}
          {!savedSearches.length ? (
            <EmptyState title="No saved searches" text="Save a filter set to receive match alerts." />
          ) : null}
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <h2>Explainable suggestions</h2>
          <HeartHandshake size={20} />
        </div>
        {selectedProfile ? (
          <div className="stack-list">
            <article className="list-item">
              <strong>{selectedProfile.name}</strong>
              <span>Compatibility suggestions with broker-readable reasons</span>
            </article>
            {matches.map((match) => (
              <article className="match-item" key={match.candidate.id}>
                <div>
                  <strong>{match.candidate.name}</strong>
                  <span>
                    {match.candidate.age} yrs · {match.candidate.residenceCountry || "-"} ·{" "}
                    {match.candidate.community || "-"}
                  </span>
                </div>
                <b>{match.score}%</b>
                <small>{match.reasons.join(" · ")}</small>
              </article>
            ))}
            {!matches.length ? (
              <EmptyState title="No matches yet" text="Adjust profile preferences or search filters." />
            ) : null}
          </div>
        ) : (
          <EmptyState title="Select a profile" text="Run explainable matchmaking from the search results." />
        )}
      </div>
    </section>
  );
}
