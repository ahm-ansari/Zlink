"use client";

import { Building2, CreditCard } from "lucide-react";
import { api } from "../../lib/api";
import { Badge } from "../../components/ui/Badge";
import { EmptyState } from "../../components/ui/EmptyState";

export function AdminModule({ brokers, plans, onRefresh }) {
  async function approveBroker(id) {
    await api(`/brokers/${id}/verification`, {
      method: "PATCH",
      body: JSON.stringify({ verificationStatus: "Approved" })
    });
    await onRefresh();
  }

  return (
    <section className="module-grid">
      <div className="panel">
        <div className="panel-header">
          <h2>Broker Verification</h2>
          <Building2 size={20} />
        </div>
        <div className="stack-list">
          {brokers.map((broker) => (
            <article className="list-item proposal-card" key={broker.id}>
              <strong>{broker.businessName}</strong>
              <span>
                {broker.contactName} · {broker.city}, {broker.country}
              </span>
              <div className="detail-actions">
                <Badge value={broker.verificationStatus} />
                {broker.verificationStatus !== "Approved" ? (
                  <button className="secondary-action" type="button" onClick={() => approveBroker(broker.id)}>
                    Approve
                  </button>
                ) : null}
              </div>
            </article>
          ))}
          {!brokers.length ? <EmptyState title="No brokers" text="Broker registrations will appear here." /> : null}
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <h2>Subscription Plans</h2>
          <CreditCard size={20} />
        </div>
        <div className="stack-list">
          {plans.map((plan) => (
            <article className="list-item" key={plan.id}>
              <strong>
                {plan.name} · QAR {plan.monthlyPriceQar}/mo
              </strong>
              <span>
                {plan.maxProfiles} profiles · {(plan.features || []).join(", ")}
              </span>
            </article>
          ))}
          {!plans.length ? <EmptyState title="No plans" text="Seed or create plans from the API." /> : null}
        </div>
      </div>
    </section>
  );
}

