"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSimpleUser = exports.campusUserSchema = void 0;
const UserImage_interface_1 = require("./UserImage.interface");
const core_1 = require("../core");
exports.campusUserSchema = {
  $id: "campusUser",
  type: "object",
  properties: {
    id: { type: "number" },
    email: { type: "string" },
    login: { type: "string" },
    first_name: { type: "string" },
    last_name: { type: "string" },
    kind: { type: "string" },
    image: UserImage_interface_1.userImageSchema,
    staff: { type: "boolean", nullable: true },
    correction_point: { type: "number" },
    wallet: { type: "number" },
    alumni: { type: "boolean", nullable: true },
    active: { type: "boolean", nullable: true },
  },
  required: [
    "id",
    "email",
    "login",
    "first_name",
    "last_name",
    "kind",
    "image",
    "correction_point",
    "wallet",
  ],
  additionalProperties: true,
};
exports.validateSimpleUser = core_1.ajv.compile(exports.campusUserSchema);
