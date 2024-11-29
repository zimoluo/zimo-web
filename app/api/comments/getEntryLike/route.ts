import { getEntryLike } from "@/lib/dataLayer/server/commentManager";

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filePath = searchParams.get("filePath");

    if (!filePath) {
      throw new Error("filePath is required");
    }

    const likedBy = await getEntryLike(filePath);

    return new Response(JSON.stringify({ likedBy }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error: any) {
    console.error("Error in fetching like:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, max-age=0",
      },
    });
  }
}
