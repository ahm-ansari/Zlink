const mongoose = require("mongoose");
const crypto = require("crypto");
const { encryptText, decryptText } = require("../services/cryptoService");

const profileSchema = new mongoose.Schema(
  {
    uuid: { type: String, default: () => crypto.randomUUID(), unique: true, index: true },
    brokerId: { type: mongoose.Schema.Types.ObjectId, ref: "Broker" },
    name: { type: String, required: true, trim: true },
    gender: { type: String, enum: ["Bride", "Groom"], required: true },
    age: { type: Number, required: true, min: 18 },
    dateOfBirth: { type: Date },
    heightCm: { type: Number, min: 120, max: 230 },
    nationality: { type: String, trim: true },
    residenceCountry: { type: String, trim: true, default: "Qatar" },
    religion: { type: String, trim: true },
    community: { type: String, trim: true },
    motherTongue: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    education: { type: String, trim: true },
    occupation: { type: String, trim: true },
    incomeLakhs: { type: Number, min: 0 },
    familyType: { type: String, enum: ["Nuclear", "Joint", "Extended"], default: "Nuclear" },
    maritalStatus: {
      type: String,
      enum: ["Never Married", "Divorced", "Widowed"],
      default: "Never Married"
    },
    status: {
      type: String,
      enum: ["Active", "Pending", "Matched", "Archived"],
      default: "Active"
    },
    phone: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    expectations: { type: String, trim: true },
    familyBackground: { type: String, trim: true },
    preferredAgeMin: { type: Number, min: 18 },
    preferredAgeMax: { type: Number, min: 18 },
    preferences: { type: mongoose.Schema.Types.Mixed, default: {} },
    preferredNationalities: { type: String, trim: true },
    preferredResidenceCountries: { type: String, trim: true },
    preferredCities: { type: String, trim: true },
    preferredCommunities: { type: String, trim: true },
    notes: { type: String, trim: true },
    followUpDate: { type: Date },
    verificationStatus: {
      type: String,
      enum: ["Draft", "Submitted", "Verified", "Rejected"],
      default: "Draft"
    },
    privacyLevel: {
      type: String,
      enum: ["Broker Only", "Limited Client View", "Admin Review"],
      default: "Broker Only"
    },
    leadStage: {
      type: String,
      enum: ["New", "Contacted", "Meeting", "Proposal", "Outcome"],
      default: "New"
    },
    serviceFeeQar: { type: Number, min: 0 },
    clientPaymentStatus: {
      type: String,
      enum: ["Unpaid", "Part Paid", "Paid", "Refunded"],
      default: "Unpaid"
    },
    media: [
      {
        url: String,
        type: { type: String, enum: ["Photo", "Document"], default: "Document" },
        approved: { type: Boolean, default: false }
      }
    ],
    documents: [
      {
        name: String,
        url: String,
        status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" }
      }
    ],
    deletedAt: { type: Date, default: null, index: true }
  },
  {
    timestamps: true
  }
);

profileSchema.pre("validate", function calculateAge(next) {
  if (this.dateOfBirth) {
    const today = new Date();
    let age = today.getFullYear() - this.dateOfBirth.getFullYear();
    const monthDelta = today.getMonth() - this.dateOfBirth.getMonth();
    if (monthDelta < 0 || (monthDelta === 0 && today.getDate() < this.dateOfBirth.getDate())) {
      age -= 1;
    }
    this.age = age;
  }
  next();
});

profileSchema.pre("save", function encryptSensitiveFields(next) {
  if (this.isModified("phone")) this.phone = encryptText(this.phone);
  if (this.isModified("email")) this.email = encryptText(this.email);
  next();
});

profileSchema.post(["init", "save"], function decryptSensitiveFields(doc) {
  if (doc.phone) doc.phone = decryptText(doc.phone);
  if (doc.email) doc.email = decryptText(doc.email);
});

profileSchema.index({
  name: "text",
  city: "text",
  community: "text",
  occupation: "text",
  phone: "text",
  nationality: "text",
  residenceCountry: "text"
});
profileSchema.index({ age: 1 });
profileSchema.index({ gender: 1 });
profileSchema.index({ nationality: 1 });
profileSchema.index({ religion: 1 });
profileSchema.index({ status: 1 });
profileSchema.index({ brokerId: 1, deletedAt: 1 });

module.exports = mongoose.model("Profile", profileSchema);
