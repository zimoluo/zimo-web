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
      return {};
    }

    const entry = await response.json();
    return entry || {};
  } catch (error: any) {
    console.error(`An error occurred: ${error.message}`);
    return {};
  }
}

export async function readAllEntriesOnClient(
  directory: string,
  mode: "markdown" | "json",
  fields: string[] = []
): Promise<Record<string, any>[]> {
  try {
    const response = await fetch("/api/entry/readAllEntries", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ directory, mode, fields }),
    });

    if (!response.ok) {
      const { error } = await response.json();
      console.error(`Reading entry on client failed: ${error}`);
      return [];
    }

    const entries = await response.json();
    return entries || [];
  } catch (error: any) {
    console.error(`An error occurred: ${error.message}`);
    return [];
  }
}
