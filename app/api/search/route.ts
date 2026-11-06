import { readSearchIndex } from "@/lib/dataLayer/server/searchIndex";

export async function GET() {
  try {
    const index = await readSearchIndex();
    return Response.json(index, {
      status: index.unavailable.length === 4 ? 503 : 200,
      headers: {
        "Cache-Control": index.unavailable.length ? "no-store" : "public, max-age=60, s-maxage=1800, stale-while-revalidate=1800",
      },
    });
  } catch {
    return Response.json({ error: "Search is temporarily unavailable." }, { status: 503 });
  }
}
