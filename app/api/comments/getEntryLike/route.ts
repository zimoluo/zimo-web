import { getEntryLike } from "@/lib/dataLayer/server/commentManager";

export async function POST(request: Request) {
  try {
    const { filePath } = await request.json();

    const likedBy = await getEntryLike(filePath);

    return new Response(JSON.stringify({ likedBy }), {
      status: 200,
    });
  } catch (error: any) {
    console.error("Error in fetching like:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
