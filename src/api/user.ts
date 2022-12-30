import { getDataFromFile } from "./file";
import { sendApiRequest } from "./core";
import { getAllFiles } from "./file";
import { validateUser, UserDto } from "./interface/user.interface";
import { dirname } from "path";
import { CoalitionUserDto } from "./interface/coalitions-user.interface";
import { logger } from "..";

const getAllCoalitionsUsers = async (): Promise<CoalitionUserDto[][][]> => {
  const path = `${process.env.PWD}/data/coalitions_users`;
  const files = await getAllFiles(path);
  const coalitions: string[] = ["gun", "gon", "gam", "lee"];
  const coalitions_users: CoalitionUserDto[][][] = [];
  const promise = files.map(async (file) => {
    for (const [index, value] of coalitions) {
      if (file.includes(value)) {
        coalitions_users.push(await getDataFromFile(`${path}/${file}`));
      }
    }
  });
  await Promise.all(promise);
  return coalitions_users;
}

export const getAllUsers = async () => {
  let cnt = 0;
  const coalitions_users = await getAllCoalitionsUsers();
  for (const [i1, value] of coalitions_users) {
    // for (const [i2, value2] of value) {
    //   for (const [i3, value3] of value2) {
    //     cnt++;
    //   }
    // }
  }
  logger.log("info", `${cnt} Getting all users\n${coalitions_users}`);
}

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
