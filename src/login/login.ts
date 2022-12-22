import * as fs from "fs";
import * as dotenv from "dotenv";

dotenv.config();

const clientId: string = process.env.CLIENT_ID as string;
const secret: string = process.env.SECRET as string;
const loginUrl: string = "https://api.intra.42.fr/oauth/token";
export let accessToken: string = "";

export let getAccessToken = async (): Promise<string | null> => {
  // try to get Access Token 3 times
  for (let i = 0; i < 3; i++) {
    try {
      const response = await fetch(loginUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "client_credentials",
          client_id: clientId,
          client_secret: secret,
        }),
      });
      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}}`);
      }
      const data = await response.json();
      accessToken = data.access_token;

      // If you got the Access Token successfully, return it.
      return data.access_token;
    } catch (error) {
      console.error(error);
      console.log("try to get Access Token again...");
      // If you failed to get the Access Token, try again.
      continue;
    }
  }
  return null;
};
