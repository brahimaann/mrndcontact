/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as admin from "../admin.js";
import type * as events from "../events.js";
import type * as identifiers from "../identifiers.js";
import type * as media from "../media.js";
import type * as migrations from "../migrations.js";
import type * as posts from "../posts.js";
import type * as profile from "../profile.js";
import type * as talents from "../talents.js";
import type * as users from "../users.js";
import type * as works from "../works.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  admin: typeof admin;
  events: typeof events;
  identifiers: typeof identifiers;
  media: typeof media;
  migrations: typeof migrations;
  posts: typeof posts;
  profile: typeof profile;
  talents: typeof talents;
  users: typeof users;
  works: typeof works;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
