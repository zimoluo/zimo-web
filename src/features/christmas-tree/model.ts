import { z } from "zod";
export const SPRITES = [
  "cane",
  "bauble",
  "bell1",
  "bell2",
  "bell3",
  "bells",
  "bell",
  "ribbon",
  "candy",
  "lollipop",
  "letter",
  "snow-globe",
  "card",
  "giftbag",
  "shopping-bag",
  "tag",
  "cup",
  "gingerbread",
  "deer",
  "gift",
  "sweater",
  "scarf",
  "glove",
  "hat",
  "sock",
  "headphones",
  "lights",
  "mistletoe",
  "ring",
  "snowflake",
  "dark-side-of-the-force",
] as const;


export const treeMessageSchema = z.object({ id: z.string(), from: z.string(), message: z.string(), position: z.tuple([z.number(),z.number()]), sprite: z.string(), createdAt: z.string(), isPublic: z.boolean().optional(), neverShowSpoilerWarning: z.boolean().optional() });
export const treeBoardSchema = z.object({ messages: z.array(treeMessageSchema), occupiedPositions: z.array(z.tuple([z.number(),z.number()])).optional() });
export type TreeMessage = z.infer<typeof treeMessageSchema>;
export const SPRITE_BASE = "https://zimo-web-bucket.s3.us-east-2.amazonaws.com/special/christmas/public/sprites/";
export const insideTree = ([x,y]: readonly [number,number]) => x >= 0 && x <= 1000 && y >= 130 && y <= 850 && y >= -1.7143 * x + 850 && y >= 1.885 * x - 1035;
export const availablePosition = (position: readonly [number,number], occupied: readonly (readonly [number,number])[]) => insideTree(position) && !occupied.some(([x,y]) => Math.abs(x-position[0])<50 && Math.abs(y-position[1])<33);
