import { fetchAllEntries } from "@/lib/dataLayer/server/awsEntryFetcher";

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const directory = searchParams.get("directory");
    const mode = searchParams.get("mode") as "markdown" | "json";
    const fields = searchParams.get("fields")?.split(",");

    if (!directory || !mode || !fields) {
      throw new Error("directory, mode, and fields are required");
    }

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

    const entries = await fetchAllEntries(directory, mode, fields);

    return new Response(JSON.stringify(entries), {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=1800",
      },
    });
  } catch (error: any) {
    console.error("Error in reading entry by slug:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
