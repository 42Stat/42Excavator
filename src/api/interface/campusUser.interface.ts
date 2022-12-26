import { JSONSchemaType } from "ajv";
import {
  UserImage,
  UserImageDto,
  userImageSchema,
} from "./userImage.interface";
import { ajv } from "../core";
import { exit } from "process";

export interface CampusUserDto {
  id: number;
  email: string;
  login: string;
  first_name: string;
  last_name: string;
  kind: string;
  // image: UserImageDto;
  staff?: boolean;
  correction_point: number;
  wallet: number;
  alumni?: boolean;
  active?: boolean;
}

export interface CampusUser {
  id: number;
  email: string;
  login: string;
  firstName: string;
  lastName: string;
  kind: string;
  // image: UserImage;
  staff?: boolean;
  correctionPoint: number;
  wallet: number;
  alumni?: boolean;
  active?: boolean;
}

export const campusUserSchema: JSONSchemaType<CampusUserDto> = {
  $id: "campusUser",
  type: "object",
  properties: {
    id: { type: "number" },
    email: { type: "string" },
    login: { type: "string" },
    first_name: { type: "string" },
    last_name: { type: "string" },
    kind: { type: "string" },
    // image: {
    //   type: "object",
    //   properties: {
    //     link: { type: "string" },
    //   },
    //   required: ["link"],
    //   additionalProperties: true,
    // },
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
    // "image",
    "correction_point",
    "wallet",
  ],
  // additionalProperties: true,
};

export const validateCampusUser = ajv.compile(campusUserSchema);
