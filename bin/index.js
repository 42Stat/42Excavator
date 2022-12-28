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
const user_1 = require("./api/user");
dotenv.config();
let data = "";
let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
main();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        let campusUser = yield (0, user_1.getCampusUser)("dha");
        if (campusUser !== null) {
            console.log("failed");
            yield fsPromises.writeFile(`data/${campusUser.login}.json`, JSON.stringify(campusUser));
        }
        rl.on("line", (line) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            rl.setPrompt("> ");
            rl.prompt();
            if (line === "exit")
                rl.close();
            let inputs = line.split(" ");
            let url = inputs[0];
            let type = parseInt(inputs[1]);
            let filename = inputs[2];
            data = (_a = (yield (0, core_1.sendApiRequest)(url))) !== null && _a !== void 0 ? _a : "";
            // console.log(data);
            // check file "data.json" exists
            if (data === "") {
                rl.prompt();
                return;
            }
            if (fs.existsSync(`data/${filename}.json`)) {
                yield fsPromises.writeFile(`data/${filename}.json`, JSON.stringify(data));
            }
            else {
                yield fsPromises.appendFile(`data/${filename}.json`, JSON.stringify(data));
            }
            rl.prompt();
        }));
        rl.on("close", () => {
            console.log("Goodbye!");
            process.exit(0);
        });
    });
}
