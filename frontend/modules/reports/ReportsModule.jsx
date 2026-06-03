"use client";

import { BarChart3 } from "lucide-react";
import { EmptyState } from "../../components/ui/EmptyState";

function ReportBlock({ title, items = [] }) {
  return (
    <div className="report-block">
      <h3>{title}</h3>
      {items.length ? (
        items.map((item) => (
          <div className="report-row" key={item._id || "None"}>
            <span>{item._id || "Not set"}</span>
            <strong>{item.count}</strong>
          </div>
        ))
      ) : (
        <span className="muted">No data</span>
      )}
    </div>
  );
}

export function ReportsModule({ report, dashboard }) {
  if (!report && !dashboard) {
    return <EmptyState title="Loading reports" text="Fetching CRM analytics." />;
  }

  return (
    <section className="module-grid">
      <div className="panel">
        <div className="panel-header">
          <h2>Broker CRM Report</h2>
          <BarChart3 size={20} />
        </div>
        <div className="report-grid">
          <ReportBlock title="Pipeline" items={report?.pipeline} />
          <ReportBlock title="Payments" items={report?.payments} />
          <ReportBlock title="Proposals" items={report?.proposals} />
        </div>
      </div>
      <div className="panel">
        <div className="panel-header">
          <h2>Success Metrics</h2>
        </div>
        <div className="stack-list">
          <article className="list-item">
            <strong>{dashboard?.totalProfiles || 0}</strong>
            <span>Total client profiles</span>
          </article>
          <article className="list-item">
            <strong>{dashboard?.verifiedProfiles || 0}</strong>
            <span>Verified biodata records</span>
          </article>
          <article className="list-item">
            <strong>{dashboard?.proposalStageProfiles || 0}</strong>
            <span>Profiles in proposal stage</span>
          </article>
          <article className="list-item">
            <strong>{dashboard?.unpaidClientFees || 0}</strong>
            <span>Profiles with unpaid or partial service fees</span>
          </article>
        </div>
      </div>
    </section>
  );
}

