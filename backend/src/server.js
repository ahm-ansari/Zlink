const path = require("path");

require("dotenv").config({
  path: process.env.DOTENV_CONFIG_PATH || path.join(__dirname, "..", "..", "..", ".env")
});

const { createApp } = require("./app");
const { connectDb } = require("./config/db");
const { attachRealtime } = require("./realtime");

const port = Number(process.env.PORT || 5000);

async function start() {
  await connectDb();

  const app = createApp();
  const server = app.listen(port, () => {
    console.log(`ZawajLink API running at http://localhost:${port}`);
  });
  attachRealtime(server);
}

start().catch((error) => {
  console.error("Failed to start ZawajLink API");
  console.error(error);
  process.exit(1);
});
