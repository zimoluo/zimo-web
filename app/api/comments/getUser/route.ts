import { getCommentUserData } from "@/lib/dataLayer/server/userLoader";

export const revalidate = 3600;

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sub = searchParams.get("sub");

    if (!sub) {
      throw new Error("sub is required");
    }

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
