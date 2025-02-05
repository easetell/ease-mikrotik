import { RouterOSAPI } from "node-routeros";

export const mikrotikApi = new RouterOSAPI({
  host: process.env.ROUTER_IP || "",
  user: process.env.USER_NAME,
  password: process.env.ROUTER_PASSWORD,
  port: 8777,
});

// export const reconnectClient = async (name: any) => {
//   await mikrotikApi.connect();
//   await mikrotikApi.write("/ppp/secret/set", [
//     "=numbers=" + name,
//     "=disabled=no",
//   ]);
//   await mikrotikApi.close();
// };
