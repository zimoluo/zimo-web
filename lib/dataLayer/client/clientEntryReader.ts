export async function readEntryOnClient(
  slug: string,
  directory: string,
  mode: "markdown" | "json",
  fields: string[] = []
): Promise<Record<string, any>> {
  try {
    const searchParams = new URLSearchParams({
      slug,
      directory,
      mode,
      fields: fields.join(","),
    });

    const response = await fetch(`/api/entry/readEntryBySlug?${searchParams}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
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
    const searchParams = new URLSearchParams({
      directory,
      mode,
      fields: fields.join(","),
    });

    const response = await fetch(`/api/entry/readAllEntries?${searchParams}`);

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
