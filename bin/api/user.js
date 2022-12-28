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
exports.getCampusUser = void 0;
const core_1 = require("./core");
const user_interface_1 = require("./interface/user.interface");
const getCampusUser = (login) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const data = (_a = (yield (0, core_1.sendApiRequest)(`users/${login}`))) !== null && _a !== void 0 ? _a : "";
    if (data === "")
        return null;
    console.log("----");
    if ((0, user_interface_1.validateUser)(data)) {
        const user = data;
        return user;
    }
    else {
        return null;
    }
});
exports.getCampusUser = getCampusUser;
