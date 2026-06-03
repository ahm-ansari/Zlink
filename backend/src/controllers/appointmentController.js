const Appointment = require("../models/Appointment");
const { serializeDoc, serializeList } = require("../utils/serialize");

async function listAppointments(req, res) {
  const { status, profileId } = req.query;
  const query = { deletedAt: null };
  if (status) query.status = status;
  if (profileId) query.profileId = profileId;

  const appointments = await Appointment.find(query).sort({ scheduledAt: 1 });
  res.json({ appointments: serializeList(appointments) });
}

async function createAppointment(req, res) {
  const appointment = await Appointment.create(req.body);
  res.status(201).json({ appointment: serializeDoc(appointment) });
}

async function updateAppointment(req, res) {
  const appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!appointment) return res.status(404).json({ error: "Appointment not found" });
  res.json({ appointment: serializeDoc(appointment) });
}

module.exports = {
  listAppointments,
  createAppointment,
  updateAppointment
};
