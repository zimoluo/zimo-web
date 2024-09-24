export async function readEntryOnClient(
  slug: string,
  directory: string,
  mode: "markdown" | "json",
  fields: string[] = []
): Promise<Record<string, any>> {
  try {
    const response = await fetch("/api/entry/readEntryBySlug", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ slug, directory, mode, fields }),
    });

    if (!response.ok) {
      const { error } = await response.json();
      console.error(`Reading entry on client failed: ${error}`);
      return [];
    }

    const post = await response.json();
    return post || {};
  } catch (error: any) {
    console.error(`An error occurred: ${error.message}`);
    return [];
  }
}
