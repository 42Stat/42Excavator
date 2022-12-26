"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userImageSchema = void 0;
exports.userImageSchema = {
    $id: "userImage",
    type: "object",
    properties: {
        link: { type: "string" },
    },
    required: ["link"],
    additionalProperties: true,
};
