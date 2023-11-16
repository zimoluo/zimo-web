import { getUserDataBySub } from "@/lib/dataLayer/server/accountStateManager";

export async function POST(request: Request) {
  try {
    const { sub } = await request.json();

    const userInfo = (await getUserDataBySub(sub, [
      "name",
      "state",
      "profilePic",
    ])) as UserInfo;

    return new Response(JSON.stringify({ userInfo }), {
      status: 200,
    });
  } catch (error: any) {
    console.error("Error in deleting user:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
