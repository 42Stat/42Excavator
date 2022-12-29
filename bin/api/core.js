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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDataLoop = exports.getMultipleData = exports.getData = exports.getValidator = exports.sendApiRequest = exports.ajv = void 0;
const ajv_1 = __importDefault(require("ajv"));
exports.ajv = new ajv_1.default();
const login_1 = require("../login/login");
const user_interface_1 = require("./interface/user.interface");
const coalitions_user_interface_1 = require("./interface/coalitions-user.interface");
const index_1 = require("../index");
const fs = __importStar(require("fs"));
const fsPromises = __importStar(require("fs/promises"));
const delay = (ms) => new Promise((res) => setTimeout(res, ms));
const sendApiRequest = (resource, retry = false) => __awaiter(void 0, void 0, void 0, function* () {
    const url = "https://api.intra.42.fr/v2/";
    try {
        const response = yield fetch(url + resource, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${login_1.accessToken}`,
            },
        });
        if (!response.ok) {
            if (response.status == 401 && !retry) {
                console.log("try to get Access Token...");
                if ((yield (0, login_1.getAccessToken)()) === null)
                    throw new Error("Failed to get Access Token");
                return yield (0, exports.sendApiRequest)(resource, true);
            }
            else if (response.status === 429) {
            }
            else
                throw new Error(`${response.status} ${response.statusText}`);
        }
        index_1.logger.log("info", `Received Sucessfully: ${resource}`);
        return yield response.json();
    }
    catch (error) {
        throw new Error(`sendApiRequest: ${error}`);
    }
});
exports.sendApiRequest = sendApiRequest;
const getValidator = (resource) => {
    const api = resource.split("/")[0];
    switch (api) {
        case "users":
            return user_interface_1.validateUser;
        case "coalitions":
            return coalitions_user_interface_1.validateCoalitionUser;
        default:
            throw new Error("No validator for this resource");
    }
};
exports.getValidator = getValidator;
const validate = (resource, data) => {
    const validator = (0, exports.getValidator)(resource);
    if (data instanceof Array) {
        for (let i = 0; i < data.length; i++) {
            validator(data[i]);
            if (validator.errors)
                throw new Error(`Invalid data\n${resource}\n${validator.errors}`);
        }
    }
    else {
        validator(data);
        if (validator.errors)
            throw new Error(`Invalid data\n${resource}\n${validator.errors}`);
    }
};
const saveData = (data, filename) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (fs.existsSync(`data/${filename}.json`)) {
            let index = 1;
            while (fs.existsSync(`data/${filename}(${index}).json`))
                index++;
            fsPromises.writeFile(`data/${filename}(${index}).json`, JSON.stringify(data));
        }
        else {
            fsPromises.writeFile(`data/${filename}.json`, JSON.stringify(data));
        }
    }
    catch (error) {
        index_1.logger.log("error", `Failed to save data to ${filename}\n${error}`);
        throw new Error(`Failed to save data to ${filename}`);
    }
});
const MAX_RETRY = 5;
const getData = (resource, filename) => __awaiter(void 0, void 0, void 0, function* () {
    let tryCount = 0;
    let data;
    while (tryCount < MAX_RETRY) {
        try {
            data = yield (0, exports.sendApiRequest)(resource);
            validate(resource, data);
            yield saveData(data, filename);
            console.log(`Saved data to ${filename}.json successfully`);
            return data;
        }
        catch (error) {
            index_1.logger.log("error", error);
            tryCount++;
            continue;
        }
    }
    throw new Error(`Failed to get data from ${resource}`);
});
exports.getData = getData;
const INTERVAL = 510;
const EACH_TRY = 10;
const getMultipleData = (resource, elements) => __awaiter(void 0, void 0, void 0, function* () {
    const len = elements.length;
    let tryCount = 0;
    let errorElements = [];
    let multipleData = [];
    console.log("Start");
    // const interval = setInterval(async () => {
    while (true) {
        console.log(Date.now());
        let element = elements.length !== 0 ? elements.shift() : errorElements.shift();
        tryCount++;
        if (element) {
            try {
                const data = yield (0, exports.sendApiRequest)(resource + `${element}`);
                if (data.length === 0) {
                    elements = [];
                }
                else {
                    validate(resource, data);
                    multipleData.push(data);
                }
            }
            catch (error) {
                index_1.logger.log("error", error);
                errorElements.push(element);
            }
        }
        else if (element === undefined) {
            break;
        }
        else if (tryCount === len + EACH_TRY) {
            throw new Error(`Failed to get data from ${elements} of ${resource}`);
        }
        yield delay(INTERVAL);
    }
    console.log("Finished2");
    return multipleData;
});
exports.getMultipleData = getMultipleData;
const PAGESIZE = 100;
const getDataLoop = (resource, filename, page = 1) => __awaiter(void 0, void 0, void 0, function* () {
    // call getMultipleData until it returns array include empty array
    let tryCount = 0;
    let data;
    let elements = Array.from({ length: EACH_TRY }, (_, i) => {
        return String(i + page);
    });
    // while (true) {
    tryCount++;
    console.log(tryCount);
    try {
        // logger.log("info", elements);
        data = yield (0, exports.getMultipleData)(resource + `?page[size]=${PAGESIZE}?page[number]=`, elements);
        console.log(typeof data);
        if (data && data.length !== 0)
            yield saveData(data, filename + tryCount);
    }
    catch (error) {
        throw new Error(`getDataLoop: ${error}`);
    }
    // if (data instanceof Array && data.includes([])) break;
    elements = elements.map((value) => String(Number(value) + EACH_TRY));
    // }
});
exports.getDataLoop = getDataLoop;
