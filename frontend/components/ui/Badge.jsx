export function Badge({ value }) {
  return <span className={`badge ${String(value || "").replaceAll(" ", "-")}`}>{value || "Active"}</span>;
}
