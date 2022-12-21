import * as fs from "fs";
import * as dotenv from "dotenv";

dotenv.config();

const clientId: string = process.env.CLIENT_ID || "";
const secret: string = process.env.SECRET || "";
const accessToken: string = process.env.ACCESS_TOKEN || "";

export let getAccessToken = async (): Promise<string | null> => {
  if (accessToken !== "") return accessToken;
  try {
    // console.log(`Getting access token...\n${clientId} \n${secret}`);
    const response = await fetch("https://api.intra.42.fr/oauth/token", {
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
    console.log(data.access_token);
    return data.access_token;
  } catch (error) {
    console.error(error);
    return null;
  }
};
