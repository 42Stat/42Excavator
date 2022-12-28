import { sendApiRequest } from "./core";
import {
  SimpleUserDto,
  // parseCampusUser,
  validateSimpleUser,
} from "./interface/simple-user.interface";
import { validateUser, UserDto } from "./interface/user.interface";

export const getCampusUser = async (login: string): Promise<UserDto | null> => {
  const data: string = (await sendApiRequest(`users/${login}`)) ?? "";
  if (data === "") return null;
  if (validateUser(data)) {
    const user: UserDto = data;
    console.log("succeed");
    return user;
  } else {
    console.log(validateUser.errors);
    return null;
  }
};
