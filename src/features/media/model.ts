import { z } from "zod";

export const mediaImageSchema = z.object({
  src: z.string().min(1), originalSrc: z.string().optional(),
  width: z.number().int().positive(), height: z.number().int().positive(),
  alt: z.string(), caption: z.string().optional(), placeholder: z.string().optional(),
  focus: z.object({ x: z.number().min(0).max(1), y: z.number().min(0).max(1) }).optional(),
});
export type MediaImage = z.infer<typeof mediaImageSchema>;
