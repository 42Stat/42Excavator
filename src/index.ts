import * as fs from "fs";
import * as dotenv from "dotenv";
import { getAccessToken } from "./login/login";

dotenv.config();
main();

async function main() {
  let accessToken = (await getAccessToken()) || "";
  console.log(await sendApiRequest("/users/cheseo", accessToken));
}

let sendApiRequest = async (
  resource: string,
  accessToken: string
): Promise<any> => {
  const url = "https://api.intra.42.fr/v2";
  try {
    const response = await fetch(url + resource, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}}`);
    }
    return await response.json();
  } catch (error) {
    console.error(error);
  }
  return null;
};
