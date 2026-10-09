"use client";

import { ImageViewer } from "./ImageViewer";
import { mediaImageSchema } from "./model";
import { z } from "zod";

export const lightboxSchema = z.object({ images: z.array(mediaImageSchema).min(1), index: z.number().int().min(0) });
export default function Lightbox(props: Record<string, unknown>) {
  const { images, index } = lightboxSchema.parse(props);
  return <ImageViewer images={images} initialIndex={index} lightbox fit="contain" sizes="100vw" />;
}
