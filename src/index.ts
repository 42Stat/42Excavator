import * as fs from "fs";
import * as fsPromises from "fs/promises";
import { FileHandle } from "fs/promises";
import * as dotenv from "dotenv";
import { getAccessToken } from "./login/login";
import { getData, getDataLoop, sendApiRequest } from "./api/core";
import * as readline from "readline";
import { getCampusUser } from "./api/user";
import * as winston from "winston";

// winston error level logger include timestamp
export const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: "info.log",
      level: "info",
    }),
    new winston.transports.File({
      filename: "error.log",
      level: "error",
    }),
    new winston.transports.File({
      filename: "combined.log",
    }),
  ],
});

dotenv.config();
let data: any;
let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

main();

async function main() {
  rl.setPrompt("Homi > ");
  await getAccessToken();
  console.log("42Homi's ready :)");
  rl.on("line", async (line) => {
    rl.prompt();
    if (line === "exit") rl.close();

    const inputs: string[] = line.split(" ");
    const url: string = inputs[0];
    const type: number = inputs[1] ? parseInt(inputs[1]) : 0;
    const filename: string = inputs[2] ? inputs[2] : "unnamed";
    const page: number = inputs[3] ? parseInt(inputs[3]) : 1;

    try {
      if (type === 0) {
        data = await getData(url, filename);
      } else if (type === 1) {
        data = await getDataLoop(url, filename, page);
      }
    } catch (error) {
      logger.log("error", `index.ts error ${error}`);
    }
  });

  rl.on("close", () => {
    console.log("Goodbye!");
    process.exit(0);
  });
}
