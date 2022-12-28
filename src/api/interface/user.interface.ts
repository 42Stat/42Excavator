import { JSONSchemaType } from "ajv";
import { SimpleUserDto, simpleUserSchema } from "./simple-user.interface";
import { UserImageDto, userImageSchema } from "./userimage.interface";
import { ajv } from "../core";

export interface UserDto {
  id: number;
  email: string;
  login: string;
  first_name: string;
  last_name: string;
  displayname: string;
  kind: string;
  image: UserImageDto;
  staff?: boolean;
  correction_point: number;
  pool_month: string;
  pool_year: string;
  wallet: number;
  alumni?: boolean;
  active?: boolean;
  cursus_users: CursusUserDto[];
  projects_users: ProjectsUserDto[];
  achievements: AcheivementDto[];
  titles: TitleDto[];
}

interface CursusUserDto {
  grade?: string;
  level: number;
  skills: SkillDto[];
  blackholed_at?: string;
  id: number;
  begin_at: string;
  end_at?: string;
  cursus_id: number;
  has_coalition: boolean;
  created_at: string;
  updated_at: string;
  user: SimpleUserDto;
  cursus: CursusDto;
}

interface SkillDto {
  id: number;
  name: string;
  level: number;
}

interface CursusDto {
  id: number;
  created_at: string;
  name: string;
  slug: string;
  kind: string;
}

interface ProjectsUserDto {
  id: number;
  occurrence: number;
  final_mark: number;
  status: string;
  validated?: boolean;
  current_team_id?: number;
  project: ProjectDto;
  cursus_ids: number[];
  marked_at?: string;
  marked: boolean;
  retriable_at?: string;
  created_at: string;
  updated_at: string;
}

interface ProjectDto {
  id: number;
  name: string;
  slug: string;
  parent_id?: number;
}

interface AcheivementDto {
  id: number;
  name: string;
  description: string;
  tier: string;
  kind: string;
  visible: boolean;
  image: string;
  nbr_of_success?: number;
  users_url: string;
}

interface TitleDto {
  id: number;
  name: string;
}

// make all ajv schemas of above types
export const userSchema: JSONSchemaType<UserDto> = {
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
    image: { $ref: userImageSchema.$id as string },
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
          user: simpleUserSchema,
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

export const validateUser = ajv.compile(userSchema);
