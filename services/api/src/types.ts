import type { OpenBankStore } from "./data/store.js";

declare module "fastify" {
  interface FastifyInstance {
    openBankStore: OpenBankStore;
  }
}
