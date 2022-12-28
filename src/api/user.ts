import { sendApiRequest } from "./core";
import {
  SimpleUserDto,
  // parseCampusUser,
  validateSimpleUser,
} from "./interface/simple-user.interface";
import { validateUser } from "./interface/user.interface";

export const getCampusUser = async (
  login: string
): Promise<SimpleUserDto | null> => {
  const data: string = (await sendApiRequest(`users/${login}`)) ?? "";
  if (data === "") return null;
  console.log("----");
  if (validateUser(data)) {
    const user: SimpleUserDto = data;
    return user;
  } else {
    return null;
  }
};
