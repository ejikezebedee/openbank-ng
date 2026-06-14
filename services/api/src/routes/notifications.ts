import type { FastifyInstance } from "fastify";
import { listNotifications } from "../services/notifications.js";

export async function registerNotificationRoutes(app: FastifyInstance) {
  app.get("/v1/notifications", async (request) => {
    const query = request.query as { customerId?: string };
    return { data: listNotifications(query.customerId) };
  });
}
