const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const brokerRoutes = require("./routes/brokerRoutes");
const proposalRoutes = require("./routes/proposalRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");
const reportRoutes = require("./routes/reportRoutes");
const savedSearchRoutes = require("./routes/savedSearchRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const requestContext = require("./middleware/requestContext");
const rateLimiter = require("./middleware/rateLimiter");
const openApiDocument = require("./openapi");

function mountApi(app, basePath) {
  app.use(basePath, authRoutes);
  app.use(basePath, dashboardRoutes);
  app.use(basePath, profileRoutes);
  app.use(basePath, brokerRoutes);
  app.use(basePath, proposalRoutes);
  app.use(basePath, appointmentRoutes);
  app.use(basePath, subscriptionRoutes);
  app.use(basePath, reportRoutes);
  app.use(basePath, savedSearchRoutes);
  app.use(basePath, notificationRoutes);
}

function createApp() {
  const app = express();

  app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:3000" }));
  app.use(express.json({ limit: "5mb" }));
  app.use(requestContext);
  app.use(rateLimiter({ windowMs: 60_000, max: 160 }));

  app.get("/api/health", (_req, res) => {
    res.json({
      ok: true,
      name: "ZawajLink",
      arabicName: "\u0632\u0648\u0627\u062c \u0644\u064a\u0646\u0643",
      version: "1.3"
    });
  });

  app.get("/api/v1/openapi.json", (_req, res) => {
    res.json(openApiDocument);
  });

  mountApi(app, "/api");
  mountApi(app, "/api/v1");

  app.use((req, res) => {
    res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
  });

  app.use((error, _req, res, _next) => {
    const status = error.name === "ValidationError" ? 400 : 500;
    res.status(status).json({ error: error.message || "Unexpected server error" });
  });

  return app;
}

module.exports = {
  createApp
};
