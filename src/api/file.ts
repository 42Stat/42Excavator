import fs from "fs";
import fsPromises from "fs/promises";
import { logger } from "../index";

export const getAllFiles = async (dir: string): Promise<string[]> => {
  console.log(dir);
  let files: string[] = [];
  fs.readdirSync(dir, {
    withFileTypes: true,
  }).forEach((dirent) => {
    if (dirent.isFile()) files.push(dirent.name);
  });
  return files;
};

export const saveDataToFile = async (data: any, filename: string) => {
  try {
    if (fs.existsSync(`data/${filename}.json`)) {
      let index = 1;
      while (fs.existsSync(`data/${filename}(${index}).json`)) index++;

      fsPromises.writeFile(
        `data/${filename}(${index}).json`,
        JSON.stringify(data)
      );
    } else {
      fsPromises.writeFile(`data/${filename}.json`, JSON.stringify(data));
    }
  } catch (error) {
    logger.log(
      "error",
      `file.ts: Failed to save data to ${filename}\n${error}`
    );
    // throw new Error(`Failed to save data to ${filename}`);
  }
};

export const getDataFromFile = async (
  filename: string
): Promise<any | null> => {
  try {
    const data = await fsPromises.readFile(filename);
    return JSON.parse(data.toString());
  } catch (error) {
    logger.log(
      "error",
      `file.ts: Failed to get data from ${filename}\n${error}`
    );
    return null;
  }
};
