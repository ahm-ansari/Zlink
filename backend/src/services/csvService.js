function escapeCsv(value) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function profilesToCsv(profiles) {
  const columns = [
    "name",
    "gender",
    "age",
    "nationality",
    "residenceCountry",
    "city",
    "religion",
    "community",
    "education",
    "occupation",
    "leadStage",
    "verificationStatus",
    "clientPaymentStatus",
    "serviceFeeQar",
    "phone",
    "email"
  ];

  const rows = profiles.map((profile) => columns.map((column) => escapeCsv(profile[column])).join(","));
  return [columns.join(","), ...rows].join("\n");
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let value = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (char === '"' && quoted && next === '"') {
      value += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      row.push(value);
      value = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(value);
      rows.push(row);
      row = [];
      value = "";
    } else {
      value += char;
    }
  }

  if (value || row.length) {
    row.push(value);
    rows.push(row);
  }

  const [headers = [], ...records] = rows;
  return records
    .filter((record) => record.some(Boolean))
    .map((record) => Object.fromEntries(headers.map((header, index) => [header, record[index] || ""])));
}

module.exports = {
  profilesToCsv,
  parseCsv
};
