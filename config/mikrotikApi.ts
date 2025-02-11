import { RouterOSAPI } from "node-routeros";

export const mikrotikApi = new RouterOSAPI({
  host: process.env.ROUTER_IP || "",
  user: process.env.USER_NAME,
  password: process.env.ROUTER_PASSWORD,
  port: process.env.API_PORT ? Number(process.env.API_PORT) : 8728, // Convert to number and provide a fallback
});
