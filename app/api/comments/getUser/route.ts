import { getCommentUserData } from "@/lib/dataLayer/server/userLoader";

export async function POST(request: Request) {
  try {
    const { sub } = await request.json();

    const userInfo = await getCommentUserData(sub);

    return new Response(JSON.stringify({ userInfo }), {
      status: 200,
    });
  } catch (error: any) {
    console.error("Error in fetching user:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
