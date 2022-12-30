import { getDataFromFile, saveDataToFile } from "./file";
import { getMultipleData, sendApiRequest } from "./core";
import { getAllFiles } from "./file";
import { validateUser, UserDto } from "./interface/user.interface";
import { dirname } from "path";
import { CoalitionUserDto } from "./interface/coalitions-user.interface";
import { logger } from "..";

const getAllCoalitionsUsers = async (): Promise<CoalitionUserDto[][][]> => {
  const path = `${process.env.PWD}/data/coalitions_users`;
  const files = await getAllFiles(path);
  // const coalitions: string[] = ["gun", "gon", "gam", "lee"];
  const coalitions: string[] = ["gun", "lee"];

  const coalitions_users: CoalitionUserDto[][][] = [];
  for (const file of files) {
    for (const value of coalitions) {
      if (file.includes(value)) {
        coalitions_users.push(await getDataFromFile(`${path}/${file}`));
      }
    }
  }
  return coalitions_users;
};

export const getAllUsers = async () => {
  let cnt = 0;
  const coalitions_users = await getAllCoalitionsUsers();
  for (const coalition_users of coalitions_users) {
    for (const users of coalition_users) {
      //get every ten of user_ids and request
      const user_ids = users.map((user) => user.user_id);
      for (let i = 0; i < user_ids.length; i += 10) {
        const numberIds = user_ids.slice(
          i,
          i + 10 > user_ids.length ? user_ids.length : i + 10
        );
        const stringIds = numberIds.map((id) => id.toString());
        console.log(stringIds);

        try {
          const users = await getMultipleData("users/", stringIds);
          for (const user of users) {
            saveDataToFile(user, `users/${user.login}`);
          }
        } catch (error) {
          logger.log("error", `user.ts: ${error}`);
        }
      }
    }
  }
  logger.log("info", `user.ts: ${cnt} Getting all users\n${coalitions_users}`);
};

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
