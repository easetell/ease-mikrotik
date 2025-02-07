import { mikrotikApi } from "./mikrotikApi";

export const disconnectClient = async (name: string) => {
  try {
    console.log(`Attempting to disable PPPoE user: ${name}`);

    await mikrotikApi.connect();
    console.log("Connected to MikroTik API");

    // Disable the secret so they can't reconnect
    await mikrotikApi.write("/ppp/secret/set", [
      `=numbers=${name}`,
      `=profile=Expiry-Profile`, // Change profile instead of disabling
    ]);
    console.log(`Disconnected : ${name} from accesing the internet`);

    // Find and remove the active session (if online)
    const activeUsers = await mikrotikApi.write("/ppp/active/print");
    const activeUser = activeUsers.find((user: any) => user.name === name);

    if (activeUser) {
      await mikrotikApi.write("/ppp/active/remove", [
        `=.id=${activeUser[".id"]}`,
      ]);
      console.log(`Disconnected active session for: ${name}`);
    } else {
      console.log(`No active session found for: ${name}`);
    }

    await mikrotikApi.close();
    console.log("Closed MikroTik API connection");
  } catch (error) {
    console.error("Error disabling PPPoE user:", error);
  }
};

//Expiry-Pool
