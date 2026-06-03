export function Info({ label, value, wide }) {
  return (
    <div className={`info-box ${wide ? "wide-info" : ""}`}>
      <span>{label}</span>
      <strong>{value || "Pending"}</strong>
    </div>
  );
}
