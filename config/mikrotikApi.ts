import { RouterOSAPI } from "node-routeros";

export const mikrotikApi = new RouterOSAPI({
  host: process.env.ROUTER_IP || "",
  user: process.env.USER_NAME,
  password: process.env.ROUTER_PASSWORD,
  port: 8720,
});
