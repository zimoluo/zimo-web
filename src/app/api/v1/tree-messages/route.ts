import { v7 as uuidv7 } from "uuid";
import { keys } from "@/src/server/storage/keys";
import { mutateJson } from "@/src/server/storage/mutate";
import { corsForRequest, preflight } from "@/src/server/http/cors";
import { CACHE_NONE, requestContext } from "@/src/server/http/context";
import { handler, invalid, json } from "@/src/server/http/problem";
import { clientIp, writeLimiter } from "@/src/server/http/rate-limit";
import {
  EMPTY_BOARD,
  hangMessage,
  parseTreeBoard,
  requireFreePosition,
  requireTreeText,
} from "@/src/server/special/tree";
import type { TreeMessage } from "@/src/server/special/tree";

export const OPTIONS = (request: Request): Response => preflight(request);

export const GET = handler(async (request) => {
  const { store } = await requestContext();
  const record = await store.readJson(keys.treeMessages(), parseTreeBoard);

  return json(record?.value ?? EMPTY_BOARD, {
    headers: { "cache-control": CACHE_NONE, ...corsForRequest(request) },
  });
});

export const POST = handler(async (request) => {
  writeLimiter.require(`tree:${clientIp(request)}`);

  const payload: unknown = await request.json().catch(() => null);
  if (typeof payload !== "object" || payload === null) {
    throw invalid("Expected a JSON body.");
  }

  const { from, message, position, sprite, isPublic } = payload as {
    from?: unknown;
    message?: unknown;
    position?: unknown;
    sprite?: unknown;
    isPublic?: unknown;
  };

  if (
    typeof from !== "string" ||
    typeof message !== "string" ||
    typeof sprite !== "string" ||
    !Array.isArray(position) ||
    position.length !== 2 ||
    typeof position[0] !== "number" ||
    typeof position[1] !== "number"
  ) {
    throw invalid("from, message, sprite and position are all required.");
  }

  const text = requireTreeText(from, message);
  const at: readonly [number, number] = [position[0], position[1]];

  const { store, now } = await requestContext();

  const hung: TreeMessage = {
    id: uuidv7(),
    from: text.from,
    message: text.message,
    position: at,
    sprite,
    createdAt: now(),
    ...(isPublic === true ? { isPublic: true } : {}),
  };

  const board = await mutateJson(
    store.asJsonStore(),
    keys.treeMessages(),
    parseTreeBoard,
    () => EMPTY_BOARD,
    (current) => {
      requireFreePosition(at, current);
      return hangMessage(current, hung);
    },
    { attempts: 8 },
  );

  return json(
    { message: hung, count: board.messages.length },
    {
      status: 201,
      headers: { "cache-control": CACHE_NONE, ...corsForRequest(request) },
    },
  );
});
