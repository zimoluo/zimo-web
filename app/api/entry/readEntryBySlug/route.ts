import { fetchEntryBySlug } from "@/lib/dataLayer/server/awsEntryFetcher";

export async function POST(request: Request) {
  try {
    const { slug, directory, mode, fields } = await request.json();

    if (
      ![
        "blog/text",
        "about/text",
        "photos/entries",
        "projects/entries",
      ].includes(directory)
    ) {
      throw new Error("Invalid directory");
    }

    const entry = await fetchEntryBySlug(slug, directory, mode, fields);

    return new Response(JSON.stringify(entry), {
      status: 200,
    });
  } catch (error: any) {
    console.error("Error in reading entry by slug:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
