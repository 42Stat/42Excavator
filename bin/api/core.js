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
exports.getDataLoop = exports.getMultipleData = exports.getData = exports.getValidator = exports.sendApiRequest = exports.ajv = void 0;
const ajv_1 = __importDefault(require("ajv"));
exports.ajv = new ajv_1.default();
const login_1 = require("../login/login");
const user_interface_1 = require("./interface/user.interface");
const coalitions_user_interface_1 = require("./interface/coalitions-user.interface");
const index_1 = require("../index");
const file_1 = require("./file");
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
const MAX_RETRY = 5;
const getData = (resource, filename) => __awaiter(void 0, void 0, void 0, function* () {
    let tryCount = 0;
    let data;
    while (tryCount < MAX_RETRY) {
        try {
            data = yield (0, exports.sendApiRequest)(resource);
            validate(resource, data);
            yield (0, file_1.saveDataToFile)(data, filename);
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
const INTERVAL_LIMIT = 510;
const EACH_TRY = 10;
const getMultipleData = (resource, elements) => __awaiter(void 0, void 0, void 0, function* () {
    const len = elements.length;
    let tryCount = 0;
    let errorElements = [];
    let multipleData = [];
    console.log("Start at: " + Date.now());
    while (true) {
        const startAt = Date.now();
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
                }
                multipleData.push(data);
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
        const interval = Date.now() - startAt;
        if (interval < INTERVAL_LIMIT)
            yield delay(INTERVAL_LIMIT - interval);
    }
    console.log("End at: " + Date.now());
    return multipleData;
});
exports.getMultipleData = getMultipleData;
const PAGESIZE = 100;
const getDataLoop = (resource, filename, page = 1) => __awaiter(void 0, void 0, void 0, function* () {
    let callCount = 0;
    let data;
    while (true) {
        const elements = Array.from({ length: EACH_TRY }, (_, i) => {
            return String(i + page + callCount * EACH_TRY);
        });
        console.log(elements);
        callCount++;
        console.log(callCount);
        try {
            data = yield (0, exports.getMultipleData)(resource + `?page[size]=${PAGESIZE}&page[number]=`, elements);
            if (data && data.length !== 0)
                yield (0, file_1.saveDataToFile)(data, filename + callCount);
        }
        catch (error) {
            throw new Error(`getDataLoop: ${error}`);
        }
        if (data instanceof Array &&
            data.filter((array) => array.length === 0).length !== 0) {
            console.log("break");
            break;
        }
    }
});
exports.getDataLoop = getDataLoop;
// export const getDataLoopWithData = async (
//   resource: string,
//   filename: string,
//   requests: string[]
// ) => {}
