import { JSONSchemaType } from "ajv";

export interface ProjectsUserDto {
  id: number;
  occurrence: number;
  final_mark?: number;
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

export interface ProjectDto {
  id: number;
  name: string;
  slug: string;
  parent_id?: number;
}

export const projectSchema: JSONSchemaType<ProjectDto> = {
  type: "object",
  properties: {
    id: { type: "number" },
    name: { type: "string" },
    slug: { type: "string" },
    parent_id: { type: "number", nullable: true },
  },
  required: ["id", "name", "slug"],
  additionalProperties: false,
};

export const projectsUserSchema: JSONSchemaType<ProjectsUserDto> = {
  type: "object",
  properties: {
    id: { type: "number" },
    occurrence: { type: "number" },
    final_mark: { type: "number", nullable: true },
    status: { type: "string" },
    validated: { type: "boolean", nullable: true },
    current_team_id: { type: "number", nullable: true },
    project: projectSchema,
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

    "status",
    "project",
    "cursus_ids",
    "marked",
    "created_at",
    "updated_at",
  ],
  additionalProperties: true,
};
