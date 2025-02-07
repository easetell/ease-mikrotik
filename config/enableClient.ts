import { mikrotikApi } from "./mikrotikApi";

export const enableClient = async (username: string) => {
  try {
    await mikrotikApi.connect();
    console.log(`🔄 Enabling user: ${username}`);

    await mikrotikApi.write("/ppp/secret/set", [
      `=name=${username}`,
      "=disabled=no",
    ]);

    await mikrotikApi.close();
    console.log(`✅ Successfully enabled user: ${username}`);
  } catch (error) {
    console.error("❌ Error enabling PPPoE user:", error);
  }
};
