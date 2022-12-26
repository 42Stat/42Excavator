"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendApiRequest = exports.ajv = void 0;
const login_1 = require("../login/login");
const jtd_1 = __importDefault(require("ajv/dist/jtd"));
exports.ajv = new jtd_1.default();
let sendApiRequest = (resource) => __awaiter(void 0, void 0, void 0, function* () {
    const url = "https://api.intra.42.fr/v2/";
    try {
        const response = yield fetch(url + resource, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${login_1.accessToken}`,
            },
        });
        if (!response.ok) {
            if (response.status == 401 || response.status == 429) {
                console.log("try to get Access Token...");
                if ((yield (0, login_1.getAccessToken)()) === null)
                    return null;
                return yield (0, exports.sendApiRequest)(resource);
            }
            else
                throw new Error(`${response.status} ${response.statusText}`);
        }
        return yield response.json();
    }
    catch (error) {
        console.error(error);
    }
    return null;
});
exports.sendApiRequest = sendApiRequest;
// 예외처리:
// 타입 체크
// 재시도
