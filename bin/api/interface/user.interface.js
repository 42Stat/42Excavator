"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUser = exports.userSchema = void 0;
const simple_user_interface_1 = require("./simple-user.interface");
const userimage_interface_1 = require("./userimage.interface");
const core_1 = require("../core");
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
            items: {
                type: "object",
                properties: {
                    grade: { type: "string", nullable: true },
                    level: { type: "number" },
                    skills: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                id: { type: "number" },
                                name: { type: "string" },
                                level: { type: "number" },
                            },
                            required: ["id", "name", "level"],
                            additionalProperties: false,
                        },
                        required: ["level", "skills"],
                    },
                    blackholed_at: { type: "string", nullable: true },
                    id: { type: "number" },
                    begin_at: { type: "string" },
                    end_at: { type: "string", nullable: true },
                    cursus_id: { type: "number" },
                    has_coalition: { type: "boolean" },
                    created_at: { type: "string" },
                    updated_at: { type: "string" },
                    user: simple_user_interface_1.simpleUserSchema,
                    cursus: {
                        type: "object",
                        properties: {
                            id: { type: "number" },
                            created_at: { type: "string" },
                            name: { type: "string" },
                            slug: { type: "string" },
                            kind: { type: "string" },
                        },
                        required: ["id", "created_at", "name", "slug", "kind"],
                        additionalProperties: false,
                    },
                },
                required: [
                    "level",
                    "skills",
                    "id",
                    "begin_at",
                    "cursus_id",
                    "has_coalition",
                    "created_at",
                    "updated_at",
                    "user",
                    "cursus",
                ],
                additionalProperties: false,
            },
        },
        projects_users: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    id: { type: "number" },
                    occurrence: { type: "number" },
                    final_mark: { type: "number" },
                    status: { type: "string" },
                    validated: { type: "boolean", nullable: true },
                    current_team_id: { type: "number", nullable: true },
                    project: {
                        type: "object",
                        properties: {
                            id: { type: "number" },
                            name: { type: "string" },
                            slug: { type: "string" },
                            parent_id: { type: "number", nullable: true },
                        },
                        required: ["id", "name", "slug"],
                        additionalProperties: false,
                    },
                    cursus_ids: {
                        type: "array",
                        items: { type: "number" },
                    },
                    marked_at: { type: "string", nullable: true },
                    marked: { type: "boolean" },
                    retriable_at: { type: "string", nullable: true },
                    created_at: { type: "string" },
                    updated_at: { type: "string" },
                },
                required: [
                    "id",
                    "occurrence",
                    "final_mark",
                    "status",
                    "project",
                    "cursus_ids",
                    "marked",
                    "created_at",
                    "updated_at",
                ],
                additionalProperties: false,
            },
        },
        achievements: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    id: { type: "number" },
                    name: { type: "string" },
                    description: { type: "string" },
                    tier: { type: "string" },
                    kind: { type: "string" },
                    visible: { type: "boolean" },
                    image: { type: "string" },
                    nbr_of_success: { type: "number", nullable: true },
                    users_url: { type: "string" },
                },
                required: [
                    "id",
                    "name",
                    "description",
                    "tier",
                    "kind",
                    "visible",
                    "image",
                    "users_url",
                ],
                additionalProperties: false,
            },
        },
        titles: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    id: { type: "number" },
                    name: { type: "string" },
                },
                required: ["id", "name"],
                additionalProperties: false,
            },
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
    additionalProperties: false,
};
exports.validateUser = core_1.ajv.compile(exports.userSchema);
