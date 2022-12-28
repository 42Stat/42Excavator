import * as fs from "fs";
import * as fsPromises from "fs/promises";
import { FileHandle } from "fs/promises";
import * as dotenv from "dotenv";
import { getAccessToken } from "./login/login";
import { sendApiRequest } from "./api/core";
import * as readline from "readline";
import { getCampusUser } from "./api/user";

dotenv.config();
let data: string = "";
let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

main();

async function main() {
  let campusUser = await getCampusUser("dha");
  if (campusUser !== null) {
    console.log("failed");
    await fsPromises.writeFile(
      `data/${campusUser.login}.json`,
      JSON.stringify(campusUser)
    );
  }
  rl.on("line", async (line) => {
    rl.setPrompt("> ");
    rl.prompt();
    if (line === "exit") rl.close();

    let inputs: string[] = line.split(" ");
    let url: string = inputs[0];
    let type: number = parseInt(inputs[1]);
    let filename: string = inputs[2];

    data = (await sendApiRequest(url)) ?? "";
    // console.log(data);
    // check file "data.json" exists
    if (data === "") {
      rl.prompt();
      return;
    }

    if (fs.existsSync(`data/${filename}.json`)) {
      await fsPromises.writeFile(`data/${filename}.json`, JSON.stringify(data));
    } else {
      await fsPromises.appendFile(
        `data/${filename}.json`,
        JSON.stringify(data)
      );
    }

    rl.prompt();
  });

  rl.on("close", () => {
    console.log("Goodbye!");
    process.exit(0);
  });
}
