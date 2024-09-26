import { fetchAllEntries } from "@/lib/dataLayer/server/awsEntryFetcher";

export async function POST(request: Request) {
  try {
    const { directory, mode, fields } = await request.json();

    const entries = await fetchAllEntries(directory, mode, fields);

    return new Response(JSON.stringify(entries), {
      status: 200,
    });
  } catch (error: any) {
    console.error("Error in reading entry by slug:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
