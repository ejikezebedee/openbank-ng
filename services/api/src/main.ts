import Fastify from "fastify";
import cors from "@fastify/cors";
import { store } from "./data/store.js";
import { registerCustomerRoutes } from "./routes/customers.js";
import { registerReferenceRoutes } from "./routes/reference.js";
import { registerTransferRoutes } from "./routes/transfers.js";
import { registerAdminRoutes } from "./routes/admin.js";
import { registerAuthRoutes } from "./routes/auth.js";
import "./types.js";

const app = Fastify({ logger: true });
app.decorate("openBankStore", store);

await app.register(cors, {
  origin: process.env.CORS_ORIGIN?.split(",") ?? false,
});

await app.register(registerCustomerRoutes);
await app.register(registerReferenceRoutes);
await app.register(registerTransferRoutes);
await app.register(registerAdminRoutes);
await app.register(registerAuthRoutes);

app.get("/health", async () => ({
  status: "ok",
  service: "openbank-ng-api",
}));

app.get("/v1/product", async () => ({
  name: "OpenBank NG",
  market: "Nigeria",
  currency: "NGN",
  moneyUnit: "kobo",
  boundary: "Commercial source-code platform. Buyer handles licensing and regulated providers.",
}));

const port = Number(process.env.PORT ?? 4000);
const host = process.env.HOST ?? "0.0.0.0";

await app.listen({ port, host });
