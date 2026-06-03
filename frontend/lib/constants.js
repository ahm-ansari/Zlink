export const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export const wsBase = apiBase.replace(/^http/, "ws").replace(/\/api\/v1$/, "");

export const emptyProfile = {
  name: "",
  gender: "Bride",
  age: "",
  heightCm: "",
  nationality: "",
  residenceCountry: "Qatar",
  religion: "",
  community: "",
  motherTongue: "",
  city: "Doha",
  state: "",
  education: "",
  occupation: "",
  incomeLakhs: "",
  familyType: "Nuclear",
  maritalStatus: "Never Married",
  status: "Active",
  phone: "",
  email: "",
  followUpDate: "",
  preferredAgeMin: "",
  preferredAgeMax: "",
  preferredNationalities: "",
  preferredResidenceCountries: "Qatar, UAE, Saudi Arabia, Kuwait, Oman, Bahrain",
  preferredCities: "",
  preferredCommunities: "",
  expectations: "",
  familyBackground: "",
  notes: "",
  verificationStatus: "Draft",
  privacyLevel: "Broker Only",
  leadStage: "New",
  serviceFeeQar: "",
  clientPaymentStatus: "Unpaid"
};

export const views = [
  "dashboard",
  "profiles",
  "search",
  "proposals",
  "crm",
  "reports",
  "admin",
  "intake"
];
