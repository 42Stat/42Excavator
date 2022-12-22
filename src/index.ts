import * as fs from "fs";
import * as dotenv from "dotenv";
import { getAccessToken } from "./login/login";
import { sendApiRequest } from "./api/api";
import * as readline from "readline";

dotenv.config();
let data: string = "";
let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

main();

async function main() {
  rl.setPrompt("> ");
  rl.prompt();
  rl.on("line", async (line) => {
    if (line === "exit") {
      rl.close();
    }
    data = (await sendApiRequest(line)) ?? "";
    console.log(data);
    rl.prompt();
  });
  rl.on("close", () => {
    console.log("Goodbye!");
    process.exit(0);
  });
}
