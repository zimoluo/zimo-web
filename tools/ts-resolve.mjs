import { pathToFileURL } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(new URL(import.meta.url).pathname), "..");

const SUFFIXES = ["", ".ts", ".tsx", "/index.ts", "/index.tsx"];

export async function resolve(specifier, context, next) {
  const aliased = specifier.startsWith("@/")
    ? pathToFileURL(join(ROOT, specifier.slice(2))).href
    : specifier;

  const relative =
    aliased.startsWith(".") || aliased.startsWith("/") || aliased.startsWith("file:");

  if (!relative) return next(aliased, context);

  let first;

  for (const suffix of SUFFIXES) {
    try {
      return await next(`${aliased}${suffix}`, context);
    } catch (error) {
      first ??= error;
    }
  }

  throw first;
}
