import { createApp } from "./app.js";
import { env } from "./config/env.js";

const app = createApp();

const server = app.listen(env.PORT, () => {
  console.log(`🌿 EcoVision API running on http://localhost:${env.PORT}`);
  console.log(`🔒 Better Auth endpoints available at http://localhost:${env.PORT}/api/auth`);
  console.log(`🤖 Connected to AI service at ${env.AI_SERVICE_URL}`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received. Closing HTTP server.");
  server.close(() => {
    console.log("HTTP server closed.");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT signal received. Closing HTTP server.");
  server.close(() => {
    console.log("HTTP server closed.");
    process.exit(0);
  });
});
