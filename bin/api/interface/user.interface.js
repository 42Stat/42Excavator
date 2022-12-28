"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUser = exports.userSchema = void 0;
const userimage_interface_1 = require("./userimage.interface");
const core_1 = require("../core");
const achievement_interface_1 = require("./achievement.interface");
const cursus_user_interface_1 = require("./cursus-user.interface");
const title_interface_1 = require("./title.interface");
const projects_user_interface_1 = require("./projects-user.interface");
// make all ajv schemas of above types
exports.userSchema = {
    $id: "user",
    type: "object",
    properties: {
        id: { type: "number" },
        email: { type: "string" },
        login: { type: "string" },
        first_name: { type: "string" },
        last_name: { type: "string" },
        displayname: { type: "string" },
        kind: { type: "string" },
        image: { $ref: userimage_interface_1.userImageSchema.$id },
        staff: { type: "boolean", nullable: true },
        correction_point: { type: "number" },
        pool_month: { type: "string" },
        pool_year: { type: "string" },
        wallet: { type: "number" },
        alumni: { type: "boolean", nullable: true },
        active: { type: "boolean", nullable: true },
        cursus_users: {
            type: "array",
            items: cursus_user_interface_1.cursusUserSchema,
        },
        projects_users: {
            type: "array",
            items: projects_user_interface_1.projectsUserSchema,
        },
        achievements: {
            type: "array",
            items: achievement_interface_1.achievementSchema,
        },
        titles: {
            type: "array",
            items: title_interface_1.titleSchema,
        },
    },
    required: [
        "id",
        "email",
        "login",
        "first_name",
        "last_name",
        "displayname",
        "kind",
        "image",
        "correction_point",
        "pool_month",
        "pool_year",
        "wallet",
        "cursus_users",
        "projects_users",
        "achievements",
        "titles",
    ],
    additionalProperties: true,
};
exports.validateUser = core_1.ajv.compile(exports.userSchema);
