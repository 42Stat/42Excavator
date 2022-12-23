"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const fsPromises = __importStar(require("fs/promises"));
const dotenv = __importStar(require("dotenv"));
const core_1 = require("./api/core");
const readline = __importStar(require("readline"));
dotenv.config();
let data = "";
let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
main();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        rl.setPrompt("> ");
        rl.prompt();
        rl.on("line", (line) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (line === "exit") {
                rl.close();
            }
            data = (_a = (yield (0, core_1.sendApiRequest)(line))) !== null && _a !== void 0 ? _a : "";
            console.log(data);
            // check file "data.json" exists
            if (data === "") {
                rl.prompt();
                return;
            }
            //check file "data.json" exists\
            // and write data to file asynchronusly
            console.log(fs.existsSync("data.json"));
            let index = 0;
            for (index; fs.existsSync(`data/data${index}.json`); index++) { }
            yield fsPromises.writeFile(`data/data${index}.json`, JSON.stringify(data));
            // try {
            //   if (!fs.existsSync("data.json")) {
            //     await fsPromises.writeFile("data.json", JSON.stringify(data));
            //   } else {
            //     await fsPromises.appendFile("data.json", JSON.stringify(data));
            //   }
            // } catch (err) {
            //   console.error(err);
            // }
            rl.prompt();
        }));
        rl.on("close", () => {
            console.log("Goodbye!");
            process.exit(0);
        });
    });
}
