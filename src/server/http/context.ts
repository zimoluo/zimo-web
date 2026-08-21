import "server-only";
import { objects } from "../storage/object";
import type { ObjectStore } from "../storage/object";
import { currentViewer } from "../session/current";
import type { MaybeViewer } from "../session/authorize";

export type RequestContext = {
  readonly store: ObjectStore;
  readonly viewer: MaybeViewer;
  readonly now: () => string;
};

export async function requestContext(): Promise<RequestContext> {
  return {
    store: objects(),
    viewer: await currentViewer(),
    now: () => new Date().toISOString(),
  };
}

export const CACHE_PRIVATE = "private, no-store";

export const CACHE_HOURS = "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400";

export const CACHE_WEEKS =
  "public, max-age=0, s-maxage=604800, stale-while-revalidate=2592000";

export const CACHE_NONE = "no-store";
