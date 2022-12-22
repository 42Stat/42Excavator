import { sendApiRequest } from "./core";
import { UserDto } from "./interface/user.interface";

export let getUser = async (login: string): Promise<UserDto | null> => {
  return (await sendApiRequest<UserDto>(`users/${login}`)) || null;
};
