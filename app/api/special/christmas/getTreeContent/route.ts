import { getTreeContentFromServer } from "@/lib/dataLayer/server/specialServiceManager";

export async function POST() {
  try {
    const treeContent = await getTreeContentFromServer();

    return new Response(JSON.stringify({ treeContent }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error: any) {
    console.error("Error in fetching Christmas tree content:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, max-age=0",
      },
    });
  }
}
