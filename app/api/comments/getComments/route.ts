import { getComments } from "@/lib/dataLayer/server/commentManager";

export async function POST(request: Request) {
  try {
    const { filePath } = await request.json();

    const comments = await getComments(filePath);

    return new Response(JSON.stringify({ comments }), {
      status: 200,
    });
  } catch (error: any) {
    console.error("Error in getting comments:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
