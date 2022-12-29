import Ajv, { ValidateFunction } from "ajv";
export const ajv = new Ajv();
import { getAccessToken, accessToken } from "../login/login";
import { validateUser } from "./interface/user.interface";
import { validateCoalitionUser } from "./interface/coalitions-user.interface";
import { logger } from "../index";
import * as fs from "fs";
import * as fsPromises from "fs/promises";

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const sendApiRequest = async (
  resource: string,
  retry: boolean = false
): Promise<any | any[]> => {
  const url = "https://api.intra.42.fr/v2/";
  try {
    const response = await fetch(url + resource, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) {
      if (response.status == 401 && !retry) {
        console.log("try to get Access Token...");
        if ((await getAccessToken()) === null)
          throw new Error("Failed to get Access Token");
        return await sendApiRequest(resource, true);
      } else if (response.status === 429) {
      } else throw new Error(`${response.status} ${response.statusText}`);
    }
    logger.log("info", `Received Sucessfully: ${resource}`);
    return await response.json();
  } catch (error) {
    throw new Error(`sendApiRequest: ${error}`);
  }
};

export const getValidator = (resource: string): ValidateFunction => {
  const api = resource.split("/")[0];
  switch (api) {
    case "users":
      return validateUser;
    case "coalitions":
      return validateCoalitionUser;
    default:
      throw new Error("No validator for this resource");
  }
};

const validate = (resource: string, data: any) => {
  const validator = getValidator(resource);
  if (data instanceof Array) {
    for (let i = 0; i < data.length; i++) {
      validator(data[i]);
      if (validator.errors)
        throw new Error(`Invalid data\n${resource}\n${validator.errors}`);
    }
  } else {
    validator(data);
    if (validator.errors)
      throw new Error(`Invalid data\n${resource}\n${validator.errors}`);
  }
};

const saveData = async (data: any, filename: string) => {
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
    logger.log("error", `Failed to save data to ${filename}\n${error}`);
    throw new Error(`Failed to save data to ${filename}`);
  }
};

const MAX_RETRY = 5;

export const getData = async (
  resource: string,
  filename: string
): Promise<any | any[] | null> => {
  let tryCount = 0;
  let data: any | any[] | null;
  while (tryCount < MAX_RETRY) {
    try {
      data = await sendApiRequest(resource);
      validate(resource, data);
      await saveData(data, filename);

      console.log(`Saved data to ${filename}.json successfully`);
      return data;
    } catch (error) {
      logger.log("error", error);
      tryCount++;
      continue;
    }
  }
  throw new Error(`Failed to get data from ${resource}`);
};

const INTERVAL = 510;
const EACH_TRY = 3;

export const getMultipleData = async (
  resource: string,
  elements: string[]
): Promise<any[]> => {
  const len = elements.length;
  let tryCount = 0;
  let errorElements: string[] = [];
  let multipleData: any[] = [];

  console.log("Start at: " + Date.now());
  while (true) {
    console.log(Date.now());
    let element =
      elements.length !== 0 ? elements.shift() : errorElements.shift();
    tryCount++;
    if (element) {
      try {
        const data = await sendApiRequest(resource + `${element}`);
        if (data.length === 0) {
          elements = [];
        } else {
          validate(resource, data);
        }
        multipleData.push(data);
      } catch (error) {
        logger.log("error", error);
        errorElements.push(element);
      }
    } else if (element === undefined) {
      break;
    } else if (tryCount === len + EACH_TRY) {
      throw new Error(`Failed to get data from ${elements} of ${resource}`);
    }
    await delay(INTERVAL);
  }
  console.log("End at: " + Date.now());
  return multipleData;
};

const PAGESIZE = 100;

export const getDataLoop = async (
  resource: string,
  filename: string,
  page: number = 1
) => {
  let callCount = 0;
  let data: any | any[] | null;
  while (true) {
    const elements = Array.from({ length: EACH_TRY }, (_, i) => {
      return String(i + page + callCount * EACH_TRY);
    });
    console.log(elements);
    callCount++;
    console.log(callCount);
    try {
      data = await getMultipleData(
        resource + `?page[size]=${PAGESIZE}&page[number]=`,
        elements
      );
      if (data && data.length !== 0) await saveData(data, filename + callCount);
    } catch (error) {
      throw new Error(`getDataLoop: ${error}`);
    }
    // data is 2d array and if it has empty array, it means there is no more data
    if (
      data instanceof Array &&
      data.filter((array) => array.length === 0).length !== 0
    ) {
      console.log("break");
      break;
    }

    // if (data instanceof Array && data.filter break;
  }
};
