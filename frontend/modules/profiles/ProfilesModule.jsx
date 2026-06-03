"use client";

import { Archive, HeartHandshake, Search } from "lucide-react";
import { Badge } from "../../components/ui/Badge";
import { EmptyState } from "../../components/ui/EmptyState";
import { Info } from "../../components/ui/Info";

export function ProfileDetail({ profile, matches, onEdit, onArchive, onFindMatches }) {
  return (
    <>
      <div className="panel-header">
        <div>
          <h2>{profile.name}</h2>
          <span>
            {profile.age} yrs - {profile.city || "City pending"} - {profile.nationality || "Nationality pending"}
          </span>
        </div>
        <Badge value={profile.gender} />
      </div>
      <div className="detail-body">
        <div className="info-grid">
          <Info label="Verification" value={profile.verificationStatus} />
          <Info label="Privacy" value={profile.privacyLevel} />
          <Info label="Pipeline" value={profile.leadStage} />
          <Info label="Payment" value={profile.clientPaymentStatus} />
          <Info label="Residence" value={profile.residenceCountry} />
          <Info label="Service Fee" value={profile.serviceFeeQar ? `QAR ${profile.serviceFeeQar}` : ""} />
        </div>
        <Info label="Family Background" value={profile.familyBackground} wide />
        <Info label="Expectations" value={profile.expectations} wide />
        <Info label="Agent Notes" value={profile.notes} wide />
        <div className="detail-actions">
          <button className="primary-action" onClick={() => onFindMatches(profile)}>
            <HeartHandshake size={17} /> Find matches
          </button>
          <button className="secondary-action" onClick={() => onEdit(profile)}>
            Edit
          </button>
          <button className="secondary-action" onClick={() => onArchive(profile)}>
            <Archive size={16} /> Archive
          </button>
        </div>
        <div className="match-list">
          {matches.map((match) => (
            <article className="match-item" key={match.candidate.id}>
              <div>
                <strong>{match.candidate.name}</strong>
                <span>
                  {match.candidate.age} yrs - {match.candidate.residenceCountry || "-"} -{" "}
                  {match.candidate.community || "-"}
                </span>
              </div>
              <b>{match.score}%</b>
              <small>{match.reasons.join(" · ")}</small>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}

export function ProfilesModule({
  t,
  filters,
  setFilters,
  profiles,
  selected,
  matches,
  onSelect,
  onEdit,
  onArchive,
  onFindMatches,
  loading
}) {
  return (
    <>
      <div className="toolbar">
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

      <section className="profile-layout">
        <div className="panel profile-list">
          {loading ? <EmptyState title="Loading profiles" text="Fetching broker records." /> : null}
          {!loading &&
            profiles.map((profile) => (
              <button
                className={`profile-item ${selected?.id === profile.id ? "selected" : ""}`}
                key={profile.id}
                onClick={() => onSelect(profile)}
              >
                <span>
                  <Badge value={profile.gender} /> <Badge value={profile.verificationStatus} />
                </span>
                <strong>{profile.name}</strong>
                <small>
                  {profile.age || "-"} yrs - {profile.nationality || "Nationality pending"} -{" "}
                  {profile.city || "City pending"}
                </small>
              </button>
            ))}
          {!loading && profiles.length === 0 ? (
            <EmptyState title={t.noProfiles} text={t.noProfilesText} />
          ) : null}
        </div>

        <div className="panel detail-panel">
          {selected ? (
            <ProfileDetail
              profile={selected}
              matches={matches}
              onEdit={onEdit}
              onArchive={onArchive}
              onFindMatches={onFindMatches}
            />
          ) : (
            <EmptyState title={t.selectProfile} text={t.selectProfileText} />
          )}
        </div>
      </section>
    </>
  );
}
