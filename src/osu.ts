import { Client } from "osu-web.js";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export async function getOsuUser(token: string) {
  const osuClient = new Client(token);

  return osuClient.users.getSelf();
}
