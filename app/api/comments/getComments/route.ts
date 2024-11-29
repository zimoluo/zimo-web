import { getComments } from "@/lib/dataLayer/server/commentManager";

export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const filePath = url.searchParams.get("filePath");

    if (!filePath) {
      throw new Error("Missing required query parameter: filePath");
    }

    const comments = await getComments(filePath);

    return new Response(JSON.stringify({ comments }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error: any) {
    console.error("Error in getting comments:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, max-age=0",
      },
    });
  }
}
