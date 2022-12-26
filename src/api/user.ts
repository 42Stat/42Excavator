import { sendApiRequest } from "./core";
import {
  CampusUserDto,
  // parseCampusUser,
  validateCampusUser,
} from "./interface/campusUser.interface";

export let getUser = async (
  login: string
): Promise<CampusUserDto | null | undefined | string> => {
  let data: string | null = await sendApiRequest(`users/${login}`);
  if (data === null) return null;
  if (validateCampusUser(data)) {
    return data;
  } else {
    return null;
  }
  return data;
};
