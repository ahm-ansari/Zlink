module.exports = {
  openapi: "3.0.3",
  info: {
    title: "ZawajLink API",
    version: "1.3.0",
    description: "REST API for the ZawajLink matrimonial broker management portal."
  },
  servers: [{ url: "/api/v1" }],
  paths: {
    "/auth/login": {
      post: {
        summary: "Broker/Admin login",
        responses: { 200: { description: "JWT access token and refresh token" } }
      }
    },
    "/auth/refresh": {
      post: {
        summary: "Refresh short-lived JWT",
        responses: { 200: { description: "New access token" } }
      }
    },
    "/profiles": {
      get: { summary: "List client profiles", responses: { 200: { description: "Profiles" } } },
      post: { summary: "Create client profile", responses: { 201: { description: "Created profile" } } }
    },
    "/profiles/search": {
      get: { summary: "Advanced search with filters", responses: { 200: { description: "Filtered profiles" } } }
    },
    "/matches/{id}": {
      get: { summary: "AI-assisted match suggestions", responses: { 200: { description: "Match suggestions" } } }
    },
    "/proposals": {
      get: { summary: "List proposals/matches", responses: { 200: { description: "Proposals" } } },
      post: { summary: "Create proposal/match", responses: { 201: { description: "Proposal created" } } }
    },
    "/proposals/{id}/messages": {
      get: { summary: "List proposal messages", responses: { 200: { description: "Messages" } } },
      post: { summary: "Send message for moderation", responses: { 201: { description: "Message queued" } } }
    },
    "/reports/broker": {
      get: { summary: "Broker performance analytics", responses: { 200: { description: "Report" } } }
    }
  }
};
