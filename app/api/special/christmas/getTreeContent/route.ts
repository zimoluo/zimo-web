import { getTreeContentFromServer } from "@/lib/dataLayer/server/specialServiceManager";

export async function GET() {
  try {
    const treeContent = await getTreeContentFromServer();

    return new Response(JSON.stringify({ treeContent }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
        "Surrogate-Control": "no-store",
      },
    });
  } catch (error: any) {
    console.error("Error in fetching Christmas tree content:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
        "Surrogate-Control": "no-store",
      },
    });
  }
}

export const revalidate = 0;
