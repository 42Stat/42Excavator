"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCoalitionUser = void 0;
const core_1 = require("../core");
const coalitionUserSchema = {
    type: "object",
    properties: {
        id: { type: "number" },
        coalition_id: { type: "number" },
        user_id: { type: "number" },
        created_at: { type: "string" },
        updated_at: { type: "string" },
    },
    required: ["id", "coalition_id", "user_id", "created_at", "updated_at"],
    additionalProperties: true,
};
exports.validateCoalitionUser = core_1.ajv.compile(coalitionUserSchema);
