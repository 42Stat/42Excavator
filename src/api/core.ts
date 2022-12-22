import { getAccessToken, accessToken } from "../login/login";

export let sendApiRequest = async <ReturnType = any>(
  resource: string
): Promise<ReturnType | null> => {
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
        await getAccessToken();
        console.log("Access Token: " + accessToken);
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