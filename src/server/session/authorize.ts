import { AppError } from "../../lib/errors";
import type { UserState } from "../../features/account/model/types";

export type Viewer = {
  readonly sub: string;
  readonly state: UserState;
};

export type MaybeViewer = Viewer | null;

export const isAdmin = (viewer: MaybeViewer): boolean =>
  viewer !== null && viewer.state === "admin";

export const isBanned = (viewer: MaybeViewer): boolean =>
  viewer !== null && viewer.state === "banned";

export function requireViewer(viewer: MaybeViewer): Viewer {
  if (viewer === null) {
    throw new AppError("unauthenticated", "Sign in to do that.");
  }
  return viewer;
}

export function requireActive(viewer: MaybeViewer): Viewer {
  const present = requireViewer(viewer);
  if (present.state === "banned") {
    throw new AppError("forbidden", "Your account cannot post.");
  }
  return present;
}

export function requireAdmin(viewer: MaybeViewer): Viewer {
  const present = requireViewer(viewer);
  if (present.state !== "admin") {
    throw new AppError("forbidden", "That is not yours to change.");
  }
  return present;
}

export type Owned = { readonly authorSub: string };

export const owns = (viewer: MaybeViewer, subject: Owned): boolean =>
  viewer !== null && viewer.sub === subject.authorSub;

export function requireOwner(viewer: MaybeViewer, subject: Owned): Viewer {
  const present = requireActive(viewer);
  if (present.sub !== subject.authorSub) {
    throw new AppError("forbidden", "That is not yours to change.");
  }
  return present;
}

export function requireOwnerOrAdmin(
  viewer: MaybeViewer,
  subject: Owned,
): Viewer {
  const present = requireViewer(viewer);
  if (present.state === "admin") return present;
  if (present.state === "banned" || present.sub !== subject.authorSub) {
    throw new AppError("forbidden", "That is not yours to delete.");
  }
  return present;
}

export const MAX_COMMENT_LENGTH = 3_000;

export function requireBody(body: string): string {
  const trimmed = body.trim();

  if (trimmed.length === 0) {
    throw new AppError("unprocessable", "Write something first.");
  }

  if (trimmed.length > MAX_COMMENT_LENGTH) {
    throw new AppError(
      "unprocessable",
      `Comments are limited to ${MAX_COMMENT_LENGTH} characters.`,
    );
  }

  return trimmed;
}
