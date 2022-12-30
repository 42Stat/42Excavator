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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCampusUser = exports.getAllUsers = void 0;
const file_1 = require("./file");
const core_1 = require("./core");
const file_2 = require("./file");
const user_interface_1 = require("./interface/user.interface");
const __1 = require("..");
const getAllCoalitionsUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const path = `${process.env.PWD}/data/coalitions_users`;
    const files = yield (0, file_2.getAllFiles)(path);
    const coalitions = ["gun", "gon", "gam", "lee"];
    const coalitions_users = [];
    const promise = files.map((file) => __awaiter(void 0, void 0, void 0, function* () {
        for (const [index, value] of coalitions) {
            if (file.includes(value)) {
                coalitions_users.push(yield (0, file_1.getDataFromFile)(`${path}/${file}`));
            }
        }
    }));
    yield Promise.all(promise);
    return coalitions_users;
});
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    let cnt = 0;
    const coalitions_users = yield getAllCoalitionsUsers();
    for (const [i1, value] of coalitions_users) {
        for (let i = 0; i < value.length; i++) {
            console.log(`[${value[i].user_id}]`);
            cnt++;
        }
    }
    __1.logger.log("info", `${cnt} Getting all users\n${coalitions_users}`);
});
exports.getAllUsers = getAllUsers;
const getCampusUser = (login) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const data = (_a = (yield (0, core_1.sendApiRequest)(`users/${login}`))) !== null && _a !== void 0 ? _a : "";
    if (data === "")
        return null;
    if ((0, user_interface_1.validateUser)(data)) {
        const user = data;
        console.log("succeed");
        return user;
    }
    else {
        console.log(user_interface_1.validateUser.errors);
        return null;
    }
});
exports.getCampusUser = getCampusUser;
