import { fetchEntryBySlug } from "@/lib/dataLayer/server/awsEntryFetcher";

export async function POST(request: Request) {
  try {
    const { slug, directory, mode, fields } = await request.json();

    const post = await fetchEntryBySlug(slug, directory, mode, fields);

    return new Response(JSON.stringify(post), {
      status: 200,
    });
  } catch (error: any) {
    console.error("Error in reading entry by slug:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
