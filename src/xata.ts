// Generated by Xata Codegen 0.29.0. Please do not edit.
import { buildClient } from "@xata.io/client";
import type {
  BaseClientOptions,
  SchemaInference,
  XataRecord,
} from "@xata.io/client";

const tables = [
  {
    name: "users",
    columns: [
      { name: "roles", type: "string", notNull: true, defaultValue: "user" },
    ],
  },
  {
    name: "alerts",
    columns: [
      { name: "enable", type: "bool", notNull: true, defaultValue: "false" },
      { name: "start", type: "datetime", defaultValue: "now" },
      { name: "end", type: "datetime" },
      { name: "type", type: "string", defaultValue: "secondary" },
      { name: "canHide", type: "bool", notNull: true, defaultValue: "false" },
      { name: "content", type: "string", defaultValue: "" },
      { name: "links", type: "json" },
    ],
  },
  {
    name: "competitions",
    columns: [
      { name: "name", type: "string" },
      { name: "location", type: "string" },
      { name: "start", type: "datetime" },
      { name: "end", type: "datetime" },
      { name: "theme", type: "string" },
      { name: "hideThis", type: "bool", notNull: true, defaultValue: "true" },
      {
        name: "showSubmissions",
        type: "bool",
        notNull: true,
        defaultValue: "false",
      },
      {
        name: "showResults",
        type: "bool",
        notNull: true,
        defaultValue: "false",
      },
      { name: "submissions", type: "json", notNull: true, defaultValue: "[]" },
    ],
  },
  { name: "teams", columns: [{ name: "name", type: "string", unique: true }] },
  {
    name: "officers",
    columns: [
      { name: "role", type: "string" },
      { name: "description", type: "string" },
      { name: "personName", type: "string" },
      { name: "personSchool", type: "string" },
      {
        name: "openForApplication",
        type: "bool",
        notNull: true,
        defaultValue: "false",
      },
    ],
  },
] as const;

export type SchemaTables = typeof tables;
export type InferredTypes = SchemaInference<SchemaTables>;

export type Users = InferredTypes["users"];
export type UsersRecord = Users & XataRecord;

export type Alerts = InferredTypes["alerts"];
export type AlertsRecord = Alerts & XataRecord;

export type Competitions = InferredTypes["competitions"];
export type CompetitionsRecord = Competitions & XataRecord;

export type Teams = InferredTypes["teams"];
export type TeamsRecord = Teams & XataRecord;

export type Officers = InferredTypes["officers"];
export type OfficersRecord = Officers & XataRecord;

export type DatabaseSchema = {
  users: UsersRecord;
  alerts: AlertsRecord;
  competitions: CompetitionsRecord;
  teams: TeamsRecord;
  officers: OfficersRecord;
};

const DatabaseClient = buildClient();

const defaultOptions = {
  databaseURL:
    "https://Massachusetts-Coding-League-s-workspace-hud22v.us-east-1.xata.sh/db/ma-coding-league-db",
};

export class XataClient extends DatabaseClient<DatabaseSchema> {
  constructor(options?: BaseClientOptions) {
    super({ ...defaultOptions, ...options }, tables);
  }
}

let instance: XataClient | undefined = undefined;

export const getXataClient = () => {
  if (instance) return instance;

  instance = new XataClient();
  return instance;
};
