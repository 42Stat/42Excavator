import { sendApiRequest } from "./core";
import {
  SimpleUserDto,
  // parseCampusUser,
  validateSimpleUser,
} from "./interface/simple-user.interface";

export let getCampusUser = async (
  login: string
): Promise<SimpleUserDto | null> => {
  let data: string = (await sendApiRequest(`users/${login}`)) ?? "";
  if (data === "") return null;
  // console.log(data);
  if (validateSimpleUser(data)) {
    let user: SimpleUserDto = data;
    return user;
  } else {
    return null;
  }
};
