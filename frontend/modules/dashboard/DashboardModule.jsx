"use client";

import {
  BadgeCheck,
  CalendarClock,
  CreditCard,
  HeartHandshake,
  Loader2,
  LockKeyhole,
  RefreshCw,
  UsersRound
} from "lucide-react";
import { FeatureCard } from "../../components/ui/FeatureCard";
import { Badge } from "../../components/ui/Badge";
import { EmptyState } from "../../components/ui/EmptyState";
import { toDateInput } from "../../lib/utils";

export function DashboardModule({ t, dashboard, loading, profiles, followUps, onRefresh }) {
  const metrics = [
    ["Total Profiles", dashboard?.totalProfiles ?? 0, UsersRound],
    ["Verified", dashboard?.verifiedProfiles ?? 0, BadgeCheck],
    ["Proposal Stage", dashboard?.proposalStageProfiles ?? 0, HeartHandshake],
    ["Due Follow-ups", dashboard?.followUpsDue ?? 0, CalendarClock],
    ["Unpaid Fees", dashboard?.unpaidClientFees ?? 0, CreditCard]
  ];

  return (
    <>
      <section className="metric-grid">
        {metrics.map(([label, value, Icon]) => (
          <article className="metric" key={label}>
            <Icon size={20} />
            <span>{label}</span>
            <strong>{loading ? <Loader2 className="spin" size={24} /> : value}</strong>
          </article>
        ))}
      </section>

      <section className="ops-grid">
        <FeatureCard icon={HeartHandshake} title={t.secureMessaging} text={t.secureMessagingText} />
        <FeatureCard icon={LockKeyhole} title={t.privacy} text={t.privacyText} />
        <FeatureCard icon={CreditCard} title={t.billing} text={t.billingText} />
      </section>

      <section className="content-grid">
        <div className="panel">
          <div className="panel-header">
            <h2>{t.recentProfiles}</h2>
            <button className="icon-button" onClick={onRefresh} title="Refresh">
              <RefreshCw size={17} />
            </button>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Location</th>
                  <th>Stage</th>
                </tr>
              </thead>
              <tbody>
                {profiles.map((profile) => (
                  <tr key={profile.id}>
                    <td>
                      <strong>{profile.name}</strong>
                      <span>{profile.occupation}</span>
                    </td>
                    <td>
                      <Badge value={profile.gender} />
                    </td>
                    <td>
                      {profile.city || "-"}, {profile.residenceCountry || "-"}
                    </td>
                    <td>
                      <Badge value={profile.leadStage} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <h2>{t.followUps}</h2>
          </div>
          <div className="stack-list">
            {followUps.length ? (
              followUps.map((profile) => (
                <article className="list-item" key={profile.id}>
                  <strong>{profile.name}</strong>
                  <span>
                    {toDateInput(profile.followUpDate)} - {profile.phone || "Phone pending"}
                  </span>
                </article>
              ))
            ) : (
              <EmptyState title="No follow-ups" text="Add dates while collecting profiles." />
            )}
          </div>
        </div>
      </section>
    </>
  );
}
