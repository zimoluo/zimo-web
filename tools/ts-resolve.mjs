const SUFFIXES = [".ts", ".tsx", "/index.ts", "/index.tsx"];

export async function resolve(specifier, context, next) {
  const relative = specifier.startsWith(".") || specifier.startsWith("/");
  if (!relative) return next(specifier, context);

  try {
    return await next(specifier, context);
  } catch (error) {
    for (const suffix of SUFFIXES) {
      try {
        return await next(`${specifier}${suffix}`, context);
      } catch {
        continue;
      }
    }
    throw error;
  }
}
