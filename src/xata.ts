// Generated by Xata Codegen 0.29.0. Please do not edit.
import { buildClient } from "@xata.io/client";
import type {
  BaseClientOptions,
  SchemaInference,
  XataRecord,
} from "@xata.io/client";

const tables = [
  {
    name: "alerts",
    columns: [
      { name: "enable", type: "bool", notNull: true, defaultValue: "false" },
      { name: "start", type: "datetime", defaultValue: "now" },
      { name: "end", type: "datetime" },
      { name: "type", type: "string" },
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
      { name: "showThis", type: "bool", notNull: true, defaultValue: "false" },
      { name: "showTheme", type: "bool", notNull: true, defaultValue: "false" },
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
      { name: "yearRange", type: "string" },
    ],
  },
  {
    name: "teams",
    columns: [{ name: "name", type: "string", unique: true }],
    revLinks: [{ column: "team", table: "nextauth_users" }],
  },
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
  {
    name: "nextauth_users",
    columns: [
      { name: "email", type: "email" },
      { name: "emailVerified", type: "datetime" },
      { name: "name", type: "string" },
      { name: "image", type: "string" },
      { name: "roles", type: "string", defaultValue: "user" },
      { name: "team", type: "link", link: { table: "teams" } },
      {
        name: "teamVerified",
        type: "bool",
        notNull: true,
        defaultValue: "false",
      },
      { name: "graduationYear", type: "int" },
    ],
    revLinks: [
      { column: "user", table: "nextauth_accounts" },
      { column: "user", table: "nextauth_users_accounts" },
      { column: "user", table: "nextauth_users_sessions" },
      { column: "user", table: "nextauth_sessions" },
    ],
  },
  {
    name: "nextauth_accounts",
    columns: [
      { name: "user", type: "link", link: { table: "nextauth_users" } },
      { name: "type", type: "string" },
      { name: "provider", type: "string" },
      { name: "providerAccountId", type: "string" },
      { name: "refresh_token", type: "string" },
      { name: "access_token", type: "string" },
      { name: "expires_at", type: "int" },
      { name: "token_type", type: "string" },
      { name: "scope", type: "string" },
      { name: "id_token", type: "text" },
      { name: "session_state", type: "string" },
    ],
    revLinks: [{ column: "account", table: "nextauth_users_accounts" }],
  },
  {
    name: "nextauth_verificationTokens",
    columns: [
      { name: "identifier", type: "string" },
      { name: "token", type: "string" },
      { name: "expires", type: "datetime" },
    ],
  },
  {
    name: "nextauth_users_accounts",
    columns: [
      { name: "user", type: "link", link: { table: "nextauth_users" } },
      { name: "account", type: "link", link: { table: "nextauth_accounts" } },
    ],
  },
  {
    name: "nextauth_users_sessions",
    columns: [
      { name: "user", type: "link", link: { table: "nextauth_users" } },
      { name: "session", type: "link", link: { table: "nextauth_sessions" } },
    ],
  },
  {
    name: "nextauth_sessions",
    columns: [
      { name: "sessionToken", type: "string" },
      { name: "expires", type: "datetime" },
      { name: "user", type: "link", link: { table: "nextauth_users" } },
    ],
    revLinks: [{ column: "session", table: "nextauth_users_sessions" }],
  },
] as const;

export type SchemaTables = typeof tables;
export type InferredTypes = SchemaInference<SchemaTables>;

export type Alerts = InferredTypes["alerts"];
export type AlertsRecord = Alerts & XataRecord;

export type Competitions = InferredTypes["competitions"];
export type CompetitionsRecord = Competitions & XataRecord;

export type Teams = InferredTypes["teams"];
export type TeamsRecord = Teams & XataRecord;

export type Officers = InferredTypes["officers"];
export type OfficersRecord = Officers & XataRecord;

export type NextauthUsers = InferredTypes["nextauth_users"];
export type NextauthUsersRecord = NextauthUsers & XataRecord;

export type NextauthAccounts = InferredTypes["nextauth_accounts"];
export type NextauthAccountsRecord = NextauthAccounts & XataRecord;

export type NextauthVerificationTokens =
  InferredTypes["nextauth_verificationTokens"];
export type NextauthVerificationTokensRecord = NextauthVerificationTokens &
  XataRecord;

export type NextauthUsersAccounts = InferredTypes["nextauth_users_accounts"];
export type NextauthUsersAccountsRecord = NextauthUsersAccounts & XataRecord;

export type NextauthUsersSessions = InferredTypes["nextauth_users_sessions"];
export type NextauthUsersSessionsRecord = NextauthUsersSessions & XataRecord;

export type NextauthSessions = InferredTypes["nextauth_sessions"];
export type NextauthSessionsRecord = NextauthSessions & XataRecord;

export type DatabaseSchema = {
  alerts: AlertsRecord;
  competitions: CompetitionsRecord;
  teams: TeamsRecord;
  officers: OfficersRecord;
  nextauth_users: NextauthUsersRecord;
  nextauth_accounts: NextauthAccountsRecord;
  nextauth_verificationTokens: NextauthVerificationTokensRecord;
  nextauth_users_accounts: NextauthUsersAccountsRecord;
  nextauth_users_sessions: NextauthUsersSessionsRecord;
  nextauth_sessions: NextauthSessionsRecord;
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
