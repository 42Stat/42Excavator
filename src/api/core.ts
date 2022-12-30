import Ajv, { ValidateFunction } from "ajv";
export const ajv = new Ajv();
import { getAccessToken, accessToken } from "../login/login";
import { validateUser } from "./interface/user.interface";
import { validateCoalitionUser } from "./interface/coalitions-user.interface";
import { logger } from "../index";
import * as fs from "fs";
import * as fsPromises from "fs/promises";
import { saveDataToFile } from "./file";

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
      await saveDataToFile(data, filename);

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

const INTERVAL_LIMIT = 510;
const EACH_TRY = 10;

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
    const startAt = Date.now();
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
    const interval = Date.now() - startAt;
    if (interval < INTERVAL_LIMIT)
      await delay(INTERVAL_LIMIT - interval);
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
      if (data && data.length !== 0) await saveDataToFile(data, filename + callCount);
    } catch (error) {
      throw new Error(`getDataLoop: ${error}`);
    }
    if (
      data instanceof Array &&
      data.filter((array) => array.length === 0).length !== 0
    ) {
      console.log("break");
      break;
    }
  }
};

// export const getDataLoopWithData = async (
//   resource: string,
//   filename: string,
//   requests: string[]
// ) => {}