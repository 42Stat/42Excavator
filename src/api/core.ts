import { getAccessToken, accessToken } from "../login/login";
import Ajv from "ajv/dist/jtd";
import { campusUserSchema } from "./interface/campusUser.interface";
import { userImageSchema } from "./interface/userImage.interface";

export const ajv = new Ajv();

export let sendApiRequest = async (
  resource: string
): Promise<string | null> => {
  const url = "https://api.intra.42.fr/v2/";
  try {
    const response = await fetch(url + resource, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) {
      if (response.status == 401 || response.status == 429) {
        console.log("try to get Access Token...");
        if ((await getAccessToken()) === null) return null;
        return await sendApiRequest(resource);
      } else throw new Error(`${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(error);
  }
  return null;
};

// 예외처리:
// 타입 체크
// 재시도
