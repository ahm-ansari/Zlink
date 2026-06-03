const path = require("path");

require("dotenv").config({
  path: process.env.DOTENV_CONFIG_PATH || path.join(__dirname, "..", "..", "..", ".env")
});

const Broker = require("./models/Broker");
const Profile = require("./models/Profile");
const Proposal = require("./models/Proposal");
const SavedSearch = require("./models/SavedSearch");
const SubscriptionPlan = require("./models/SubscriptionPlan");
const User = require("./models/User");
const { connectDb } = require("./config/db");
const { hashPassword } = require("./services/passwordService");

const profiles = [
  {
    name: "Ananya Raman",
    gender: "Bride",
    age: 26,
    heightCm: 163,
    nationality: "Indian",
    residenceCountry: "Qatar",
    religion: "Hindu",
    community: "Tamil Brahmin",
    motherTongue: "Tamil",
    city: "Chennai",
    state: "Tamil Nadu",
    education: "MBA",
    occupation: "Product Manager",
    incomeLakhs: 18,
    familyType: "Nuclear",
    maritalStatus: "Never Married",
    status: "Active",
    phone: "+91 90000 10001",
    email: "ananya@example.com",
    expectations: "Well educated groom from Tamil-speaking family, preferably in Chennai or Bengaluru.",
    familyBackground: "Family based in Doha with roots in Chennai.",
    preferredAgeMin: 27,
    preferredAgeMax: 32,
    preferredNationalities: "Indian",
    preferredResidenceCountries: "Qatar, UAE, India",
    preferredCities: "Chennai, Bengaluru",
    preferredCommunities: "Tamil Brahmin, Iyer, Iyengar",
    notes: "Parents available for weekend meeting.",
    followUpDate: "2026-05-30",
    verificationStatus: "Verified",
    privacyLevel: "Broker Only",
    leadStage: "Meeting",
    serviceFeeQar: 2500,
    clientPaymentStatus: "Part Paid"
  },
  {
    name: "Karthik Subramanian",
    gender: "Groom",
    age: 29,
    heightCm: 176,
    nationality: "Indian",
    residenceCountry: "Qatar",
    religion: "Hindu",
    community: "Iyer",
    motherTongue: "Tamil",
    city: "Bengaluru",
    state: "Karnataka",
    education: "M.Tech",
    occupation: "Software Architect",
    incomeLakhs: 32,
    familyType: "Nuclear",
    maritalStatus: "Never Married",
    status: "Active",
    phone: "+91 90000 10002",
    email: "karthik@example.com",
    expectations: "Bride with professional education and family values. Open to Chennai and Bengaluru.",
    familyBackground: "Professional family living in Doha.",
    preferredAgeMin: 24,
    preferredAgeMax: 29,
    preferredNationalities: "Indian",
    preferredResidenceCountries: "Qatar, India",
    preferredCities: "Chennai, Bengaluru",
    preferredCommunities: "Tamil Brahmin, Iyer, Iyengar",
    notes: "Horoscope received.",
    followUpDate: "2026-06-01",
    verificationStatus: "Submitted",
    privacyLevel: "Limited Client View",
    leadStage: "Proposal",
    serviceFeeQar: 3000,
    clientPaymentStatus: "Unpaid"
  },
  {
    name: "Nisha Menon",
    gender: "Bride",
    age: 28,
    heightCm: 158,
    nationality: "Indian",
    residenceCountry: "UAE",
    religion: "Hindu",
    community: "Nair",
    motherTongue: "Malayalam",
    city: "Kochi",
    state: "Kerala",
    education: "BDS",
    occupation: "Dentist",
    incomeLakhs: 12,
    familyType: "Joint",
    maritalStatus: "Never Married",
    status: "Active",
    phone: "+91 90000 10003",
    email: "nisha@example.com",
    expectations: "Groom from Kerala, professionally settled, respectful family background.",
    familyBackground: "Kerala family with GCC business background.",
    preferredAgeMin: 29,
    preferredAgeMax: 34,
    preferredNationalities: "Indian",
    preferredResidenceCountries: "Qatar, UAE, Oman",
    preferredCities: "Kochi, Trivandrum, Bengaluru",
    preferredCommunities: "Nair, Menon",
    notes: "Family prefers horoscope check before meeting.",
    followUpDate: "2026-05-28",
    verificationStatus: "Verified",
    privacyLevel: "Broker Only",
    leadStage: "Contacted",
    serviceFeeQar: 2000,
    clientPaymentStatus: "Paid"
  },
  {
    name: "Arjun Nair",
    gender: "Groom",
    age: 31,
    heightCm: 180,
    nationality: "Indian",
    residenceCountry: "Qatar",
    religion: "Hindu",
    community: "Nair",
    motherTongue: "Malayalam",
    city: "Kochi",
    state: "Kerala",
    education: "CA",
    occupation: "Finance Controller",
    incomeLakhs: 24,
    familyType: "Joint",
    maritalStatus: "Never Married",
    status: "Active",
    phone: "+91 90000 10004",
    email: "arjun@example.com",
    expectations: "Bride from Kerala with professional degree. Open to doctors and finance professionals.",
    familyBackground: "Respected family in Kochi and Doha.",
    preferredAgeMin: 25,
    preferredAgeMax: 30,
    preferredNationalities: "Indian",
    preferredResidenceCountries: "Qatar, UAE, India",
    preferredCities: "Kochi, Trivandrum",
    preferredCommunities: "Nair, Menon",
    notes: "Ready for family introduction next week.",
    followUpDate: "2026-05-29",
    verificationStatus: "Draft",
    privacyLevel: "Admin Review",
    leadStage: "New",
    serviceFeeQar: 2500,
    clientPaymentStatus: "Unpaid"
  }
];

async function seed() {
  await connectDb();
  await Promise.all([
    Broker.deleteMany({}),
    Profile.deleteMany({}),
    Proposal.deleteMany({}),
    SavedSearch.deleteMany({}),
    SubscriptionPlan.deleteMany({}),
    User.deleteMany({})
  ]);

  const broker = await Broker.create({
    businessName: "Doha Family Mediation",
    contactName: "Abulhassan",
    email: "broker@zawajlink.qa",
    phone: "+974 5000 1000",
    country: "Qatar",
    city: "Doha",
    verificationStatus: "Approved",
    subscriptionPlan: "Professional",
    mfaEnabled: true
  });

  const adminPassword = hashPassword("Admin@12345");
  await User.create({
    name: "ZawajLink Admin",
    email: "admin@zawajlink.qa",
    phone: "+974 5000 0000",
    passwordHash: adminPassword.hash,
    passwordSalt: adminPassword.salt,
    role: "Admin",
    status: "Active",
    mfaEnabled: true
  });

  const brokerPassword = hashPassword("Broker@12345");
  await User.create({
    brokerId: broker._id,
    name: "Abulhassan",
    email: "broker@zawajlink.qa",
    phone: "+974 5000 1000",
    passwordHash: brokerPassword.hash,
    passwordSalt: brokerPassword.salt,
    role: "Broker",
    status: "Active",
    mfaEnabled: true
  });

  await SubscriptionPlan.insertMany([
    {
      name: "Starter",
      monthlyPriceQar: 199,
      maxProfiles: 100,
      features: ["Profile management", "Basic search", "Follow-up tracking"]
    },
    {
      name: "Professional",
      monthlyPriceQar: 499,
      maxProfiles: 500,
      features: ["Advanced matchmaking", "Proposal workflow", "CSV import/export", "Broker reports"]
    },
    {
      name: "Agency",
      monthlyPriceQar: 999,
      maxProfiles: 2000,
      features: ["Multi-user access", "Admin moderation", "Priority support", "Analytics"]
    }
  ]);

  const insertedProfiles = await Profile.insertMany(profiles.map((profile) => ({ ...profile, brokerId: broker._id })));
  await Proposal.create({
    brokerId: broker._id,
    fromProfile: insertedProfiles[0]._id,
    toProfile: insertedProfiles[1]._id,
    status: "Family Review",
    approvalRequired: true,
    message: "Families are reviewing biodata and availability for introduction.",
    appointmentAt: "2026-06-05T15:00:00.000Z",
    notes: "Share only limited profile details until both families approve."
  });

  await SavedSearch.create({
    brokerId: broker._id,
    name: "Verified Qatar-based Indian profiles",
    filters: {
      residenceCountry: "Qatar",
      nationality: "Indian",
      status: "Active"
    },
    alertEnabled: true,
    alertChannel: "In-App"
  });

  console.log(`Seeded ZawajLink demo data: ${insertedProfiles.length} profiles, broker, users, plans, and proposal`);
  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
