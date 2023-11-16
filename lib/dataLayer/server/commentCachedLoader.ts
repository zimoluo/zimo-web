import { cache } from "react";
import { getComments } from "./commentManager";

/**
 * This function is called at initializing comment data, as no caching is supposed to be conducted.
 */
export const getCachedComments = cache(async (filePath: string) => {
  return await getComments(filePath);
});

export const revalidate = 0;
