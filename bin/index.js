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
exports.logger = void 0;
const dotenv = __importStar(require("dotenv"));
const login_1 = require("./login/login");
const core_1 = require("./api/core");
const readline = __importStar(require("readline"));
const winston = __importStar(require("winston"));
// winston error level logger include timestamp
exports.logger = winston.createLogger({
    format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
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
let data;
let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
main();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        rl.setPrompt("Homi > ");
        yield (0, login_1.getAccessToken)();
        console.log("42Homi's ready :)");
        rl.on("line", (line) => __awaiter(this, void 0, void 0, function* () {
            rl.prompt();
            if (line === "exit")
                rl.close();
            const inputs = line.split(" ");
            const url = inputs[0];
            const type = inputs[1] ? parseInt(inputs[1]) : 0;
            const filename = inputs[2] ? inputs[2] : "unnamed";
            const page = inputs[3] ? parseInt(inputs[3]) : 1;
            try {
                if (type === 0) {
                    data = yield (0, core_1.getData)(url, filename);
                }
                else if (type === 1) {
                    data = yield (0, core_1.getDataLoop)(url, filename, page);
                }
            }
            catch (error) {
                exports.logger.log("error", `index.ts error ${error}`);
            }
        }));
        rl.on("close", () => {
            console.log("Goodbye!");
            process.exit(0);
        });
    });
}
