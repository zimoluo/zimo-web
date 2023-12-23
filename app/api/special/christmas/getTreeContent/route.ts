import { getTreeContentFromServer } from "@/lib/dataLayer/server/specialServiceManager";

export async function GET() {
  try {
    const treeContent = await getTreeContentFromServer();

    return new Response(JSON.stringify({ treeContent }), {
      status: 200,
    });
  } catch (error: any) {
    console.error("Error in fetching Christmas tree content:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
