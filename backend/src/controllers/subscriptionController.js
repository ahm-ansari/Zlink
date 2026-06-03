const SubscriptionPlan = require("../models/SubscriptionPlan");
const { serializeDoc, serializeList } = require("../utils/serialize");

async function listPlans(_req, res) {
  const plans = await SubscriptionPlan.find({ deletedAt: null }).sort({ monthlyPriceQar: 1 });
  res.json({ plans: serializeList(plans) });
}

async function createPlan(req, res) {
  const plan = await SubscriptionPlan.create(req.body);
  res.status(201).json({ plan: serializeDoc(plan) });
}

async function updatePlan(req, res) {
  const plan = await SubscriptionPlan.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!plan) return res.status(404).json({ error: "Subscription plan not found" });
  res.json({ plan: serializeDoc(plan) });
}

module.exports = {
  listPlans,
  createPlan,
  updatePlan
};
