"use client";

import { Loader2, Plus, ShieldCheck } from "lucide-react";
import { Select } from "../../components/ui/Select";

export function IntakeModule({ t, form, setForm, onSubmit, saving }) {
  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  const fields = [
    ["name", "Name", "text"],
    ["age", "Age", "number"],
    ["heightCm", "Height (cm)", "number"],
    ["nationality", "Nationality", "text"],
    ["residenceCountry", "Residence Country", "text"],
    ["religion", "Religion", "text"],
    ["community", "Community / Tribe", "text"],
    ["motherTongue", "Mother Tongue", "text"],
    ["city", "City", "text"],
    ["state", "State / Region", "text"],
    ["education", "Education", "text"],
    ["occupation", "Occupation", "text"],
    ["incomeLakhs", "Income", "number"],
    ["phone", "Phone", "text"],
    ["email", "Email", "email"],
    ["followUpDate", "Follow-up Date", "date"],
    ["preferredAgeMin", "Preferred Age Min", "number"],
    ["preferredAgeMax", "Preferred Age Max", "number"],
    ["serviceFeeQar", "Service Fee (QAR)", "number"]
  ];

  return (
    <form className="panel intake-form" onSubmit={onSubmit}>
      <div className="panel-header">
        <div>
          <p className="eyebrow">ZawajLink V1.3</p>
          <h2>{form.id ? `Edit ${form.name}` : t.createProfile}</h2>
        </div>
        <ShieldCheck size={22} />
      </div>
      <div className="form-grid">
        <label>
          Profile Type
          <Select name="gender" value={form.gender} onChange={updateField} options={["Bride", "Groom"]} />
        </label>
        <label>
          Status
          <Select
            name="status"
            value={form.status}
            onChange={updateField}
            options={["Active", "Pending", "Matched", "Archived"]}
          />
        </label>
        <label>
          Verification
          <Select
            name="verificationStatus"
            value={form.verificationStatus}
            onChange={updateField}
            options={["Draft", "Submitted", "Verified", "Rejected"]}
          />
        </label>
        <label>
          Privacy
          <Select
            name="privacyLevel"
            value={form.privacyLevel}
            onChange={updateField}
            options={["Broker Only", "Limited Client View", "Admin Review"]}
          />
        </label>
        <label>
          Lead Stage
          <Select
            name="leadStage"
            value={form.leadStage}
            onChange={updateField}
            options={["New", "Contacted", "Meeting", "Proposal", "Outcome"]}
          />
        </label>
        <label>
          Payment
          <Select
            name="clientPaymentStatus"
            value={form.clientPaymentStatus}
            onChange={updateField}
            options={["Unpaid", "Part Paid", "Paid", "Refunded"]}
          />
        </label>
        <label>
          Family Type
          <Select
            name="familyType"
            value={form.familyType}
            onChange={updateField}
            options={["Nuclear", "Joint", "Extended"]}
          />
        </label>
        <label>
          Marital Status
          <Select
            name="maritalStatus"
            value={form.maritalStatus}
            onChange={updateField}
            options={["Never Married", "Divorced", "Widowed"]}
          />
        </label>

        {fields.map(([name, label, type]) => (
          <label key={name}>
            {label}
            <input
              required={name === "name" || name === "age"}
              name={name}
              type={type}
              value={form[name] || ""}
              onChange={updateField}
            />
          </label>
        ))}

        <label className="wide">
          Preferred Nationalities
          <input name="preferredNationalities" value={form.preferredNationalities || ""} onChange={updateField} />
        </label>
        <label className="wide">
          Preferred Residence Countries
          <input
            name="preferredResidenceCountries"
            value={form.preferredResidenceCountries || ""}
            onChange={updateField}
          />
        </label>
        <label className="wide">
          Preferred Cities
          <input name="preferredCities" value={form.preferredCities || ""} onChange={updateField} />
        </label>
        <label className="wide">
          Preferred Communities
          <input name="preferredCommunities" value={form.preferredCommunities || ""} onChange={updateField} />
        </label>
        <label className="wide">
          Family Background
          <textarea name="familyBackground" rows="3" value={form.familyBackground || ""} onChange={updateField} />
        </label>
        <label className="wide">
          Expectations
          <textarea name="expectations" rows="3" value={form.expectations || ""} onChange={updateField} />
        </label>
        <label className="wide">
          Agent Notes
          <textarea name="notes" rows="3" value={form.notes || ""} onChange={updateField} />
        </label>
      </div>
      <div className="form-actions">
        <button className="primary-action" disabled={saving}>
          {saving ? <Loader2 className="spin" size={17} /> : <Plus size={17} />} {t.saveProfile}
        </button>
      </div>
    </form>
  );
}
