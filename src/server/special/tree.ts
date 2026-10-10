import { z } from "zod";
import { AppError } from "../../lib/errors";
import { isIsoInstant } from "../../lib/datetime";

export type TreeMessage = {
  readonly id: string;
  readonly from: string;
  readonly message: string;
  readonly position: readonly [number, number];
  readonly sprite: string;
  readonly createdAt: string;
  readonly isPublic?: boolean | undefined;
  readonly neverShowSpoilerWarning?: boolean | undefined;
};

export type TreeBoard = { readonly messages: readonly TreeMessage[] };

export const MAX_FROM_LENGTH = 500;
export const MAX_MESSAGE_LENGTH = 4_000;

export const TREE_BOUNDS = {
  minX: 0,
  maxX: 1000,
  minY: 130,
  maxY: 850,
} as const;

export const SPACING = { x: 50, y: 33 } as const;

export const EMPTY_BOARD: TreeBoard = { messages: [] };

const position = z.tuple([z.number(), z.number()]);

export const treeMessageSchema = z.object({
  id: z.string().min(1),
  from: z.string().min(1).max(MAX_FROM_LENGTH),
  message: z.string().max(MAX_MESSAGE_LENGTH),
  position,
  sprite: z.string().min(1),
  createdAt: z.string().refine(isIsoInstant, { message: "expected an instant" }),
  isPublic: z.boolean().optional(),
  neverShowSpoilerWarning: z.boolean().optional(),
});

export const treeBoardSchema = z.object({
  messages: z.array(treeMessageSchema),
});

export const parseTreeBoard = (input: unknown): TreeBoard =>
  treeBoardSchema.parse(input) as TreeBoard;

export const insideTree = (at: readonly [number, number]): boolean => {
  const [x, y] = at;
  return (
    x >= TREE_BOUNDS.minX &&
    x <= TREE_BOUNDS.maxX &&
    y >= TREE_BOUNDS.minY &&
    y <= TREE_BOUNDS.maxY &&
    y >= -1.7143 * x + 850 &&
    y >= 1.885 * x - 1035
  );
};

export const crowds = (
  at: readonly [number, number],
  board: TreeBoard,
): boolean =>
  board.messages.some(
    ({ position: [x, y] }) =>
      Math.abs(x - at[0]) < SPACING.x && Math.abs(y - at[1]) < SPACING.y,
  );

export function requireFreePosition(
  at: readonly [number, number],
  board: TreeBoard,
): readonly [number, number] {
  if (!insideTree(at)) {
    throw new AppError("unprocessable", "That spot is not on the tree.");
  }

  if (crowds(at, board)) {
    throw new AppError("unprocessable", "Something is already hanging there.");
  }

  return at;
}

export function requireTreeText(
  from: string,
  message: string,
): { readonly from: string; readonly message: string } {
  const trimmedFrom = from.trim();
  const trimmedMessage = message.trim();

  if (trimmedFrom.length === 0 || trimmedMessage.length === 0) {
    throw new AppError("unprocessable", "A name and a message are both needed.");
  }

  if (trimmedFrom.length > MAX_FROM_LENGTH) {
    throw new AppError(
      "unprocessable",
      `A name is limited to ${MAX_FROM_LENGTH} characters.`,
    );
  }

  if (trimmedMessage.length > MAX_MESSAGE_LENGTH) {
    throw new AppError(
      "unprocessable",
      `A message is limited to ${MAX_MESSAGE_LENGTH} characters.`,
    );
  }

  return { from: trimmedFrom, message: trimmedMessage };
}

export const hangMessage = (
  board: TreeBoard,
  message: TreeMessage,
): TreeBoard => ({ messages: [...board.messages, message] });

export const publicMessages = (board: TreeBoard): readonly TreeMessage[] =>
  board.messages.filter((message) => message.isPublic === true);
