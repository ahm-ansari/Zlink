const WebSocket = require("ws");
const Message = require("./models/Message");
const { verify } = require("./services/tokenService");

function attachRealtime(server) {
  const wss = new WebSocket.Server({ server, path: "/ws/messages" });

  wss.on("connection", (socket, req) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const tokenPayload = verify(url.searchParams.get("token"));

    if (!tokenPayload) {
      socket.close(1008, "Authentication required");
      return;
    }

    socket.on("message", async (raw) => {
      const payload = JSON.parse(raw.toString());
      if (payload.type !== "message:create") return;

      const message = await Message.create({
        proposalId: payload.proposalId,
        senderRole: tokenPayload.role,
        body: payload.body,
        approvalStatus: "Pending Approval"
      });

      const event = JSON.stringify({ type: "message:created", message });
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) client.send(event);
      });
    });
  });

  return wss;
}

module.exports = {
  attachRealtime
};
