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
exports.getAccessToken = exports.accessToken = void 0;
const dotenv = __importStar(require("dotenv"));
const process_1 = require("process");
dotenv.config();
const clientId = process.env.CLIENT_ID;
const secret = process.env.SECRET;
const loginUrl = "https://api.intra.42.fr/oauth/token";
exports.accessToken = "";
let getAccessToken = () => __awaiter(void 0, void 0, void 0, function* () {
    // try to get Access Token 3 times
    if (clientId === undefined || secret === undefined) {
        console.error("[Error] No clientId or secret");
        (0, process_1.exit)();
    }
    for (let i = 0; i < 3; i++) {
        try {
            const response = yield fetch(loginUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({
                    grant_type: "client_credentials",
                    client_id: clientId,
                    client_secret: secret,
                }),
            });
            if (!response.ok) {
                throw new Error(`${response.status} ${response.statusText}`);
            }
            const data = yield response.json();
            exports.accessToken = data.access_token;
            console.log(`Access token: ${exports.accessToken}`);
            // If you got the Access Token successfully, return it.
            return data.access_token;
        }
        catch (error) {
            console.error(error);
            console.log("try to get Access Token again...");
            // If you failed to get the Access Token, try again.
            continue;
        }
    }
    return null;
});
exports.getAccessToken = getAccessToken;
