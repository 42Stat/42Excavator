import * as fs from "fs";
import * as fsPromises from "fs/promises";
import { FileHandle } from "fs/promises";
import * as dotenv from "dotenv";
import { getAccessToken } from "./login/login";
import { sendApiRequest } from "./api/core";
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
    // check file "data.json" exists
    if (data === "") {
      rl.prompt();
      return;
    }
    //check file "data.json" exists
    // and write data to file asynchronusly
    console.log(fs.existsSync("data.json"));

    let index = 0;
    while (fs.existsSync(`data/data${index}.json`)) index++;

    await fsPromises.writeFile(`data/data${index}.json`, JSON.stringify(data));

    rl.prompt();
  });
  rl.on("close", () => {
    console.log("Goodbye!");
    process.exit(0);
  });
}
