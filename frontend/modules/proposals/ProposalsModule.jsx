"use client";

import { useEffect, useMemo, useState } from "react";
import { HeartHandshake, LockKeyhole } from "lucide-react";
import { api } from "../../lib/api";
import { Badge } from "../../components/ui/Badge";
import { EmptyState } from "../../components/ui/EmptyState";
import { Select } from "../../components/ui/Select";
import { useProposalSocket } from "../../lib/websocket";

export function ProposalsModule({ proposals, profiles, onRefresh }) {
  const [draft, setDraft] = useState({ fromProfile: "", toProfile: "", status: "Draft", message: "" });
  const [activeProposal, setActiveProposal] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageBody, setMessageBody] = useState("");
  const eligibleProfiles = useMemo(() => profiles.filter((profile) => profile.status !== "Archived"), [profiles]);

  const { sendMessage: sendRealtime } = useProposalSocket({
    enabled: Boolean(activeProposal),
    onMessageCreated: (message) => {
      if (!activeProposal) return;
      if (String(message.proposalId) !== String(activeProposal.id)) return;
      setMessages((current) => [...current, { ...message, id: message.id || message._id }]);
    }
  });

  useEffect(() => {
    if (!activeProposal) return;
    openMessages(activeProposal).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeProposal?.id]);

  async function createProposal(event) {
    event.preventDefault();
    await api("/proposals", {
      method: "POST",
      body: JSON.stringify(draft)
    });
    setDraft({ fromProfile: "", toProfile: "", status: "Draft", message: "" });
    await onRefresh();
  }

  async function updateStatus(id, status) {
    await api(`/proposals/${id}`, {
      method: "PUT",
      body: JSON.stringify({ status })
    });
    await onRefresh();
  }

  async function openMessages(proposal) {
    setActiveProposal(proposal);
    const payload = await api(`/proposals/${proposal.id}/messages`);
    setMessages(payload.messages);
  }

  async function sendMessage(event) {
    event.preventDefault();
    if (!activeProposal || !messageBody) return;

    const sent = sendRealtime(activeProposal.id, messageBody);
    if (!sent) {
      await api(`/proposals/${activeProposal.id}/messages`, {
        method: "POST",
        body: JSON.stringify({ body: messageBody, senderRole: "Broker" })
      });
    }

    setMessageBody("");
    await openMessages(activeProposal);
  }

  return (
    <section className="module-grid">
      <form className="panel module-form" onSubmit={createProposal}>
        <div className="panel-header">
          <h2>Create Proposal</h2>
          <HeartHandshake size={20} />
        </div>
        <div className="form-grid compact">
          <label>
            From Profile
            <Select
              name="fromProfile"
              value={draft.fromProfile}
              onChange={(event) => setDraft({ ...draft, fromProfile: event.target.value })}
              options={["", ...eligibleProfiles.map((profile) => ({ id: profile.id, value: profile.id }))]}
              renderOption={(option) =>
                typeof option === "string"
                  ? option
                  : eligibleProfiles.find((profile) => profile.id === option.value)?.name || option.value
              }
            />
          </label>
          <label>
            To Profile
            <Select
              name="toProfile"
              value={draft.toProfile}
              onChange={(event) => setDraft({ ...draft, toProfile: event.target.value })}
              options={["", ...eligibleProfiles.map((profile) => ({ id: profile.id, value: profile.id }))]}
              renderOption={(option) =>
                typeof option === "string"
                  ? option
                  : eligibleProfiles.find((profile) => profile.id === option.value)?.name || option.value
              }
            />
          </label>
          <label>
            Status
            <Select
              name="status"
              value={draft.status}
              onChange={(event) => setDraft({ ...draft, status: event.target.value })}
              options={["Draft", "Sent", "Interested", "Family Review", "Meeting Scheduled", "Accepted", "Declined", "Closed"]}
            />
          </label>
          <label className="wide">
            Message
            <textarea rows="3" value={draft.message} onChange={(event) => setDraft({ ...draft, message: event.target.value })} />
          </label>
        </div>
        <div className="form-actions">
          <button className="primary-action">Create proposal</button>
        </div>
      </form>

      <div className="panel">
        <div className="panel-header">
          <h2>Proposal Pipeline</h2>
        </div>
        <div className="stack-list">
          {proposals.map((proposal) => (
            <article className="list-item proposal-card" key={proposal.id}>
              <strong>
                {proposal.fromProfile?.name || "Profile"} to {proposal.toProfile?.name || "Profile"}
              </strong>
              <span>{proposal.message || "No message"}</span>
              <div className="detail-actions">
                <Badge value={proposal.status} />
                <button className="secondary-action" type="button" onClick={() => updateStatus(proposal.id, "Family Review")}>
                  Family Review
                </button>
                <button
                  className="secondary-action"
                  type="button"
                  onClick={() => updateStatus(proposal.id, "Meeting Scheduled")}
                >
                  Meeting
                </button>
                <button className="secondary-action" type="button" onClick={() => updateStatus(proposal.id, "Accepted")}>
                  Accepted
                </button>
                <button className="secondary-action" type="button" onClick={() => openMessages(proposal)}>
                  Messages
                </button>
              </div>
            </article>
          ))}
          {!proposals.length ? <EmptyState title="No proposals" text="Create proposals after shortlisting matches." /> : null}
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <h2>Secure Messaging</h2>
          <LockKeyhole size={20} />
        </div>
        {activeProposal ? (
          <>
            <div className="stack-list">
              {messages.map((message) => (
                <article className="list-item" key={message.id}>
                  <strong>
                    {message.senderRole} · {message.approvalStatus}
                  </strong>
                  <span>{message.body}</span>
                </article>
              ))}
              {!messages.length ? <EmptyState title="No messages" text="Messages remain pending until approved." /> : null}
            </div>
            <form className="message-box" onSubmit={sendMessage}>
              <input
                value={messageBody}
                onChange={(event) => setMessageBody(event.target.value)}
                placeholder="Type a broker note or family-approved message"
              />
              <button className="primary-action">Send</button>
            </form>
          </>
        ) : (
          <EmptyState title="Select proposal" text="Open a proposal to review and send moderated messages." />
        )}
      </div>
    </section>
  );
}

